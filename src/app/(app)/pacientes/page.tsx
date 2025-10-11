'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';
import Modal from '@/components/Modal'; // Import Modal
import AddPatientForm from '@/components/AddPatientForm'; // Import Form

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or Anon Key are not defined in environment variables.');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the type for a Paciente
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
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from('pacientes')
          .select('*')
          .eq('id_profissional', user.id)
          .order('created_at', { ascending: false }); // Show newest first

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
    // Add the new patient to the beginning of the list
    setPacientes([newPatient, ...pacientes]);
  };

  return (
    <>
      <div className="text-slate-100 p-8">
          <div className="container mx-auto">
              <div className="flex justify-between items-center mb-12">
                  <h1 className="text-3xl font-bold tracking-tighter">Meus Pacientes</h1>
                  <button 
                    onClick={() => setIsModalOpen(true)} // Open modal on click
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300 ease-in-out transform hover:scale-105">
                      + Adicionar Paciente
                  </button>
              </div>

              {loading ? (
                  <p>Carregando pacientes...</p>
              ) : pacientes.length === 0 ? (
                  <div className="text-center bg-slate-800/50 border border-dashed border-slate-700/50 rounded-2xl p-12">
                      <h2 className="text-xl font-semibold mb-2">Nenhum paciente encontrado.</h2>
                      <p className="text-slate-400">Clique em "Adicionar Paciente" para começar a gerenciar seus acompanhamentos.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pacientes.map((paciente) => (
                          <div key={paciente.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-lg hover:border-cyan-500/50 transition-colors duration-300">
                              <h3 className="text-xl font-semibold text-teal-400">{paciente.nome_completo}</h3>
                              <p className="text-slate-400 mt-2 break-all">{paciente.email}</p>
                              {paciente.telefone && <p className="text-slate-400">{paciente.telefone}</p>}
                              <p className="text-xs text-slate-500 mt-4">Cadastro em: {new Date(paciente.created_at).toLocaleDateString()}</p>
                          </div>
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
