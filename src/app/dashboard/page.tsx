'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FACTIONS } from '@/lib/factions';
import { useRouter } from 'next/navigation';

interface UserData {
  id: string;
  username: string;
  faction: string;
}

interface FactionProgressData {
  influence: number;
  reputation: number;
  resources: number;
  quest_count: number;
}

interface GameStateData {
  current_act: number;
  severance_level: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [factionProgress, setFactionProgress] = useState<FactionProgressData | null>(null);
  const [gameState, setGameState] = useState<GameStateData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/auth');
        return;
      }

      try {
        // Fetch user data
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (!userData || !userData.faction) {
          router.push('/faction-select');
          return;
        }

        setUser(userData);

        // Fetch faction progress
        const { data: progressData } = await supabase
          .from('faction_progress')
          .select('*')
          .eq('user_id', authUser.id)
          .eq('faction', userData.faction)
          .single();

        if (progressData) {
          setFactionProgress(progressData);
        }

        // Fetch game state
        const { data: stateData } = await supabase
          .from('game_state')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (stateData) {
          setGameState(stateData);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-gray-400">Loading your journey...</p>
      </div>
    );
  }

  if (!user || !factionProgress || !gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-red-400">Error loading dashboard</p>
      </div>
    );
  }

  const factionInfo = FACTIONS[user.faction];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 p-8 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">
            Welcome, <span className="text-teal-400">{user.username}</span>
          </h1>
          <p className="text-gray-300">
            You walk the path of{' '}
            <span style={{ color: factionInfo.color }} className="font-bold">
              {factionInfo.name}
            </span>
          </p>
          <p className="text-gray-400 mt-2 italic">"{factionInfo.philosophy}"</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Faction Info Card */}
          <div className="lg:col-span-2 p-6 bg-slate-800 border border-slate-600 rounded-lg">
            <h2 className="text-2xl font-bold mb-4" style={{ color: factionInfo.color }}>
              {factionInfo.name}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-gray-400 text-sm font-semibold mb-2">GOAL</h3>
                <p className="text-gray-200">{factionInfo.goal}</p>
              </div>

              <div>
                <h3 className="text-gray-400 text-sm font-semibold mb-2">PLAYSTYLE</h3>
                <p className="text-gray-200">{factionInfo.playstyle}</p>
              </div>

              <div>
                <h3 className="text-gray-400 text-sm font-semibold mb-2">GREATEST FEAR</h3>
                <p className="text-gray-200">{factionInfo.fear}</p>
              </div>
            </div>
          </div>

          {/* Game Progress Card */}
          <div className="p-6 bg-slate-800 border border-slate-600 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-teal-400">Game Progress</h3>

            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm mb-1">Current Act</p>
                <p className="text-3xl font-bold text-teal-400">{gameState.current_act}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Severance Level</p>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-600 h-full transition-all"
                    style={{ width: `${Math.min(gameState.severance_level * 10, 100)}%` }}
                  />
                </div>
                <p className="text-gray-300 text-sm mt-1">{gameState.severance_level}%</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Quests Completed</p>
                <p className="text-2xl font-bold text-gray-200">
                  {factionProgress.quest_count}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Influence */}
          <div className="p-6 bg-slate-800 border border-slate-600 rounded-lg">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">INFLUENCE</h3>
            <p className="text-4xl font-bold text-blue-400">{factionProgress.influence}</p>
            <p className="text-gray-500 text-xs mt-2">
              Your faction's power and reach
            </p>
          </div>

          {/* Reputation */}
          <div className="p-6 bg-slate-800 border border-slate-600 rounded-lg">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">REPUTATION</h3>
            <p className="text-4xl font-bold text-purple-400">{factionProgress.reputation}</p>
            <p className="text-gray-500 text-xs mt-2">
              How others view your actions
            </p>
          </div>

          {/* Resources */}
          <div className="p-6 bg-slate-800 border border-slate-600 rounded-lg">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">RESOURCES</h3>
            <p className="text-4xl font-bold text-amber-400">{factionProgress.resources}</p>
            <p className="text-gray-500 text-xs mt-2">
              Capital to pursue your goals
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 bg-gradient-to-r from-teal-900/30 to-blue-900/30 border border-teal-700 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Begin?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            The Severance awaits. Your choices will ripple across the world, affecting not just your faction, but the fate of all five.
          </p>
          <button className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition">
            Start First Quest
          </button>
          <p className="text-gray-500 text-sm mt-4">
            (Quest system coming in Phase 2)
          </p>
        </div>
      </div>
    </div>
  );
}