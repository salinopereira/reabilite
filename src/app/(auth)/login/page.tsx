'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or Anon Key are not defined in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // On successful login, redirect to the dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
            Login no ReabilitePro
          </h1>
          <p className="text-slate-400 mt-2">Bem-vindo de volta!</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && <p className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg p-3 mb-4 text-sm">{error}</p>}
          
          <div className="space-y-6">
            <div className="relative">
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer bg-slate-900/70 border border-slate-700 focus:border-cyan-500 w-full rounded-lg p-3 outline-none transition placeholder-transparent"
                    placeholder="E-mail"
                />
                <label htmlFor="email" className="absolute left-3 -top-2.5 text-sm text-slate-400 bg-slate-800 px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400">E-mail</label>
            </div>

            <div className="relative">
                 <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer bg-slate-900/70 border border-slate-700 focus:border-cyan-500 w-full rounded-lg p-3 outline-none transition placeholder-transparent"
                    placeholder="Senha"
                />
                <label htmlFor="password" className="absolute left-3 -top-2.5 text-sm text-slate-400 bg-slate-800 px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400">Senha</label>
            </div>
          </div>

          <div className="mt-8">
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300 ease-in-out transform hover:scale-105">
              Entrar
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
            <p className="text-slate-400">
                Não tem uma conta?
                <Link href="/signup" className="font-semibold text-cyan-400 hover:text-cyan-300 ml-1">
                    Cadastre-se
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
