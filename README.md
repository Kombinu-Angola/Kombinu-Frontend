# Kombinu Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwindcss)

**Plataforma educacional gamificada para conectar Criadores e Aprendizes**

</div>

---

## ✨ Features

- 🔐 **Autenticação Completa** - Login/Register com JWT
- 🎨 **Dark Mode** - Tema claro/escuro persistente
- 📊 **Dashboards Personalizados** - Estatísticas para Aprendizes e Criadores
- 🏆 **Sistema de Ranking** - Leaderboard global em tempo real
- 📚 **Marketplace de Cursos** - Listagem com filtros e busca
- 🧠 **Quizzes Interativos** - Geração dinâmica com pontuação

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm (gestor de pacotes oficial do projecto)
- Backend Django a correr (ver repositório `kombinu-backend`)

### Instalação

```bash
# Instale as dependências
npm install

# Copie o ficheiro de variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com o URL do backend

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## ⚙️ Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha os valores:

| Variável       | Descrição                         | Exemplo                      |
| :------------- | :-------------------------------- | :--------------------------- |
| `VITE_API_URL` | URL base da API do backend Django | `http://localhost:8000/api`  |
| `VITE_ENV`     | Ambiente da aplicação             | `development` / `production` |

> **Nota:** `.env.local` nunca deve ser commitado. Está listado no `.gitignore`.

---

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── layout/          # Header, BaseLayout
│   └── ui/              # Card, Button
├── contexts/            # React Context (Auth, Theme)
├── hooks/               # Custom Hooks (useRanking, etc.)
├── pages/               # Páginas da aplicação
│   ├── LandingPage.tsx
│   ├── Login.tsx / Register.tsx
│   ├── DashboardAprendiz.tsx / DashboardCriador.tsx
│   ├── Marketplace.tsx
│   ├── Quiz.tsx
│   └── Ranking.tsx
├── routes/              # Configuração do React Router
├── services/            # Camada de API (Axios)
│   ├── api.ts           # Configuração base
│   ├── authService.ts
│   ├── contentService.ts
│   ├── dashboardService.ts
│   ├── quizService.ts
│   └── rankingService.ts
└── utils/               # Utilitários (logger, etc.)
```

---

## 🔌 Integração com Backend

| Endpoint          | Serviço            | Descrição                      |
| :---------------- | :----------------- | :----------------------------- |
| `/api/auth/`      | `authService`      | Login, Register                |
| `/api/contents/`  | `contentService`   | CRUD de Cursos                 |
| `/api/quizzes/`   | `quizService`      | Geração e Submissão de Quizzes |
| `/api/rankings/`  | `rankingService`   | Leaderboard Global             |
| `/api/dashboard/` | `dashboardService` | Estatísticas de Usuário        |

**Configuração do Proxy:** `vite.config.ts`

---

## 🛠️ Scripts Disponíveis

| Comando           | Descrição                          |
| :---------------- | :--------------------------------- |
| `npm run dev`     | Inicia servidor de desenvolvimento |
| `npm run build`   | Gera build de produção             |
| `npm run preview` | Preview local do build             |
| `npm run lint`    | Executa ESLint                     |

---

## 📄 Licença

Este projeto faz parte do MVP Kombinu.
