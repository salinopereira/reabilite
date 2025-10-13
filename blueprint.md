# Reabilite Pro - Blueprint de Aplicação

Este documento serve como a fonte única de verdade para o projeto Reabilite Pro, detalhando sua arquitetura, design, funcionalidades e o plano de desenvolvimento atual.

## Visão Geral

O Reabilite Pro é uma aplicação web moderna, projetada para fisioterapeutas gerenciarem seus pacientes e o progresso de suas avaliações de forma eficiente, segura e intuitiva.

## Design e Estilo

- **Tema:** Escuro (Dark Mode), com uma paleta de cores baseada em tons de ardósia (slate) e acentos em ciano e verde-azulado (teal) para interatividade e destaque.
- **Layout:** Responsivo, mobile-first, garantindo usabilidade em desktops e dispositivos móveis.
- **Componentes:**
  - **Cards:** Efeito de "levantado" com sombras suaves e bordas que reagem ao hover.
  - **Botões:** Ações primárias em ciano vibrante com sombras sutis para criar profundidade.
  - **Modais:** Experiência de modal fluida com fundo desfocado para focar a atenção do usuário na tarefa.
  - **Ícones:** Uso consistente de iconografia para melhorar a compreensão das ações.
- **Página Inicial:** Uma landing page profissional para apresentar o produto.

## Funcionalidades Implementadas

- **Autenticação de Usuários (Supabase Auth):**
  - Rotas `/login` e `/signup` para cadastro e login de profissionais.
  - Redirecionamento automático para a página de pacientes (`/pacientes`) após o login bem-sucedido.
- **Gerenciamento de Pacientes (`/pacientes`):**
  - Listagem de todos os pacientes em cards.
  - Funcionalidade de busca para filtrar pacientes por nome.
  - Ações para editar e deletar pacientes.
  - Modal para adicionar um novo paciente.
- **Detalhes do Paciente (`/pacientes/[id]`):**
  - Exibição das informações do paciente.
  - Listagem do histórico de avaliações.
  - Modal para adicionar uma nova avaliação (formato SOAP).
- **Detalhes da Avaliação (`/pacientes/[id]/avaliacoes/[avaliacaoId]`):**
  - Visualização completa de uma avaliação registrada.
- **Estrutura Técnica:**
  - **Next.js com App Router:** Utilização da arquitetura mais recente do Next.js.
  - **TypeScript:** Tipagem forte em todo o projeto para maior robustez.
- **Supabase:** Backend como serviço para autenticação e banco de dados.
  - **TailwindCSS:** Para estilização utilitária e design system.

---

## Plano de Ação Atual: Migração para @supabase/ssr

**Objetivo:** Substituir os pacotes descontinuados `@supabase/auth-helpers-*` pelo novo pacote oficial `@supabase/ssr` para garantir a compatibilidade e segurança da autenticação.

**Passos:**

1.  **Desinstalar dependências antigas:** Remover `@supabase/auth-helpers-nextjs` e `@supabase/auth-helpers-react`.
2.  **Instalar nova dependência:** Adicionar `@supabase/ssr`.
3.  **Refatorar a criação do cliente Supabase:**
    - Criar arquivos utilitários em `src/lib/supabase/` para gerenciar a criação de clientes para:
      - Componentes de Cliente (Client Components)
      - Componentes de Servidor (Server Components)
      - Middleware
4.  **Atualizar o Middleware de Autenticação:**
    - Substituir a lógica em `src/middleware.ts` para usar a função `updateSession` do `@supabase/ssr`.
5.  **Refatorar Componentes e Páginas:**
    - Atualizar todas as instâncias onde o cliente Supabase é utilizado para usar os novos métodos, garantindo que a comunicação com o backend continue funcionando de forma segura e eficiente.
