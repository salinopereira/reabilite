'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, Star } from 'lucide-react';
import withAuth from '@/components/withAuth';

const AvaliarConsultaPage = () => {
    const router = useRouter();
    const params = useParams();
    const { consultaId } = params;
    const [user] = useAuthState(auth);

    const [consulta, setConsulta] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [nota, setNota] = useState(0);
    const [comentario, setComentario] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (!user || !consultaId) return;

        const fetchConsulta = async () => {
            const docRef = doc(db, 'consultas', consultaId as string);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().pacienteId === user.uid) {
                setConsulta(docSnap.data());
            } else {
                setError('Consulta não encontrada ou acesso negado.');
            }
            setLoading(false);
        };

        fetchConsulta();
    }, [user, consultaId]);

    const handleAvaliacao = async (e: React.FormEvent) => {
        e.preventDefault();
        if (nota === 0 || !comentario.trim()) {
            setError('Por favor, dê uma nota e escreva um comentário.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await setDoc(doc(db, 'avaliacoes', consultaId as string), {
                consultaId,
                pacienteId: user?.uid,
                profissionalId: consulta.profissionalId,
                nota,
                comentario,
                createdAt: serverTimestamp(),
            });
            setFeedback('Avaliação enviada com sucesso! Obrigado.');
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
            setError('Ocorreu um erro. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">{error}</div>;
    }

    return (
        <div className="p-6 bg-dark rounded-lg shadow-md max-w-2xl mx-auto mt-10">
            <h1 className="text-3xl font-bold text-light mb-6">Avaliar Atendimento</h1>
            {feedback ? (
                 <p className="text-green-400 bg-green-900/50 p-3 rounded-lg">{feedback}</p>
            ) : (
                <form onSubmit={handleAvaliacao} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-light/80 mb-2">Sua nota</label>
                        <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, index) => (
                                <Star key={index} className={`w-8 h-8 cursor-pointer ${index < nota ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" onClick={() => setNota(index + 1)} />
                            ))}
                        </div>
                    </div>
                    <div>
                         <label htmlFor="comentario" className="block text-sm font-medium text-light/80 mb-2">Seu comentário</label>
                         <textarea id="comentario" value={comentario} onChange={(e) => setComentario(e.target.value)} required rows={5} className="w-full p-3 bg-dark/70 border border-primary/50 rounded-lg" placeholder="Compartilhe sua experiência..."></textarea>
                    </div>
                     {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={submitting} className="w-full py-3 font-bold text-white bg-primary rounded-lg disabled:opacity-50">
                        {submitting ? <Loader2 className="animate-spin mx-auto"/> : 'Enviar Avaliação'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default withAuth(AvaliarConsultaPage, ['paciente']);
