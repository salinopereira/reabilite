'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, MessageSquarePlus } from 'lucide-react';
import withAuth from '@/components/withAuth';

const ChatListPage = () => {
    const [user] = useAuthState(auth);
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('participants', 'array-contains', user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setChats(chatsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Conversas</h1>
            </div>

            {chats.length === 0 ? (
                <div className="text-center text-light/80 mt-16">
                    <p>Você ainda não tem nenhuma conversa.</p>
                    <p className="text-sm mt-2">Inicie um chat através do perfil de um profissional.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {chats.map(chat => (
                        <Link href={`/chat/${chat.id}`} key={chat.id}>
                            <div className="bg-dark/70 p-4 rounded-lg border border-primary/40 hover:bg-dark/60 transition-colors cursor-pointer">
                                <p className="font-bold">{chat.id.replace(user!.uid, '').replace('_', '').substring(0, 10)}...</p>
                                <p className="text-sm text-light/80 truncate">{chat.lastMessage || 'Nenhuma mensagem ainda.'}</p>
                            </div>
                        </Link>
                    ))
                    }
                </div>
            )
            }
        </div>
    );
}

// Corrigindo a chamada do HOC para incluir os perfis permitidos
export default withAuth(ChatListPage, ['paciente', 'profissional']);
