'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Loader2, User, MapPin, Search, ChevronLeft, ChevronRight, MessageSquare, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import withAuth from '@/components/withAuth';

const DashboardPage = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProfessionals, setTotalProfessionals] = useState(0);

  const userDocRef = user ? doc(db, 'users', user.uid) : null;
  const [userData, loadingUserData] = useDocumentData(userDocRef);

  const findProfessionals = useCallback((page = 1) => {
    setLoadingProfessionals(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocalização não é suportada pelo seu navegador.');
      setLoadingProfessionals(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        if (userDocRef) {
          await updateDoc(userDocRef, { location: { lat: latitude, lng: longitude } });
        }

        try {
          const response = await fetch(`/api/profissionais_proximos?lat=${latitude}&lng=${longitude}&raio=10&page=${page}&pageSize=9`);
          if (!response.ok) {
            throw new Error('Falha ao buscar profissionais.');
          }
          const data = await response.json();
          setProfessionals(data.professionals || []);
          setTotalPages(data.totalPages || 0);
          setCurrentPage(data.currentPage || 1);
          setTotalProfessionals(data.totalProfessionals || 0);

        } catch (error: any) {
          setLocationError(error.message);
        } finally {
          setLoadingProfessionals(false);
        }
      },
      (error) => {
        setLocationError(`Erro ao obter localização: ${error.message}`);
        setLoadingProfessionals(false);
      }
    );
  }, [userDocRef]);

  useEffect(() => {
    // Automatically search for professionals on component mount if location is available
    findProfessionals();
  }, [findProfessionals]);


  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      findProfessionals(newPage);
    }
  };

  if (loading || loadingUserData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark text-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">Bem-vindo ao seu Painel, <span className="text-primary">{userData?.name || 'Usuário'}</span>!</h1>
          <p className="mt-2 text-lg text-light/80">Gerencie suas atividades e conecte-se com a comunidade.</p>
        </div>

        {/* Barra de Navegação do Dashboard */}
        <div className="mb-8 p-4 bg-dark/50 rounded-lg shadow-md">
          <nav className="flex items-center justify-around">
            <Link href="/dashboard/encontrar" className="flex flex-col items-center gap-2 text-light hover:text-primary transition-colors">
              <Search />
              <span>Encontrar</span>
            </Link>
            <Link href="/dashboard/consultas" className="flex flex-col items-center gap-2 text-light hover:text-primary transition-colors">
              <Calendar />
              <span>Consultas</span>
            </Link>
            <Link href="/dashboard/chats" className="flex flex-col items-center gap-2 text-light hover:text-primary transition-colors">
              <MessageSquare />
              <span>Chats</span>
            </Link>
            <Link href="/dashboard/feed" className="flex flex-col items-center gap-2 text-light hover:text-primary transition-colors">
              <Users />
              <span>Feed</span>
            </Link>
          </nav>
        </div>

        <div className="bg-dark/50 rounded-2xl shadow-lg border border-primary/30 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><MapPin className="text-primary" />Profissionais Próximos</h2>
          
          {locationError && <p className="text-red-500 my-4 text-center">{locationError}</p>}

          {loadingProfessionals && (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
          )}

          {!loadingProfessionals && professionals.length > 0 && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {professionals.map(prof => (
                        <div key={prof.id} className="bg-dark/70 p-5 rounded-lg border border-primary/50 transition-transform hover:scale-105">
                             <div className="flex items-center gap-4 mb-4">
                                <Image 
                                    src={prof.fotoPerfil || 'https://via.placeholder.com/150'} 
                                    alt={prof.name} 
                                    width={64} 
                                    height={64}
                                    className="w-16 h-16 rounded-full border-2 border-primary"/>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{prof.name}</h3>
                                    <p className="text-primary/90">{prof.specialty}</p>
                                </div>
                            </div>
                            <p className="text-sm text-light/80 mb-4">A {prof.distancia_km.toFixed(2)} km de você.</p>
                            <Link href={`/profile/${prof.id}`} className="block w-full text-center bg-primary/20 text-primary hover:bg-primary/30 font-semibold py-2 px-4 rounded-lg transition-colors">
                                Ver Perfil
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center items-center gap-4">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1 || loadingProfessionals} className="p-2 rounded-md bg-primary/20 hover:bg-primary/30 disabled:opacity-50">
                        <ChevronLeft size={24}/>
                    </button>
                    <span className="font-semibold">Página {currentPage} de {totalPages}</span>
                     <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages || loadingProfessionals} className="p-2 rounded-md bg-primary/20 hover:bg-primary/30 disabled:opacity-50">
                        <ChevronRight size={24}/>
                    </button>
                </div>
            </>
          )}

          {!loadingProfessionals && professionals.length === 0 && (
              <div className="text-center py-16">
                <p className="text-light/80 mb-4">Nenhum profissional encontrado na sua área.</p>
                <button onClick={() => findProfessionals(1)} disabled={loadingProfessionals} className="bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mx-auto">
                    {loadingProfessionals ? <><Loader2 className="animate-spin"/> Buscando...</> : <><Search size={20}/> Buscar Novamente</>}
                </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(DashboardPage, ['paciente', 'profissional']);
