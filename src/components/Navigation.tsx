'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (loading) return null;

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-teal-400">
            ⚡ SEVERANCE
          </Link>

          {user ? (
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-teal-400">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}