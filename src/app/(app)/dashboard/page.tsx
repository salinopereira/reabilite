'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Import the centralized Supabase client
import type { User } from '@supabase/supabase-js';

// This line ensures the page is rendered dynamically on the server at request time
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  // The AppLayout now handles the redirect if the user is not authenticated.
  // This useEffect simply fetches the user data for display.
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  // A simple loading state until user data is fetched for display.
  if (!user) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
            <p>Carregando dados do dashboard...</p>
        </div>
    );
  }

  return (
    <div className="text-slate-100 p-8">
        <div className="container mx-auto">
            <header className="mb-12">
                 <h1 className="text-3xl font-bold tracking-tighter">
                    Visão Geral
                </h1>
                 <p className="text-slate-400 mt-1">Seu resumo de atividades e próximos passos.</p>
            </header>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-2">Bem-vindo, {user?.user_metadata.full_name || user?.email}!</h2>
                <p className="text-slate-400">Este é o seu painel de controle. Use a navegação acima para acessar as seções.</p>
            </div>
        </div>
    </div>
  );
}
