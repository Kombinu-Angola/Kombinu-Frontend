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

- Ecras de sistema (`features/system/`): `OfflineScreen` (sem ligacao, mostra o que continua a funcionar) e `RecoveryScreens` (`SessionExpiredScreen` — reentrada por SMS sem perder o sitio; `NotFoundScreen` — 404 com atalhos de volta). Novas rotas: `/v2/offline`, `/v2/sessao-expirada`, `/v2/404`. `lib/assets3d.ts`: novo asset `kombi-offline`.
- Definicoes da conta do estudante (`features/account/`: `StudentSettingsScreen`, `PhoneSecurityScreen`), trilha de aprendizagem e trilha mista adaptativa (`features/trail/`: `LearningTrailScreen`, `AdaptiveTrailScreen`), resultado da homologacao de criador (`features/creator/HomologationResultScreen`) e falha de renovacao da subscricao Pro (`features/subscription/RenewalFailureScreen`). Novas rotas: `/v2/definicoes`, `/v2/conta/telemovel`, `/v2/trilha`, `/v2/trilha/mista`, `/v2/estudio/homologacao` (+ `/correcao`), `/v2/estudio/renovacao`.
- `CourseScreen` ganha atalho "Ver a trilha completa"; `StudentProfileScreen` ganha atalho "Definições".
- Biblioteca do estudante (`features/library/`: `StudentLibraryScreen`, `OfflineDownloadsScreen`), historico de compras e recibos (`features/purchases/PurchaseHistoryScreen`) e gestao de materiais do criador (`features/creator-content/`: `CreatorContentHubScreen`, `PricingModal`) e fila de homologacao de criadores no backoffice (`features/admin/CreatorQueueScreen`) — pecas identificadas em falta no `docs/kombinu-mapeamento.md`. Novas rotas em `routes/v2.tsx`: `/v2/biblioteca`, `/v2/biblioteca/descargas`, `/v2/perfil/compras`, `/v2/estudio/materiais`, `/v2/admin/criadores`.
- `AppShell`/`CreatorShell`/`AdminShell`: novos itens de navegacao para as telas acima; `StudentProfileScreen` ganha atalhos para compras e biblioteca; `StudioScreen` mostra o `PricingModal` (preco e visibilidade) antes de publicar.
- `lib/format.ts`: `formatSize` (KB/MB/GB), usado pelos ecras de biblioteca e materiais.
- Integracao das 39 telas novas (docs/kombinu-mapeamento.md) em rotas paralelas `/v2/*`, sem tocar nas paginas e rotas actuais: `src/features/*` (20 dominios), `src/components/{ui,layout,charts}` do design system, `src/lib/{format,levels,assets3d}`, `src/contexts/GamificationContext`, `src/routes/v2.tsx` + `src/routes/V2Layout.tsx` (intercetor de navegacao interna e sessao de gamificacao partilhada). Detalhe completo em `docs/INTEGRACAO-TELAS.md`.
- `src/services/creatorService.ts`: envio real do credenciamento de criador (multipart, `/creators/applications/`) usando a instancia `api` partilhada.
- Migracao para Tailwind v4 (`@tailwindcss/vite`), mantendo a paleta e as cores legadas via `@config`.

### Corrigido

- Botao "Comecar a ler" no fim do onboarding apontava para um caminho inexistente (`/resumos/taxa-bna`); corrigido para `/v2/leitura`.
- Botoes (`Button3D`/`LinkButton3D`) usavam `font-lato` em vez de `font-poppins` (SLA 7.3: hierarquia de fontes obrigatoria para CTAs).
- 4 ocorrencias de `window.location.hash = "#/..."` (nao navegam sob rotas por path): `CreatorShell`, `SubscriptionFlow`, `CreatorContentHubScreen`, `PurchaseHistoryScreen` -- trocadas por `window.location.assign`.
- `src/components/ui/sonner.tsx`: nomes de icones lucide-react inexistentes na versao instalada (`CircleCheckIcon` etc.) corrigidos; o `<Toaster />` estava definido mas nunca montado -- montado agora em `App.tsx`.
- `tsconfig.app.json`: `DOM.Iterable` em falta na `lib` (necessario para iterar `NodeListOf`).

### Adicionado

- `CriarConteudo.tsx`: botao "Gerar com IA" agora guarda o conteudo e chama `/quizzes/contents/<id>/generate-quiz/` (OpenTDB); trata erros 503 (rate limit) com mensagem explicativa (S3-09).
- `quizService.ts`: descodificacao automatica de URL encoding (`%20`, `%2C`, etc.) nas perguntas e opcoes ao carregar o quiz — garante compatibilidade enquanto o backend usa `encode=url3986` da OpenTDB.
- `Quiz.tsx`: classe `break-words` adicionada ao titulo da pergunta para evitar que textos longos ultrapassem os limites do ecra em dispositivos moveis.
- `Ranking.tsx`: podio visual para o top 3 com coroa, medalhas e blocos de altura diferenciada; header com gradiente azul/indigo; empty state quando sem dados (S3-05/S3-06).
- `index.html`: meta tags SEO completas — description, keywords, Open Graph (og:title, og:description, og:type, og:locale), theme-color e novo titulo "Aprende. Compete. Cresce." (S3-11).
- `Quiz.tsx`: ecra de resultados redesenhado com 3 cards de estatisticas (Correctas / Precisao / XP ganhos), barra de progresso animada e faixa de cor no topo (S3-01).
- `api.ts`: tratamento do erro 403 com forceLogout automatico, prevenindo estados inconsistentes na sessao (S2-19).
- `VisualizarConteudo.tsx`: aviso em amarelo quando `quiz_id` e nulo mas `has_quiz` e verdadeiro, evitando navegacao para URL errado (S2-16).

### Alterado

- `contentService.ts`: mapeamento completo de campos do backend — `video_url` -> `videoUrl`, `text_content` -> `textContent`, objecto `creator` -> `creatorName`; categorias reais do backend (`tecnologia`, `negocios`, `design`) com labels em portugues (S2-20).
- `Marketplace.tsx`: filtros de categoria agora usam valores reais do backend com labels formatadas; botoes com `type="button"` (S2-20).
- `authService.ts`: login le `pontos` e `nivel` reais do backend em vez de inicializar a 0 e 1.
- `Quiz.tsx`: `atualizarPontos` chamado apos submissao bem-sucedida para reflectir XP em tempo real no dashboard (S2-18); `handleSubmitQuiz` envolto em `useCallback` eliminando warnings de dependencias no `useEffect` do timer (S3-04).
- `DashboardAprendiz.tsx`: threshold de nivel corrigido de 1000 para 100 pontos, alinhado com formula do backend `(total_points // 100) + 1`; barras de progresso migradas para `BarraDinamica` (useRef+useEffect) eliminando inline styles (S2-02).
- `Ranking.tsx`: formula de nivel corrigida de `/ 1000` para `/ 100` para consistencia com o backend.
- `package.json` e `pnpm-lock.yaml`: dependencia `motion` (Framer Motion) nao utilizada removida; `pnpm-lock.yaml` eliminado para evitar conflito de package manager no build do Vercel.

### Corrigido

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
