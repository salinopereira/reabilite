'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { placeholderImages } from '@/lib/placeholder-images';
import { Star, MapPin, Clock, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import Link from 'next/link';
import { useFirebase, useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { type Appointment } from '@/lib/types';


const professional = {
  id: '1',
  name: 'Dr.ª Carolina Moreira',
  specialty: 'Nutricionista',
  location: 'São Paulo, SP',
  rating: 4.9,
  reviews: 87,
  avatarId: 'professional-avatar-1',
  bio: 'Nutricionista com foco em reeducação alimentar e emagrecimento saudável. Mais de 10 anos de experiência ajudando pacientes a alcançarem seus objetivos com uma alimentação balanceada e saborosa.',
  price: '180,00',
};

const reviews = [
  { id: 1, name: 'Mariana L.', rating: 5, comment: 'Excelente profissional! Muito atenciosa e me ajudou muito a mudar meus hábitos.' },
  { id: 2, name: 'João P.', rating: 5, comment: 'A Carolina é fantástica. Consegui atingir meu objetivo de peso e hoje me sinto muito melhor.' },
];

const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export default function ProfessionalProfilePage({ params }: { params: { id: string } }) {
  const avatar = placeholderImages.find((p) => p.id === professional.avatarId);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const { user, isUserLoading } = useFirebase();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleBooking = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Você precisa estar logado para agendar uma consulta.' });
        return;
    }
    if (!date || !selectedTime) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Por favor, selecione uma data e um horário.' });
        return;
    }

    setIsBooking(true);

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const appointmentData: Omit<Appointment, 'id'> = {
        patientId: user.uid,
        professionalId: params.id, // ID do profissional da URL
        dateTime: Timestamp.fromDate(appointmentDateTime),
        status: 'scheduled',
        notes: ''
    };

    try {
        const appointmentsCollection = collection(firestore, 'appointments');
        await addDocumentNonBlocking(appointmentsCollection, appointmentData);
        
        toast({
            title: 'Consulta Agendada!',
            description: `Sua consulta com ${professional.name} foi marcada para ${appointmentDateTime.toLocaleDateString('pt-BR')} às ${selectedTime}.`,
        });

        setSelectedTime(null);

    } catch (error) {
        console.error("Error booking appointment: ", error);
        toast({
            variant: 'destructive',
            title: 'Erro ao agendar',
            description: 'Não foi possível agendar sua consulta. Tente novamente.',
        });
    } finally {
        setIsBooking(false);
    }
  };


  return (
    <div className="flex min-h-screen flex-col bg-background">
       <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Button variant="outline" asChild><Link href="/patient/dashboard">Voltar</Link></Button>
      </header>
      <main className="container mx-auto flex-1 p-4 md:p-8">
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                {avatar && <AvatarImage src={avatar.imageUrl} alt={professional.name} data-ai-hint={avatar.imageHint} />}
                <AvatarFallback className="text-4xl">{professional.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{professional.name}</h1>
                <p className="text-lg text-primary">{professional.specialty}</p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-muted-foreground md:justify-start">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{professional.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-foreground">{professional.rating}</span>
                    <span>({professional.reviews} avaliações)</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-2 md:w-auto">
                <p className="text-2xl font-bold text-foreground">R$ {professional.price}</p>
                <p className="text-sm text-muted-foreground">por consulta</p>
                <Button size="lg" className="w-full" onClick={handleBooking} disabled={isBooking || isUserLoading}>
                  {isBooking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isBooking ? 'Agendando...' : 'Agendar Consulta'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="schedule">Agenda</TabsTrigger>
                <TabsTrigger value="about">Sobre</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              </TabsList>
              <TabsContent value="schedule" className="mt-6">
                <h3 className="text-xl font-semibold">Agende sua consulta</h3>
                <p className="text-muted-foreground">Selecione uma data e horário disponíveis.</p>
                <div className="mt-4 grid gap-8 md:grid-cols-2">
                  <div className="flex justify-center rounded-md border">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="p-0"
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                    />
                  </div>
                  <div className="space-y-4">
                     <h4 className="font-semibold">Horários disponíveis para {date?.toLocaleDateString('pt-BR') || 'a data selecionada'}</h4>
                     <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map(time => (
                            <Button 
                              key={time} 
                              variant={selectedTime === time ? "default" : "outline"}
                              onClick={() => setSelectedTime(time)}
                              className="flex items-center gap-2"
                            >
                                <Clock className="h-4 w-4"/>
                                {time}
                            </Button>
                        ))}
                     </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="about" className="mt-6">
                 <Card>
                    <CardHeader><CardTitle>Sobre mim</CardTitle></CardHeader>
                    <CardContent><p className="text-muted-foreground whitespace-pre-wrap">{professional.bio}</p></CardContent>
                 </Card>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <Card>
                    <CardHeader><CardTitle>O que os pacientes dizem</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {reviews.map(review => (
                            <div key={review.id} className="border-b pb-4 last:border-b-0">
                               <div className="flex items-center justify-between">
                                 <p className="font-semibold">{review.name}</p>
                                 <div className="flex items-center gap-1">
                                    {Array(review.rating).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
                                 </div>
                               </div>
                               <p className="mt-2 text-muted-foreground">{review.comment}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
