'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { GeoPoint, collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { Loader2, Search, MapPin, Star, User, Calendar, History, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

// Interfaces (mantidas do código anterior)
interface Professional {
    id: string;
    name: string;
    specialty: string;
    photoURL: string;
    distance: number;
    averageRating: number;
}
interface Consultation {
    id: string;
    professionalId: string;
    professionalName?: string;
    date: string;
    reason: string;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
}

const PatientDashboardPage = () => {
    const [user, loadingAuth] = useAuthState(auth);
    const [location, setLocation] = useState<GeoPoint | null>(null);
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [loadingProfessionals, setLoadingProfessionals] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [radius, setRadius] = useState(10);

    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loadingConsultations, setLoadingConsultations] = useState(true);

    // Função para buscar nome do profissional
    const getProfessionalName = async (professionalId: string) => {
        const profRef = doc(db, 'users', professionalId);
        const profSnap = await getDoc(profRef);
        return profSnap.exists() ? profSnap.data().name : 'Profissional Desconhecido';
    };

    // Efeito para buscar localização (mantido)
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => setLocation(new GeoPoint(position.coords.latitude, position.coords.longitude)),
                (err) => setError('Não foi possível obter sua localização.')
            );
        }
    }, []);

    // Efeito para buscar consultas
    useEffect(() => {
        if (!user) return;
        const fetchConsultations = async () => {
            setLoadingConsultations(true);
            try {
                const q = query(collection(db, 'consultations'), where('patientId', '==', user.uid), orderBy('date', 'desc'));
                const snapshot = await getDocs(q);
                const allConsultations: Consultation[] = await Promise.all(snapshot.docs.map(async (d) => {
                    const data = d.data();
                    const professionalName = await getProfessionalName(data.professionalId);
                    const isPast = new Date(data.date) < new Date();
                    return {
                        id: d.id,
                        professionalName,
                        ...data,
                        status: (data.status === 'confirmed' && isPast) ? 'completed' : data.status,
                    } as Consultation;
                }));
                setConsultations(allConsultations);
            } catch (err) {
                setError("Falha ao carregar suas consultas.");
            } finally {
                setLoadingConsultations(false);
            }
        };
        fetchConsultations();
    }, [user]);

    const findProfessionals = async () => {
        // ... (lógica de busca de profissionais mantida)
    };
    
    const confirmedConsultations = consultations.filter(c => c.status === 'confirmed' && new Date(c.date) >= new Date());
    const historyConsultations = consultations.filter(c => c.status === 'completed' || c.status === 'rejected');

    // Componente de Card de Consulta
    const ConsultationCard = ({ cons }: { cons: Consultation }) => (
        <div className="bg-dark/70 p-5 rounded-lg border border-primary/20">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg flex items-center gap-2"><User /> {cons.professionalName}</p>
                    <p className="text-sm text-light/80 mt-1">{cons.reason}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold flex items-center gap-2 justify-end"><Calendar /> {new Date(cons.date).toLocaleDateString('pt-BR')}</p>
                    <p className="text-sm text-light/80 flex items-center gap-2 justify-end"><Clock size={16}/> {new Date(cons.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                </div>
            </div>
            {cons.status === 'completed' && (
                 <Link href={`/feed/dashboard/avaliar/${cons.id}`} className="text-yellow-400 hover:text-yellow-300 mt-4 inline-block font-semibold"><Star size={16} className="inline mr-1"/> Deixar uma avaliação</Link>
            )}
        </div>
    );

    if (loadingAuth) {
        return <div className="loading-container"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold">Dashboard do Paciente</h1>
                    <p className="text-light/80">Encontre profissionais e gerencie suas consultas.</p>
                </header>

                {/* Seções de Consulta */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <section id="confirmed" className="dashboard-section">
                        <h2 className="section-title"><CheckCircle className="text-green-400"/> Consultas Agendadas</h2>
                        {loadingConsultations ? <Loader2 className="animate-spin mx-auto" /> : confirmedConsultations.length > 0 ? 
                            <div className="space-y-4">{confirmedConsultations.map(c => <ConsultationCard key={c.id} cons={c} />)}</div> : 
                            <p className="info-text">Você não tem consultas agendadas.</p>}
                    </section>
                    <section id="history" className="dashboard-section">
                        <h2 className="section-title"><History/> Histórico de Consultas</h2>
                        {loadingConsultations ? <Loader2 className="animate-spin mx-auto" /> : historyConsultations.length > 0 ? 
                            <div className="space-y-4">{historyConsultations.map(c => <ConsultationCard key={c.id} cons={c} />)}</div> : 
                            <p className="info-text">Seu histórico de consultas está vazio.</p>}
                    </section>
                </div>

                {/* Seção de Busca (mantida) */}
                <section className="bg-dark/50 p-8 rounded-2xl shadow-lg border border-primary/30">
                     <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Search/> Encontrar Profissionais</h2>
                     {/* ... (conteúdo da busca de profissionais) */}
                </section>

            </div>
        </div>
    );
};

export default PatientDashboardPage;
