'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FACTIONS } from '@/lib/factions';
import FactionCard from '@/components/FactionCard';
import { useRouter } from 'next/navigation';

export default function FactionSelectPage() {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth');
        return;
      }

      setUser(user);
      setCheckingAuth(false);
    };

    checkUser();
  }, [router]);

  const handleSelectFaction = async () => {
    if (!selectedFaction || !user) return;

    setLoading(true);

    try {
      // Update user faction
      const { error: userError } = await supabase
        .from('users')
        .update({ faction: selectedFaction })
        .eq('id', user.id);

      if (userError) throw userError;

      // Create faction progress entry
      const { error: progressError } = await supabase
        .from('faction_progress')
        .insert([
          {
            user_id: user.id,
            faction: selectedFaction,
            influence: 0,
            reputation: 0,
            resources: 100,
            quest_count: 0,
          },
        ]);

      if (progressError) throw progressError;

      // Create game state entry
      const { error: stateError } = await supabase
        .from('game_state')
        .insert([
          {
            user_id: user.id,
            current_act: 1,
            severance_level: 0,
            choices_made: {},
            completed_quests: [],
          },
        ]);

      if (stateError) throw stateError;

      router.push('/dashboard');
    } catch (error) {
      console.error('Error selecting faction:', error);
      alert('Failed to select faction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-400 mb-4">
            Choose Your Faction
          </h1>
          <p className="text-gray-400 mb-2">
            Reality is fragmenting. Which vision of the world will you fight for?
          </p>
          <p className="text-gray-500 text-sm">
            Your choice will shape your experience, determine your allies, and define your place in The Severance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {Object.values(FACTIONS).map((faction) => (
            <FactionCard
              key={faction.id}
              faction={faction}
              isSelected={selectedFaction === faction.id}
              onClick={() => setSelectedFaction(faction.id)}
              isLoading={loading}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleSelectFaction}
            disabled={!selectedFaction || loading}
            className="px-12 py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition text-lg"
          >
            {loading ? 'Initializing...' : 'Enter the Severance'}
          </button>

          {selectedFaction && (
            <p className="text-gray-400 mt-4 text-sm">
              You have chosen <span className="text-teal-400 font-semibold">{FACTIONS[selectedFaction].name}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}