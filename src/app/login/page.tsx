'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth, useFirebase, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  role: z.enum(['patient', 'professional']),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useFirebase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isFirebaseReady = !!auth && !!firestore;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'patient',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!isFirebaseReady) return;

    setIsSubmitting(true);
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const loggedInUser = userCredential.user;

        const collectionPath = values.role === 'patient' ? 'users' : 'professionals';
        const userDocRef = doc(firestore, collectionPath, loggedInUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
             toast({
                title: 'Login bem-sucedido!',
                description: 'Bem-vindo(a) de volta.',
            });
            const redirectPath = values.role === 'patient' ? '/patient/dashboard' : '/professional/dashboard';
            router.push(redirectPath);
        } else {
            await auth.signOut();
            toast({
                variant: 'destructive',
                title: 'Erro no Login',
                description: `Você não está registrado como ${values.role === 'patient' ? 'paciente' : 'profissional'}. Por favor, verifique o tipo de conta selecionado.`,
            });
        }

    } catch (error: any) {
        let message = "E-mail ou senha incorretos. Tente novamente.";
        if (error && error.code) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                message = "E-mail ou senha inválidos.";
            } else if (error.code === 'auth/too-many-requests') {
                message = "Muitas tentativas de login. Tente novamente mais tarde."
            }
        }
        console.error("Login error:", error)
        toast({
            variant: 'destructive',
            title: 'Erro no Login',
            description: message,
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleRoleChange = (value: string) => {
      form.setValue('role', value as 'patient' | 'professional');
  }

  // This effect handles redirection if a user is already logged in and revisits the login page.
  useEffect(() => {
    if (!isUserLoading && user && firestore) {
      const fetchUserRoleAndRedirect = async () => {
        // Check if professional
        const professionalRef = doc(firestore, 'professionals', user.uid);
        const professionalSnap = await getDoc(professionalRef);
        if (professionalSnap.exists()) {
          router.push('/professional/dashboard');
          return;
        }

        // Check if patient
        const patientRef = doc(firestore, 'users', user.uid);
        const patientSnap = await getDoc(patientRef);
        if (patientSnap.exists()) {
          router.push('/patient/dashboard');
          return;
        }
      };

      fetchUserRoleAndRedirect();
    }
  }, [user, isUserLoading, router, firestore]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Bem-vindo de volta!</CardTitle>
          <CardDescription>
            Acesse sua conta para continuar sua jornada de saúde.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Entrar como:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={handleRoleChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
                          </FormControl>
                          <Label
                            htmlFor="patient"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            Paciente
                          </Label>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value="professional"
                              id="professional"
                              className="peer sr-only"
                            />
                          </FormControl>
                          <Label
                            htmlFor="professional"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            Profissional
                          </Label>
                        </FormItem>
                      </RadioGroup>
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
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting || !isFirebaseReady}>
                {isSubmitting ? 'Entrando...' : !isFirebaseReady ? 'Carregando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link href="/signup" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
