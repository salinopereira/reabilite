
# Blueprint do Projeto: ReabilitePro

## Visão Geral

O ReabilitePro é uma aplicação web moderna para fisioterapeutas e profissionais de reabilitação gerenciarem seus pacientes e acompanhamentos. A plataforma oferece um sistema de autenticação seguro, gerenciamento de perfis de pacientes e, futuramente, a criação e acompanhamento de avaliações de reabilitação.

---

## Arquitetura e Estilo

- **Framework:** Next.js com App Router
- **Estilo:** Tailwind CSS
- **Design:** Tema escuro, profissional e moderno, com foco em uma interface limpa, gradientes sutis (ciano e azul) e boa usabilidade.
- **Backend & Autenticação:** Supabase (PostgreSQL, Auth)
- **Fonte:** Poppins

---

## Funcionalidades Implementadas (Histórico)

### **Versão 0.1: Estrutura Inicial e Landing Page**
- **Estrutura do Projeto:** Configuração inicial do Next.js.
- **Landing Page (`/`):**
  - Design visualmente atraente com o logo da aplicação.
  - Seções: "Sobre", "Recursos", "Planos".
  - Botões de "Login" e "Cadastro" que direcionam para as respectivas páginas.
- **Estilo Global:** Configuração do `tailwind.config.ts` e `globals.css` para o tema escuro.

### **Versão 0.2: Sistema de Autenticação com Supabase**
- **Instalação:** Adicionado o pacote `@supabase/supabase-js`.
- **Configuração:**
  - Criação do arquivo `src/lib/supabaseClient.ts` para inicializar o cliente Supabase.
  - Utilização do arquivo `.env.local` para armazenar as credenciais do Supabase de forma segura.
- **Página de Cadastro (`/signup`):**
  - Formulário para registrar novos usuários com nome, e-mail, senha e tipo de usuário (Paciente ou Profissional).
- **Página de Login (`/login`):**
  - Formulário para autenticar usuários com e-mail e senha.

### **Versão 0.3: Refatoração da Autenticação**
- **Centralização da Segurança:**
  - Foi criado um layout de rota (`src/app/(app)/layout.tsx`) que atua como um "guardião", redirecionando usuários não logados.
- **Navegação Global:**
  - Criado o componente `Nav.tsx` para uma barra de navegação consistente.
  - A navegação foi integrada ao layout principal, aparecendo em todas as páginas da área logada.

### **Versão 0.4: Módulo de Gerenciamento de Pacientes**
- **Estrutura do Banco de Dados:**
  - Criada a tabela `pacientes` no Supabase com colunas para `nome_completo`, `email`, `telefone`, `data_nascimento`.
  - Estabelecida uma relação de chave estrangeira (`id_profissional`) com a tabela `auth.users` para associar cada paciente a um profissional.
- **Listagem de Pacientes (`/pacientes`):**
  - A página busca e exibe uma lista de todos os pacientes associados ao profissional logado.
  - Apresenta os pacientes em formato de cartões com suas informações principais.
  - Exibe uma mensagem amigável caso nenhum paciente tenha sido adicionado.
- **Adição de Pacientes (Formulário em Modal):**
  - Criado um componente de `Modal` reutilizável.
  - Desenvolvido um formulário (`AddPatientForm.tsx`) para inserir os dados de um novo paciente.
  - Ao clicar no botão "+ Adicionar Paciente", o formulário é exibido em um modal.
  - Ao salvar, o novo paciente é inserido no banco de dados e a lista na tela é atualizada em tempo real.

---

## **Plano Futuro: Página de Detalhes do Paciente (Versão 0.5)**

Agora que podemos listar e adicionar pacientes, o próximo passo é criar um espaço dedicado para cada um deles.

### **1. Rota Dinâmica para Pacientes**
- **Ação:** Criarei uma rota dinâmica, como `src/app/(app)/pacientes/[id]/page.tsx`.
- **Funcionalidade:** O `[id]` na URL permitirá que tenhamos uma página única para cada paciente, baseada no seu ID do banco de dados.

### **2. Página de Detalhes**
- **Ação:** Desenvolverei a página que buscará os dados completos do paciente específico (usando o ID da URL) e os exibirá.
- **Funcionalidade:**
  - Exibirá todas as informações de cadastro do paciente.
  - Este será o local onde, no futuro, adicionaremos o histórico de avaliações, sessões, gráficos de progresso, etc.
- **Navegação:** Será possível navegar da lista de pacientes para a página de detalhes de um paciente específico ao clicar no seu cartão.
