'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirebase, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, getDoc, Timestamp } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { type Appointment, type Patient } from '@/lib/types';
import { placeholderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type AppointmentWithPatient = Appointment & { patient?: Patient };
type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';


const statusVariant: { [key in AppointmentStatus]: "default" | "secondary" | "outline" | "destructive" } = {
  scheduled: 'secondary',
  confirmed: 'default',
  completed: 'outline',
  cancelled: 'destructive',
};

const statusText: { [key in AppointmentStatus]: string } = {
  scheduled: 'Agendada',
  confirmed: 'Confirmada',
  completed: 'Concluída',
  cancelled: 'Cancelada',
};

export default function SchedulePage() {
  const { user } = useFirebase();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const appointmentsQuery = useMemoFirebase(() => {
    // Ensure user and firestore are available and user.uid is valid before creating the query
    if (!user?.uid || !firestore) {
      return null;
    }
    return query(
      collection(firestore, 'appointments'),
      where('professionalId', '==', user.uid)
    );
  }, [user?.uid, firestore]);

  const { data: appointmentData, isLoading: isLoadingCollection, error: appointmentError } = useCollection<Appointment>(appointmentsQuery);

  // Client-side sorting
  const sortedAppointments = useMemo(() => {
    if (!appointments) return [];
    return [...appointments].sort((a, b) => b.dateTime.toMillis() - a.dateTime.toMillis());
  }, [appointments]);


  useEffect(() => {
    if (appointmentData && firestore) {
      const fetchPatientDetails = async () => {
        setIsLoadingData(true);
        const appointmentsWithPatients = await Promise.all(
          appointmentData.map(async (appt) => {
            const patientDocRef = doc(firestore, 'users', appt.patientId);
            const patientSnap = await getDoc(patientDocRef);
            if (patientSnap.exists()) {
              return { ...appt, patient: patientSnap.data() as Patient };
            }
            return appt;
          })
        );
        setAppointments(appointmentsWithPatients);
        setIsLoadingData(false);
      };
      fetchPatientDetails();
    } else if (appointmentData === null && !isLoadingCollection) {
        setAppointments([]);
        setIsLoadingData(false);
    }
  }, [appointmentData, firestore, isLoadingCollection]);
  
  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    if (!firestore) return;
    const appointmentRef = doc(firestore, 'appointments', appointmentId);
    updateDocumentNonBlocking(appointmentRef, { status: newStatus });
    toast({
        title: 'Status atualizado!',
        description: `A consulta foi marcada como ${statusText[newStatus]}.`,
    });
  }

  const formatDateTime = (timestamp: Timestamp) => {
    const d = timestamp.toDate();
    return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  const isLoading = isLoadingData || isLoadingCollection;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Minha Agenda</h2>
          <p className="text-muted-foreground">
            Visualize e gerencie seus horários e consultas.
          </p>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Data e Horário</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <>
                    <TableRow>
                        <TableCell><Skeleton className="h-8 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-32 mx-auto" /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Skeleton className="h-8 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-32 mx-auto" /></TableCell>
                    </TableRow>
                </>
            ) : sortedAppointments.length > 0 ? (
              sortedAppointments.map((appt) => {
                const avatar = placeholderImages.find(p => p.id === 'patient-avatar-1');
                const patientName = appt.patient?.name || 'Paciente';
                return (
                  <TableRow key={appt.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {avatar && <AvatarImage src={avatar.imageUrl} alt={patientName} data-ai-hint={avatar.imageHint} />}
                          <AvatarFallback>{patientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{patientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDateTime(appt.dateTime)}</TableCell>
                    <TableCell className="text-center">
                        <Select
                            defaultValue={appt.status}
                            onValueChange={(newStatus: AppointmentStatus) => handleStatusChange(appt.id, newStatus)}
                        >
                            <SelectTrigger className="w-40 mx-auto">
                                <SelectValue>
                                    <Badge variant={statusVariant[appt.status]}>{statusText[appt.status]}</Badge>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {(Object.keys(statusText) as AppointmentStatus[]).map(status => (
                                    <SelectItem key={status} value={status}>
                                        {statusText[status]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                        Nenhuma consulta encontrada.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
