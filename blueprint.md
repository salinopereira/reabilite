# Blueprint do Projeto: Reabilite Pro

## 🎯 Objetivo

Criar uma plataforma digital de saúde integrativa e educação, onde profissionais e pacientes possam se cadastrar, interagir e utilizar recursos de acompanhamento online. A ideia é oferecer um ecossistema completo que conecta Educação Física, Fisioterapia, Nutrição e Psicologia, sob o conceito da Reabilite — promover saúde de forma interdisciplinar.

## Stack Tecnológica

*   **Framework:** Next.js
*   **Linguagem:** TypeScript
*   **Estilização:** Tailwind CSS
*   **Backend & DB:** Supabase
*   **Assistente de IA:** Gemini (integrado ao ambiente de desenvolvimento)

## ⚙️ Funcionalidades Principais

### 1. Cadastro e Login
*   **Tipos de usuário:** Profissional e Paciente.
*   **Páginas:** `src/app/signup/page.tsx` e `src/app/login/page.tsx`.
*   **Backend:** Integração com o sistema de autenticação do Supabase.
*   **Validação:** Validação de dados no cliente e no servidor.

### 2. Dashboard Principal
*   **Interface Dinâmica:** O conteúdo do dashboard se adapta ao tipo de usuário logado (Profissional ou Paciente).
*   **Componentes:** Cards com informações rápidas (consultas, pacientes, métricas, progresso).
*   **IA:** Integração futura com IA para fornecer sugestões personalizadas.

### 3. Gerenciamento de Pacientes (Para Profissionais)
*   **CRUD:** Cadastro, edição e acompanhamento de pacientes.
*   **Acompanhamento:** Histórico e evolução (peso, medidas, postura, adesão ao treino, etc.).
*   **Rotas:** Componentes dedicados dentro de `/dashboard/pacientes`.

### 4. Avaliação e Protocolos
*   **Módulo Inicial:** Avaliação postural.
*   **Automação com IA:** Formulários que utilizam IA para gerar relatórios automáticos.
*   **Exportação:** Funcionalidade para exportar relatórios em PDF.

### 5. Design e Experiência (Reabilite Design System)
*   **Estilo:** Minimalista, limpo e profissional.
*   **Responsividade:** Layout totalmente responsivo utilizando Tailwind CSS.
*   **Animações:** Uso de ícones (Lucide) e animações suaves (Framer Motion) para uma experiência de usuário fluida.

## 🧩 Arquitetura do Projeto

```
src/
 ├─ app/
 │   ├─ (auth)/
 │   │   ├─ login/page.tsx
 │   │   └─ signup/page.tsx
 │   ├─ (app)/
 │   │   ├─ dashboard/
 │   │   │   ├─ pacientes/
 │   │   │   ├─ avaliacao/
 │   │   │   ├─ layout.tsx
 │   │   │   └─ page.tsx
 │   │   └─ layout.tsx
 │   ├─ api/
 │   ├─ layout.tsx
 │   └─ page.tsx (Landing Page)
 │
 ├─ components/  (Componentes reutilizáveis, ex: Button, Input, Card)
 ├─ lib/         (Configurações de clientes, ex: supabaseClient.ts)
 └─ utils/       (Funções utilitárias)
public/
 ├─ prompt_reabilite_ia.txt
 ├─ prompt_revisao.txt
 └─ prompt_dashboard.txt
```

## 🤖 Papel da IA (Gemini)

A IA é uma parceira ativa no desenvolvimento, responsável por:
*   Revisar e sugerir melhorias no código.
*   Corrigir bugs e erros de implementação.
*   Criar componentes, páginas e lógicas de negócio com base nos prompts.
*   Otimizar a performance da aplicação.
*   Preencher lacunas do projeto de forma proativa.
