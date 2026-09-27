# Integracao das telas React no Kombinu-Frontend

Guia de colocacao das 39 telas convertidas dos ficheiros HTML de design.
Complemento de `CLAUDE.md` (convencoes) e de `docs/kombinu-mapeamento.md` (mapa de produto e roadmap).

---

## 1. Decisoes bloqueantes

| # | Decisao | Porque bloqueia | Sugestao |
| --- | --- | --- | --- |
| 1 | Tailwind 3.4 ou 4 | As telas usam sintaxe exclusiva da v4 (`@theme`, `size-*`, `has-[...]`, `field-sizing-content`, `text-balance`) | Activar o `@tailwindcss/vite` (ja instalado) e manter a paleta antiga com `@config "../tailwind.config.js"` |
| 2 | `features/` ou `pages/` | O `CLAUDE.md` fixa `pages/`; as telas vem organizadas por dominio | Manter `features/` e registar o desvio no `CLAUDE.md` |
| 3 | Tipografia e tema escuro | SLA manda Montserrat/Lato/Poppins; o design system manda Montserrat/Rubik. As telas novas nao tem `dark:` | Decisao de design + um bloco de trabalho so para o tema escuro |

---

## 2. Mapa de colocacao

| Do pacote | Destino | Accao |
| --- | --- | --- |
| `src/styles/tokens.css` | `src/index.css` | Fundir, nao substituir |
| `src/lib/cn.ts` | — | Nao copiar; usar `@/lib/utils` |
| `src/lib/format.ts`, `levels.ts` | `src/lib/` | Copiar |
| `src/hooks/` (9) | `src/hooks/` | Copiar |
| `src/context/GamificationContext.tsx` | `src/contexts/` | Copiar |
| `src/components/ui/` (28) | `src/components/ui/` | Copiar, excepto `Card.tsx` |
| `src/components/charts/` | `src/components/charts/` | Copiar |
| `src/components/app/`, `admin/`, `creator/` | `src/components/layout/` | Copiar |
| `src/features/*` | `src/features/` | Copiar (decisao 2) |
| `src/features/creator/api.ts` | `src/services/creatorService.ts` | Reescrever com a instancia `api` |
| `src/assets/assets3d.ts` | `src/lib/assets3d.ts` | Copiar |
| `public/assets/` | `public/assets/` | Copiar |
| `App.tsx`, `main.tsx`, `index.html`, `package.json`, `tsconfig*`, `vite.config.ts` | — | Nao copiar; so referencia |

---

## 3. Colisoes de nomes

| Conflito | Resolucao |
| --- | --- |
| `components/ui/Card.tsx` nos dois | Renomear o novo para `SectionCard.tsx` |
| `lib/cn.ts` vs `lib/utils.ts` | Apagar o novo, importar de `@/lib/utils` |
| `Toast.tsx` vs `sonner` | Usar `sonner`; `useToast` passa a involucro |
| `Icon.tsx` vs `lucide-react` | Mapear os nomes do `Icon` para componentes lucide |
| `Button3D` vs `Button` | Decidir qual e o canonico |
| Tipos por funcionalidade vs `types/index.ts` | Contratos de API centralizados; mocks locais |
| `AuthScreen` com callbacks proprios | Ligar a `AuthContext` e `authService` |

---

## 4. Telas novas que substituem paginas existentes

| Pagina actual | Tela nova |
| --- | --- |
| `pages/Login.tsx` | `features/auth/AuthScreen` |
| `pages/DashboardAprendiz.tsx` | `features/dashboard/DashboardScreen` + `feed/StudyFeedScreen` |
| `pages/DashboardCriador.tsx` | `features/creator-finance/CreatorFinanceScreen` |
| `pages/Marketplace.tsx` | `features/marketplace/MarketplaceScreen` |
| `pages/Quiz.tsx` | `quiz/DiagnosticQuizScreen` + `challenge/ChallengeQuizScreen` |
| `pages/Ranking.tsx` | `features/leagues/LeaguesScreen` |
| `pages/CriarConteudo.tsx` | `features/studio/StudioScreen` |
| `pages/VisualizarConteudo.tsx` | `features/reading/ReadingPlayerScreen` |
| `pages/PainelAdmin.tsx` | Os seis ecras de `features/admin/` |
| `pages/Register.tsx` | Fluxos de onboarding |
| `pages/LandingPage.tsx` | Sem equivalente |

Estrategia sugerida: manter as paginas antigas a funcionar e montar as novas em rotas paralelas (`/v2/...`), trocando uma a uma. Substituir tudo de uma vez quebra os testes Playwright de login.

---

## 5. Ordem de integracao

| # | Branch | Commit | Conteudo |
| --- | --- | --- | --- |
| 1 | `chore/tailwind-v4` | `chore(ui): migrar para tailwind v4 mantendo config legado` | `vite.config.ts`, `index.css`, PostCSS |
| 2 | `feat/design-tokens` | `feat(theme): tokens do design system kombinu` | Tokens, `lib/format`, `lib/levels` |
| 3 | `feat/ui-base` | `feat(ui): componentes base do design system` | `components/ui/`, `charts/` |
| 4 | `feat/hooks-gamificacao` | `feat(ui): hooks partilhados e contexto de gamificacao` | `hooks/`, `contexts/` |
| 5 | `feat/layout-shells` | `feat(layout): molduras de estudante, criador e backoffice` | `components/layout/` |
| 6 | `feat/content-blocks` | `feat(content): modelo de conteudo em blocos` | `features/content/`, `quiz/` |
| 7 | `feat/auth-onboarding` | `feat(auth): entrada por sms e onboarding` | `auth/`, `onboarding/`, `creator/` |
| 8 | `feat/aprendiz-telas` | `feat(dashboard): feed, leitura e gamificacao` | `feed/`, `course/`, `reading/`, `dashboard/`, `challenge/`, `leagues/`, `streak/`, `profile/` |
| 9 | `feat/marketplace-criador` | `feat(marketplace): vitrine, compra e estudio` | `marketplace/`, `document/`, `creator-public/`, `creator-finance/`, `studio/`, `subscription/` |
| 10 | `feat/backoffice` | `feat(dashboard): backoffice administrativo` | `features/admin/` |
| 11 | `feat/rotas-v2` | `feat(layout): rotas das novas telas` | `routes/index.tsx` |
| 12 | `docs/telas-react` | `docs: mapeamento de telas e assets 3d` | `docs/` |

Os escopos `admin`, `estudio`, `ligas` e `pagamentos` nao existem na lista do `CLAUDE.md`. Se forem precisos, actualizar o ficheiro com o CTO.

---

## 6. Depois de integrar

- Gerar os 20 assets 3D com os prompts de `ASSETS-3D.md` e colocar em `public/assets/3d/`. Ate la, cada ilustracao cai para um icone SVG.
- Substituir cada `mock*.ts` pelo servico correspondente.
- Acrescentar variantes `dark:` a todas as telas novas.
- Correr a auditoria de acessibilidade (axe-core) depois da migracao do Tailwind: a mudanca de versao pode alterar contrastes.
