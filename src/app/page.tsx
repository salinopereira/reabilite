
import Link from 'next/link';
import type { Metadata } from 'next';

// SVG Icon Components for better readability and reuse
const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </svg>
);

const ChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

const MessageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);


export default function HomePage() {
  return (
    <div className="bg-slate-900 text-slate-100 antialiased">
      {/* Header & Nav */}
      <header className="container mx-auto flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
          ReabilitePro
        </h1>
        <nav>
          <Link href="/login" className="text-slate-300 hover:text-cyan-400 transition-colors">
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-24 pb-32 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
            Bem-vindo ao <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">ReabilitePro</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-10">
            Sua jornada para a recuperação começa aqui. Conectando pacientes e
            profissionais de saúde com tecnologia de ponta.
          </p>
          <Link
            href="/signup"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/20 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Comece Agora
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-950/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
              Funcionalidades Principais
            </h3>
            <p className="text-slate-500 mt-2">
              Tudo que você precisa para uma recuperação assistida por tecnologia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 shadow-lg hover:border-cyan-500/50 transition-colors">
              <div className="bg-slate-900/70 inline-flex items-center justify-center w-12 h-12 rounded-lg mb-6 border border-slate-700/50">
                <ClipboardIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Planos Personalizados</h4>
              <p className="text-slate-400">
                Receba planos de reabilitação feitos sob medida para suas
                necessidades, criados por especialistas.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 shadow-lg hover:border-cyan-500/50 transition-colors">
               <div className="bg-slate-900/70 inline-flex items-center justify-center w-12 h-12 rounded-lg mb-6 border border-slate-700/50">
                <ChartIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <h4 className="text-xl font-semibold mb-2">
                Acompanhamento Contínuo
              </h4>
              <p className="text-slate-400">
                Monitore seu progresso com gráficos e relatórios detalhados,
                compartilhados em tempo real com seu fisioterapeuta.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 shadow-lg hover:border-cyan-500/50 transition-colors">
               <div className="bg-slate-900/70 inline-flex items-center justify-center w-12 h-12 rounded-lg mb-6 border border-slate-700/50">
                <MessageIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Canal de Comunicação</h4>
              <p className="text-slate-400">
                Comunicação direta e segura com seu profissional de saúde para
                tirar dúvidas e receber orientações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Pronto para transformar sua recuperação?
            </h3>
            <p className="text-lg text-slate-400 mb-8">
              Junte-se à comunidade ReabilitePro e dê o próximo passo na sua
              jornada de bem-estar.
            </p>
            <Link
              href="/signup"
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/20 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Cadastre-se Gratuitamente
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="container mx-auto px-6 py-8 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} ReabilitePro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
