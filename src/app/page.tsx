'use client';
// Trigger deploy
export default function HomePage() {

  return (
    <div className='bg-gray-50 text-gray-800'>
      {/* Hero Section */}
      <header className='relative bg-gradient-to-r from-blue-500 to-green-500 text-white text-center py-20 md:py-32'>
        <div className='absolute inset-0 opacity-20'></div>
        <div className='relative z-10'>
          <h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-4'>
            Bem-vindo ao ReabilitePro
          </h1>
          <p className='text-lg md:text-xl max-w-2xl mx-auto'>
            Sua jornada para a recuperação começa aqui. Conectando pacientes e
            profissionais de saúde com tecnologia de ponta.
          </p>
          <button className='mt-8 bg-white text-blue-500 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105'>
            Comece Agora
          </button>
        </div>
      </header>

      {/* Features Section */}
      <main className='container mx-auto px-6 py-16 text-center'>
        <h2 className='text-3xl md:text-4xl font-bold mb-12'>
          Funcionalidades Principais
        </h2>
        <div className='grid md:grid-cols-3 gap-12'>
          <div className='bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow'>
            <h3 className='text-2xl font-semibold mb-4'>Planos Personalizados</h3>
            <p>
              Receba planos de reabilitação feitos sob medida para suas
              necessidades, criados por especialistas.
            </p>
          </div>
          <div className='bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow'>
            <h3 className='text-2xl font-semibold mb-4'>
              Acompanhamento Contínuo
            </h3>
            <p>
              Monitore seu progresso com gráficos e relatórios detalhados,
              compartilhados em tempo real com seu fisioterapeuta.
            </p>
          </div>
          <div className='bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow'>
            <h3 className='text-2xl font-semibold mb-4'>Canal de Comunicação</h3>
            <p>
              Comunicação direta e segura com seu profissional de saúde para
              tirar dúvidas e receber orientações.
            </p>
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className='bg-blue-600 text-white py-20'>
        <div className='container mx-auto px-6 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Pronto para transformar sua recuperação?
          </h2>
          <p className='text-lg md:text-xl max-w-3xl mx-auto mb-8'>
            Junte-se à comunidade ReabilitePro e dê o próximo passo na sua
            jornada de bem-estar.
          </p>
          <button className='bg-white text-blue-600 font-bold py-3 px-10 rounded-full shadow-xl hover:bg-gray-200 transition-transform transform hover:scale-105'>
            Cadastre-se Gratuitamente
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-800 text-white py-8'>
        <div className='container mx-auto px-6 text-center'>
          <p>&copy; 2024 ReabilitePro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
