'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword, useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, , loadingEmail, errorEmail] = useSignInWithEmailAndPassword(auth);
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const handleUser = async (user: any) => {
      if (!user) return;
      const userDocRef = doc(db, 'usuarios', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.tipo === 'profissional') {
          router.push('/dashboard/profissional');
        } else if (userData.tipo === 'paciente') {
          router.push('/dashboard/paciente');
        } else {
          router.push('/');
        }
      } else {
        router.push('/cadastro');
      }
    };

    if (!loadingAuth && user) {
      handleUser(user);
    }
  }, [user, loadingAuth, router]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = `${username}@reabilite.pro`;
    signInWithEmailAndPassword(email, password);
  };
  
  const loading = loadingEmail || loadingAuth;

  if (loadingAuth || user) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <Loader2 className="animate-spin h-10 w-10 text-white" />
        </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="absolute top-6 left-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                &larr; Voltar para a Home
            </Link>
        </div>
        <div className="w-full max-w-sm">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Acesse sua Conta</h1>
                <p className="text-gray-400 mt-2">Bem-vindo de volta!</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                        Usuário
                    </label>
                    <div className="mt-1 flex rounded-lg bg-gray-800 border border-gray-700 focus-within:ring-2 focus-within:ring-indigo-500">
                        <input
                            id="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="flex-1 block w-full px-4 py-3 bg-transparent rounded-l-lg focus:outline-none"
                            placeholder="seu.usuario"
                        />
                        <span className="inline-flex items-center px-4 text-gray-400 bg-gray-700/50 rounded-r-lg border-l border-gray-700">
                            @reabilite.pro
                        </span>
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                        Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {errorEmail && <p className="text-red-400 text-sm text-center">{errorEmail.message.replace("Firebase: ", "").replace("Error (auth/invalid-credential).", "Credenciais inválidas.")}</p>}

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
                    </button>
                </div>
            </form>

            <div className="text-center text-sm text-gray-400 mt-6">
                Não tem uma conta?{' '}
                <Link href="/cadastro" className="font-medium text-indigo-400 hover:text-indigo-300">
                    Cadastre-se
                </Link>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;
