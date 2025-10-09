'use client';

import Link from 'next/link';

const MainSection = () => {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-dark text-white pt-20">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-accent/20 to-dark"></div>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary leading-tight">
          Integrando Saúde e Bem-Estar
        </h1>
        <p className="mt-6 max-w-3xl text-lg md:text-xl text-light/80">
          A Reabilite Pro é a sua plataforma completa de saúde, conectando pacientes e profissionais de diversas áreas para um cuidado integrado e personalizado.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="px-8 py-4 font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary/50 transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            Junte-se a Nós
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 font-bold text-light bg-dark/50 border border-primary/50 rounded-lg hover:bg-dark/80 transition-colors"
          >
            Descubra os Recursos
          </Link>
        </div>
      </div>
    </main>
  );
};

export default MainSection;
