
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

### **Versão 0.4: Módulo de Gerenciamento de Pacientes (CRUD Básico)**
- **Estrutura do Banco de Dados:**
  - Criada a tabela `pacientes` no Supabase.
  - Estabelecida uma relação de chave estrangeira (`id_profissional`) com a tabela `auth.users`.
- **Listagem de Pacientes (`/pacientes`):**
  - A página busca e exibe uma lista dos pacientes do profissional logado.
- **Adição de Pacientes (Formulário em Modal):**
  - Implementação de um formulário em modal para adicionar novos pacientes e atualizar a lista em tempo real.

### **Versão 0.5: Página de Detalhes do Paciente**
- **Navegação:**
  - Os cartões na lista de pacientes tornaram-se links clicáveis.
- **Rota Dinâmica:**
  - Criada a rota `src/app/(app)/pacientes/[id]/page.tsx` para exibir detalhes de um paciente específico.
- **Página de Detalhes:**
  - A página busca os dados completos do paciente (usando o ID da URL) e os exibe.
  - Inclui um link para voltar facilmente para a lista de pacientes.

---

## **Plano Futuro: Módulo de Avaliações (Versão 0.6)**

Com o gerenciamento de pacientes estabelecido, o próximo passo crucial é permitir que os profissionais criem e registrem avaliações para eles. Isso transformará a aplicação de um simples catálogo para uma ferramenta de acompanhamento clínico.

### **1. Estrutura do Banco de Dados para Avaliações**
- **Ação:** Criarei uma nova tabela `avaliacoes` no Supabase.
- **Estrutura Proposta:**
  - `id`: Chave primária.
  - `id_paciente`: Chave estrangeira referenciando a tabela `pacientes`.
  - `data_avaliacao`: Data em que a avaliação foi realizada.
  - `titulo`: Um título para a avaliação (ex: "Avaliação Inicial do Ombro Direito").
  - `notas_subjetivas`: Campo de texto para as queixas do paciente (o que ele sente).
  - `observacoes_objetivas`: Campo de texto para as observações do profissional (o que ele mede e vê).

### **2. Interface na Página de Detalhes do Paciente**
- **Ação:** Modificarei a página `pacientes/[id]/page.tsx` para incluir uma nova seção de "Avaliações".
- **Funcionalidade:**
  - Listará todas as avaliações já realizadas para aquele paciente.
  - Terá um botão "+ Adicionar Avaliação" para abrir um formulário (provavelmente em um modal, similar ao de adicionar pacientes).
