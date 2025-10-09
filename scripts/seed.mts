
import { adminDb } from '../src/lib/firebaseAdmin';

// --- Dados de Teste ---
const profissionaisDeTeste = [
  {
    nome: "Dr. Carlos Pereira",
    email: "carlos.p@example.com",
    tipo: "profissional",
    especialidade: "Fisioterapeuta",
    // Localização próxima ao centro de uma cidade grande (ex: São Paulo)
    localizacao: { latitude: -23.5505, longitude: -46.6333 }, 
  },
  {
    nome: "Dra. Ana Souza",
    email: "ana.s@example.com",
    tipo: "profissional",
    especialidade: "Psicóloga",
    localizacao: { latitude: -23.5613, longitude: -46.6565 },
  },
  {
    nome: "Ricardo Mendes",
    email: "ricardo.m@example.com",
    tipo: "profissional",
    especialidade: "Personal Trainer",
    localizacao: { latitude: -23.5475, longitude: -46.6361 },
  },
  {
    nome: "Juliana Costa",
    email: "juliana.c@example.com",
    tipo: "profissional",
    especialidade: "Nutricionista",
    localizacao: { latitude: -23.5558, longitude: -46.6396 },
  },
  {
    nome: "Paciente Teste",
    email: "paciente@example.com",
    tipo: "paciente",
    especialidade: "N/A",
    localizacao: { latitude: -23.5510, longitude: -46.6340 },
  }
];

// --- Função para Popular o Banco ---
async function popularBanco() {
  console.log("Iniciando o povoamento do banco de dados...");
  const collectionRef = adminDb.collection('usuarios');

  for (const usuario of profissionaisDeTeste) {
    try {
      // Usamos o email como um ID único para evitar duplicatas
      const docRef = collectionRef.doc(usuario.email.replace(/[^a-zA-Z0-9]/g, '_')); 
      await docRef.set(usuario);
      console.log(`- Usuário '${usuario.nome}' adicionado/atualizado com sucesso.`);
    } catch (error) {
      console.error(`Erro ao adicionar o usuário '${usuario.nome}':`, error);
    }
  }

  console.log("\nPovoamento do banco de dados concluído!");
}

// --- Execução ---
popularBanco().catch(console.error);
