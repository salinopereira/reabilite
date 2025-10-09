'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, MapPin, Calendar, X, Loader2, Star, MessageSquare, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import withAuth from '@/components/withAuth';
import Map from '@/components/Map'; // O nome da importação está correto
import Image from 'next/image';

// ... (interfaces e outros componentes permanecem os mesmos)
interface ProfilePageProps {
    params: { id: string; };
}

interface Avaliacao {
    id: string;
    nota: number;
    comentario: string;
    pacienteId: string;
    createdAt: { seconds: number };
}

const StarRating = ({ rating, totalStars = 5 } : { rating: number, totalStars?: number }) => {
    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, index) => {
                const starClass = index < Math.round(rating) ? "text-yellow-400" : "text-gray-600";
                return <Star key={index} className={`w-5 h-5 ${starClass}`} fill="currentColor" />
            })}
        </div>
    );
};


const ProfilePage = ({ params }: ProfilePageProps) => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user] = useAuthState(auth);
    const router = useRouter();
    
    // ... (estados do modal e outras funções permanecem iguais)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataConsulta, setDataConsulta] = useState('');
    const [motivoConsulta, setMotivoConsulta] = useState('');
    const [agendando, setAgendando] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const [avaliacoes, setAvaliations] = useState<Avaliacao[]>([]);
    const [loadingAvaliations, setLoadingAvaliations] = useState(true);

    const handleAgendamento = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setAgendando(true);
        setFeedback({ type: '', message: '' });

        try {
            const response = await fetch('/api/consultas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pacienteId: user.uid,
                    profissionalId: params.id,
                    data: dataConsulta,
                    motivo: motivoConsulta,
                }),
            });

            if (response.ok) {
                setFeedback({ type: 'success', message: 'Solicitação enviada com sucesso! O profissional entrará em contato.' });
                setTimeout(() => {
                    setIsModalOpen(false);
                    setDataConsulta('');
                    setMotivoConsulta('');
                }, 3000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao enviar solicitação.');
            }
        } catch (error: any) {
            setFeedback({ type: 'error', message: error.message });
        } finally {
            setAgendando(false);
        }
    };

    const handleStartChat = async () => {
        if (!user) return;
        const chatId = user.uid > params.id ? `${user.uid}_${params.id}` : `${params.id}_${user.uid}`;
        const chatRef = doc(db, 'chats', chatId);
        await setDoc(chatRef, { participants: [user.uid, params.id], createdAt: serverTimestamp() }, { merge: true });
        router.push(`/chat/${chatId}`);
    };

    useEffect(() => {
        const fetchProfileAndReviews = async () => {
            if (!params.id) return;
            setLoading(true);
            try {
                const docRef = doc(db, 'users', params.id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Garantir que a localização seja convertida corretamente
                    if (data.location) {
                        data.location = {
                            lat: data.location.latitude,
                            lng: data.location.longitude
                        };
                    }
                    setProfile(data);
                }

                const reviewsResponse = await fetch(`/api/avaliacoes?profissionalId=${params.id}`);
                if (reviewsResponse.ok) {
                    const data = await reviewsResponse.json();
                    setAvaliations(data.avaliacoes);
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
                setLoadingAvaliations(false);
            }
        };
        fetchProfileAndReviews();
    }, [params.id]);

    const averageRating = avaliacoes.length > 0 ? avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) / avaliacoes.length : 0;

    // ... (renderização)
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-dark text-white"><Loader2 className="animate-spin h-10 w-10"/></div>;
    }

    if (!profile) {
        return <div className="flex items-center justify-center min-h-screen bg-dark text-white">Perfil não encontrado.</div>;
    }

    return (
        <div className="min-h-screen bg-dark text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard/patient" className="flex items-center gap-2 text-light/80 hover:text-white mb-6">
                    <ArrowLeft size={18} /> Voltar para o dashboard
                </Link>
                
                <div className="bg-dark/50 rounded-2xl shadow-lg border border-primary/30 p-8 mb-8">
                    {/* ... (cabeçalho do perfil) */}
                     <div className="flex flex-col md:flex-row items-center gap-6">
                        <Image src={profile.photoURL || 'https://via.placeholder.com/150'} alt={profile.name} width={128} height={128} className="w-32 h-32 rounded-full border-4 border-primary object-cover" />
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold">{profile.name}</h1>
                            <p className="text-primary text-xl font-semibold">{profile.specialty}</p>
                            <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                                <StarRating rating={averageRating} />
                                <span className="text-light/80">({avaliacoes.length} avaliações)</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3"><Mail size={20} className="text-primary"/><p>{profile.email}</p></div>
                        {profile.location && 
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold flex items-center gap-2"><MapPin size={20} className="text-primary"/> Localização</h3>
                                <div className="mt-2 h-64 w-full rounded-lg overflow-hidden border border-primary/30">
                                    {/* CORREÇÃO: Passando as props corretas para o componente Map */}
                                    <Map 
                                        userLocation={profile.location} 
                                        professionals={[profile]} 
                                    />
                                </div>
                            </div>
                        }
                    </div>
                    {/* ... (botões de ação) */}
                     {user?.uid !== params.id && (
                         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                                <Calendar size={20}/> Solicitar Atendimento
                            </button>
                            <button onClick={handleStartChat} className="bg-dark/70 border border-primary/50 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                                <MessageCircle size={20}/> Iniciar Conversa
                            </button>
                        </div>
                    )}
                </div>

                {/* ... (seção de avaliações e modal) */}
                  <div className="bg-dark/50 rounded-2xl shadow-lg border border-primary/30 p-8">
                    <h2 className="text-2xl font-bold mb-6"><MessageSquare/> Avaliações</h2>
                    {loadingAvaliations ? <Loader2 className="animate-spin mx-auto"/> : avaliacoes.length > 0 ? (
                        <div className="space-y-6">
                            {avaliacoes.map(ava => (
                                <div key={ava.id} className="border-b border-primary/20 pb-4">
                                    <div className="flex items-center justify-between">
                                        <StarRating rating={ava.nota} />
                                        <span className="text-sm text-light/70">{new Date(ava.createdAt.seconds * 1000).toLocaleDateString()}</span>
                                    </div>
                                    <p className="mt-2 text-light/90">{ava.comentario}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-center text-light/80">Este profissional ainda não tem avaliações.</p>}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-dark border border-primary/50 rounded-2xl shadow-xl w-full max-w-lg p-8 space-y-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-light/80 hover:text-white"><X/></button>
                        <h2 className="text-2xl font-bold text-light">Solicitar Atendimento</h2>
                        
                        {feedback.type === 'success' ? (
                             <p className="text-green-400 bg-green-900/50 p-3 rounded-lg">{feedback.message}</p>
                        ) : (
                            <form onSubmit={handleAgendamento} className="space-y-4">
                                <div>
                                    <label htmlFor="dataConsulta" className="block text-sm font-medium text-light/80 mb-2">Data e Hora</label>
                                    <input type="datetime-local" id="dataConsulta" value={dataConsulta} onChange={(e) => setDataConsulta(e.target.value)} required className="w-full p-3 bg-dark/70 border border-primary/50 rounded-lg" />
                                </div>
                                <div>
                                    <label htmlFor="motivoConsulta" className="block text-sm font-medium text-light/80 mb-2">Motivo da Consulta</label>
                                    <textarea id="motivoConsulta" value={motivoConsulta} onChange={(e) => setMotivoConsulta(e.target.value)} required rows={4} className="w-full p-3 bg-dark/70 border border-primary/50 rounded-lg" placeholder="Descreva brevemente o que você precisa..."></textarea>
                                </div>
                                {feedback.type === 'error' && <p className="text-red-400">{feedback.message}</p>}
                                <button type="submit" disabled={agendando} className="w-full py-3 font-bold text-white bg-primary rounded-lg disabled:opacity-50">
                                    {agendando ? <Loader2 className="animate-spin mx-auto"/> : 'Enviar Solicitação'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default withAuth(ProfilePage, ['paciente', 'profissional']);
