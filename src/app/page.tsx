import { File, Globe, Window } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-jacksons-purple text-iron">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48 text-center">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-iron to-nepal">
              Reabilite Pro: O Futuro da Gestão em Fisioterapia
            </h1>
            <p className="max-w-[600px] mx-auto mt-4 text-nepal md:text-xl">
              Uma plataforma completa para simplificar a gestão de pacientes e avaliações, permitindo que você foque no que realmente importa: a reabilitação.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-md bg-royal-blue px-8 text-sm font-medium text-iron shadow-lg transition-colors hover:bg-opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue disabled:pointer-events-none disabled:opacity-50"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-md border border-nepal bg-transparent px-8 text-sm font-medium text-nepal shadow-sm transition-colors hover:bg-nepal hover:text-jacksons-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nepal disabled:pointer-events-none disabled:opacity-50"
              >
                Cadastrar-se
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-16 md:py-24 bg-jacksons-purple/80">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-iron">Funcionalidades Principais</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-jacksons-purple/50 backdrop-blur-sm border border-nepal/30 shadow-lg">
                <div className="p-3 rounded-full bg-royal-blue mb-4">
                  <File className="h-8 w-8 text-iron" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-iron">Gestão Simplificada</h3>
                <p className="text-nepal">
                  Organize seus pacientes e avaliações em um só lugar, com acesso rápido e fácil a todo o histórico.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-jacksons-purple/50 backdrop-blur-sm border border-nepal/30 shadow-lg">
                <div className="p-3 rounded-full bg-royal-blue mb-4">
                  <Window className="h-8 w-8 text-iron" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-iron">Avaliações Detalhadas</h3>
                <p className="text-nepal">
                  Crie e acompanhe avaliações personalizadas, registrando cada etapa da evolução do seu paciente.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-jacksons-purple/50 backdrop-blur-sm border border-nepal/30 shadow-lg">
                <div className="p-3 rounded-full bg-royal-blue mb-4">
                  <Globe className="h-8 w-8 text-iron" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-iron">Acesso Seguro e Online</h3>
                <p className="text-nepal">
                  Acesse seus dados de qualquer lugar, a qualquer hora, com a segurança da autenticação moderna.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
