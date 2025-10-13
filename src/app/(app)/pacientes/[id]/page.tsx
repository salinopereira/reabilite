'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // USE CENTRAL CLIENT
import AddEvaluationModal from '@/components/AddEvaluationModal';
import EditPatientModal from '@/components/EditPatientModal';
import { PlusCircle, Edit } from 'lucide-react';
import Link from 'next/link';

// This line ensures the page is rendered dynamically on the server at request time
export const dynamic = 'force-dynamic';

interface Paciente {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  cpf: string;
  endereco: string;
}

interface Avaliacao {
  id: string;
  titulo: string;
  data_avaliacao: string;
}

export default function PacienteDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchPacienteDetails = useCallback(async () => {
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error fetching patient details:', error);
    } else {
      setPaciente(data);
    }
  }, [id]);

  const fetchAvaliations = useCallback(async () => {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('id, titulo, data_avaliacao')
      .eq('paciente_id', id)
      .order('data_avaliacao', { ascending: false });

    if (error) {
      console.error('Error fetching avaliations:', error);
    } else {
      setAvaliacoes(data);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPacienteDetails();
      fetchAvaliations();
    }
  }, [id, fetchAvaliations, fetchPacienteDetails]);

  if (!paciente) {
    return <div className="text-slate-100 p-8 container mx-auto">Carregando...</div>;
  }

  const handleEvaluationAdded = () => {
    fetchAvaliations();
  };

  const handlePatientUpdated = () => {
    fetchPacienteDetails();
  };

  return (
    <div className="text-slate-100 p-8">
      <div className="container mx-auto">
        <Link href="/pacientes" className="mb-12 inline-block text-cyan-400 hover:text-cyan-300 transition-colors">&larr; Voltar para a lista de pacientes</Link>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-teal-300">{paciente.nome_completo}</h1>
            <p className="text-slate-400 text-lg mt-1">CPF: {paciente.cpf}</p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-lg"
          >
            <Edit size={18} />
            Editar Paciente
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <h3 className="font-semibold text-slate-400 mb-1">Email</h3>
            <p className="text-lg">{paciente.email}</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <h3 className="font-semibold text-slate-400 mb-1">Telefone</h3>
            <p className="text-lg">{paciente.telefone}</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <h3 className="font-semibold text-slate-400 mb-1">Data de Nascimento</h3>
            <p className="text-lg">{new Date(paciente.data_nascimento).toLocaleDateString()}</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 md:col-span-2">
            <h3 className="font-semibold text-slate-400 mb-1">Endereço</h3>
            <p className="text-lg">{paciente.endereco}</p>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-teal-300/90">Histórico de Avaliações</h2>
            <button
              onClick={() => setIsEvaluationModalOpen(true)}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg">
              <PlusCircle size={20} />
              Nova Avaliação
            </button>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            {avaliacoes.length > 0 ? (
              <ul className="space-y-4">
                {avaliacoes.map(avaliacao => (
                  <li key={avaliacao.id} className="p-4 bg-slate-700/40 rounded-lg flex justify-between items-center transition-all hover:bg-slate-600/50">
                    <div>
                      <h3 className="font-semibold text-lg text-cyan-300">{avaliacao.titulo}</h3>
                      <p className="text-slate-400">Data: {new Date(avaliacao.data_avaliacao).toLocaleDateString()}</p>
                    </div>
                    <Link href={`/pacientes/${id}/avaliacoes/${avaliacao.id}`} className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                      Ver Detalhes
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-slate-400 py-8">Nenhuma avaliação encontrada para este paciente.</p>
            )}
          </div>
        </div>
      </div>
      <AddEvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        pacienteId={id}
        onEvaluationAdded={handleEvaluationAdded}
      />
      {paciente && (
        <EditPatientModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          paciente={paciente}
          onPatientUpdated={handlePatientUpdated}
        />
      )}
    </div>
  );
}
