'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Loader2, Check, X, Calendar, User, Clock, AlertTriangle, History, CheckCircle } from 'lucide-react';
import { sendNotification } from '@/app/actions/sendNotification'; // Importa a Server Action

interface Consultation {
    id: string;
    patientId: string;
    patientName?: string;
    date: string;
    reason: string;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
}

const ProfessionalDashboardPage = () => {
    const [user, loadingAuth] = useAuthState(auth);
    const [requests, setRequests] = useState<Consultation[]>([]);
    const [confirmed, setConfirmed] = useState<Consultation[]>([]);
    const [history, setHistory] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getUserName = async (userId: string) => {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? userSnap.data().name : 'Usuário Desconhecido';
    };

    useEffect(() => {
        if (!user) return;
        const fetchConsultations = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'consultations'), where('professionalId', '==', user.uid), orderBy('date', 'desc'));
                const querySnapshot = await getDocs(q);
                const allConsultations: Consultation[] = await Promise.all(querySnapshot.docs.map(async (d) => {
                    const data = d.data();
                    const patientName = await getUserName(data.patientId);
                    const isPast = new Date(data.date) < new Date();
                    let status = data.status;
                    if (status === 'confirmed' && isPast) status = 'completed';
                    return { id: d.id, patientName, ...data, status } as Consultation;
                }));
                setRequests(allConsultations.filter(c => c.status === 'pending'));
                setConfirmed(allConsultations.filter(c => c.status === 'confirmed' && new Date(c.date) >= new Date()));
                setHistory(allConsultations.filter(c => c.status === 'completed' || c.status === 'rejected'));
            } catch (err) { setError('Falha ao carregar consultas.'); } finally { setLoading(false); }
        };
        fetchConsultations();
    }, [user]);

    const handleUpdateRequest = async (consultation: Consultation, newStatus: 'confirmed' | 'rejected') => {
        const { id, patientId, patientName } = consultation;
        try {
            await updateDoc(doc(db, 'consultations', id), { status: newStatus });
            
            // Envia notificação se a consulta for confirmada
            if (newStatus === 'confirmed') {
                await sendNotification({
                    recipientId: patientId,
                    title: "Consulta Confirmada!",
                    body: `Sua consulta com ${user?.displayName || 'o profissional'} foi confirmada.`
                });
                setConfirmed(prev => [...prev, { ...consultation, status: newStatus }]);
            } else {
                setHistory(prev => [...prev, { ...consultation, status: newStatus }]);
            }
            setRequests(prev => prev.filter(r => r.id !== id));

        } catch (err) {
            setError(`Falha ao atualizar a solicitação.`);
        }
    };

    // ... resto do componente (renderização)
    const renderConsultationCard = (c: Consultation, actions: boolean = false) => (
        <div key={c.id} className="bg-dark/70 p-5 rounded-lg border border-primary/20 shadow-md">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                    <p className="flex items-center gap-3 font-bold text-xl"><User/> {c.patientName}</p>
                    <p className="text-light/90 mt-2 text-md">{c.reason}</p>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                    <p className="flex items-center gap-2 font-semibold justify-end"><Calendar/> {new Date(c.date).toLocaleDateString('pt-BR')}</p>
                    <p className="flex items-center gap-2 text-sm text-light/80 justify-end"><Clock size={16}/> {new Date(c.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>
            {actions && (
                <div className="mt-5 flex gap-4 justify-end">
                    <button onClick={() => handleUpdateRequest(c, 'rejected')} className="btn-rejeitar"><X size={18}/> Rejeitar</button>
                    <button onClick={() => handleUpdateRequest(c, 'confirmed')} className="btn-aceitar"><Check size={18}/> Aceitar</button>
                </div>
            )}
        </div>
    );

    if (loadingAuth || loading) {
        return <div className="loading-container"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold">Dashboard do Profissional</h1>
                    <p className="text-light/80">Gerencie suas consultas e pacientes.</p>
                </header>

                {error && <p className="error-banner">{error}</p>}

                <section id="requests" className="dashboard-section">
                    <h2 className="section-title"><AlertTriangle className="text-yellow-400"/> Novas Solicitações</h2>
                    {requests.length > 0 ? <div className="space-y-6">{requests.map(r => renderConsultationCard(r, true))}</div> : <p className="info-text">Nenhuma nova solicitação.</p>}
                </section>

                <section id="confirmed" className="dashboard-section">
                    <h2 className="section-title"><CheckCircle className="text-green-400"/> Consultas Confirmadas</h2>
                    {confirmed.length > 0 ? <div className="space-y-6">{confirmed.map(c => renderConsultationCard(c))}</div> : <p className="info-text">Nenhuma consulta confirmada na sua agenda.</p>}
                </section>

                <section id="history" className="dashboard-section">
                    <h2 className="section-title"><History/> Histórico de Consultas</h2>
                    {history.length > 0 ? <div className="space-y-6">{history.map(h => renderConsultationCard(h))}</div> : <p className="info-text">Nenhum registro no seu histórico.</p>}
                </section>
            </div>
        </div>
    );
};

export default ProfessionalDashboardPage;
