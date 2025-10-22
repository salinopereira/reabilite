'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { useAuth, useFirestore, useUser } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { AuthError, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const formSchema = z.object({
  role: z.enum(['patient', 'professional']),
  name: z.string().min(2, { message: 'O nome é obrigatório.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  location: z.string().optional(),
  credential: z.string().optional(),
}).refine(data => {
    if (data.role === 'patient' && !data.location) {
        return false;
    }
    return true;
}, {
    message: "Localização é obrigatória para pacientes.",
    path: ["location"],
}).refine(data => {
    if (data.role === 'professional' && !data.credential) {
        return false;
    }
    return true;
}, {
    message: "CRN/CRP/CREF é obrigatório para profissionais.",
    path: ["credential"],
});

type FormValues = z.infer<typeof formSchema>;


export default function SignupPage() {
  const [role, setRole] = useState('patient');
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isFirebaseReady = !!auth && !!firestore;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'patient',
      name: '',
      email: '',
      password: '',
      location: '',
      credential: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!isFirebaseReady) {
        toast({
            variant: "destructive",
            title: "Erro de Conexão",
            description: "Aguarde a conexão com os serviços ser estabelecida."
        });
        return;
    }

    setIsSubmitting(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Send email verification
        sendEmailVerification(user).then(() => {
            console.log("Verification email sent.");
        });
        
        let collectionPath = '';
        let docData: any = {};

        if (values.role === 'patient') {
          collectionPath = 'users';
          docData = {
            id: user.uid,
            name: values.name,
            email: values.email,
            location: values.location,
            healthInformation: '',
            preferences: 'both',
            role: 'patient'
          };
        } else {
          collectionPath = 'professionals';
          docData = {
            id: user.uid,
            name: values.name,
            email: values.email,
            crnCrefCrp: values.credential,
            areaOfExpertise: '',
            consultationFee: 0,
            availability: '',
            serviceMode: 'both',
            role: 'professional'
          };
        }
        
        const userRef = doc(firestore, collectionPath, user.uid);
        setDocumentNonBlocking(userRef, docData, { merge: true });

        toast({
          title: 'Conta criada com sucesso!',
          description: 'Enviamos um e-mail de verificação. Por favor, cheque sua caixa de entrada.',
        });
        
        auth.signOut().then(() => {
            router.push('/login');
        });

      })
      .catch((error: AuthError) => {
        let message = 'Ocorreu um erro ao criar a conta. Tente novamente.';
        if (error.code === 'auth/email-already-in-use') {
          message = 'Este e-mail já está em uso por outra conta.';
        }
        console.error("Signup Error:", error);
        toast({
          variant: 'destructive',
          title: 'Erro no cadastro',
          description: message,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  const handleRoleChange = (value: string) => {
      setRole(value);
      form.setValue('role', value as 'patient' | 'professional');
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Crie sua conta</CardTitle>
          <CardDescription>
            Junte-se à Reabilite e inicie sua jornada de bem-estar.
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
                    <FormLabel>Você é um:</FormLabel>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
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

              {role === 'patient' ? (
                 <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Localização (Cidade/Estado)</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: São Paulo, SP" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              ) : (
                <FormField
                    control={form.control}
                    name="credential"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>CRN/CRP/CREF</FormLabel>
                        <FormControl>
                            <Input placeholder="Seu número de registro profissional" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting || !isFirebaseReady}>
                {isSubmitting ? 'Criando conta...' : !isFirebaseReady ? 'Carregando...' : 'Criar conta'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
