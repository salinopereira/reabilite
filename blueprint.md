# Reabilite Pro - Blueprint de Aplicação

Este documento serve como a fonte única de verdade para o projeto Reabilite Pro, detalhando sua arquitetura, design, funcionalidades e o plano de desenvolvimento atual.

## Visão Geral

O Reabilite Pro é uma aplicação web moderna, projetada para fisioterapeutas e pacientes, facilitando a gestão de tratamentos e o acompanhamento do progresso de forma eficiente, segura e intuitiva.

## Design e Estilo

- **Tema:** Escuro (Dark Mode), com uma identidade visual sofisticada e moderna.
- **Paleta de Cores:**
    - **Fundo Principal:** `jacksons-purple` (#1C2B7A)
    - **Acentos e Interação:** `royal-blue` (#4B72D9)
    - **Texto Principal:** `iron` (#D5D5D6)
    - **Texto Secundário:** `nepal` (#94A3B8)
- **Layout:** Responsivo e moderno, com espaçamento limpo e hierarquia visual clara.
- **Efeitos Visuais:** Textura de ruído, efeito de vidro (Glassmorphism) e sombras (Drop Shadows).
- **Componentes:** Botões, formulários e cards com estilos modernos e interativos.

## Funcionalidades Implementadas

- **Autenticação de Usuários (Supabase Auth):**
    - **Validação de Domínio:** O cadastro e o login são restritos a emails que terminam com `@reabilite.pro`, garantindo o acesso exclusivo à equipe.
    - **Seleção de Papel (Role):** Na página de cadastro, os utilizadores devem identificar-se como "Profissional" ou "Paciente".
    - **Página de Cadastro (`/signup`):** Formulário de cadastro com seletor de papel. A lógica insere o utilizador na tabela `profissionais` ou `pacientes` com base na seleção.
    - **Página de Login (`/login`):** Após a autenticação, o sistema verifica a tabela (`profissionais` ou `pacientes`) à qual o utilizador pertence e o redireciona para o dashboard correspondente.
- **Dashboards por Papel:**
    - **Dashboard do Profissional (`/pacientes`):** Painel para gerir pacientes, visualizar listas, adicionar, editar e excluir perfis.
    - **Dashboard do Paciente (`/dashboard-paciente`):** Uma página inicial para os pacientes, que exibe suas informações pessoais e uma seção para o histórico de avaliações (em desenvolvimento).
- **Landing Page (`/`):** Uma página de apresentação profissional do produto.
- **Gerenciamento de Pacientes (para Profissionais):**
    - Listagem, visualização detalhada, adição, edição e exclusão de pacientes.
- **Gerenciamento de Avaliações:**
    - Adição e visualização de avaliações associadas a um paciente.

## Stack de Tecnologias

- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **Backend:** Supabase (Autenticação e Banco de Dados)
- **Estilização:** TailwindCSS
- **Deployment:** Firebase Hosting com GitHub Actions.
