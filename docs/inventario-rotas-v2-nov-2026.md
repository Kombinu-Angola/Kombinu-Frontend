# Inventário das rotas `/v2` — dados reais, de exemplo e contratos em falta (C-F4, Nov 2026)

> **Base:** `develop`, sem flags, backend `main` (`fd1d273`) com `seed_demo`.
> **Complementa** o C-F3 (`docs/ecras-orfaos-nov-2026.md`, que diz *se* um ecrã tem entrada). Aqui diz-se *de onde vêm os dados* de cada rota e *o que o backend precisaria de ter* para o ecrã deixar de usar exemplos.
> **Método:** tabela de rotas (`src/routes/v2.tsx`), análise dos imports de cada ecrã (serviços, hooks, ficheiros `mock*`), abertura de cada ecrã com contas reais do seed e consulta (só leitura) ao mapa de endpoints do backend.
> **Legenda:** ✅ real (API) · 🟡 híbrido (real com parâmetros, exemplo sem eles) · ❌ exemplo (dados fixos no código) · ⏳ «Em breve» (sem dados) · 🚩 só com `VITE_FLUXO_MOCKS=true`.

## 1. Resumo

| Estado | Rotas | Nota |
|---|---:|---|
| ✅ Real | 22 | Dados da API do backend |
| 🟡 Híbrido | 2 | `/v2/cadeira`, `/v2/trilha`: reais com `?trilhaId=`/`?id=`; sem eles mostram um exemplo |
| ❌ Exemplo | 12 | 7 alcançáveis pela interface ou públicas (secção 3.1), 5 só por URL (3.2) |
| ⏳ Em breve | 35 | Sem dados, sem risco (30 sem ligação, 5 alcançáveis) |
| 🚩 Só com flag | 6 | Fluxo «Preparar»; 404 em produção |
| Redirecionamentos | 2 | `/v2/estudio`, `/v2/admin/estudantes` |
| **Total** | **79** | |

> **Correcção ao C-F3 (PR #119).** Lá escrevi que `/v2/definicoes` e `/v2/conta/telemovel` eram ecrãs reais. **Não são**: usam `MOCK_ACCOUNT` (filiação «UAN» verificada, telemóvel «+244 923 ••• 024» e códigos de confirmação fixos no código). Estão agora na secção 3.1 e o C-F3 será corrigido.

Contratos de backend em falta (secção 5): **sessões de login, exportação/eliminação de dados, compras e pagamentos, dúvidas por material, polos/universidades públicas, alteração de telefone, candidatura de criador, fluxo «Preparar» (IA), painéis de admin e subscrições**. Hoje o backend `main` só tem: `accounts` (registo, login, login institucional, refresh, `me`, instituições, alterar palavra-passe), `contents` (+ cadeiras), `quizzes`, `rankings` (global e `me`), `enquetes`, `trilhas`, `tenancy` (membros, importação em lote), `notificacoes` e `dashboard`.

## 2. Rotas reais (✅) e híbridas (🟡)

| Rota | Estado | Fonte dos dados | Endpoint(s) |
|---|:---:|---|---|
| `/v2/painel` | ✅ | `useV2Dados`, `useDoMeuCurso` (PR #117) | `/dashboard/learner/*`, `/rankings/me/`, `/me/`, `/trilhas/?cadeira=`, `/contents/?cadeira=` |
| `/v2/trilhas` | ✅ | `trilhaService` | `/trilhas/` |
| `/v2/trilha?id=` | 🟡 | `trilhaService` (com `id`); `MOCK_TRAIL` (sem `id`) | `/trilhas/{id}/` |
| `/v2/cadeira?trilhaId=&itemId=` | 🟡 | `trilhaService`; `MOCK_COURSE` sem parâmetros | `/trilhas/{id}/`, `/trilhas/items/{id}/complete/` |
| `/v2/desafio?quizId=` | ✅ | `quizService` | `/quizzes/{id}/`, `/quizzes/{id}/submit/` |
| `/v2/marketplace`, `/v2/marketplace/:id`, `/v2/sebenta`, `/v2/leitura` | ✅ | `materialService` | `/contents/` |
| `/v2/biblioteca-livre` | ✅ | `materialService` | `/contents/` |
| `/v2/pesquisa` | ✅ | `useV2Dados` | `/contents/?search=` |
| `/v2/classificacao` | ✅ | `rankingGlobalService` | `/rankings/global/` |
| `/v2/perfil` | ✅ | `useV2Dados` | `/dashboard/learner/*`, `/rankings/me/` |
| `/v2/notificacoes` | ✅ | `notificationService` | `/notifications/*` |
| `/v2/enquetes`, `/v2/estudio/enquete`, `/v2/estudio/enquete/resultados` | ✅ | `surveyService` | `/enquetes/*` |
| `/v2/estudio/materiais` | ✅ | `useV2Dados` | `/dashboard/creator/stats/`, `/contents/` |
| `/v2/estudio/criar` | ✅/⚠️ | Só links para outros ecrãs (ver 4) | — |
| `/v2/estudio/definicoes` | ✅ | Nome e e-mail do utilizador; subscrição «Em breve» | — |
| `/v2/admin/membros` | ✅ | `memberService` | `/tenancy/members/*` |
| `/v2/onboarding` | ✅ (flag `VITE_ONBOARDING_API`) | `perfilService` | `/me/`, `/instituicoes/`, `/cadeiras/` |
| `/v2/credenciamento` | ✅/⏳ | Ecrã real com envio desligado («Em breve») | — (falta endpoint, ver 5) |
| `/v2/404` | ✅ | Estático | — |

## 3. Rotas com dados de exemplo (❌)

### 3.1 Alcançáveis pela interface ou públicas

| Rota | O que é inventado | Fonte | Contrato que falta | Acção proposta |
|---|---|---|---|---|
| `/v2/definicoes` | Filiação «verificada» na UAN, faculdade, ano, formatos, telemóvel `+244 923 ••• 024`; as alterações só mudam o estado local | `MOCK_ACCOUNT` | `GET/PATCH /me/` já tem instituição, curso, ano e cadeira (K1); falta estado de verificação e telefone | **Ligar ao `/me/`** (campos já existentes) e passar o resto a «Em breve» |
| `/v2/conta/telemovel` | Número atual fixo e códigos de confirmação `842913`/`100200` validados no browser | `MOCK_ACCOUNT` + função fixa | Alteração de telefone com SMS (verificação em dois passos) | «Em breve» |
| `/v2/conta/sessoes` | Aparelhos, IPs, cidades e operadoras; «Terminar sessão» sem efeito | `SESSIONS` | Listar/revogar sessões (refresh tokens por dispositivo) | «Em breve» |
| `/v2/privacidade` | Interruptores sem efeito; «Pedir o meu ficheiro» sem backend | `MOCK_ACCOUNT` | Exportação (LPD, Lei 22/11), preferências de privacidade, eliminação de conta | «Em breve» |
| `/v2/u/:slug` | Faculdade de Economia da UAN com dados fixos, **sem login** | `MOCK_CAMPUS` | Polos/universidades públicas (`/instituicoes/` só dá nome, sigla e província) | Retirar a rota |
| `/v2/entrar` | Login por SMS/Google em demonstração (não é o login real) | `AuthScreen` | Login por SMS | Retirar a rota |
| `/v2/sessao-expirada` | Pede código para «+244 923 ••• 024» | `SessionExpiredScreen` | — | Retirar (o interceptor já leva ao `/login`) |

### 3.2 Só por URL

| Rota | O que é inventado | Fonte | Contrato que falta | Acção proposta |
|---|---|---|---|---|
| `/v2/perfil/compras` | Compras, referências `TX-…`, valores em Kz, Multicaixa Express | `PURCHASES` | Compras, pagamentos e recibos (EMIS) | «Em breve» |
| `/v2/duvidas` | Fórum de dúvidas e respostas («Macroeconomia I») | `MOCK_QA` | Dúvidas por material com resposta do criador | «Em breve» |
| `/v2/polo` | Faculdade de Economia — UAN | `MOCK_CAMPUS` | Polos (igual a `/v2/u/:slug`) | Retirar a rota |
| `/v2/trilha/mista` | «Trilha de recuperação» de «Contabilidade II» | `MOCK_ADAPTIVE` | Diagnóstico adaptativo | «Em breve» |
| `/v2/trilha` e `/v2/cadeira` sem parâmetros | Trilha e aula de exemplo | `MOCK_TRAIL`, `MOCK_COURSE` | — (os reais já existem) | Sem parâmetros → voltar a `/v2/trilhas` |
| `/v2/onboarding/estudante` | Onboarding antigo de 4 passos | `mockRecommendation`, `MOCK_DIAGNOSTIC` | Substituído por `/v2/onboarding` | Retirar a rota |

## 4. Texto fixo que afirma coisas sem base (`/v2/estudio/criar`)

O ecrã é «real» (só liga a outros), mas o texto dos cartões afirma factos que ninguém mede:
- «**Procura alta em época de frequências**» (cartão do simulado) — não há dados de procura.
- «**Venda avulsa ou acesso livre**» — o financeiro está «Em breve» e não há compras.
- «**Menos de 1 MB por artigo**», «**30 a 60 min a escrever**» — limites e tempos sem fonte.

Pela regra de persuasão honesta (sem números ou escassez inventados) convém retirar ou provar estas frases.

## 5. Contratos de backend em falta (para o Anderson)

| Necessidade | Rotas que desbloqueia | Existe hoje |
|---|---|---|
| Sessões por dispositivo (listar/revogar) | `/v2/conta/sessoes` | Não (só login, refresh e alterar palavra-passe) |
| Exportar/eliminar dados e preferências de privacidade | `/v2/privacidade` | Não |
| Alterar telefone com SMS | `/v2/conta/telemovel` | Não |
| Estado de verificação da filiação | `/v2/definicoes` | Não (o resto está em `/me/`) |
| Compras, pagamentos, recibos (EMIS/Multicaixa) | `/v2/perfil/compras`, venda no estúdio, financeiro | Não |
| Dúvidas por material com resposta | `/v2/duvidas` | Não |
| Polos/universidades públicas | `/v2/polo`, `/v2/u/:slug` | Parcial (`/instituicoes/`) |
| Candidatura de criador e homologação | `/v2/credenciamento`, `/v2/estudio/homologacao*` | Não |
| Fluxo «Preparar a minha prova» (upload, IA, pagamento do encarregado) | `/v2/preparar*` | Não |
| Painéis e relatórios de admin (insights, moderação, financeiro, subscrições, equipa) | `/v2/admin/*` | Só membros e importação |
| Ligas, medalhas, revisão, convites, áudio, offline | 9 rotas de aluno «Em breve» | Só ofensiva/XP em `/rankings/me/` |
| Consentimento do encarregado (menores) | B-07 do QA, C-F5 | Estado guardado (`consentimento_encarregado = pendente` para menores de 18), **não exposto em `/me/`** e sem fluxo de pedido ao encarregado |

## 6. Ordem sugerida

1. **Já, só frontend:** `/v2/conta/sessoes`, `/v2/privacidade`, `/v2/conta/telemovel` → «Em breve»; `/v2/definicoes` → ligar ao `/me/`; retirar `/v2/u/:slug`, `/v2/polo`, `/v2/entrar`, `/v2/sessao-expirada`, `/v2/onboarding/estudante`; sem parâmetros `/v2/trilha` e `/v2/cadeira` voltam a `/v2/trilhas`; `/v2/perfil/compras`, `/v2/duvidas` e `/v2/trilha/mista` → «Em breve».
2. **Texto do `/v2/estudio/criar`** (secção 4).
3. **Contratos do Anderson** por prioridade: consentimento do encarregado (B-07), sessões e privacidade (segurança/legal), depois pagamentos.

## 7. Limites

- Só `/v2` e só com as 6 contas do seed. Os dados «reais» foram confirmados abrindo os ecrãs com contas reais, mas não se avaliou a qualidade de cada um.
- O estado das rotas «Em breve» vem do código e do QA geral (#109); a lista de endpoints do backend vem dos ficheiros `urls.py` do `main` (`fd1d273`), lidos sem alterar nada.
- As 79 rotas incluem as 6 de `/v2/preparar`, que só existem com a flag.
