# Ecrãs órfãos e rotas `/v2` — C-F3 (Nov 2026)

> **Base:** `develop` (a seguir ao release de 24 Nov), sem flags (`VITE_FLUXO_MOCKS` e `VITE_ONBOARDING_API` desligadas), backend local com `seed_demo`.
> **Método:** (1) leitura da tabela de rotas `src/routes/v2.tsx`; (2) *crawl* automático em Chromium como os 6 papéis do QA (A admin, B professor, C e D estudantes de escola, E aprendiz de marketplace, F criador de marketplace), a 1280 px e a 375 px com o menu aberto, seguindo só os `<a href="/v2/...">` que um utilizador vê; (3) abertura directa de cada rota não alcançada para ver o que mostra; (4) procura de ficheiros `.tsx` em `features/` e `pages/` que nenhum outro ficheiro importa.
> **Âmbito:** só as rotas `/v2/*`. As rotas antigas (`/dashboard`, `/courses`, …) não foram inventariadas.
> **Correcção (C-F4):** na 1.ª versão desta lista `/v2/definicoes` e `/v2/conta/telemovel` estavam como ecrãs reais; usam dados de exemplo e passaram à secção 2.1. O inventário completo por rota está em `docs/inventario-rotas-v2-nov-2026.md`.
> **Definição:** *órfão* = ecrã com rota, mas que nenhum link da interface alcança (só se chega escrevendo o endereço).

## 1. Resumo

| | Rotas |
|---|---:|
| Rotas `/v2` na tabela | 79 |
| Alcançadas pela interface (por pelo menos um papel) | 27 |
| **Órfãs** (só por URL) | **52** |
| — «Em breve» (sem dados nem risco) | 30 |
| — Reais, sem ligação | 3 |
| — Com **dados de exemplo** visíveis (só por URL) | 8 |
| — Fluxos que chegam por redirecionamento (não são órfãs a sério) | 5 |
| — Só existem com `VITE_FLUXO_MOCKS=true` | 6 |
| Ficheiros de ecrã **nunca importados** (código morto) | 41 de 134 |

(30 + 8 + 3 + 5 + 6 = 52. Além disso, `/v2/conta/sessoes`, `/v2/privacidade` e `/v2/cadeira` **são alcançáveis** e também mostram dados de exemplo — secção 2.1.)

O que merece decisão antes de anunciar: **dados de exemplo que um estudante vê sem saber** (secção 2) e **ecrãs úteis que ninguém consegue abrir** (secção 3).

## 2. Ecrãs com dados de exemplo visíveis (prioridade)

Mostram dados inventados a utilizadores reais. É a mesma família do problema dos números falsos (650 XP, 12 dias, 450 gemas) e do chip «UAN · Economia».

### 2.1 Alcançáveis pela interface (`/v2/definicoes` e o que sai dela)

| Rota | O que mostra de inventado | Como se chega |
|---|---|---|
| `/v2/definicoes` | Filiação «verificada» na UAN, faculdade, ano e telemóvel `+244 923 ••• 024` iguais para toda a gente; as alterações só mudam o estado local (`MOCK_ACCOUNT`) | Link no rodapé das notificações e no menu de conta |
| `/v2/conta/telemovel` | Número atual fixo e códigos de confirmação (`842913` e `100200`) validados no browser | `/v2/definicoes` → Segurança |
| `/v2/conta/sessoes` | Lista de aparelhos com IPs, cidades e operadoras («Samsung Galaxy A14 · Luanda (Unitel)», «Tecno Spark 10 Pro · Talatona»), botões «Terminar sessão» que não fazem nada | `/v2/definicoes` → Segurança |
| `/v2/privacidade` | Interruptores de privacidade e «Pedir o meu ficheiro de dados» sem backend; o texto da exportação promete recibos Multicaixa Express | `/v2/definicoes` → Privacidade |

### 2.2 Só por URL (mas abrem para qualquer pessoa com o endereço)

| Rota | O que mostra de inventado |
|---|---|
| `/v2/perfil/compras` | Compras e recibos falsos («Sebenta: Macroeconomia I», 1 500 Kz, referências `TX-…`) e um número Multicaixa Express |
| `/v2/duvidas` | Fórum com dúvidas e respostas de pessoas inventadas («Macroeconomia I») |
| `/v2/polo` | Página de faculdade («Faculdade de Economia — UAN») com dados fixos |
| `/v2/u/:slug` | O mesmo polo, **sem login** (página pública com «Começar grátis») |
| `/v2/trilha/mista` | «Trilha de recuperação» de «Contabilidade II» inventada |
| `/v2/cadeira` (sem `?trilhaId`) | Aula de exemplo «Equilíbrio cambial e políticas fiscais em Angola». Com um item real de trilha mostra dados reais |
| `/v2/sessao-expirada` | Pede um código SMS para «+244 923 ••• 024» (número fixo) |
| `/v2/onboarding/estudante` | Onboarding antigo de 4 passos («+0 XP em jogo»), duplicado do `/v2/onboarding` |
| `/v2/entrar` | Login por SMS/Google em modo demonstração (não é o login real) |

> Proposta: ou passam a «Em breve» (como já foi feito com homologação, descargas, etc.), ou saem da tabela de rotas. Para os dois da 2.1 convém, no mínimo, mostrar «Em breve» até haver backend.

## 3. Ecrãs reais sem ligação

| Rota | Estado | Problema |
|---|---|---|
| `/v2/perfil` | Real (nome, XP, escolas) | **Nada na interface leva lá.** O avatar do cabeçalho tem o rótulo «Painel e perfil de …» mas liga a `/v2/painel` |
| `/v2/pesquisa` | Real (7 resultados no seed) | Sem caixa de pesquisa nem link em nenhum ecrã |
| `/v2/biblioteca-livre` | Real (conteúdos de criadores) | Sem entrada no menu nem nos ecrãs alcançáveis |

Os três funcionam e usam dados reais; só faltam pontos de entrada (avatar → perfil, lupa no cabeçalho, atalho para a biblioteca livre).

## 4. Fluxos por redirecionamento (esperados, não são órfãos a sério)

`/v2/onboarding` (só com `VITE_ONBOARDING_API=true`; vai-se lá por redirecionamento a contas novas), `/v2/credenciamento` (a partir de `/register`), `/v2/404`, `/v2/estudio` e `/v2/admin/estudantes` (redirecionam), `/v2/sebenta` (alias de `/v2/marketplace/:id`).

## 5. «Em breve» sem ligação (30 rotas, sem risco)

- Aluno: `/v2/ligas`, `/v2/ligas/temporada`, `/v2/ofensiva`, `/v2/medalhas`, `/v2/biblioteca`, `/v2/offline`, `/v2/audio`, `/v2/revisao`, `/v2/convidar`.
- Criador: `/v2/criador`, `/v2/estudio/financeiro`, `/v2/estudio/plano`, `/v2/estudio/homologacao`, `/v2/estudio/homologacao/correcao`, `/v2/estudio/renovacao`, `/v2/estudio/analitica`, `/v2/estudio/comecar`, `/v2/estudio/questoes`, `/v2/estudio/versoes`.
- Admin: `/v2/admin/criadores`, `/v2/admin/moderacao`, `/v2/admin/insights`, `/v2/admin/financeiro`, `/v2/admin/gamificacao`, `/v2/admin/catalogo`, `/v2/admin/subscricoes`, `/v2/admin/suporte`, `/v2/admin/adaptativo`, `/v2/admin/fiscal`, `/v2/admin/equipa`.

Ficam como estão: não mostram nada falso.

## 6. Só com `VITE_FLUXO_MOCKS=true`

`/v2/preparar`, `/v2/preparar/calibrar`, `/v2/preparar/previa`, `/v2/preparar/materiais`, `/v2/preparar/modulo/:id`, `/v2/preparar/simulado/:id`. Em produção dão 404 (verificado no QA geral, #109).

## 7. Código morto (41 ficheiros nunca importados)

Substituídos por páginas «Em breve» e que já não são usados:

- Admin: `AdminOverviewScreen`, `CreatorQueueScreen`, `CurriculumCatalogScreen`, `FinanceScreen`, `GamificationScreen`, `InsightsScreen`, `ModerationScreen`, `SubscriptionsReportScreen`, `SupportTicketsScreen`, `AdaptiveRulesScreen`.
- Criador/estúdio: `StudioScreen`, `BulkImportScreen`, `ExamComposerScreen`, `ItemCalibrationScreen`, `PeerReviewScreen`, `QuestionBankScreen`, `StudioOnboardingScreen`, `TrailComposerScreen`, `VersionHistoryScreen`, `MaterialAnalyticsScreen`, `CreatorFinanceScreen`, `CreatorPublicProfileScreen`, `HomologationResultScreen`, `FiscalExportScreen`, `TeamPermissionsScreen`.
- Aluno: `LeaguesScreen`, `SeasonFinaleScreen`, `StreakHubScreen`, `BadgeVaultScreen`, `ReviewNotebookScreen`, `ReferralScreen`, `StudentLibraryScreen`, `OfflineDownloadsScreen`, `AudioPlayerScreen`, `ReadingFlow`.
- Conta e outros: `AccountSettingsScreen`, `SubscriptionFlow`, `RenewalFailureScreen`, `onboarding/RoleCard`, `pages/DashboardAprendiz`, `pages/DashboardCriador`.

Vários ainda têm o chip «UAN · Economia» escrito à mão (`StudentLibraryScreen`, `OfflineDownloadsScreen`, `ReviewNotebookScreen`, `StreakHubScreen`). Como não estão ligados, o risco é nulo. Os que estão ligados (`PrivacyScreen`, `SessionsScreen`, `PurchaseHistoryScreen`, `PlaceholderScreen`) são os da secção 2.

## 8. Decisões que preciso do Anderson / Orlando

1. **`/v2/conta/sessoes`, `/v2/privacidade` e `/v2/conta/telemovel`:** passar a «Em breve» até haver backend? (Recomendado: sim — mostram sessões e dados falsos.) `/v2/definicoes` pode ligar-se já ao `/api/me/` (instituição, curso, ano).
2. **Rotas só-por-URL com dados de exemplo (2.2):** «Em breve» ou retirar da tabela? (Recomendado: retirar `/v2/u/:slug`, `/v2/sessao-expirada`, `/v2/entrar` e `/v2/onboarding/estudante`, e passar as restantes a «Em breve».)
3. **Pontos de entrada em falta (secção 3):** avatar → `/v2/perfil` e um lugar para «Sair» (QA geral, B-01); pesquisa e biblioteca livre entram no menu ou ficam de fora?
4. **Código morto:** apagar os 41 ficheiros num PR de limpeza?

## 9. Limites desta auditoria

- O *crawl* segue links do DOM; ecrãs que só se abrem por acção (botão que faz `navigate`) podem ter ficado como órfãos mesmo tendo entrada. Os ecrãs com dados de exemplo foram abertos à mão para confirmar o conteúdo.
- Só `/v2`. Papéis testados: os 6 do seed.
- Não se avaliou a qualidade de cada ecrã «real», só se tem dados inventados e se há caminho até ele.
