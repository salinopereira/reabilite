'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email.endsWith('@reabilite.pro')) {
      setError('Acesso restrito a utilizadores com email @reabilite.pro.');
      setLoading(false);
      return;
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (signInData.user) {
      // Check if the user is in the 'profissionais' table
      const { data: profissional, error: profissionalError } = await supabase
        .from('profissionais')
        .select('id')
        .eq('id', signInData.user.id)
        .single();

      if (profissional) {
        router.push('/pacientes');
      } else {
        // If not a profissional, check if the user is in the 'pacientes' table
        const { data: paciente, error: pacienteError } = await supabase
          .from('pacientes')
          .select('id')
          .eq('id', signInData.user.id)
          .single();
        
        if (paciente) {
          router.push('/dashboard-paciente');
        } else {
          setError('Não foi possível encontrar um perfil associado a esta conta.');
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-jacksons-purple">
      <div className="w-full max-w-md p-8 space-y-8 bg-jacksons-purple/50 rounded-2xl shadow-lg backdrop-blur-sm border border-nepal/30">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-iron">Bem-vindo de volta!</h1>
          <p className="text-nepal">Acesso exclusivo para membros da equipe Reabilite Pro.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer block w-full px-4 py-3 text-lg text-iron bg-transparent border-2 border-nepal/50 rounded-lg focus:ring-royal-blue focus:border-royal-blue transition-colors duration-300"
              placeholder=" "
            />
            <label 
              htmlFor="email"
              className="absolute text-lg text-nepal duration-300 transform -translate-y-7 scale-75 top-3 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
            >
              Email Corporativo
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer block w-full px-4 py-3 text-lg text-iron bg-transparent border-2 border-nepal/50 rounded-lg focus:ring-royal-blue focus:border-royal-blue transition-colors duration-300"
              placeholder=" "
            />
            <label 
              htmlFor="password"
              className="absolute text-lg text-nepal duration-300 transform -translate-y-7 scale-75 top-3 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
            >
              Senha
            </label>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 inline-flex items-center justify-center rounded-md bg-royal-blue px-8 text-sm font-medium text-iron shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="text-center">
            <p className="text-nepal">
                Não tem uma conta?{' '}
                <Link href="/signup" className="font-medium text-royal-blue hover:underline">
                    Cadastre-se
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
