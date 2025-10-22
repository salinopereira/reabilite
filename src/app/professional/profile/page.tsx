'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirebase, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'O nome é obrigatório.' }),
  email: z.string().email(),
  crnCrefCrp: z.string().min(1, { message: 'Seu registro profissional é obrigatório.' }),
  areaOfExpertise: z.string().min(1, { message: 'A especialidade é obrigatória.' }),
  consultationFee: z.coerce.number().min(0, { message: 'O valor não pode ser negativo.' }),
  serviceMode: z.string(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfessionalProfilePage() {
  const { user } = useFirebase();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      crnCrefCrp: '',
      areaOfExpertise: '',
      consultationFee: 0,
      serviceMode: 'both',
      bio: '',
    },
  });

  useEffect(() => {
    if (user && firestore) {
      const fetchUserData = async () => {
        setIsLoading(true);
        const userDocRef = doc(firestore, 'professionals', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          form.reset({
            name: userData.name || '',
            email: userData.email || '',
            crnCrefCrp: userData.crnCrefCrp || '',
            areaOfExpertise: userData.areaOfExpertise || '',
            consultationFee: userData.consultationFee || 0,
            serviceMode: userData.serviceMode || 'both',
            bio: userData.bio || '',
          });
        }
        setIsLoading(false);
      };

      fetchUserData();
    }
  }, [user, firestore, form]);

  const onSubmit = (data: ProfileFormValues) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Usuário não autenticado ou conexão perdida.',
      });
      return;
    }

    const userDocRef = doc(firestore, 'professionals', user.uid);
    setDocumentNonBlocking(userDocRef, data, { merge: true });

    toast({
      title: 'Perfil atualizado!',
      description: 'Suas informações foram salvas com sucesso.',
    });
  };
  
    return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
          <p className="text-muted-foreground">
            Gerencie seu perfil público e informações profissionais.
          </p>
        </div>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Informações Públicas</CardTitle>
              <CardDescription>
                Essas informações serão exibidas para os pacientes. O e-mail não pode ser alterado aqui.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                 <div className="space-y-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input {...field} disabled /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <FormField
                      control={form.control}
                      name="areaOfExpertise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especialidade</FormLabel>
                           <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecione sua especialidade" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Nutrição">Nutricionista</SelectItem>
                                <SelectItem value="Psicologia">Psicólogo</SelectItem>
                                <SelectItem value="Educação Física">Educador Físico</SelectItem>
                            </SelectContent>
                           </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="crnCrefCrp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CRN/CRP/CREF</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <FormField
                      control={form.control}
                      name="consultationFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor da Consulta (R$)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="serviceMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modalidade de Atendimento</FormLabel>
                           <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="in-person">Presencial</SelectItem>
                                <SelectItem value="both">Ambos</SelectItem>
                            </SelectContent>
                           </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sobre mim (Bio)</FormLabel>
                          <FormControl><Textarea rows={5} placeholder="Fale um pouco sobre sua experiência, abordagem e o que os pacientes podem esperar." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
