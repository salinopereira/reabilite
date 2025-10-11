
# Blueprint do Projeto: ReabilitePro

## Visão Geral

O ReabilitePro é uma aplicação web moderna para fisioterapeutas e profissionais de reabilitação gerenciarem seus pacientes e acompanhamentos. A plataforma oferece um sistema de autenticação seguro, gerenciamento de perfis de pacientes e um sistema completo para criar e acompanhar avaliações de reabilitação.

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
- Configuração do projeto, criação da landing page com seções e botões de navegação, e estilo global.

### **Versão 0.2: Sistema de Autenticação com Supabase**
- Instalação e configuração do Supabase, criação das páginas e formulários de Login e Cadastro.

### **Versão 0.3: Refatoração da Autenticação**
- Implementação de um layout de rota (`(app)`) para proteger o acesso e criação de uma barra de navegação global.

### **Versão 0.4: Módulo de Gerenciamento de Pacientes (CRUD Básico)**
- Criação da tabela `pacientes` no Supabase.
- Implementação da listagem de pacientes e do formulário de adição em modal.

### **Versão 0.5: Página de Detalhes do Paciente**
- Os cartões de paciente se tornaram links.
- Criação da rota dinâmica `pacientes/[id]` para exibir os detalhes cadastrais completos de um paciente específico.

### **Versão 0.6: Módulo de Avaliações (CRUD Básico)**
- **Estrutura do Banco de Dados:**
  - Criada a tabela `avaliacoes` no Supabase, com colunas para `id_paciente`, `titulo`, `data_avaliacao`, `notas_subjetivas`, `observacoes_objetivas`.
  - Políticas de Segurança (RLS) foram configuradas para garantir a privacidade dos dados.
- **Listagem de Avaliações:**
  - A página de detalhes do paciente (`/pacientes/[id]`) foi atualizada para buscar e exibir uma lista com o histórico de avaliações daquele paciente.
- **Adição de Avaliações (Formulário em Modal):**
  - Desenvolvido um formulário (`AddAvaliacaoForm.tsx`) para inserir os dados de uma nova avaliação.
  - Ao clicar no botão "+ Adicionar Avaliação", o formulário é exibido em um modal.
  - Ao salvar, a nova avaliação é inserida no banco de dados e a lista na tela é atualizada em tempo real.

---

## **Plano Futuro: Visualização de Detalhes da Avaliação (Versão 0.7)**

Agora que podemos criar e listar avaliações, o próximo passo é permitir que o profissional veja todos os detalhes de uma avaliação específica.

### **1. Rota Dinâmica para Avaliações**
- **Ação:** Criarei uma nova rota dinâmica, como `/pacientes/[id]/avaliacoes/[avaliacaoId]`.
- **Funcionalidade:** Isso permitirá ter uma página única para cada avaliação registrada.

### **2. Página de Detalhes da Avaliação**
- **Ação:** Desenvolverei a página que buscará os dados completos da avaliação (incluindo as notas subjetivas e objetivas) e os exibirá em um formato de fácil leitura.
- **Navegação:** Será possível navegar da lista de avaliações (na página do paciente) para a página de detalhes de uma avaliação específica ao clicar no botão "Ver Detalhes".
