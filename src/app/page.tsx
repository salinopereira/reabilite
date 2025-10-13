import { File, Globe, AppWindow as Window } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-jacksons-purple text-iron">
      <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center">
        <div className="text-2xl font-bold">Reabilite Pro</div>
        <nav>
          <Link href="/login" className="bg-royal-blue text-white py-2 px-6 rounded-lg shadow-lg hover:bg-opacity-80 transition-all">
            Acessar Plataforma
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-8 pt-40 text-center">
        <h1 className="text-6xl font-extrabold mb-4 leading-tight">
          A Ferramenta Definitiva para Fisioterapeutas Modernos
        </h1>
        <p className="text-nepal text-xl mb-12 max-w-3xl mx-auto">
          Gestão de pacientes, avaliações personalizadas e acompanhamento de progresso. Tudo num só lugar, com uma interface que vai adorar usar.
        </p>
        <Link href="/signup" className="bg-royal-blue text-white py-4 px-10 rounded-full text-lg font-semibold shadow-2xl hover:scale-105 transition-transform">
          Comece Agora Gratuitamente
        </Link>
      </main>

      <section className="mt-32 pb-20">
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-jacksons-purple/50 backdrop-blur-sm border border-nepal/30 rounded-2xl p-8 text-center shadow-lg">
            <File className="w-16 h-16 mx-auto mb-6 text-royal-blue" />
            <h3 className="text-2xl font-bold mb-2">Avaliações Detalhadas</h3>
            <p className="text-nepal">Crie e personalize avaliações completas para cada paciente, registando cada detalhe do tratamento.</p>
          </div>
          <div className="bg-jacksons-purple/50 backdrop-blur-sm border border-nepal/30 rounded-2xl p-8 text-center shadow-lg">
            <Globe className="w-16 h-16 mx-auto mb-6 text-royal-blue" />
            <h3 className="text-2xl font-bold mb-2">Acesso Onde Estiver</h3>
            <p className="text-nepal">Aceda aos dados dos seus pacientes a partir de qualquer dispositivo, de forma segura e rápida.</p>
          </div>
          <div className="bg-jacksons-purple/50 backdrop-blur-sm border border-nepal/30 rounded-2xl p-8 text-center shadow-lg">
            <Window className="w-16 h-16 mx-auto mb-6 text-royal-blue" />
            <h3 className="text-2xl font-bold mb-2">Interface Intuitiva</h3>
            <p className="text-nepal">Uma experiência de utilização desenhada para ser eficiente, bonita e fácil de usar no dia a dia.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
