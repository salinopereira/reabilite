# Reabilite Pro - Blueprint

## Visão Geral

O Reabilite Pro é uma plataforma que conecta pacientes a profissionais de saúde (nutricionistas, personal trainers e psicólogos) para acompanhamento e suporte contínuo. A aplicação web oferece dashboards personalizados para cada tipo de usuário, um mapa para encontrar profissionais e um sistema de chat para comunicação.

## Estilo e Design

- **Tema:** Moderno e escuro (dark mode), com fundo `#111827` (gray-900) e elementos em tons de cinza mais claros.
- **Cor de Destaque:** Azul (`#4f46e5`), usado para botões, links e elementos de interface ativos.
- **Tipografia:** Fonte sans-serif padrão do sistema.
- **Ícones:** Heroicons (variantes "outline" e "solid") e Lucide React para uma iconografia clara e consistente.
- **Componentes:**
    - **Botões:** Cantos arredondados, preenchimento sólido na cor de destaque.
    - **Inputs:** Fundo escuro, bordas sutis e foco com anel azul.
    - **Cards:** Fundo cinza escuro (`#1f2937`), cantos arredondados e sombra suave.

## Funcionalidades Implementadas

### Autenticação e Usuários

- **Cadastro:**
    - Rota: `/signup`
    - Os usuários podem se cadastrar como "paciente" ou "profissional".
    - Para profissionais, é obrigatório selecionar uma especialidade (Nutricionista, Profissional de Educação Física, Psicólogo).
    - Os nomes de usuário são padronizados no formato `seu.usuario@reabilite.pro`.
- **Login:**
    - Rota: `/login`
    - Sistema de login com email (formato de usuário) e senha.
    - Redirecionamento automático para o dashboard correspondente após o login.
- **Tipos de Usuário:**
    - **Paciente:** Tem acesso ao seu dashboard, pode encontrar profissionais no mapa, visualizar o feed de conteúdo e interagir via chat.
    - **Profissional:** Tem acesso ao seu dashboard, pode gerenciar sua visibilidade no mapa, publicar conteúdo e interagir com pacientes.

### Dashboards

- **Dashboard do Paciente:**
    - Rota: `/dashboard/paciente`
    - **Feed de Conteúdo:** Visualiza as últimas publicações dos profissionais.
    - **Encontrar Profissionais:** Link para a página do mapa.
    - **Chat:** (Em desenvolvimento) Área para comunicação com os profissionais.
- **Dashboard do Profissional:**
    - Rota: `/dashboard/profissional`
    - **Visibilidade no Mapa:** Permite que o profissional defina sua localização (latitude e longitude) e ative ou desative sua visibilidade no mapa.
    - **Criação de Conteúdo:** Formulário para criar e publicar novas postagens no feed, com título, corpo e imagem opcional.

### Mapa de Profissionais

- **Rota:** `/mapa`
- **Funcionalidade:** Exibe um mapa (atualmente, uma imagem estática de placeholder) onde os pacientes podem encontrar profissionais próximos.
- **Backend:** A API em `/api/profissionais_proximos` foi criada para, no futuro, fornecer os dados dos profissionais com base na localização do paciente.

### Estrutura do Projeto

- **Framework:** Next.js com App Router.
- **Firebase:**
    - **Authentication:** Para gerenciamento de usuários.
    - **Firestore:** Para armazenamento de dados dos usuários (perfis, tipo de conta) e conteúdo (posts).
    - **Storage:** Para upload de imagens dos posts.
- **Estilização:** Tailwind CSS para uma abordagem "utility-first".

## Plano de Alterações Recentes

- **Objetivo:** Publicar a aplicação no Firebase App Hosting.
- **Passos Executados:**
    1.  Verificada a existência do backend `reabilite` no App Hosting.
    2.  Analisado e confirmado o conteúdo do arquivo de configuração `apphosting.yaml`, garantindo que as variáveis de ambiente do Firebase estivessem disponíveis para o build.
    3.  Iniciado o processo de deploy com o comando `firebase deploy`.
    4.  **Correção de Erros de Build:**
        - **Erro 1:** Corrigida a importação da variável do Firestore de `firestore` para `db` em múltiplos arquivos (`/dashboard/paciente`, `/dashboard/profissional`, `/login`, `/signup`).
        - **Erro 2:** Corrigida a importação de ícones no dashboard do profissional, substituindo os ícones inexistentes (`LayoutDashboardIcon`, `FileTextIcon`) por ícones válidos da biblioteca Heroicons (`Squares2X2Icon`, `DocumentTextIcon`).
    5.  Realizado um novo deploy após as correções.
    6.  **Sucesso:** O deploy foi concluído com êxito e a aplicação foi publicada.
