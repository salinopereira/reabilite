'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Paciente } from '@/lib/types'; // Importa a interface

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or Anon Key are not defined');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// A interface Paciente foi removida daqui e importada de @/lib/types

interface EditPatientFormProps {
  paciente: Paciente;
  onClose: () => void;
  onPatientUpdated: () => void;
}

export default function EditPatientForm({ paciente, onClose, onPatientUpdated }: EditPatientFormProps) {
  const [nome, setNome] = useState(paciente.nome_completo);
  const [email, setEmail] = useState(paciente.email);
  const [telefone, setTelefone] = useState(paciente.telefone);
  const [dataNascimento, setDataNascimento] = useState(paciente.data_nascimento);
  const [cpf, setCpf] = useState(paciente.cpf);
  const [endereco, setEndereco] = useState(paciente.endereco);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('pacientes')
      .update({
        nome_completo: nome,
        email,
        telefone,
        data_nascimento: dataNascimento,
        cpf,
        endereco,
      })
      .eq('id', paciente.id);

    if (updateError) {
      console.error('Error updating patient:', updateError);
      setError('Não foi possível atualizar o paciente. Tente novamente.');
    } else {
      onPatientUpdated();
      onClose();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="nome_completo" className="block text-sm font-medium text-slate-300">Nome Completo</label>
            <input
                type="text"
                id="nome_completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                required
            />
        </div>

        {/* Repetir para os outros campos */}
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" required />
        </div>
        <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-slate-300">Telefone</label>
            <input type="text" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" required />
        </div>
        <div>
            <label htmlFor="data_nascimento" className="block text-sm font-medium text-slate-300">Data de Nascimento</label>
            <input type="date" id="data_nascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" required />
        </div>
        <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-slate-300">CPF</label>
            <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" required />
        </div>
        <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-slate-300">Endereço</label>
            <input type="text" id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" required />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors">Cancelar</button>
            <button type="submit" disabled={isLoading} className="py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50">
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </div>
    </form>
  );
}
