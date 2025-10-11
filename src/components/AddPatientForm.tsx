'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or Anon Key are not defined');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AddPatientFormProps {
  onPatientAdded: (newPatient: any) => void;
  onClose: () => void;
}

export default function AddPatientForm({ onPatientAdded, onClose }: AddPatientFormProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!nome || !email || !dataNascimento) {
        setError('Por favor, preencha os campos obrigatórios: Nome, E-mail e Data de Nascimento.');
        setLoading(false);
        return;
    }

    // 1. Get the current logged-in user (the professional)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        setError('Não foi possível identificar o profissional. Por favor, faça login novamente.');
        setLoading(false);
        return;
    }

    // 2. Prepare the data for insertion
    const newPatient = {
        nome_completo: nome,
        email: email,
        telefone: telefone || null,
        data_nascimento: dataNascimento,
        id_profissional: user.id,
    };

    // 3. Insert the new patient into the database
    const { data, error: insertError } = await supabase
        .from('pacientes')
        .insert(newPatient)
        .select()
        .single(); // .single() returns the inserted object

    if (insertError) {
        setError(`Erro ao adicionar paciente: ${insertError.message}`);
    } else {
        onPatientAdded(data); // Pass the newly created patient back to the parent
        onClose(); // Close the modal on success
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-cyan-500 focus:border-cyan-500" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-cyan-500 focus:border-cyan-500" />
      </div>
      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-slate-300 mb-1">Telefone (Opcional)</label>
        <input type="tel" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-cyan-500 focus:border-cyan-500" />
      </div>
      <div>
        <label htmlFor="dataNascimento" className="block text-sm font-medium text-slate-300 mb-1">Data de Nascimento</label>
        <input type="date" id="dataNascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-cyan-500 focus:border-cyan-500" />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex justify-end gap-4 mt-4">
        <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300">
          {loading ? 'Salvando...' : 'Salvar Paciente'}
        </button>
      </div>
    </form>
  );
}
