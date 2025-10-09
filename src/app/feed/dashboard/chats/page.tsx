'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, MessageSquare } from 'lucide-react';
import withAuth from '@/components/withAuth';

interface Chat {
    id: string;
    participants: string[];
    lastMessage: string;
    lastUpdatedAt: { seconds: number };
    partnerDetails?: { // Adicionado para guardar os detalhes do contato
        name: string;
        photoURL: string;
    };
}

const ChatsListPage = () => {
    const [user] = useAuthState(auth);
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            let chatsData: Chat[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
            
            // Buscar detalhes do outro participante
            for (let chat of chatsData) {
                const partnerId = chat.participants.find(p => p !== user.uid);
                if (partnerId) {
                    const userDoc = await getDoc(doc(db, 'users', partnerId));
                    if (userDoc.exists()) {
                        chat.partnerDetails = {
                            name: userDoc.data().name,
                            photoURL: userDoc.data().photoURL
                        };
                    }
                }
            }

            // Ordenar por data da última mensagem
            chatsData.sort((a, b) => (b.lastUpdatedAt?.seconds || 0) - (a.lastUpdatedAt?.seconds || 0));
            
            setChats(chatsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    return (
        <div className="p-6 bg-dark rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-light mb-6 flex items-center gap-3"><MessageSquare/> Minhas Conversas</h1>
            {chats.length > 0 ? (
                <div className="space-y-4">
                    {chats.map(chat => (
                        <div key={chat.id} onClick={() => router.push(`/chat/${chat.id}`)} 
                             className="flex items-center gap-4 p-4 rounded-lg bg-dark/60 border border-primary/30 hover:bg-primary/20 cursor-pointer transition-colors">
                            <Image 
                                src={chat.partnerDetails?.photoURL || 'https://via.placeholder.com/50'} 
                                alt={chat.partnerDetails?.name || 'Usuário'}
                                width={50}
                                height={50} 
                                className="w-12 h-12 rounded-full object-cover"/>
                            <div className="flex-1">
                                <h2 className="font-bold text-lg text-light">{chat.partnerDetails?.name || 'Usuário'}</h2>
                                <p className="text-sm text-light/70 truncate">{chat.lastMessage || 'Nenhuma mensagem ainda.'}</p>
                            </div>
                            {chat.lastUpdatedAt && (
                                <span className="text-xs text-light/60 self-start">{
                                    new Date(chat.lastUpdatedAt.seconds * 1000).toLocaleDateString() === new Date().toLocaleDateString() ?
                                    new Date(chat.lastUpdatedAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) :
                                    new Date(chat.lastUpdatedAt.seconds * 1000).toLocaleDateString()
                                }</span>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-light/80 py-8">Você ainda não tem nenhuma conversa.</p>
            )}
        </div>
    );
}

export default withAuth(ChatsListPage, ['paciente', 'profissional']);
