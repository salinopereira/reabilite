
# Blueprint do Projeto: ReabilitePro

## Visão Geral

O ReabilitePro é uma aplicação web moderna para fisioterapeutas e profissionais de reabilitação gerenciarem seus pacientes e acompanhamentos. A plataforma oferece um sistema de autenticação seguro, gerenciamento de perfis de pacientes e um sistema completo para criar, visualizar, e futuramente, editar e excluir avaliações de reabilitação.

---

## Arquitetura e Estilo

- **Framework:** Next.js com App Router
- **Estilo:** Tailwind CSS
- **Design:** Tema escuro, profissional e moderno, com foco em uma interface limpa, gradientes sutis (ciano e azul) e boa usabilidade.
- **Backend & Autenticação:** Supabase (PostgreSQL, Auth)
- **Fonte:** Poppins

---

## Funcionalidades Implementadas (Histórico)

### **Versão 0.1 a 0.5 (Resumo)**
- Estrutura inicial, sistema de autenticação, refatoração com rotas protegidas e o CRUD básico de pacientes (Adicionar, Listar, Ver Detalhes).

### **Versão 0.6: Módulo de Avaliações (CRUD Básico)**
- **Banco de Dados:** Criação da tabela `avaliacoes` com políticas de segurança.
- **Interface:** Implementação da listagem de avaliações na página do paciente e do formulário de adição de novas avaliações em um modal.

### **Versão 0.7: Visualização de Detalhes da Avaliação**
- **Navegação:** O botão "Ver Detalhes" na lista de avaliações foi transformado em um link funcional.
- **Rota Dinâmica:** Criada a rota aninhada `/pacientes/[id]/avaliacoes/[avaliacaoId]` para exibir uma avaliação específica.
- **Página de Detalhes:** A nova página busca os dados completos da avaliação (incluindo as notas subjetivas e objetivas) do Supabase e os apresenta em um layout claro, com foco na leitura das informações clínicas.

---

## **Plano Futuro: Editar e Excluir Pacientes (Versão 0.8)**

Com a visualização de pacientes e avaliações bem estabelecida, a próxima etapa é adicionar funcionalidades de gerenciamento essenciais. Atualmente, um paciente pode ser adicionado, mas suas informações não podem ser corrigidas e ele não pode ser removido do sistema.

### **1. Edição de Pacientes**
- **Ação:** Adicionar um botão "Editar" na página de detalhes do paciente (`/pacientes/[id]`).
- **Funcionalidade:**
  - Ao clicar no botão, um modal (reaproveitando o componente `Modal.tsx` e `AddPatientForm.tsx` com modificações) se abrirá, preenchido com os dados atuais do paciente.
  - O profissional poderá alterar as informações e, ao salvar, os dados serão atualizados no Supabase.
  - A interface na página de detalhes será atualizada automaticamente com as novas informações.

### **2. Exclusão de Pacientes**
- **Ação:** Adicionar um botão "Excluir" na página de detalhes do paciente.
- **Funcionalidade:**
  - Ao clicar, um modal de confirmação será exibido para prevenir a exclusão acidental (Ex: "Você tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.").
  - Se o profissional confirmar, o paciente será removido do banco de dados. Graças à configuração `ON DELETE CASCADE`, todas as avaliações associadas a ele também serão excluídas automaticamente.
  - Após a exclusão, o usuário será redirecionado de volta para a lista principal de pacientes.
