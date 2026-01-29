'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getQuestsByFaction } from '@/lib/quests';
import { FACTIONS } from '@/lib/factions';
import QuestCard from '@/components/QuestCard';
import ChoiceButtons from '@/components/ChoiceButtons';
import QuestResult from '@/components/QuestResult';
import { useRouter } from 'next/navigation';
import { Quest, Choice } from '@/lib/types';

interface UserData {
  id: string;
  username: string;
  faction: string;
}

interface FactionProgressData {
  id: number;
  influence: number;
  reputation: number;
  resources: number;
  quest_count: number;
}

interface GameStateData {
  id: number;
  current_act: number;
  severance_level: number;
  completed_quests: string[];
  choices_made?: Record<string, string>;
}

export default function QuestPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [factionProgress, setFactionProgress] = useState<FactionProgressData | null>(null);
  const [gameState, setGameState] = useState<GameStateData | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadQuestData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/auth');
        return;
      }

      try {
        // Get faction from auth metadata
        const faction = authUser.user_metadata?.faction;
        if (!faction) {
          router.push('/faction-select');
          return;
        }

        // Create user object
        const userData: UserData = {
          id: authUser.id,
          username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'User',
          faction: faction,
        };
        setUser(userData);

        // Fetch faction progress with error handling
        const { data: progressData, error: progressError } = await supabase
          .from('faction_progress')
          .select('*')
          .eq('user_id', authUser.id)
          .eq('faction', faction)
          .single();

        if (progressData) {
          setFactionProgress(progressData);
        } else if (progressError) {
          console.warn('Progress fetch failed, using defaults:', progressError);
          // Create default progress
          setFactionProgress({
            id: 0,
            influence: 0,
            reputation: 0,
            resources: 0,
            quest_count: 0,
          });
        }

        // Fetch game state with error handling
        const { data: stateData, error: stateError } = await supabase
          .from('game_state')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (stateData) {
          setGameState(stateData);
        } else if (stateError) {
          console.warn('Game state fetch failed, using defaults:', stateError);
          // Create default game state
          setGameState({
            id: 0,
            current_act: 1,
            severance_level: 0,
            completed_quests: [],
            choices_made: {},
          });
        }

        // Load quests for this faction
        const factionQuests = getQuestsByFaction(faction);
        setQuests(factionQuests);
      } catch (error) {
        console.error('Error loading quest data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestData();
  }, [router]);

  const handleChoose = async (choice: Choice) => {
    if (!user || !selectedQuest || !gameState || !factionProgress) return;

    setSubmitting(true);

    try {
      // Update local state immediately (optimistic update)
      const updatedCompletedQuests = [...(gameState.completed_quests || []), selectedQuest.id];
      const updatedGameState = {
        ...gameState,
        completed_quests: updatedCompletedQuests,
        choices_made: {
          ...(gameState.choices_made || {}),
          [selectedQuest.id]: choice.id,
        },
        severance_level: Math.max(
          0,
          gameState.severance_level + (choice.consequences.severance_level || 0)
        ),
      };
      setGameState(updatedGameState);

      // Update faction progress locally
      const newInfluence = Math.max(
        0,
        factionProgress.influence + (choice.consequences.influence || 0)
      );
      const newReputation = Math.max(
        0,
        factionProgress.reputation + (choice.consequences.reputation || 0)
      );
      const newResources = Math.max(
        0,
        factionProgress.resources + (choice.consequences.resources || 0)
      );

      const updatedProgress = {
        ...factionProgress,
        influence: newInfluence,
        reputation: newReputation,
        resources: newResources,
        quest_count: factionProgress.quest_count + 1,
      };
      setFactionProgress(updatedProgress);

      // Try to sync to database but don't fail if it doesn't work
      if (gameState.id > 0) {
        try {
          await supabase
            .from('game_state')
            .update({
              completed_quests: updatedGameState.completed_quests,
              choices_made: updatedGameState.choices_made,
              severance_level: updatedGameState.severance_level,
            })
            .eq('id', gameState.id);
        } catch (err) {
          console.warn('Could not sync game state:', err);
        }
      }

      if (factionProgress.id > 0) {
        try {
          await supabase
            .from('faction_progress')
            .update({
              influence: newInfluence,
              reputation: newReputation,
              resources: newResources,
              quest_count: updatedProgress.quest_count,
            })
            .eq('id', factionProgress.id);
        } catch (err) {
          console.warn('Could not sync progress:', err);
        }
      }

      setSelectedChoice(choice);
    } catch (error) {
      console.error('Error processing choice:', error);
      alert('Error processing your choice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    setSelectedChoice(null);
    setSelectedQuest(null);
    // Don't reload - state is already updated locally
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-gray-400">Loading quests...</p>
      </div>
    );
  }

  if (!user || !gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-red-400">Error loading data</p>
      </div>
    );
  }

  const progress = factionProgress || {
    id: 0,
    influence: 0,
    reputation: 0,
    resources: 0,
    quest_count: 0,
  };

  const factionInfo = FACTIONS[user.faction];
  const completedQuestIds = new Set(gameState.completed_quests || []);

  if (selectedQuest && !selectedChoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setSelectedQuest(null)}
            className="mb-6 text-gray-400 hover:text-teal-400 transition"
          >
            ← Back to Quests
          </button>

          {/* Quest content */}
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-teal-400 mb-2">{selectedQuest.title}</h1>
            <p className="text-gray-400 mb-6">
              {selectedQuest.description} (Quest {selectedQuest.order} of 7)
            </p>

            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {selectedQuest.narrative}
              </p>
            </div>

            {/* Choices */}
            <ChoiceButtons
              choices={selectedQuest.choices}
              onChoose={handleChoose}
              loading={submitting}
            />
          </div>
        </div>
      </div>
    );
  }

  if (selectedChoice) {
    return <QuestResult choice={selectedChoice} onContinue={handleContinue} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 text-gray-400 hover:text-teal-400 transition"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-teal-400 mb-2">Quests</h1>
          <p className="text-gray-400">
            Embark on story-driven missions that will shape the fate of your faction.
          </p>
        </div>

        {/* Progress */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-4 bg-slate-800 border border-slate-600 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Quests Completed</p>
            <p className="text-2xl font-bold text-teal-400">{progress.quest_count}/7</p>
          </div>
          <div className="p-4 bg-slate-800 border border-slate-600 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Influence</p>
            <p className="text-2xl font-bold text-blue-400">{progress.influence}</p>
          </div>
          <div className="p-4 bg-slate-800 border border-slate-600 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Reputation</p>
            <p className="text-2xl font-bold text-purple-400">{progress.reputation}</p>
          </div>
          <div className="p-4 bg-slate-800 border border-slate-600 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Resources</p>
            <p className="text-2xl font-bold text-amber-400">{progress.resources}</p>
          </div>
        </div>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              completed={completedQuestIds.has(quest.id)}
              onClick={() => {
                if (!completedQuestIds.has(quest.id)) {
                  setSelectedQuest(quest);
                }
              }}
            />
          ))}
        </div>

        {/* Completion note */}
        {progress.quest_count === 7 && (
          <div className="mt-8 p-6 bg-green-900/30 border border-green-700 rounded-lg text-center">
            <h3 className="text-xl font-bold text-green-400 mb-2">Act Complete!</h3>
            <p className="text-gray-300">
              You've completed all quests in Act 1. Act 2 coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}