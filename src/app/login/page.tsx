import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-jacksons-purple p-4">
      <div className="w-full max-w-md bg-jacksons-purple/60 backdrop-blur-sm border border-nepal/30 rounded-2xl p-8 shadow-2xl text-iron">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Bem-vindo de Volta</h1>
          <p className="text-nepal mt-2">Acesse sua conta para continuar.</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-nepal mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seu@email.com"
              className="w-full bg-jacksons-purple/70 border border-nepal/50 rounded-lg p-3 text-iron placeholder-nepal/70 focus:ring-2 focus:ring-royal-blue focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-nepal mb-2">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="w-full bg-jacksons-purple/70 border border-nepal/50 rounded-lg p-3 text-iron placeholder-nepal/70 focus:ring-2 focus:ring-royal-blue focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-royal-blue text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:bg-opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-jacksons-purple focus:ring-royal-blue"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-nepal mt-8">
          Não tem uma conta? <Link href="/signup" className="font-medium text-royal-blue hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
