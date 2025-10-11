'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Modal from '@/components/Modal';
import AddAvaliacaoForm from '@/components/AddAvaliacaoForm';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or Anon Key are not defined');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Paciente {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string | null;
  data_nascimento: string;
  created_at: string;
}

interface Avaliacao {
    id: string;
    data_avaliacao: string;
    titulo: string;
}

export default function PatientDetailPage() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) return;

      const { data: patientData, error: patientError } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id', id)
        .single();

      if (patientError) {
        console.error('Error fetching patient details:', patientError);
        setError('Não foi possível carregar os dados do paciente.');
        setLoading(false);
        return;
      }
      
      setPaciente(patientData);

      const { data: avaliacoesData, error: avaliacoesError } = await supabase
        .from('avaliacoes')
        .select('id, data_avaliacao, titulo')
        .eq('id_paciente', id)
        .order('data_avaliacao', { ascending: false });

      if (avaliacoesError) {
        console.error('Error fetching evaluations:', avaliacoesError);
      } else {
        setAvaliacoes(avaliacoesData || []);
      }

      setLoading(false);
    };

    fetchPatientData();
  }, [id]);

  const handleAvaliacaoAdded = (newAvaliacao: Avaliacao) => {
    setAvaliacoes([newAvaliacao, ...avaliacoes]);
  };

  if (loading) {
    return (
        <div className="text-slate-100 p-8"><div className="container mx-auto"><p>Carregando...</p></div></div>
    );
  }

  if (error || !paciente) {
    return (
        <div className="text-slate-100 p-8"><div className="container mx-auto"><p className="text-red-400">{error || 'Paciente não encontrado.'}</p><Link href="/pacientes" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">&larr; Voltar</Link></div></div>
    );
  }

  return (
    <>
      <div className="text-slate-100 p-8">
          <div className="container mx-auto">
              <div className="mb-8">
                  <Link href="/pacientes" className="mb-12 inline-block text-cyan-400 hover:text-cyan-300 transition-colors">&larr; Voltar para a lista de pacientes</Link>
                  <h1 className="text-4xl font-bold tracking-tighter text-teal-300">{paciente.nome_completo}</h1>
                  <p className="text-lg text-slate-400">{paciente.email}</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-lg mb-8">
                  <h2 className="text-2xl font-semibold mb-6">Detalhes do Cadastro</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><p className="text-sm text-slate-400">Telefone</p><p className="text-lg font-medium">{paciente.telefone || 'Não informado'}</p></div>
                      <div><p className="text-sm text-slate-400">Data de Nascimento</p><p className="text-lg font-medium">{new Date(paciente.data_nascimento).toLocaleDateString()}</p></div>
                      <div><p className="text-sm text-slate-400">Paciente desde</p><p className="text-lg font-medium">{new Date(paciente.created_at).toLocaleDateString()}</p></div>
                  </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold">Histórico de Avaliações</h2>
                      <button onClick={() => setIsModalOpen(true)} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-3 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105">+ Adicionar Avaliação</button>
                  </div>
                  
                  {avaliacoes.length === 0 ? (
                      <div className="text-center border-2 border-dashed border-slate-700/80 rounded-lg p-10"><p className="text-slate-400">Nenhuma avaliação encontrada.</p><p className="text-sm text-slate-500 mt-1">Clique em "Adicionar Avaliação" para registrar a primeira.</p></div>
                  ) : (
                      <ul className="space-y-4">
                          {avaliacoes.map((avaliacao) => (
                              <li key={avaliacao.id} className="bg-slate-700/50 p-4 rounded-lg flex justify-between items-center hover:bg-slate-700 transition-colors">
                                  <div>
                                      <p className="font-semibold text-teal-400">{avaliacao.titulo}</p>
                                      <p className="text-sm text-slate-400">Data: {new Date(avaliacao.data_avaliacao).toLocaleDateString()}</p>
                                  </div>
                                  <button className="text-slate-400 hover:text-white">Ver Detalhes</button>
                              </li>
                          ))}
                      </ul>
                  )}
              </div>
          </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Nova Avaliação">
        <AddAvaliacaoForm 
          pacienteId={paciente.id}
          onAvaliacaoAdded={handleAvaliacaoAdded}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
