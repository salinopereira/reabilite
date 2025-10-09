'use client';

import { CheckCircle } from 'lucide-react';

const patientBenefits = [
  'Acesso a profissionais qualificados de qualquer lugar.',
  'Acompanhamento contínuo e personalizado da sua evolução.',
  'Comunicação direta e segura para tirar dúvidas.',
  'Ferramentas que motivam e engajam no tratamento.',
];

const professionalBenefits = [
  'Gerencie múltiplos pacientes de forma centralizada.',
  'Crie e reutilize planos de tratamento com facilidade.',
  'Otimize seu tempo com ferramentas de acompanhamento remoto.',
  'Expanda seu alcance e ofereça seus serviços online.',
];

const BenefitsSection = () => {
  return (
    <section className="py-20 sm:py-32 bg-dark border-t border-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Patient Column */}
          <div className="p-8 bg-dark/50 rounded-2xl shadow-lg border border-primary/30">
            <h3 className="text-2xl font-bold text-white">Para Pacientes</h3>
            <p className="mt-2 text-light/80">Recupere-se no seu ritmo, com o suporte que você precisa.</p>
            <ul className="mt-6 space-y-4">
              {patientBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 text-secondary mt-0.5" />
                  <span className="ml-3 text-light/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Professional Column */}
          <div className="p-8 bg-dark/50 rounded-2xl shadow-lg border border-accent/30">
            <h3 className="text-2xl font-bold text-white">Para Profissionais</h3>
            <p className="mt-2 text-light/80">Otimize seu trabalho e entregue o melhor cuidado.</p>
            <ul className="mt-6 space-y-4">
              {professionalBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 text-accent mt-0.5" />
                  <span className="ml-3 text-light/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
