'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { collection, doc, query, orderBy, onSnapshot, getDoc } from 'firebase/firestore';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import withAuth from '@/components/withAuth';
import Image from 'next/image'; // Importando o componente Image

interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: { seconds: number };
}

const ChatPage = () => {
    const params = useParams();
    const chatId = params.chatId as string;
    const [user] = useAuthState(auth);
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatPartner, setChatPartner] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (!user || !chatId) return;

        const messagesQuery = query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(msgs);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching messages: ", error);
            setLoading(false);
        });

        const fetchChatPartner = async () => {
            const chatDoc = await getDoc(doc(db, 'chats', chatId));
            if (chatDoc.exists()) {
                const partnerId = chatDoc.data().participants.find((p: string) => p !== user.uid);
                if (partnerId) {
                    const userDoc = await getDoc(doc(db, 'users', partnerId));
                    if (userDoc.exists()) {
                        setChatPartner(userDoc.data());
                    }
                }
            }
        };

        fetchChatPartner();

        return () => unsubscribe();
    }, [user, chatId]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const text = newMessage;
        setNewMessage('');

        try {
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    chatId,
                    senderId: user.uid,
                    text 
                }),
            });
            scrollToBottom();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    if (loading && !chatPartner) {
        return <div className="flex items-center justify-center h-screen bg-dark"><Loader2 className="animate-spin h-10 w-10 text-primary"/></div>;
    }

    return (
        <div className="h-screen flex flex-col bg-dark text-white">
            <header className="flex items-center p-4 bg-dark/80 border-b border-primary/30 backdrop-blur-sm sticky top-0 z-10">
                <button onClick={() => router.back()} className="mr-4 text-light/80 hover:text-white"><ArrowLeft /></button>
                {chatPartner ? (
                    <div className="flex items-center gap-3">
                         <Image 
                            src={chatPartner.photoURL || 'https://via.placeholder.com/40'} 
                            alt={chatPartner.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"/>
                         <div>
                             <h1 className="text-lg font-bold">{chatPartner.name}</h1>
                             <p className="text-sm text-primary">{chatPartner.specialty || 'Paciente'}</p>
                         </div>
                    </div>
                ) : <Loader2 className='animate-spin'/>}
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === user?.uid ? 'bg-primary text-white rounded-br-none' : 'bg-dark/70 border border-primary/40 rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 bg-dark/80 border-t border-primary/30 sticky bottom-0">
                <form onSubmit={sendMessage} className="flex items-center gap-3">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..." 
                        className="flex-1 p-3 bg-dark/70 border border-primary/50 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <button type="submit" className="p-3 bg-primary rounded-lg text-white disabled:opacity-50" disabled={!newMessage.trim()}>
                        <Send />
                    </button>
                </form>
            </footer>
        </div>
    );
}

export default withAuth(ChatPage, ['paciente', 'profissional']);
