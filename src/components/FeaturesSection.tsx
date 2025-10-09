'use client';

import { Users, ClipboardList, MessageSquare, Video } from 'lucide-react';

const features = [
  {
    icon: <Users size={32} className="text-primary" />,
    title: 'Conexão Direta',
    description: 'Conecte-se facilmente com pacientes ou profissionais qualificados em nossa plataforma segura e intuitiva.',
  },
  {
    icon: <ClipboardList size={32} className="text-primary" />,
    title: 'Planos Personalizados',
    description: 'Crie e acompanhe planos de reabilitação detalhados, adaptados às necessidades de cada paciente.',
  },
  {
    icon: <MessageSquare size={32} className="text-primary" />,
    title: 'Comunicação Integrada',
    description: 'Utilize nosso chat para tirar dúvidas e manter uma comunicação clara e constante durante o tratamento.',
  },
  {
    icon: <Video size={32} className="text-primary" />,
    title: 'Sessões Online',
    description: 'Realize sessões de acompanhamento por vídeo diretamente na plataforma, com segurança e praticidade.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 sm:py-32 bg-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Tudo que você precisa para uma reabilitação de sucesso
          </h2>
          <p className="mt-4 text-lg text-light/80">
            Nossa plataforma foi desenhada para otimizar a jornada de recuperação, desde o primeiro contato até a alta.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-8 bg-dark/50 rounded-2xl shadow-lg border border-primary/30 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-dark border border-primary/50">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-base text-light/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
