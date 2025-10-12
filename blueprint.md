# Blueprint: Fisiogest Pro

## Visão Geral

O Fisiogest Pro é uma aplicação web moderna para fisioterapeutas gerenciarem seus pacientes e o progresso clínico de forma eficiente. A plataforma permite o cadastro de pacientes, o registro de avaliações detalhadas (SOAP) e o acompanhamento da evolução de cada caso, tudo em uma interface intuitiva e reativa.

## Design e Estilo

- **Tema:** Escuro (Dark Mode) com um esquema de cores baseado em tons de ardósia (slate), acentuado por um ciano vibrante para ações primárias e elementos interativos.
- **Tipografia:** Fonte sans-serif limpa e moderna para garantir legibilidade.
- **Componentes:**
  - **Cards:** Efeito de "levantado" com sombras suaves para destacar elementos como os cards de paciente.
  - **Botões:** Botões de ação primária com cor ciano e efeito de sombra para se destacarem. Botões secundários com fundo cinza sutil.
  - **Modais:** Experiência de modal fluida com fundo desfocado para focar a atenção do usuário na tarefa atual (adicionar/editar paciente, adicionar avaliação).
  - **Ícones:** Uso de iconografia (Feather Icons) para ações como editar, deletar e adicionar, melhorando a usabilidade.
- **Layout:** Responsivo e centrado, garantindo uma boa experiência tanto em desktops quanto em dispositivos móveis.

## Funcionalidades Implementadas

- **Autenticação de Usuários:**
  - Cadastro (`/signup`) e Login (`/login`) de profissionais utilizando o Supabase Auth.
  - Redirecionamento automático para o dashboard após o login.
- **Dashboard (`/dashboard`):
  - Apresenta um resumo ou ponto de partida para o profissional (atualmente, um placeholder).
- **Gerenciamento de Pacientes (`/pacientes`):
  - **Listagem:** Exibe todos os pacientes cadastrados em cards individuais, mostrando nome, email e telefone.
  - **Ações Rápidas:** Botões para editar ou deletar um paciente diretamente do card.
  - **Adicionar Paciente:** Botão "Adicionar Paciente" que abre um formulário em um modal para o cadastro de novos pacientes.
  - **Busca:** Funcionalidade de busca para filtrar pacientes pelo nome.
- **Visualização de Paciente (`/pacientes/[id]`):
  - **Detalhes do Paciente:** Exibe todas as informações de um paciente específico.
  - **Listagem de Avaliações:** Mostra um histórico de todas as avaliações já realizadas para aquele paciente.
  - **Adicionar Avaliação:** Botão "Nova Avaliação" que abre um modal com um formulário para registrar uma nova avaliação (SOAP).
- **Gerenciamento de Avaliações:
  - **Criação:** O formulário de avaliação permite registrar Título, Data, Notas Subjetivas (queixa do paciente) e Observações Objetivas (análise do profissional).
  - **Visualização:** A página de detalhes de uma avaliação (`/pacientes/[id]/avaliacoes/[avaliacaoId]`) exibe as informações registradas.
- **Componentes Reutilizáveis:**
  - `Modal.tsx`: Componente de modal genérico e estilizado.
  - `AddPatientForm.tsx`, `EditPatientForm.tsx`, `AddAvaliacaoForm.tsx`: Formulários desacoplados para cada ação específica.
  - `AddPatientModal.tsx`, `EditPatientModal.tsx`, `AddEvaluationModal.tsx`: Componentes que gerenciam o estado de visibilidade dos modais e envolvem os formulários.
- **Tipagem:**
  - `src/lib/types.ts`: Arquivo central para interfaces TypeScript (ex: `Paciente`), garantindo consistência em todo o projeto.

## Plano de Ação Atual

- **Tarefa:** Implementar a funcionalidade de Adicionar Avaliação para um Paciente.
- **Status:** **Concluído.**
- **Passos Executados:**
    1.  **Atualização da UI:** Adicionado um botão "Nova Avaliação" na página de detalhes do paciente.
    2.  **Criação de Componentes:**
        -   `AddEvaluationModal.tsx`: Gerencia a abertura e fechamento do modal de avaliação.
        -   `AddAvaliacaoForm.tsx`: Contém o formulário para a criação de uma nova avaliação, com comunicação com o Supabase.
    3.  **Refatoração:**
        -   O componente `Modal.tsx` foi generalizado para aceitar um `title` e ser reutilizado.
        -   `EditPatientModal.tsx` foi atualizado para usar o novo `Modal`.
    4.  **Centralização de Tipos:** A interface `Paciente` foi movida para `src/lib/types.ts` para ser reutilizada e evitar duplicação de código.
    5.  **Resolução de Erros:** Corrigida uma série de erros de compilação relacionados a `props` inconsistentes, erros de digitação e importações de tipos incorretas.
    6.  **Validação:** O projeto foi compilado com sucesso (`npm run build`), confirmando que a estrutura de componentes e tipos está correta.
