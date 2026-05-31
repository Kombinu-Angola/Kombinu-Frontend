# SLA — Frontend KOMBINU · AngoTic 2026

**Documento:** Sprint Agreement & Development Standards
**Versao:** 1.0.0
**Data de Emissao:** 24 de Maio de 2026
**Validade:** 24 Mai - 13 Jun 2026 (3 semanas)
**Emitido por:** Anderson Cafurica — TechLead / CTO
**Destinatarios:** Carlos Avelino · Augusto Manuel
**Revisao:** Este documento deve ser lido, compreendido e confirmado por ambos os developers antes do inicio do sprint.

---

## Indice

1. [Contexto e Objectivo](#1-contexto-e-objectivo)
2. [Equipa e Papeis](#2-equipa-e-papeis)
3. [Padroes de Controlo de Versao (Git)](#3-padroes-de-controlo-de-versao-git)
4. [Convencao de Commits](#4-convencao-de-commits)
5. [Processo de Pull Request](#5-processo-de-pull-request)
6. [Padroes de Codigo](#6-padroes-de-codigo)
7. [Cronograma de Tarefas — 3 Semanas](#7-cronograma-de-tarefas--3-semanas)
8. [Definicao de Pronto (Definition of Done)](#8-definicao-de-pronto-definition-of-done)
9. [Gestao de Ambientes](#9-gestao-de-ambientes)
10. [Gestao do Changelog](#10-gestao-do-changelog)
11. [Comunicacao e Escalamento](#11-comunicacao-e-escalamento)
12. [Riscos e Mitigacoes](#12-riscos-e-mitigacoes)
13. [Confirmacao de Leitura](#13-confirmacao-de-leitura)
14. [Anexos](#14-anexos)

---

## 1. Contexto e Objectivo

O KOMBINU participara na **AngoTic 2026**, a maior feira de tecnologia e inovacao de Angola, em **13 de Junho de 2026**. Para esse evento, e necessario apresentar um MVP funcional, visualmente impactante e tecnicamente robusto, capaz de demonstrar o valor da plataforma para potenciais investidores, parceiros e utilizadores.

Este documento estabelece os acordos de trabalho, padroes tecnicos e cronograma de entregaveis que a equipa de frontend devera seguir durante as tres semanas de sprint.

### Criterios de Sucesso

| Criterio | Meta |
|----------|------|
| Todas as paginas com novo design aplicado | 100% |
| Fluxo completo funcional (registo, quiz, ranking) | Sem erros criticos |
| Comunicacao com backend estavavel | 0 erros 500 durante a demo |
| Performance de carregamento | Primeira carga abaixo de 3 segundos |
| Responsividade mobile | Todas as paginas |
| Dark mode consistente | Todas as paginas |

---

## 2. Equipa e Papeis

### Carlos Avelino — Frontend Developer Junior

- **Nivel actual:** Em aprendizagem de React
- **Semana 1:** Emparelhamento (pair programming) com Augusto — foco em aprendizagem e tarefas guiadas
- **Semanas 2 e 3:** Tarefas de complexidade progressiva com suporte do Augusto
- **Responsabilidade:** Executar tarefas atribuidas, pedir ajuda proactivamente, nunca bloquear o sprint em silencio

### Augusto Manuel — Frontend Developer Senior

- **Nivel actual:** React experiente
- **Semana 1:** Mentor do Carlos e execucao das tarefas de maior impacto visual
- **Semanas 2 e 3:** Liderar integracoes complexas, rever o trabalho do Carlos
- **Responsabilidade:** Garantir qualidade tecnica, guiar o Carlos, manter o ritmo do sprint

### Anderson Cafurica — TechLead / CTO

- **Funcao:** Aprovacao de PRs, decisoes de arquitectura, revisao de codigo, merge para `develop` e `main`
- **Disponibilidade para review:** Resposta em ate 24 horas uteis apos PR aberto
- **Responsabilidade:** Aprovar ou solicitar alteracoes em todos os PRs. Nenhum codigo vai para `develop` ou `main` sem aprovacao do CTO

### Orlando Fortuna — CEO / Design Lead

- **Funcao:** Fonte da nova paleta de cores e guidelines de design
- **Entregavel esperado:** Ficheiro de design (Figma ou PDF) com paleta, tipografia e mockups ate 26 de Maio
- **Ponto de contacto para duvidas de design:** Directo com Orlando antes de implementar qualquer alteracao visual

---

## 3. Padroes de Controlo de Versao (Git)

### 3.1 Estrategia de Branches (Git Flow Simplificado)

```
main
 +-- develop
      +-- feature/nome-da-feature
      +-- fix/nome-do-bug
      +-- chore/nome-da-tarefa
      +-- hotfix/nome-do-hotfix     (apenas em emergencias, a partir da main)
```

| Branch | Descricao | Quem pode fazer merge |
|--------|-----------|-----------------------|
| `main` | Producao (Vercel). Codigo estavavel e revisto. | Apenas CTO |
| `develop` | Staging e integracao. Codigo testado e aprovado. | Apenas CTO |
| `feature/*` | Nova funcionalidade ou melhoria visual | Developer via PR para `develop` |
| `fix/*` | Correccao de bug nao critico | Developer via PR para `develop` |
| `chore/*` | Manutencao: configs, dependencias, documentacao | Developer via PR para `develop` |
| `hotfix/*` | Correccao critica em producao | Apenas com autorizacao do CTO |

### 3.2 Regras Obrigatorias

- NUNCA fazer `push` directo para `main` ou `develop`
- NUNCA fazer `git push --force` sem autorizacao explicita do CTO
- SEMPRE criar uma branch antes de qualquer trabalho
- SEMPRE abrir um PR e aguardar aprovacao antes do merge
- SEMPRE fazer `git pull origin develop` antes de criar uma nova branch

O incumprimento destas regras sera tratado como falta grave de processo.

### 3.3 Nomenclatura de Branches

Formato obrigatorio: `tipo/descricao-curta-em-kebab-case`

```
# Exemplos correctos
feature/nova-paleta-de-cores
feature/landing-page-hero-redesign
feature/dashboard-aprendiz-stats
fix/quiz-timer-auto-submit
fix/auth-token-refresh
chore/atualizar-tailwind-config
chore/adicionar-pr-template

# Exemplos incorrectos
MinhaFeature            (sem tipo, sem kebab-case)
fix                     (demasiado generico)
feature/update          (demasiado vago)
correcao-de-bug         (sem prefixo de tipo)
```

### 3.4 Fluxo de Trabalho Diario

```bash
# Passo 1: Sincronizar com develop antes de comecar
git checkout develop
git pull origin develop

# Passo 2: Criar a branch da tarefa
git checkout -b feature/nome-da-feature

# Passo 3: Trabalhar e commitar regularmente (ver seccao 4)
git add .
git commit -m "feat(landing): adicionar seccao de testemunhos"

# Passo 4: Antes de abrir PR, sincronizar com develop
git fetch origin
git rebase origin/develop

# Passo 5: Push e abrir PR no GitHub
git push origin feature/nome-da-feature
# Abrir PR para a branch develop no GitHub
```

---

## 4. Convencao de Commits

A equipa segue o padrao **Conventional Commits** (https://www.conventionalcommits.org).

### 4.1 Formato

```
<tipo>(<escopo>): <descricao curta em imperativo>

[corpo opcional — o que foi feito e porque, nao o como]

[rodape opcional — referencias ou breaking changes]
```

### 4.2 Tipos de Commit

| Tipo | Quando usar | Exemplo |
|------|-------------|---------|
| `feat` | Nova funcionalidade | `feat(quiz): adicionar countdown timer` |
| `fix` | Correccao de bug | `fix(auth): corrigir loop de redirect no login` |
| `style` | Mudancas visuais ou CSS apenas | `style(landing): aplicar nova paleta do CEO` |
| `refactor` | Refactoring sem alterar comportamento | `refactor(services): extrair logica de autenticacao` |
| `chore` | Configuracoes, dependencias, scripts | `chore: actualizar tailwind para v3.4` |
| `docs` | Documentacao | `docs: adicionar guia de setup no README` |
| `perf` | Melhoria de performance | `perf(marketplace): implementar lazy load de imagens` |
| `test` | Adicionar ou corrigir testes | `test(quiz): testar submissao automatica por tempo` |

### 4.3 Escopos Recomendados

`landing`, `auth`, `dashboard`, `marketplace`, `quiz`, `ranking`, `content`, `layout`, `api`, `ui`, `theme`

### 4.4 Exemplos de Commits Correctos

```
feat(landing): adicionar seccao de testemunhos com animacoes
fix(quiz): corrigir submissao automatica quando o tempo acaba
style(dashboard): aplicar nova paleta de cores ao header
refactor(auth): mover logica de token para authService
chore(deps): actualizar axios de 1.4 para 1.6
docs(readme): adicionar instrucoes de setup do ambiente local
perf(marketplace): implementar lazy loading nas thumbnails
```

### 4.5 Exemplos de Commits Incorrectos

```
update files                (demasiado vago)
fix bug                     (sem escopo, sem descricao util)
WIP                         (nunca commitar WIP directamente)
alteracoes no dashboard     (sem tipo, sem convencao)
FEAT: Nova Feature          (maiusculas incorrectas)
```

### 4.6 Commits Atomicos

Cada commit deve representar uma unica mudanca logica. Nao acumular varias features ou correccoes num so commit. Se o titulo do commit precisar da palavra "e" para descrever tudo, provavelmente sao dois commits separados.

---

## 5. Processo de Pull Request

### 5.1 Quando Abrir um PR

- Ao concluir uma feature, fix ou chore completa, ou uma parte significativa e funcional da mesma
- Nunca abrir PR com codigo que nao compila ou que quebra a aplicacao
- Sempre fazer self-review antes de submeter

### 5.2 Template de Descricao de PR

O repositorio ja contem o ficheiro `.github/pull_request_template.md`. Todos os PRs devem preencher esse template na integra.

### 5.3 Regras para o Reviewer (CTO)

- Review em ate 24 horas uteis apos abertura do PR
- Aprovar com comentario "Aprovado" ou solicitar alteracoes com comentarios claros e accionaveis
- Merge apenas apos todos os items do checklist estarem cumpridos
- Squash merge preferivel para manter historico limpo em `develop`

### 5.4 Configuracoes de Proteccao no GitHub

As seguintes proteccoes devem ser configuradas nas branches principais:

- `main` e `develop`: Require pull request reviews before merging (1 aprovacao minima — CTO)
- `main` e `develop`: Require status checks to pass (build sem erros)
- `main` e `develop`: Restrict who can push (apenas Anderson Cafurica)

---

## 6. Padroes de Codigo

### 6.1 Regras Gerais

- **Idioma do codigo:** Portugues para variaveis, comentarios e mensagens de UI, conforme o padrao ja existente no projecto
- **TypeScript:** Sem `any` implicito; definir interfaces em `src/types/index.ts`
- **Sem codigo comentado:** Remover blocos de codigo comentados antes do PR (o historico Git serve esse proposito)
- **Sem `console.log` em producao:** Usar `src/utils/logger.ts` para logging

### 6.2 Estrutura de Componentes

```typescript
// Ordem recomendada dentro de um componente:
// 1. Imports externos
// 2. Imports internos
// 3. Interfaces e Types locais
// 4. Componente: hooks no topo, logica, return com JSX
// 5. Export default

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface MinhaProps {
  titulo: string;
  onAccao: () => void;
}

export default function MeuComponente({ titulo, onAccao }: MinhaProps) {
  const { usuario } = useAuth();
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    // logica de efeito
  }, []);

  return (
    // JSX aqui
  );
}
```

### 6.3 Comunicacao com o Backend

- Toda a comunicacao com o backend passa pelos ficheiros em `src/services/`
- Nunca chamar `axios` ou a instancia `api` directamente num componente — sempre via service
- Tratar erros em todos os blocos `async/await` com `try/catch`
- Exibir mensagem de erro amigavel ao utilizador quando uma chamada falha
- Nunca deixar o utilizador sem feedback quando algo corre mal

### 6.4 Estilos

- Usar apenas Tailwind CSS e as classes utilitarias existentes em `src/index.css`
- Nao instalar novas bibliotecas de UI ou icones — apenas Lucide React esta autorizado
- Todos os novos componentes devem suportar dark mode com classes `dark:`
- Hierarquia de fontes obrigatoria:
  - `font-montserrat` para titulos (h1, h2, h3 e metricas numericas)
  - `font-lato` para corpo de texto, descricoes e labels
  - `font-poppins` para botoes e CTAs
- Usar as classes utilitarias `dark-bg-primary`, `dark-text-primary`, etc. ja existentes

### 6.5 Acessibilidade Minima

- Todos os elementos `<img>` com atributo `alt` descritivo e nao vazio
- Todos os botoes com texto visivel ou atributo `aria-label`
- Contraste de cores suficiente de acordo com WCAG AA
- Navegacao por teclado funcional em todos os formularios

---

## 7. Cronograma de Tarefas — 3 Semanas

**Legenda de Prioridade:** [ALTA] Alta prioridade · [MEDIA] Media prioridade · [BAIXA] Baixa prioridade
**Responsaveis:** AA = Augusto Manuel · CA = Carlos Avelino · AA+CA = Pair Programming

---

### SEMANA 1 — 26 Mai a 30 Mai | Fundacao e Design System

**Foco:** Onboarding do Carlos no React, setup do ambiente, implementacao do novo Design System do CEO e inicio do redesign da Landing Page.

Nota: As tarefas visuais desta semana dependem do ficheiro de design do CEO Orlando Fortuna, esperado ate 26 de Maio. Em caso de atraso no ficheiro de design, iniciar com as tarefas de setup e integracao.

#### Tarefas de Setup — Dia 1 (26 Mai) — AA + CA

| ID | Tarefa | Branch Sugerida | Prioridade |
|----|--------|-----------------|------------|
| S1-01 | Configurar proteccoes de branch no GitHub (main e develop) | `chore/branch-protection` | [ALTA] |
| S1-02 | Adicionar template de PR ao repositorio (`.github/pull_request_template.md`) | `chore/pr-template` | [ALTA] |
| S1-03 | Actualizar `CHANGELOG.md` com formato Keep a Changelog e remover emojis do historico | `chore/changelog-update` | [ALTA] |
| S1-04 | Actualizar `README.md` com instrucoes de setup, scripts e arquitectura | `chore/readme-update` | [MEDIA] |
| S1-05 | Criar `.env.example` com as variaveis de ambiente necessarias documentadas | `chore/env-example` | [ALTA] |

#### Design System — Nova Paleta do CEO — Dias 2 a 5 — AA lidera, CA assiste

| ID | Tarefa | Branch Sugerida | Prioridade |
|----|--------|-----------------|------------|
| S1-06 | Actualizar `tailwind.config.js` com nova paleta de cores do CEO | `feature/nova-paleta-cores` | [ALTA] |
| S1-07 | Actualizar variaveis CSS em `src/index.css` para modo claro e escuro | `feature/nova-paleta-cores` | [ALTA] |
| S1-08 | Rever e actualizar componentes `Button`, `Card` e `Logo` com novas cores | `feature/design-system-update` | [ALTA] |
| S1-09 | Garantir consistencia visual em `Header` e `Footer` | `feature/design-system-update` | [ALTA] |

#### Landing Page — Inicio do Redesign — Dias 3 a 5 — AA lidera, CA acompanha

| ID | Tarefa | Branch Sugerida | Prioridade |
|----|--------|-----------------|------------|
| S1-10 | Redesenhar seccao Hero com nova paleta e copy revisto | `feature/landing-hero-redesign` | [ALTA] |
| S1-11 | Adicionar seccao de Testemunhos (ausente no codigo actual apesar de constar no menu) | `feature/landing-testemunhos` | [ALTA] |
| S1-12 | Adicionar seccao de Contacto e melhorar o Footer | `feature/landing-contacto` | [MEDIA] |
| S1-13 | Verificar e corrigir navegacao mobile (menu hamburger se necessario) | `fix/landing-mobile-nav` | [ALTA] |

#### Plano de Aprendizagem do Carlos — Todos os dias da Semana 1

| Topico | Descricao |
|--------|-----------|
| React Fundamentals | `useState`, `useEffect`, props e componentes — com exemplos no projecto real |
| React Router | Como funciona o routing, `ProtectedRoute` e navegacao programatica |
| Context API | Compreender `AuthContext` e `ThemeContext` e como consumi-los |
| Tailwind e Dark Mode | Como aplicar as classes e o sistema de dark mode existente |
| Git Workflow | Praticar o fluxo: branch, commit, push, PR com as tarefas de setup acima |

---

### SEMANA 2 — 2 Jun a 6 Jun | Paginas Internas e Integracao

**Foco:** Actualizacao de todas as paginas internas, correccao de integracoes com o backend e melhoria dos dashboards.

#### Dashboard Aprendiz — AA

| ID | Tarefa | Branch Sugerida | Prioridade |
|----|--------|-----------------|------------|
| S2-01 | Corrigir barra de progresso "Proximo Nivel" (actualmente hardcoded a 75%) | `fix/dashboard-nivel-progress` | [ALTA] |
| S2-02 | Actualizar design dos cards de estatisticas com nova paleta | `style/dashboard-aprendiz-redesign` | [ALTA] |
| S2-03 | Adicionar skeleton loading nos cards de estatisticas durante carregamento | `feature/dashboard-skeleton-loading` | [MEDIA] |
| S2-04 | Tratar falha do backend com mensagem amigavel ao utilizador | `fix/dashboard-error-handling` | [ALTA] |

#### Dashboard Criador — AA

| ID | Tarefa | Branch Sugerida | Prioridade |
|----|--------|-----------------|------------|
| S2-05 | Corrigir `totalLikes` hardcoded a 0 — buscar valor real do backend | `fix/dashboard-criador-likes` | [MEDIA] |
| S2-06 | Actualizar design da lista de conteudos com nova paleta | `style/dashboard-criador-redesign` | [ALTA] |
| S2-07 | Adicionar dialogo de confirmacao antes de gerar Quiz por IA | `feat/quiz-ia-confirmacao` | [MEDIA] |
| S2-08 | Melhorar mensagem de erro na geracao de quiz por IA | `fix/quiz-ia-error-message` | [MEDIA] |

#### Marketplace (/courses) — CA com suporte de AA

| ID | Tarefa | Branch Sugerida | Prioridade |
|----|--------|-----------------|------------|
| S2-09 | Actualizar cards de conteudo com nova paleta e layout melhorado | `style/marketplace-card-redesign` | [ALTA] |
| S2-10 | Adicionar estado de lista vazia (empty state) quando nao ha conteudos | `feat/marketplace-empty-state` | [MEDIA] |
| S2-11 | Melhorar UI dos filtros de categoria | `style/marketplace-filtros` | [MEDIA] |
| S2-12 | Implementar lazy loading nas thumbnails dos conteudos | `perf/marketplace-lazy-images` | [MEDIA] |

#### Visualizar Conteudo (/courses/:id) — CA

| ID | Tarefa | Branch Sugerida | Prioridade |
|----|--------|-----------------|------------|
| S2-13 | Actualizar design da pagina com nova paleta | `style/visualizar-conteudo-redesign` | [ALTA] |
| S2-14 | Implementar persistencia real da accao "Curtir" via endpoint do backend | `feat/like-persistencia` | [MEDIA] |
| S2-15 | Implementar persistencia real da accao "Marcar como Concluido" | `feat/progresso-persistencia` | [MEDIA] |
| S2-16 | Corrigir navegacao para quiz quando `quiz_id` nao existe mas `has_quiz` e verdadeiro | `fix/quiz-navigation-fallback` | [ALTA] |

#### Integracao com Backend — AA (prioridade tecnica alta)

| ID | Tarefa | Branch Sugerida | Prioridade |
|----|--------|-----------------|------------|
| S2-17 | Implementar logica de Refresh Token no interceptor 401 em `src/services/api.ts` | `feat/auth-refresh-token` | [ALTA] |
| S2-18 | Actualizar pontos do utilizador no `AuthContext` apos conclusao de quiz | `feat/quiz-update-pontos` | [ALTA] |
| S2-19 | Adicionar tratamento do erro 403 com redireccao para login | `fix/auth-403-handling` | [ALTA] |
| S2-20 | Verificar e corrigir mapeamento de campos da API em `contentService` | `fix/content-api-mapping` | [MEDIA] |

---

### SEMANA 3 — 9 Jun a 13 Jun | Polimento, Qualidade e Preparacao para Demo

**Foco:** Correccao de bugs, polimento visual, performance, responsividade mobile e preparacao para a demonstracao na AngoTic.

Nota critica: A partir de 11 de Junho (quarta-feira), o codigo em `develop` deve ser considerado congelado para novas funcionalidades. Apenas correccoes criticas sao aceites a partir dessa data.

#### Quiz — AA

| ID | Tarefa | Branch Sugerida | Prioridade |
|----|--------|-----------------|------------|
| S3-01 | Redesenhar ecra de resultados do quiz com nova paleta e animacao de conclusao | `style/quiz-resultado-redesign` | [ALTA] |
| S3-02 | Melhorar UI do timer com alertas visuais quando restam menos de 30 segundos | `feat/quiz-timer-alerta` | [MEDIA] |
| S3-03 | Melhorar ecra de carregamento do quiz | `style/quiz-loading-state` | [MEDIA] |
| S3-04 | Corrigir dependencias do `useEffect` no timer para eliminar warnings do React | `fix/quiz-timer-deps` | [MEDIA] |

#### Ranking — CA

| ID | Tarefa | Branch Sugerida | Prioridade |
|----|--------|-----------------|------------|
| S3-05 | Actualizar design da pagina de ranking com nova paleta | `style/ranking-redesign` | [ALTA] |
| S3-06 | Destacar visualmente o utilizador autenticado na lista de ranking | `feat/ranking-highlight-user` | [MEDIA] |

#### Criar Conteudo — CA com suporte de AA

| ID | Tarefa | Branch Sugerida | Prioridade |
|----|--------|-----------------|------------|
| S3-07 | Actualizar design do formulario de criacao com nova paleta | `style/criar-conteudo-redesign` | [ALTA] |
| S3-08 | Adicionar validacao mais robusta no formulario antes de submeter | `fix/criar-conteudo-validacao` | [MEDIA] |
| S3-09 | Melhorar UX do botao "Gerar com IA" (actualmente apenas exibe alerta) | `fix/quiz-ia-ux-melhoria` | [MEDIA] |

#### Landing Page — Polimento Final — AA

| ID | Tarefa | Branch Sugerida | Prioridade |
|----|--------|-----------------|------------|
| S3-10 | Rever e polir todas as animacoes e transicoes da landing page | `style/landing-animacoes-polish` | [MEDIA] |
| S3-11 | Optimizar meta tags SEO: `<title>`, `<meta description>` e Open Graph | `chore/seo-meta-tags` | [MEDIA] |
| S3-12 | Executar e corrigir performance (meta: Lighthouse acima de 80 em todas as categorias) | `perf/lighthouse-optimizacao` | [MEDIA] |

#### QA e Preparacao para Demo — AA + CA

| ID | Tarefa | Prioridade |
|----|--------|------------|
| S3-13 | Testar fluxo completo: registo, login, marketplace, quiz, ranking | [ALTA] |
| S3-14 | Testar em dispositivos mobile: iOS Safari e Android Chrome | [ALTA] |
| S3-15 | Testar dark mode em todas as paginas | [ALTA] |
| S3-16 | Corrigir todos os bugs encontrados durante o QA | [ALTA] |
| S3-17 | Executar deploy final para producao (Vercel) apos aprovacao do CTO | [ALTA] |
| S3-18 | Coordenar com backend para preparar dados de demonstracao | [ALTA] |

---

## 8. Definicao de Pronto (Definition of Done)

Uma tarefa so e considerada concluida quando todos os criterios abaixo estiverem cumpridos:

- O codigo esta na branch correcta e sincronizado com `develop`
- PR aberto com o template preenchido na integra
- Screenshots anexados ao PR (obrigatorio para qualquer mudanca visual)
- `npm run build` corre sem erros
- Sem erros na consola do browser
- Testado em resolucao mobile (largura minima de 375px)
- Dark mode verificado e funcional em todos os elementos alterados
- `CHANGELOG.md` actualizado com a descricao da alteracao
- PR aprovado pelo CTO (Anderson Cafurica)
- Merge feito para `develop` pelo CTO

---

## 9. Gestao de Ambientes

### 9.1 Ficheiro `.env.example`

Criar na raiz do projecto e commitar para o repositorio (sem valores reais):

```
# URL base da API do backend Django
VITE_API_URL=https://api.kombinu.ao/api

# Ambiente da aplicacao: development, staging ou production
VITE_ENV=development
```

### 9.2 Ficheiro `.env.local`

- Nunca commitar para o repositorio (deve estar listado no `.gitignore`)
- Cada developer cria o seu localmente com os valores do ambiente de desenvolvimento
- O CTO fornece os valores para staging e producao atraves de canal seguro

### 9.3 Tabela de Ambientes

| Ambiente | Branch | Deploy | Acesso |
|----------|--------|--------|--------|
| Local | Qualquer feature branch | `npm run dev` — `localhost:5173` | Developer |
| Staging | `develop` | Automatico via Vercel Preview | Equipa interna |
| Producao | `main` | Manual pelo CTO | Publico |

---

## 10. Gestao do Changelog

### 10.1 Formato (Keep a Changelog)

O ficheiro `CHANGELOG.md` deve seguir este formato:

```markdown
# Changelog

## [Nao Lancado]

### Adicionado
- Descricao da nova funcionalidade

### Alterado
- Descricao da alteracao numa funcionalidade existente

### Corrigido
- Descricao da correccao de bug

---

## [0.2.0] - 2026-06-13

### Adicionado
- ...
```

### 10.2 Categorias do Changelog

| Categoria | Quando usar |
|-----------|-------------|
| Adicionado | Novas funcionalidades |
| Alterado | Mudancas em funcionalidades existentes |
| Descontinuado | Funcionalidades que serao removidas em versao futura |
| Removido | Funcionalidades removidas nesta versao |
| Corrigido | Correccoes de bugs |
| Seguranca | Correccoes de vulnerabilidades de seguranca |

### 10.3 Responsabilidade

- O developer que executa a tarefa e responsavel por actualizar o `CHANGELOG.md` antes de abrir o PR
- O CTO valida a entrada do changelog durante o code review

---

## 11. Comunicacao e Escalamento

### 11.1 Canais de Comunicacao

| Situacao | Canal | Tempo de Resposta |
|----------|-------|-------------------|
| Duvidas tecnicas do dia-a-dia | WhatsApp do grupo dev | 2 horas uteis |
| Bloqueio critico que para o sprint | Chamada directa ao CTO | Imediato |
| PR aberto para review | Notificacao GitHub e mensagem no grupo | 24 horas uteis |
| Duvidas de design | Directo com Orlando Fortuna | 4 horas uteis |
| Bug critico em producao | Chamada directa ao CTO | Imediato |

### 11.2 Regras de Escalamento

1. **Bloqueio tecnico:** Se um developer estiver bloqueado por mais de 2 horas sem progresso, deve pedir ajuda — ao Augusto em primeiro lugar, ao CTO em segundo.
2. **Decisao de arquitectura:** Qualquer mudanca estrutural — nova biblioteca, alteracao de estrutura de pastas, novo padrao — deve ser aprovada pelo CTO antes de ser implementada.
3. **Atraso numa tarefa:** Comunicar proactivamente no grupo de trabalho com uma estimativa revista. Nunca silenciar um atraso.

### 11.3 Check-ins Diarios (Daily Standup)

- **Horario:** Todos os dias uteis as 09:00, durante as 3 semanas do sprint
- **Formato (maximo 5 minutos por pessoa):**
  - O que fiz ontem?
  - O que farei hoje?
  - Tenho algum bloqueio?

---

## 12. Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|--------------|---------|-----------|
| Atraso no ficheiro de design do CEO | Media | Alto | Iniciar tarefas de setup e integracao. Prazo limite: 27 de Maio. |
| Carlos nao acompanhar o ritmo do React | Media | Medio | Augusto prioriza o pair programming. CTO ajusta tarefas se necessario. |
| Backend indisponivel para testes | Baixa | Alto | Manter dados mock nos services como fallback. Testar endpoints com Postman. |
| Bug critico na semana 3 | Media | Muito Alto | Congelar novas features em 11 Jun. Focar apenas em correccoes e QA. |
| Falha na integracao do Refresh Token | Media | Alto | Augusto prioriza esta tarefa no inicio da semana 2. |
| Performance abaixo do esperado na demo | Baixa | Alto | Executar Lighthouse na semana 3. Optimizar imagens e implementar lazy loading. |

---

## 13. Confirmacao de Leitura

Ao assinar, o developer declara que leu, compreendeu e concorda com todos os padroes, processos e responsabilidades definidos neste documento.

| Nome | Funcao | Estado | Data |
|------|--------|--------|------|
| Anderson Cafurica | TechLead / CTO | Emitido | 24 Mai 2026 |
| Augusto Manuel | Frontend Developer Senior | Pendente | ___ |
| Carlos Avelino | Frontend Developer Junior | Pendente | ___ |

---

## 14. Anexos

| Anexo | Descricao | Estado |
|-------|-----------|--------|
| Anexo A | Ficheiro de design do CEO — paleta, tipografia e mockups (Figma / PDF) | Aguardado ate 26 Mai |
| Anexo B | Credenciais de acesso ao ambiente de staging | Partilhado pelo CTO via canal seguro |
| Anexo C | Documentacao dos endpoints do backend (Swagger / Postman Collection) | A solicitar ao backend |
| Anexo D | Template de PR — `.github/pull_request_template.md` | Criado na Semana 1 |

---

*Documento emitido por Anderson Cafurica — TechLead / CTO · KOMBINU · 24 de Maio de 2026*
*Versao 1.0.0 — Quaisquer alteracoes a este documento devem ser comunicadas a toda a equipa antes de entrarem em vigor.*
