'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import withAuth from '@/components/withAuth'; // Importando o HOC

const PatientDashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // A lógica de loading, error e !user agora é primariamente tratada pelo HOC,
  // mas podemos manter uma verificação para exibir informações do usuário.
  if (loading) {
    return null; // O HOC já mostra um loader
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Ocorreu um erro: {error.message}</p>
      </div>
    );
  }

  if (!user) {
    return null; // O HOC cuida do redirecionamento
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl text-center p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          Dashboard do Paciente
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Bem-vindo, <span className="font-semibold text-teal-400">{user.displayName || user.email}</span>!
        </p>
        <p className="mt-2 text-gray-400">
          Sua jornada para a recuperação começa aqui.
        </p>
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full max-w-xs px-6 py-3 font-bold text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-red-500/50 transform transition-transform duration-300 ease-in-out disabled:opacity-50"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

// Envolvendo a página com o HOC e especificando que apenas o perfil 'paciente' é permitido
export default withAuth(PatientDashboard, ['paciente']);
