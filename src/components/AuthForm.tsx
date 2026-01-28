'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Sign up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create user profile
          const { error: profileError } = await supabase.from('users').insert([
            {
              id: authData.user.id,
              username: username || email.split('@')[0],
              faction: null,
            },
          ]);

          if (profileError) throw profileError;

          // Redirect to faction selection
          router.push('/faction-select');
        }
      } else {
        // Sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        // Check if user has selected a faction
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('faction')
            .eq('id', userData.user.id)
            .single();

          if (profile?.faction) {
            router.push('/dashboard');
          } else {
            router.push('/faction-select');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-teal-400 mb-2 text-center">
            SEVERANCE
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            A narrative RPG of factions, choices, and reality itself
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-teal-700 text-white font-semibold py-2 rounded transition"
            >
              {loading
                ? 'Loading...'
                : isSignUp
                ? 'Create Account'
                : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isSignUp
                ? 'Already have an account? '
                : "Don't have an account? "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-teal-400 hover:text-teal-300 font-semibold"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}