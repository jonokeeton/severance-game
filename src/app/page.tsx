'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (user) {
        // Check if user has faction
        const { data: profile } = await supabase
          .from('users')
          .select('faction')
          .eq('id', user.id)
          .single();

        if (profile?.faction) {
          router.push('/dashboard');
        } else {
          router.push('/faction-select');
        }
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="text-4xl">⚡</div>
          </div>
          <p className="text-gray-400">Initializing Severance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-teal-400 mb-4">SEVERANCE</h1>
        <p className="text-xl text-gray-300 mb-8">
          Reality is fragmenting. Five factions have incompatible visions for what comes next.
        </p>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          In a world where physical laws, time, and causality no longer operate uniformly, your choices will determine not just your faction's fate—but the fate of the entire world.
        </p>

        {!user ? (
          <Link
            href="/auth"
            className="inline-block px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition"
          >
            Enter the Game
          </Link>
        ) : (
          <p className="text-gray-400">Redirecting...</p>
        )}
      </div>
    </div>
  );
}