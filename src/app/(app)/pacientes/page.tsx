'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient'; // Import the centralized Supabase client
import type { User } from '@supabase/supabase-js';
import Modal from '@/components/Modal';
import AddPatientForm from '@/components/AddPatientForm';

// This line ensures the page is rendered dynamically on the server at request time
export const dynamic = 'force-dynamic';

interface Paciente {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string | null;
  created_at: string;
}

export default function PacientesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from('pacientes')
          .select('*')
          .eq('id_profissional', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching pacientes:', error);
        } else {
          setPacientes(data || []);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handlePatientAdded = (newPatient: Paciente) => {
    setPacientes([newPatient, ...pacientes]);
  };

  return (
    <>
      <div className="text-slate-100 p-8">
          <div className="container mx-auto">
              <div className="flex justify-between items-center mb-12">
                  <h1 className="text-3xl font-bold tracking-tighter">Meus Pacientes</h1>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300 ease-in-out transform hover:scale-105">
                      + Adicionar Paciente
                  </button>
              </div>

              {loading ? (
                  <p>Carregando pacientes...</p>
              ) : pacientes.length === 0 ? (
                  <div className="text-center bg-slate-800/50 border border-dashed border-slate-700/50 rounded-2xl p-12">
                      <h2 className="text-xl font-semibold mb-2">Nenhum paciente encontrado.</h2>
                      <p className="text-slate-400">Clique em &quot;Adicionar Paciente&quot; para começar a gerenciar seus acompanhamentos.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pacientes.map((paciente) => (
                          <Link href={`/pacientes/${paciente.id}`} key={paciente.id}>
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-lg h-full hover:border-cyan-500/50 transition-colors duration-300 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-teal-400">{paciente.nome_completo}</h3>
                                    <p className="text-slate-400 mt-2 break-all">{paciente.email}</p>
                                    {paciente.telefone && <p className="text-slate-400">{paciente.telefone}</p>}
                                </div>
                                <p className="text-xs text-slate-500 mt-4">Cadastro em: {new Date(paciente.created_at).toLocaleDateString()}</p>
                            </div>
                          </Link>
                      ))}
                  </div>
              )}
          </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Novo Paciente">
        <AddPatientForm 
          onPatientAdded={handlePatientAdded}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
