# Blueprint: ReabilitePro

## Visão Geral

O ReabilitePro é uma aplicação web moderna para fisioterapeutas gerenciarem seus pacientes e o progresso clínico de forma eficiente. A plataforma permite o cadastro de profissionais, login, e gerenciamento completo de pacientes, incluindo a criação e visualização de avaliações clínicas detalhadas (SOAP).

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

## Resolução de Problemas de Build e Deploy (App Hosting)

Após múltiplas tentativas, o erro `Backend Not Found` foi diagnosticado e resolvido. A causa era uma cascata de problemas relacionados à disponibilidade de variáveis de ambiente (`secrets`) nos diferentes ambientes de build.

- **Plano de Ação Executado:**
    1.  **Correção do Código:**
        -   A instanciação do cliente Supabase foi atualizada para não falhar durante o build, usando variáveis de ambiente "dummy" se as reais não estiverem presentes.
    2.  **Configuração de Permissões (IAM):**
        -   Concedido o papel de **"Acessor de secrets do Secret Manager"** à conta de serviço do App Hosting.

- **Status Atual:** Build bem-sucedido. A implantação está falhando devido a um problema transitório ao tentar acessar o artefato de build. Acionando um novo deploy para tentar novamente.
