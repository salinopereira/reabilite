export interface Paciente {
    id: string;
    nome_completo: string;
    email: string;
    telefone: string;
    data_nascimento: string;
    cpf: string;
    endereco: string;
    // Adicione quaisquer outros campos relevantes que possam vir da tabela
    created_at?: string;
}

// Você pode adicionar outras interfaces globais aqui no futuro
// export interface Avaliacao { ... }
