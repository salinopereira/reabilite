'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { ArrowLeft, Loader2, Users, UserPlus } from 'lucide-react';
import Link from 'next/link';

// Mock data for patients and requests
const mockPatients = [
  { id: 1, name: 'Ana Silva', lastActivity: 'Ontem' },
  { id: 2, name: 'Bruno Costa', lastActivity: '3 dias atrás' },
  { id: 3, name: 'Carla Dias', lastActivity: 'Hoje' },
];

const mockRequests = [
  { id: 1, name: 'Fernando Lima', date: '25/07/2024' },
  { id: 2, name: 'Gabriela Martins', date: '24/07/2024' },
];

const ProfessionalDashboardPage = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const userDocRef = user ? doc(db, 'users', user.uid) : null;
  const [userData, loadingUserData] = useDocumentData(userDocRef);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    // Redirect if user is not a professional
    if (!loadingUserData && userData && userData.type !== 'profissional') {
        router.push('/dashboard');
    }
  }, [user, loading, userData, loadingUserData, router]);

  if (loading || loadingUserData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark text-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-light/80 hover:text-white transition-colors">
          <ArrowLeft size={18} />
          Voltar
        </Link>
      </div>
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">Olá, <span className="text-primary">Dr(a). {userData?.name || 'Profissional'}</span>!</h1>
          <p className="mt-2 text-lg text-light/80">Você tem {mockRequests.length} novas solicitações de atendimento.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Patients */}
          <div className="bg-dark/50 rounded-2xl shadow-lg border border-primary/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Users className="text-primary"/>Meus Pacientes</h2>
            <div className="space-y-4">
              {mockPatients.map((patient) => (
                <div key={patient.id} className="p-4 bg-dark/60 rounded-lg flex justify-between items-center">
                  <p className="font-semibold text-white">{patient.name}</p>
                  <p className="text-sm text-light/70">Última atividade: {patient.lastActivity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Service Requests */}
          <div className="bg-dark/50 rounded-2xl shadow-lg border border-primary/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><UserPlus className="text-primary"/>Solicitações de Atendimento</h2>
            <div className="space-y-4">
              {mockRequests.map((request) => (
                <div key={request.id} className="p-4 bg-dark/60 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{request.name}</p>
                      <p className="text-sm text-light/70">Solicitado em: {request.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm font-bold text-white bg-green-600/80 rounded-md hover:bg-green-500">Aceitar</button>
                      <button className="px-3 py-1 text-sm font-bold text-white bg-red-600/80 rounded-md hover:bg-red-500">Recusar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboardPage;
