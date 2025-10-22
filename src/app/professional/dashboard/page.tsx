'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { placeholderImages } from '@/lib/placeholder-images';
import { ArrowUpRight, Calendar, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUserAppointments } from '@/hooks/use-user-appointments';
import { useFirebase, useFirestore } from '@/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { CompleteProfileAlert } from '@/components/complete-profile-alert';
import { type Professional, type Patient, type Appointment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const initialChartData = [
    { name: 'Jan', total: 0 },
    { name: 'Fev', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Abr', total: 0 },
    { name: 'Mai', total: 0 },
    { name: 'Jun', total: 0 },
];

type AppointmentWithPatient = Appointment & { patient?: Patient };

export default function ProfessionalDashboard() {
  const [chartData, setChartData] = useState(initialChartData);
  const { user } = useFirebase();
  const firestore = useFirestore();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);

  const { data: appointmentData, isLoading: isLoadingAppointments, error } = useUserAppointments();

  useEffect(() => {
    const generateRandomData = () => {
        return initialChartData.map(item => ({
            ...item,
            total: Math.floor(Math.random() * 50) + 10,
        }));
    };
    setChartData(generateRandomData());

     if (user && firestore) {
      const fetchProfessionalData = async () => {
        const docRef = doc(firestore, 'professionals', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfessional(docSnap.data() as Professional);
        }
      };
      fetchProfessionalData();
    }
  }, [user, firestore]);

  useEffect(() => {
    if (appointmentData && firestore) {
      const fetchPatientDetails = async () => {
        const upcomingAppointments = appointmentData
          .filter(appt => appt.dateTime.toDate() >= new Date()) 
          .sort((a, b) => a.dateTime.toMillis() - b.dateTime.toMillis()) 
          .slice(0, 5); 

        const appointmentsWithPatients = await Promise.all(
          upcomingAppointments.map(async (appt) => {
            if (!appt.patientId) return appt;
            // Corrected collection name from 'users' to 'patients'
            const patientDocRef = doc(firestore, 'patients', appt.patientId);
            const patientSnap = await getDoc(patientDocRef);
            if (patientSnap.exists()) {
              return { ...appt, patient: patientSnap.data() as Patient };
            }
            return appt;
          })
        );
        setAppointments(appointmentsWithPatients);
      };
      fetchPatientDetails();
    } else if (appointmentData === null) {
      setAppointments([]);
    }
  }, [appointmentData, firestore]);

  const formatTime = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  if (error) {
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Erro ao carregar agendamentos</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-500">Ocorreu um erro ao buscar seus agendamentos.</p>
                    <p className="text-sm text-muted-foreground mt-2">Detalhe: {error.message}</p>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <CompleteProfileAlert professional={professional} />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Aqui está um resumo da sua atividade.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pacientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">
              +10% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consultas no Mês
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+42</div>
            <p className="text-xs text-muted-foreground">
              +18.7% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9</div>
            <p className="text-xs text-muted-foreground">
              Baseado em 87 avaliações
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Visão Geral de Consultas</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Próximas Consultas</CardTitle>
            {isLoadingAppointments ? <CardDescription>Carregando...</CardDescription> :
            <CardDescription>
              Você tem {appointments.length} consultas futuras.
            </CardDescription>
            }
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingAppointments ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4"><Skeleton className="h-9 w-9 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-[150px]" /><Skeleton className="h-4 w-[100px]" /></div></div>
                  <div className="flex items-center space-x-4"><Skeleton className="h-9 w-9 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-[150px]" /><Skeleton className="h-4 w-[100px]" /></div></div>
                </div>
              ) : appointments.length > 0 ? (
                appointments.map((appt) => {
                  const avatar = placeholderImages.find(p => p.id === 'patient-avatar-1');
                  const patientName = appt.patient?.name || 'Paciente';
                  const serviceMode = appt.patient?.preferences === 'online' ? 'Online' : 'Presencial';
                  return (
                      <div key={appt.id} className="flex items-center">
                          <Avatar className="h-9 w-9">
                          {avatar && <AvatarImage src={avatar.imageUrl} alt={patientName} data-ai-hint={avatar.imageHint} />}
                          <AvatarFallback>{patientName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{patientName}</p>
                          <p className="text-sm text-muted-foreground">{formatTime(appt.dateTime)} - {appt.dateTime.toDate().toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div className="ml-auto">
                            <Badge variant={serviceMode === 'Online' ? 'default' : 'secondary'}>{serviceMode}</Badge>
                          </div>
                      </div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma consulta futura agendada.</p>
              )}
            </div>
          </CardContent>
           <CardHeader>
             <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/professional/schedule">
                  Ver todas
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
           </CardHeader>
        </Card>
      </div>
    </div>
  );
}
