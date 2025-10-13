'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface Paciente {
  id: string;
  nome_completo: string;
  email: string;
}

export default function PacienteDashboard() {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPacienteData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('pacientes')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar dados do paciente:', error);
          router.push('/login'); // Redireciona se não encontrar o paciente
        } else {
          setPaciente(data);
        }
      } else {
        router.push('/login'); // Redireciona se não houver usuário logado
      }
      setLoading(false);
    };

    fetchPacienteData();
  }, [router]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-jacksons-purple">
            <div className="text-center">
                <p className="text-lg text-iron">Carregando seu dashboard...</p>
            </div>
        </div>
    );
  }

  if (!paciente) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-jacksons-purple">
            <div className="text-center">
                <p className="text-lg text-iron">Não foi possível carregar os dados. Por favor, tente fazer login novamente.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-jacksons-purple text-iron">
        <div className="container mx-auto p-8">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-2">Dashboard do Paciente</h1>
                <p className="text-nepal">Bem-vindo(a), {paciente.nome_completo}!</p>
            </header>

            <div className="bg-jacksons-purple/50 backdrop-blur-sm border border-nepal/30 rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Suas Informações</h2>
                <div className="space-y-4">
                    <p><strong>Nome:</strong> {paciente.nome_completo}</p>
                    <p><strong>Email:</strong> {paciente.email}</p>
                </div>
            </div>

            <div className="bg-jacksons-purple/50 backdrop-blur-sm border border-nepal/30 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-4">Seu Histórico de Avaliações</h2>
                <div className="text-center text-nepal">
                    <p>Em breve, você poderá visualizar seu progresso e histórico de avaliações aqui.</p>
                </div>
            </div>
        </div>
    </div>
  );
}
