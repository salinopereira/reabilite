'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Loader2, Check, X, Calendar, User, AlertCircle } from 'lucide-react';
import withAuth from '@/components/withAuth';

interface Consulta {
    id: string;
    pacienteId: string;
    pacienteNome?: string; // Nome será buscado separadamente
    data: { seconds: number };
    motivo: string;
    status: 'pendente' | 'aceita' | 'recusada' | 'concluida';
}

const ConsultasPage = () => {
    const [user] = useAuthState(auth);
    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, 'consultas'), where('profissionalId', '==', user.uid));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const consultasData: Consulta[] = await Promise.all(
                snapshot.docs.map(async (docSnap) => {
                    const data = docSnap.data() as Omit<Consulta, 'id'>;
                    const pacienteDoc = await getDoc(doc(db, 'users', data.pacienteId));
                    return {
                        id: docSnap.id,
                        ...data,
                        pacienteNome: pacienteDoc.exists() ? pacienteDoc.data().name : 'Paciente não encontrado',
                    };
                })
            );
            setConsultas(consultasData.sort((a, b) => b.data.seconds - a.data.seconds));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleUpdateStatus = async (id: string, status: 'aceita' | 'recusada') => {
        try {
            await fetch('/api/consultas', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ consultaId: id, status }),
            });
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    return (
        <div className="p-6 bg-dark rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-light mb-6 flex items-center gap-3"><Calendar/> Gerenciar Consultas</h1>

            {consultas.length === 0 ? (
                <div className="text-center text-light/70 p-8 border-2 border-dashed border-primary/30 rounded-lg">
                    <AlertCircle className="mx-auto h-12 w-12 text-primary/80"/>
                    <p className="mt-4">Nenhuma solicitação de consulta encontrada.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {consultas.map(c => (
                        <div key={c.id} className="bg-dark/60 border border-primary/40 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                           <div className="flex-1 space-y-2">
                               <p className="font-bold text-lg text-light flex items-center gap-2"><User size={18}/> {c.pacienteNome}</p>
                               <p className="text-sm text-light/80"><strong>Data:</strong> {new Date(c.data.seconds * 1000).toLocaleString()}</p>
                               <p className="text-sm text-light/80"><strong>Motivo:</strong> {c.motivo}</p>
                           </div>
                           <div className="flex items-center gap-3 w-full md:w-auto">
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${c.status === 'pendente' ? 'bg-yellow-500/20 text-yellow-400' : c.status === 'aceita' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                                </span>
                                {c.status === 'pendente' && (
                                    <>
                                        <button onClick={() => handleUpdateStatus(c.id, 'aceita')} className="p-2 bg-green-500/80 hover:bg-green-500 rounded-full text-white"><Check size={18}/></button>
                                        <button onClick={() => handleUpdateStatus(c.id, 'recusada')} className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white"><X size={18}/></button>
                                    </>
                                )}
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default withAuth(ConsultasPage, ['paciente', 'profissional']);
