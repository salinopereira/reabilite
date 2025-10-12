'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or Anon Key are not defined');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AddAvaliacaoFormProps {
  pacienteId: string;
  onEvaluationAdded: (newAvaliacao: any) => void;
  onClose: () => void;
}

export default function AddAvaliacaoForm({ pacienteId, onEvaluationAdded, onClose }: AddAvaliacaoFormProps) {
  const [titulo, setTitulo] = useState('');
  const [notasSubjetivas, setNotasSubjetivas] = useState('');
  const [observacoesObjetivas, setObservacoesObjetivas] = useState('');
  const [dataAvaliacao, setDataAvaliacao] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!titulo || !dataAvaliacao) {
        setError('Por favor, preencha os campos obrigatórios: Título e Data da Avaliação.');
        setLoading(false);
        return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setError('Não foi possível identificar o profissional. Faça login novamente.');
        setLoading(false);
        return;
    }

    const newAvaliacao = {
        id_paciente: pacienteId,
        id_profissional: user.id,
        titulo,
        data_avaliacao: dataAvaliacao,
        notas_subjetivas: notasSubjetivas,
        observacoes_objetivas: observacoesObjetivas,
    };

    const { data, error: insertError } = await supabase
        .from('avaliacoes')
        .insert(newAvaliacao)
        .select()
        .single();

    if (insertError) {
        setError(`Erro ao salvar avaliação: ${insertError.message}`);
    } else {
        onEvaluationAdded(data);
        onClose();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-slate-100">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-slate-300 mb-1">Título da Avaliação</label>
        <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder='Ex: Avaliação Inicial do Ombro'/>
      </div>
       <div>
        <label htmlFor="dataAvaliacao" className="block text-sm font-medium text-slate-300 mb-1">Data da Avaliação</label>
        <input type="date" id="dataAvaliacao" value={dataAvaliacao} onChange={(e) => setDataAvaliacao(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500" />
      </div>
      <div>
        <label htmlFor="notasSubjetivas" className="block text-sm font-medium text-slate-300 mb-1">Notas Subjetivas (Queixa do Paciente)</label>
        <textarea id="notasSubjetivas" value={notasSubjetivas} onChange={(e) => setNotasSubjetivas(e.target.value)} rows={4} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder='Ex: Dor na região lombar ao sentar por mais de 30 minutos...'></textarea>
      </div>
      <div>
        <label htmlFor="observacoesObjetivas" className="block text-sm font-medium text-slate-300 mb-1">Observações Objetivas (Análise do Profissional)</label>
        <textarea id="observacoesObjetivas" value={observacoesObjetivas} onChange={(e) => setObservacoesObjetivas(e.target.value)} rows={4} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder='Ex: Teste de elevação da perna positivo a 45 graus, diminuição da flexão lombar...'></textarea>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex justify-end gap-4 mt-4">
        <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-500 font-bold py-2 px-4 rounded-lg transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 disabled:cursor-not-allowed font-bold py-2 px-4 rounded-lg shadow-lg shadow-cyan-500/20 transition-all">
          {loading ? 'Salvando...' : 'Salvar Avaliação'}
        </button>
      </div>
    </form>
  );
}
