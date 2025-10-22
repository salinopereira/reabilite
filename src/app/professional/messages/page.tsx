'use client';

import { ChatInterface } from '@/components/chat-interface';
import { useFirebase, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { Patient, Appointment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type Conversation = {
  id: string;
  patientId: string;
  patientName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  avatarId: string;
};

export default function MessagesPage() {
  const { user, isUserLoading } = useFirebase();
  const firestore = useFirestore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  useEffect(() => {
    if (user && firestore) {
      const fetchConversations = async () => {
        setIsLoadingConversations(true);
        // 1. Find all appointments for the current professional
        const appointmentsQuery = query(
          collection(firestore, 'appointments'),
          where('professionalId', '==', user.uid)
        );
        const appointmentSnap = await getDocs(appointmentsQuery);

        // 2. Get unique patient IDs from appointments
        const patientIds = [
          ...new Set(appointmentSnap.docs.map(doc => (doc.data() as Appointment).patientId)),
        ];

        // 3. Fetch patient details for each unique patient ID
        const patientPromises = patientIds.map(async (patientId) => {
          const patientDocRef = doc(firestore, 'users', patientId);
          const patientSnap = await getDoc(patientDocRef);
          return patientSnap.exists() ? { id: patientSnap.id, ...patientSnap.data() } as Patient : null;
        });

        const patients = (await Promise.all(patientPromises)).filter(p => p !== null) as Patient[];
        
        // 4. Create conversation objects
        const conversationData = patients.map(patient => {
            // Create a consistent, predictable conversation ID
            const convoId = [user.uid, patient.id].sort().join('_');
            return {
                id: convoId,
                patientId: patient.id,
                patientName: patient.name,
                lastMessage: 'Clique para ver as mensagens...', // Placeholder
                lastMessageTimestamp: '', // This could be fetched from the last message in a real scenario
                avatarId: 'patient-avatar-1' // Simplified avatar logic
            }
        });

        setConversations(conversationData);
        setIsLoadingConversations(false);
      };

      fetchConversations();
    }
  }, [user, firestore]);

  if (isUserLoading || isLoadingConversations) {
    return (
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Mensagens</h2>
                <p className="text-muted-foreground">Carregando conversas...</p>
            </div>
        </div>
        <div className="grid h-[calc(100vh-12rem)] grid-cols-1 md:grid-cols-3 rounded-lg border">
            <div className="flex flex-col border-r p-2 space-y-2">
                <Skeleton className="h-10 w-full" />
                <div className="flex items-center space-x-4 p-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                    </div>
                </div>
                 <div className="flex items-center space-x-4 p-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                    </div>
                </div>
            </div>
            <div className="col-span-2 flex items-center justify-center">
                 <p className="text-muted-foreground">Carregando...</p>
            </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight">Acesso Negado</h2>
        <p className="text-muted-foreground">
          Você precisa estar logado para ver as mensagens.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mensagens</h2>
          <p className="text-muted-foreground">
            {conversations.length > 0 ? 'Selecione uma conversa para começar.' : 'Nenhuma conversa encontrada. Seus pacientes aparecerão aqui após o primeiro agendamento.'}
          </p>
        </div>
      </div>
      <ChatInterface conversations={conversations} currentUserId={user.uid} />
    </div>
  );
}
