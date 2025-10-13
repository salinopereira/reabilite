'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('profissional'); // 'profissional' or 'paciente'
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email.endsWith('@reabilite.pro')) {
      setError('Por favor, utilize um email com o domínio @reabilite.pro.');
      setLoading(false);
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (signUpData.user) {
      const tableName = userType === 'profissional' ? 'profissionais' : 'pacientes';
      const { error: insertError } = await supabase
        .from(tableName)
        .insert([{ 
          id: signUpData.user.id,
          nome_completo: fullName,
          email: email
        }]);

      if (insertError) {
        setError(insertError.message);
      } else {
        const redirectPath = userType === 'profissional' ? '/pacientes' : '/dashboard-paciente';
        router.push(redirectPath);
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-jacksons-purple">
      <div className="w-full max-w-md p-8 space-y-8 bg-jacksons-purple/50 rounded-2xl shadow-lg backdrop-blur-sm border border-nepal/30">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-iron">Crie a sua conta</h1>
          <p className="text-nepal">Acesso exclusivo para membros da equipe Reabilite Pro.</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button type="button" onClick={() => setUserType('profissional')} className={`w-full p-3 rounded-lg text-center font-semibold transition-all duration-300 ${userType === 'profissional' ? 'bg-royal-blue text-iron shadow-lg' : 'bg-nepal/20 text-nepal hover:bg-nepal/30'}`}>
              Sou Profissional
            </button>
            <button type="button" onClick={() => setUserType('paciente')} className={`w-full p-3 rounded-lg text-center font-semibold transition-all duration-300 ${userType === 'paciente' ? 'bg-royal-blue text-iron shadow-lg' : 'bg-nepal/20 text-nepal hover:bg-nepal/30'}`}>
              Sou Paciente
            </button>
          </div>
          <div className="relative">
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="peer block w-full px-4 py-3 text-lg text-iron bg-transparent border-2 border-nepal/50 rounded-lg focus:ring-royal-blue focus:border-royal-blue transition-colors duration-300"
              placeholder=" "
            />
            <label 
              htmlFor="fullName"
              className="absolute text-lg text-nepal duration-300 transform -translate-y-7 scale-75 top-3 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
            >
              Nome Completo
            </label>
          </div>
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
           <p className="text-sm text-nepal text-center -mt-4">
            Apenas emails com o domínio @reabilite.pro são permitidos.
          </p>
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
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>
        <div className="text-center">
            <p className="text-nepal">
                Já tem uma conta?{' '}
                <Link href="/login" className="font-medium text-royal-blue hover:underline">
                    Faça login
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
