<!-- markdownlint-disable MD024 -->
# Changelog — KOMBINU Frontend

Todas as alteracoes notaveis neste projecto serao documentadas neste ficheiro.

O formato e baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
e este projecto adere ao [Versionamento Semantico](https://semver.org/lang/pt-BR/).

---

## [Nao Lancado]

<!-- Registar aqui as alteracoes que estao em desenvolvimento e ainda nao foram lancadas. -->
<!-- Quando houver um release, mover esta seccao para um bloco com versao e data. -->

### Adicionado

- Interceptor de resposta 401 em `src/services/api.ts` com logica de refresh token automatico:
  - Sistema de fila para requests concorrentes durante o refresh, evitando multiplas chamadas simultaneas ao endpoint de refresh.
  - Suporte a rotacao de refresh token — se o backend emitir um novo token, e guardado automaticamente.
  - Logout forcado com limpeza do localStorage (`accessToken`, `refreshToken`, `kombinu_usuario`) e redireccao para `/login` quando o refresh falha.
- `SplashScreen` de entrada na aplicacao com duracao de 2.5 segundos.
- `AuthLayout` separado para as paginas de Login e Registo, sem Header de navegacao.

### Alterado

- `BaseLayout` actualizado para servir apenas as paginas autenticadas (Dashboard, Marketplace, Quiz, Ranking, etc.), com Header presente em todas.
- `sonner.tsx` migrado de `next-themes` para o `ThemeContext` existente no projecto, eliminando dependencia conflituante.
- Header reescrito com menu hamburger para mobile e navegacao diferenciada por role (Aprendiz, Criador, Admin).
- Landing page redesenhada com nova paleta de cores e estrutura de seccoes actualizada.

### Corrigido

- Removida dependencia `next-themes` que conflituava com o `ThemeContext` do projecto.
- Removido selector `* { transition: all 0.3s ease; }` do CSS global que causava degradacao de performance em dispositivos lentos.
- Corrigido mapeamento de `tags` em `contentService` para aceitar `string[] | string`, resolvendo erro `.map is not a function`.

---

## [1.2.2] - 2026-03-xx — Correccoes Adicionais do MVP

### Adicionado

- Rodape (Footer) actualizado com dados de contacto reais da Kombinu: email, telefone e localizacao em Angola.
- Formulario de subscricao da newsletter no frontend funcional e redigido para o email da Kombinu.

### Corrigido

- Implementacao end-to-end do fluxo de criacao manual de quizzes sem uso de IA, permitindo aos criadores submeterem perguntas digitadas manualmente para os servidores.
- Player de quizzes corrigido:
  - Resolvido erro 500 no carregamento inicial por causa de URLs e lookup fields incorrectos no backend.
  - Sincronizacao de propriedades (ID vs PK) no modelo frontend-backend para resolver problemas visuais (temporizador NaN e inputs radio marcando todos simultaneamente).
  - Corrigido envio de respostas do quiz para garantir pontuacao fiel ao modelo do backend.

---

## [1.2.1] - 2026-03-xx — Configuracao de Deploy no Vercel

### Adicionado

- Ficheiro `vercel.json` criado para configurar o comportamento de deploy no Vercel, incluindo redireccoes e rewrites para SPA.

---

## [1.2.0] - 2026-03-xx — Funcionalidades Finais do MVP

### Adicionado

- Botao interativo para gerar quiz via Inteligencia Artificial (OpenTDB) associado a conteudos criados.
- Ligacao de interface completa na pagina `/courses/:id`, agora a renderizar iFrames e textos descritivos inseridos pelos criadores.

### Corrigido

- Corrigido erro critico `undefined.toLocaleString()` no Marketplace quando o preco esta vazio ou indefinido.
- O frontend passa a suportar correctamente a paginacao do DRF, garantindo que as listagens do Marketplace sao populadas atraves do array `results`.
- Componente de Ranking ligado de forma dinamica via chamada API a `/api/rankings/global/`, calculando o score directamente do backend.
- Corrigido parse incorrecto de tags armazenadas em formato CSV no servidor (`.map is not a function`).
- Corrigida configuracao base do Axios para se orientar correctamente atraves de `VITE_API_URL` em deploys no Vercel.

---

## [1.1.0] - 2026-01-11 — MVP Release

### Adicionado

- Arquitectura migrada completamente de HTML legado para React 18 com TypeScript e Vite.
- Configuracao de Tailwind CSS para estilizacao.
- React Router v7 para navegacao SPA.
- Servicos de API em `src/services/`:
  - `authService.ts` — Autenticacao JWT com login e registo.
  - `contentService.ts` — CRUD de conteudos e cursos.
  - `dashboardService.ts` — Estatisticas de Aprendiz e Criador.
  - `quizService.ts` — Geracao e submissao de quizzes.
  - `rankingService.ts` — Leaderboard global.
- Paginas implementadas:
  - `LandingPage.tsx` — Pagina inicial com suporte a dark mode.
  - `Login.tsx` e `Register.tsx` — Autenticacao completa.
  - `DashboardAprendiz.tsx` e `DashboardCriador.tsx` — Dashboards diferenciados por role.
  - `Marketplace.tsx` — Listagem de cursos com filtros.
  - `Quiz.tsx` — Interface interativa de quizzes com timer.
  - `Ranking.tsx` — Leaderboard com indicadores de tendencia.
- Dark mode global com persistencia via ThemeContext.
- Componentes reutilizaveis: `Card`, `Button`, `Header`, `Footer`, `Logo`.
- Design responsivo mobile-first.
- Routing com proteccao por role via `ProtectedRoute`.

### Corrigido

- Links de navegacao do Dashboard que geravam erros 404.
- Erros de compilacao TypeScript em multiplas paginas.
- Configuracao de proxy Vite para API local.
- Imports em falta de icones Lucide.

### Alterado

- `dashboardService` actualizado para consumir endpoints reais do backend.
- `rankingService` ligado ao endpoint `/rankings/global/`.
- `quizService` integrado com o backend para submissao real de respostas.

---

_Changelog mantido pela equipa de Frontend do KOMBINU._
_Ultima actualizacao: 31 de Maio de 2026_
