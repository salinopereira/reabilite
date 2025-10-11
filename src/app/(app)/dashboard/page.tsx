'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or Anon Key are not defined in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        // If no user is logged in, redirect to login page
        router.push('/login');
      } else {
        setUser(data.user);
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
            <p>Carregando...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
        <div className="container mx-auto">
            <header className="flex justify-between items-center mb-12">
                 <h1 className="text-3xl font-bold tracking-tighter">
                    Dashboard <span className="font-normal text-slate-400">- {user?.user_metadata.user_type === 'profissional' ? 'Profissional' : 'Paciente'}</span>
                </h1>
                <button 
                    onClick={handleLogout} 
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Sair
                </button>
            </header>

            <main>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-2">Bem-vindo, {user?.user_metadata.full_name || user?.email}!</h2>
                    <p className="text-slate-400">Este é o seu painel de controle. Em breve, você verá seus dados e acompanhamentos aqui.</p>
                </div>
            </main>
        </div>
    </div>
  );
}
