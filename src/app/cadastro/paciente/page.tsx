'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function PatientRegistrationPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || '');
        setLoading(false);
      } else {
        router.push('/login?role=patient');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
        setError('Por favor, insira seu nome.');
        return;
    }

    try {
      await setDoc(doc(firestore, 'usuarios', user.uid), {
        uid: user.uid,
        email: user.email,
        nome: name,
        fotoURL: user.photoURL,
        tipo: 'paciente',
        createdAt: new Date(),
      }, { merge: true });

      router.push('/dashboard/paciente');
    } catch (error) {
      console.error("Error creating patient profile:", error);
      setError('Ocorreu um erro ao finalizar seu cadastro. Tente novamente.');
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Carregando...</span>
        </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-indigo-900 opacity-50"></div>
        <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
            
            <div className="flex flex-col items-center text-center mb-4">
              <Image src="/icon.svg" alt="Reabilite Pro Logo" width={40} height={40} />
              <h1 className="text-3xl font-bold text-gray-100 mt-4">Cadastro de Paciente</h1>
              <p className="text-gray-400 mt-2">Falta pouco para você encontrar o profissional ideal.</p>
            </div>

            <form onSubmit={handleRegistration} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder='Digite seu nome'
                />
              </div>

              {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm">{error}</p>}

              <button 
                type="submit"
                className="w-full px-4 py-3 font-bold text-white text-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all transform hover:scale-105"
              >
                Finalizar Cadastro
              </button>
            </form>
        </div>
    </main>
  );
}
