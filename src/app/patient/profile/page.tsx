'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirebase, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';


const profileSchema = z.object({
  name: z.string().min(2, { message: 'O nome é obrigatório.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  location: z.string().min(1, { message: 'A localização é obrigatória.' }),
  preferences: z.string(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PatientProfilePage() {
  const { user } = useFirebase();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      location: '',
      preferences: 'both',
    },
  });

  useEffect(() => {
    if (user && firestore) {
      const fetchUserData = async () => {
        setIsLoading(true);
        const userDocRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          // Set form values from Firestore data
          form.reset({
            name: userData.name || '',
            email: userData.email || '',
            location: userData.location || '',
            preferences: userData.preferences || 'both',
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

    const userDocRef = doc(firestore, 'users', user.uid);
    updateDocumentNonBlocking(userDocRef, {
        name: data.name,
        location: data.location,
        preferences: data.preferences
    });

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
            Gerencie suas informações pessoais e preferências.
          </p>
        </div>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Mantenha seus dados sempre atualizados. O e-mail não pode ser alterado aqui.
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
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
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
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localização</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferências de Atendimento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
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
