
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
  - A lógica de cadastro se comunica com a API de Auth do Supabase.
  - Feedback visual (sucesso/erro) para o usuário.
- **Página de Login (`/login`):**
  - Formulário para autenticar usuários com e-mail e senha.
  - Redireciona para o `/dashboard` em caso de sucesso.
- **Página de Dashboard (`/dashboard`):**
  - Página inicial para usuários autenticados.
  - Exibe uma mensagem de boas-vindas com o nome do usuário.
  - Inclui um botão de "Sair" (Logout).

### **Versão 0.3: Refatoração da Autenticação**
- **Centralização da Segurança:**
  - Foi criado um layout de rota (`src/app/(app)/layout.tsx`).
  - Este layout agora atua como um "guardião", verificando se o usuário está logado antes de renderizar qualquer página dentro do grupo `(app)`.
  - Se o usuário não estiver logado, ele é automaticamente redirecionado para a página `/login`.
- **Código Simplificado:** A lógica de verificação de sessão foi removida das páginas individuais (como o dashboard), tornando o código mais limpo, seguro e fácil de manter.

---

## **Plano Atual: Módulo de Gerenciamento de Pacientes (Versão 0.4)**

O próximo passo é construir a funcionalidade principal para o profissional: o gerenciamento de seus pacientes.

### **1. Tabela de Pacientes no Supabase**
- **Ação:** Vou guiar você para criar uma nova tabela chamada `pacientes` no seu banco de dados Supabase.
- **Colunas:**
  - `id` (Chave Primária, gerada automaticamente)
  - `nome_completo` (Texto)
  - `email` (Texto, único)
  - `telefone` (Texto)
  - `data_nascimento` (Data)
  - `id_profissional` (UUID, Chave Estrangeira referenciando `auth.users.id`)
  - `created_at` (Timestamp, gerado automaticamente)

### **2. Página para Listar Pacientes (`/pacientes`)**
- **Ação:** Criarei a página em `src/app/(app)/pacientes/page.tsx`.
- **Funcionalidade:**
  - A página buscará e exibirá uma lista de todos os pacientes associados ao profissional logado.
  - Terá um botão "Adicionar Novo Paciente".
  - O design será uma tabela ou uma grade de cartões, seguindo nosso estilo visual.

### **3. Formulário para Adicionar Pacientes**
- **Ação:** Criarei um componente de formulário (provavelmente em um modal) para adicionar um novo paciente.
- **Funcionalidade:**
  - O formulário conterá campos para todas as informações do paciente (nome, e-mail, etc.).
  - Ao submeter, os dados serão salvos na tabela `pacientes` no Supabase.

### **4. Página de Detalhes do Paciente (Futuro)**
- Após a listagem e criação, o próximo passo será criar uma página dinâmica para visualizar os detalhes e o histórico de um paciente específico.
