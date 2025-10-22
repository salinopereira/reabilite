'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { placeholderImages } from '@/lib/placeholder-images';
import { Cake, Mail, Phone } from 'lucide-react';
import { HealthHistorySummarizer } from './health-history-summarizer';
import { useEffect, useState } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { type Patient } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function calculateAge(dob: string) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  
  const patientDocRef = useMemoFirebase(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'users', params.id);
  }, [firestore, params.id]);

  const { data: patient, isLoading } = useDoc<Patient>(patientDocRef);

  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    if (patient?.dob) {
      setAge(calculateAge(patient.dob));
    } else {
      setAge(null);
    }
  }, [patient?.dob]);
  
  const handleSaveHistory = async (newHistory: string) => {
    if (patientDocRef) {
      await updateDoc(patientDocRef, { healthHistory: newHistory });
    }
  };

  const avatar = patient ? placeholderImages.find(p => p.id === 'patient-avatar-1') : null; // Simplified avatar logic

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prontuário do Paciente</h2>
          <p className="text-muted-foreground">
            {isLoading ? 'Carregando...' : `Detalhes e histórico de saúde de ${patient?.name || 'paciente'}.`}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
            <Card>
              {isLoading ? (
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </CardHeader>
              ) : patient ? (
                <>
                  <CardHeader>
                      <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                              {avatar && <AvatarImage src={avatar.imageUrl} alt={patient.name} data-ai-hint={avatar.imageHint} />}
                              <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                              <CardTitle>{patient.name}</CardTitle>
                              {age !== null && <CardDescription>{age} anos</CardDescription>}
                          </div>
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{patient.email}</span>
                      </div>
                      {patient.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{patient.phone}</span>
                        </div>
                      )}
                      {patient.dob && (
                        <div className="flex items-center gap-2">
                          <Cake className="h-4 w-4 text-muted-foreground" />
                          <span>Nascimento: {new Date(patient.dob).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                  </CardContent>
                </>
              ) : (
                 <CardHeader>
                    <CardTitle>Paciente não encontrado</CardTitle>
                 </CardHeader>
              )}
            </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
           {isLoading ? (
             <Card>
               <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
               <CardContent><Skeleton className="h-64 w-full" /></CardContent>
             </Card>
           ): (
             <HealthHistorySummarizer 
                patientId={params.id}
                initialHistory={patient?.healthHistory || ''} 
                onSave={handleSaveHistory}
            />
           )}
        </div>
      </div>
    </div>
  );
}
