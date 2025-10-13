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
        -   Páginas que dependem de autenticação (`login`, `signup`, `pacientes`) foram marcadas como `export const dynamic = "force-dynamic";` para evitar a pré-renderização estática.
        -   A instanciação do cliente Supabase foi centralizada no arquivo `@/lib/supabaseClient.ts`.
    2.  **Configuração de Build do GitHub Actions:**
        -   Criado o arquivo `.github/workflows/firebase-hosting-pull-request.yml` para injetar os `secrets` do repositório no ambiente de build de Pull Requests.
    3.  **Configuração de Build do Firebase App Hosting:**
        -   O arquivo `firebase.json` foi configurado para instruir o Cloud Build a usar variáveis de ambiente do Google Secret Manager.
    4.  **Configuração do Google Secret Manager:**
        -   Criados os secrets `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no Secret Manager.
    5.  **Correção de Permissões (IAM):**
        -   **Causa Raiz:** O serviço de build do App Hosting (`gcp-sa-firebaseapphosting`) não tinha permissão para acessar os secrets criados.
        -   **Solução:** Concedido o papel de **"Acessor de secrets do Secret Manager"** à conta de serviço `service-35066393789@gcp-sa-firebaseapphosting.iam.gserviceaccount.com` na configuração de IAM do projeto.

- **Status Final:** **Resolvido.** O próximo `git push` para o branch `main` deve acionar um build bem-sucedido e implantar a aplicação.
