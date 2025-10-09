import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebaseAdmin';

// Força a rota a ser dinâmica, impedindo a pré-renderização no build
export const dynamic = 'force-dynamic';

// --- Dados de Teste ---
const usuariosDeTeste = [
  {
    id: "carlos_p_example_com",
    nome: "Dr. Carlos Pereira",
    email: "carlos.p@example.com",
    tipo: "profissional",
    especialidade: "Fisioterapeuta",
    localizacao: { latitude: -23.5505, longitude: -46.6333 }, 
  },
  {
    id: "ana_s_example_com",
    nome: "Dra. Ana Souza",
    email: "ana.s@example.com",
    tipo: "profissional",
    especialidade: "Psicóloga",
    localizacao: { latitude: -23.5613, longitude: -46.6565 },
  },
  {
    id: "ricardo_m_example_com",
    nome: "Ricardo Mendes",
    email: "ricardo.m@example.com",
    tipo: "profissional",
    especialidade: "Personal Trainer",
    localizacao: { latitude: -23.5475, longitude: -46.6361 },
  },
  {
    id: "juliana_c_example_com",
    nome: "Juliana Costa",
    email: "juliana.c@example.com",
    tipo: "profissional",
    especialidade: "Nutricionista",
    localizacao: { latitude: -23.5558, longitude: -46.6396 },
  },
  {
    id: "paciente_example_com",
    nome: "Paciente Teste",
    email: "paciente@example.com",
    tipo: "paciente",
    especialidade: "N/A",
    localizacao: { latitude: -23.5510, longitude: -46.6340 },
  }
];

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin não inicializado.' }, { status: 500 });
  }

  console.log("Iniciando o povoamento do banco de dados via API...");
  const collectionRef = adminDb.collection('usuarios');
  const logs: string[] = [];

  for (const usuario of usuariosDeTeste) {
    try {
      const docRef = collectionRef.doc(usuario.id); 
      await docRef.set(usuario);
      const message = `- Usuário '${usuario.nome}' adicionado/atualizado com sucesso.`;
      console.log(message);
      logs.push(message);
    } catch (error: any) {
      const message = `Erro ao adicionar o usuário '${usuario.nome}': ${error.message}`;
      console.error(message);
      logs.push(message);
    }
  }

  console.log("\nPovoamento do banco de dados concluído!");
  return NextResponse.json({ 
    message: "Povoamento concluído!",
    logs
  });
}
