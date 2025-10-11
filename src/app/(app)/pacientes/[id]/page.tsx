'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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

export default function PatientDetailPage() {
  const { id } = useParams(); // Get the patient ID from the URL
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;

      // Fetch a single patient by their ID
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching patient details:', error);
        setError('Não foi possível carregar os dados do paciente.');
      } else {
        setPaciente(data);
      }
      setLoading(false);
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return (
        <div className="text-slate-100 p-8">
            <div className="container mx-auto">
                <p>Carregando dados do paciente...</p>
            </div>
        </div>
    );
  }

  if (error || !paciente) {
    return (
        <div className="text-slate-100 p-8">
            <div className="container mx-auto">
                <p className="text-red-400">{error || 'Paciente não encontrado.'}</p>
                 <Link href="/pacientes" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">
                    &larr; Voltar para a lista de pacientes
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="text-slate-100 p-8">
        <div className="container mx-auto">
            <div className="mb-8">
                <Link href="/pacientes" className="mb-12 inline-block text-cyan-400 hover:text-cyan-300 transition-colors">
                    &larr; Voltar para a lista de pacientes
                </Link>
                <h1 className="text-4xl font-bold tracking-tighter text-teal-300">{paciente.nome_completo}</h1>
                <p className="text-lg text-slate-400">{paciente.email}</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Detalhes do Cadastro</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-slate-400">Telefone</p>
                        <p className="text-lg font-medium">{paciente.telefone || 'Não informado'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Data de Nascimento</p>
                        <p className="text-lg font-medium">{new Date(paciente.data_nascimento).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Paciente desde</p>
                        <p className="text-lg font-medium">{new Date(paciente.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Future sections for evaluations, progress, etc. will go here */}
        </div>
    </div>
  );
}
