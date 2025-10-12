'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // USE CENTRAL CLIENT
import { useParams } from 'next/navigation';
import Link from 'next/link';

// This line ensures the page is rendered dynamically on the server at request time
export const dynamic = 'force-dynamic';

// A interface correta, aceitando que `pacientes` é um array.
interface AvaliacaoDetails {
  id: string;
  data_avaliacao: string;
  titulo: string;
  notas_subjetivas: string | null;
  observacoes_objetivas: string | null;
  pacientes: { nome_completo: string }[] | null;
}

export default function AvaliacaoDetailPage() {
  const params = useParams();
  const pacienteId = params.id;
  const avaliacaoId = params.avaliacaoId;

  const [avaliacao, setAvaliacao] = useState<AvaliacaoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvaliacao = async () => {
      if (!avaliacaoId) return;

      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          id,
          data_avaliacao,
          titulo,
          notas_subjetivas,
          observacoes_objetivas,
          pacientes ( nome_completo )
        `)
        .eq('id', avaliacaoId)
        .single();

      if (error) {
        console.error('Error fetching evaluation details:', error);
        setError('Não foi possível carregar os dados da avaliação.');
      } else {
        // Sem transformações. Apenas dizemos ao TypeScript que o `data` tem o formato correto.
        setAvaliacao(data as AvaliacaoDetails);
      }
      setLoading(false);
    };

    fetchAvaliacao();
  }, [avaliacaoId]);

  if (loading) {
    return <div className="text-slate-100 p-8 container mx-auto">Carregando...</div>;
  }

  if (error || !avaliacao) {
    return (
        <div className="text-slate-100 p-8 container mx-auto">
            <p className="text-red-400">{error || 'Avaliação não encontrada.'}</p>
            <Link href={`/pacientes/${pacienteId}`} className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">
                &larr; Voltar para o paciente
            </Link>
        </div>
    );
  }

  return (
    <div className="text-slate-100 p-8">
        <div className="container mx-auto">
            <div className="mb-10">
                 {/* Acessando o primeiro item do array de pacientes */}
                 <Link href={`/pacientes/${pacienteId}`} className="mb-12 inline-block text-cyan-400 hover:text-cyan-300 transition-colors">
                    &larr; Voltar para {avaliacao.pacientes?.[0]?.nome_completo || 'o paciente'}
                </Link>
                <h1 className="text-4xl font-bold tracking-tighter text-teal-300">{avaliacao.titulo}</h1>
                <p className="text-lg text-slate-400">Data da Avaliação: {new Date(avaliacao.data_avaliacao).toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Notas Subjetivas</h2>
                    <p className="text-slate-300 whitespace-pre-wrap">{avaliacao.notas_subjetivas || 'Nenhuma nota subjetiva registrada.'}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Observações Objetivas</h2>
                    <p className="text-slate-300 whitespace-pre-wrap">{avaliacao.observacoes_objetivas || 'Nenhuma observação objetiva registrada.'}</p>
                </div>
            </div>

        </div>
    </div>
  );
}
