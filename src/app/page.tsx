import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Stethoscope,
  HeartPulse,
  Users,
  BrainCircuit,
  Dumbbell,
  CalendarCheck,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { placeholderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <Stethoscope className="h-10 w-10 text-primary" />,
    title: 'Encontre Profissionais Qualificados',
    description:
      'Acesse uma rede de nutricionistas, psicólogos e educadores físicos verificados e prontos para te ajudar.',
  },
  {
    icon: <CalendarCheck className="h-10 w-10 text-primary" />,
    title: 'Agendamento Fácil e Rápido',
    description:
      'Marque consultas presenciais ou online com poucos cliques, de forma automatizada e segura.',
  },
  {
    icon: <HeartPulse className="h-10 w-10 text-primary" />,
    title: 'Acompanhamento Integrado',
    description:
      'Tenha seu histórico de saúde e consultas em um só lugar, facilitando o cuidado contínuo.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Comunidade de Apoio',
    description:
      'Participe de um espaço para troca de experiências e apoio mútuo em sua jornada de bem-estar.',
  },
];

export default function LandingPage() {
  const heroImage = placeholderImages.find((img) => img.id === 'hero-background');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Cadastre-se</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
          <div className="container relative mx-auto px-4 text-center md:px-6">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Sua jornada de saúde integrativa começa aqui.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Conectamos você aos melhores nutricionistas, psicólogos e educadores físicos. Cuide do seu bem-estar de forma completa.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/patient/dashboard">Buscar profissional</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Sou profissional</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Uma plataforma completa para sua saúde
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-muted-foreground">
              A Reabilite oferece as ferramentas que você precisa para alcançar
              seus objetivos de saúde e bem-estar.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/50">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    Para Profissionais
                  </div>
                  <h2 className="mt-4 text-3xl font-bold text-foreground">
                    Expanda seu alcance e gerencie sua clínica
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    Nossa plataforma oferece as ferramentas para você focar no que mais importa: seus pacientes. Gerencie agendamentos, prontuários e finanças em um só lugar.
                  </p>
                  <div className="mt-6">
                    <Button asChild>
                      <Link href="/signup">Quero ser um profissional</Link>
                    </Button>
                  </div>
                </div>
                <div className="relative hidden h-full min-h-[300px] w-full md:block">
                  <Image
                    src="https://picsum.photos/seed/prof/800/600"
                    alt="Profissional de saúde usando a plataforma Reabilite"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="health professional"
                  />
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Reabilite. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
