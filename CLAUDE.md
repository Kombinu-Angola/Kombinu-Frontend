# KOMBINU Frontend

SPA educacional gamificada (Criadores e Aprendizes), em expansão para B2B (instituições) + B2C (marketplace).
Prod: kombinu.vercel.app · Backend (repo separado `backend/`): kombinu.onrender.com (Django 4.2 + DRF, Swagger em /api/docs/).
Padrões vigentes: SLA v2.0.0 (Fase de Expansão B2B/B2C, 17 Ago–6 Nov 2026), ficheiro `docs/SLA-KOMBINU-Fase-Expansao-B2B-B2C.md` na pasta-mãe.

## 🔒 Segurança — prioridade máxima
Antes de qualquer outra convenção deste ficheiro: segurança da plataforma e dos dados dos utilizadores é a prioridade número um, acima de prazos, estética ou conveniência. Em qualquer tarefa, mesmo uma que pareça só visual:
- Nunca expor segredos, tokens, chaves de API ou credenciais no código, em commits, logs ou mensagens de erro. Nada de segredos hardcoded — sempre via variáveis de ambiente.
- Tratar tudo o que vem do backend ou do utilizador como não confiável: validar, sanitizar e nunca assumir a forma da resposta.
- Toda a comunicação com o backend continua a passar por `src/services/` — nunca lógica de auth/token duplicada num componente.
- Nunca ampliar a superfície de risco actual (tokens em localStorage, isolamento multi-tenant, etc.) sem sinalizar o CTO; qualquer mudança que toque em autenticação, tokens, permissões (`ProtectedRoute`, `allowedRoles`) ou isolamento entre workspaces B2B/B2C precisa de aprovação explícita do CTO antes de avançar.
- Se, ao trabalhar noutra tarefa, encontrares uma falha de segurança (token exposto, endpoint sem protecção, dados a vazar entre utilizadores/tenants), pára e reporta antes de continuar — não é para "resolver depois".
- Nas PRs multi-tenant (Fase 2 da SLA), o isolamento de dados entre tenants é sempre verificado e documentado, nunca assumido.

## Stack
React 18.3 · TypeScript 5.5 · Vite 5.4 · Tailwind 3.4 (tailwind.config.js, directivas @tailwind) · react-router-dom 7 · axios · lucide-react (único pacote de ícones) · Playwright.
npm apenas. Alias `@` → `src/`. Não instalar libs de UI/ícones sem aprovação do CTO.

## Comandos
npm run dev | build (não valida tipos) | lint | test:e2e
npx tsc -p tsconfig.app.json --noEmit
Env: .env.example → .env.local (VITE_API_URL, VITE_ENV).

## Estrutura (src/)
routes/ · pages/ (export default) · components/{layout,ui,auth,debug} · contexts/{Auth,Theme} · services/ · hooks/ · utils/ · types/index.ts
LEGADO (não usar): DataContext, useContent, useProgress, storageService, progressService.

## API e auth
- Só via `src/services/` com a instância `api` (services/api.ts). Nunca axios/api dentro de componentes.
- JWT em localStorage (accessToken, refreshToken); utilizador em 'kombinu_usuario'. Interceptor: Bearer, 401 → refresh, falha/403 → forceLogout.
- Backend: `user_type` = creator|learner (mapeado para criador|aprendiz); `admin` ainda não existe no backend.
- Refresh no backend é POST /api/auth/token/refresh/ (o frontend usa /auth/refresh/ — bug conhecido).
- Resposta de submit de quiz traz a chave `"xp earned"` (com espaço). Nível = XP//100 + 1.
- Contrato: usar /api/schema/ (Swagger). O Kombinu API.yaml e o README do backend estão desactualizados.
- Novos domínios previstos: trilhaService, enqueteService, workspaceService. Manter mocks como fallback se o backend faltar.

## Convenções
- Português em identificadores do domínio, comentários e UI. Sem `any`, sem código comentado, sem console.log (usar utils/logger). Tipos em types/index.ts.
- try/catch em todo async e feedback ao utilizador em falhas. Loading com spinner `animate-spin`.
- Tailwind apenas, sem style={{}} (padrão BarraDinamica). Todo o componente novo com `dark:`; testar a 375px.
- Fontes (SLA): font-montserrat títulos, font-lato corpo, font-poppins botões. Base visual do redesenho vem de templates/ (extrair padrões, nunca copiar código).
- Acessibilidade: alt descritivo, aria-label em botões só com ícone, contraste WCAG AA.
- Workspaces B2B/B2C: notificações do marketplace silenciadas no workspace escolar; um só login.

## Git
- Conventional Commits em português sem acentos; escopos: landing, auth, dashboard, marketplace, quiz, ranking, content, layout, ui, theme, workspace.
- Branch a partir de `develop` (feature|fix|chore|hotfix/kebab-case). Nunca push directo para main/develop. `git rebase origin/develop` antes do PR. Squash merge; só o CTO faz merge.
- PR com .github/pull_request_template.md, screenshots em mudanças visuais, CHANGELOG.md actualizado (secção "Nao Lancado").
- Nunca adicionar Claude como co-author nos commits deste projecto.

## Dívida conhecida (não corrigir sem pedido)
tsc e lint têm erros pré-existentes (não acrescentar novos) · Tailwind v4 instalado mas não usado · /dashboard/admin depende de DataProvider não montado e de um role que o backend não tem · Ranking.tsx chama a API directamente · refresh de token com URL errado · playwright-report/ e test-results/ versionados.
