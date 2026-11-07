# Kombinu — Mapeamento de telas, lacunas e roadmap

**Critério de contagem:** conta-se um componente de tela; passos de um fluxo contam em separado, estados da mesma tela não.

**Base:** projeto React + TypeScript + Tailwind v4 migrado a partir dos ficheiros HTML entregues em nove iterações.
**Estado técnico:** compila sem erros (`tsc` + `vite build`), auditado com `axe-core` em 1280px e 390px, sem violações.
**Data do levantamento:** setembro de 2026.

---

## 1. Mapa completo das telas já construídas

39 telas (37 convertidas dos ficheiros HTML e 2 criadas para fechar fluxos), agrupadas em 6 fluxos e 3 molduras de navegação (`AppShell` para estudante, `CreatorShell` para criador, `AdminShell` para backoffice).

### 1.1 Entrada e onboarding

| # | Tela | Rota | Ficheiro | Notas |
| --- | --- | --- | --- | --- |
| 1 | Autenticação por SMS | `#/entrar` | `features/auth/AuthScreen` | Telefone + código de 6 dígitos, reenvio com contador, alternativas Google e e-mail académico |
| 2 | Escolha de perfil | sem hash | `features/onboarding/OnboardingRoleScreen` | Estudante ou criador |
| 3 | Passo 1: universidade e cadeira | fluxo | `onboarding/StepAffiliation` | Universidade, curso, ano, cadeira crítica |
| 4 | Passo 2: quiz diagnóstico | fluxo | `quiz/DiagnosticQuizScreen` | Feedback imediato, checkpoint por questão |
| 5 | Passo 2b: resumo do diagnóstico | fluxo | `quiz/DiagnosticSummary` | Acertos, XP, calibração |
| 6 | Passo 3: rotina e lembretes | fluxo | `onboarding/StepRoutine` | Meta diária, formatos, lembrete (SMS opcional) |
| 7 | Passo 4: perfil ativo | fluxo | `onboarding/ProfileActivatedScreen` | Recompensas, nível, primeira leitura recomendada |

### 1.2 Credenciamento de criador

| # | Tela | Rota | Ficheiro | Notas |
| --- | --- | --- | --- | --- |
| 8 | Passo 1: credenciais académicas | fluxo | `creator/StepCredentials` | Nome, instituição, vínculo, cadeiras |
| 9 | Passo 2: comprovativo e amostra | fluxo | `creator/StepDocuments` | Upload com validação, declaração de autoria (Lei n.º 15/14) |
| 10 | Passo 3: monetização | fluxo | `creator/StepMonetization` | Multicaixa Express, plano, simulador de ganhos |
| 11 | Candidatura submetida | fluxo | `creator/CreatorConfirmationScreen` | Protocolo, linha do tempo da auditoria, estúdio em rascunho |

### 1.3 Aprendizagem

| # | Tela | Rota | Ficheiro | Notas |
| --- | --- | --- | --- | --- |
| 12 | Feed de estudos | `#/trilhas` | `feed/StudyFeedScreen` | Módulo em curso, publicações, painel lateral |
| 13 | Página da cadeira | `#/cadeira` | `course/CourseScreen` | Autor, publicação em destaque, próximos módulos |
| 14 | Leitor de artigo | `#/leitura` | `reading/ReadingPlayerScreen` | Índice, blocos, checkpoints, tamanho de texto |
| 15 | Conclusão de módulo | fluxo | `reading/ModuleCompleteScreen` | Métricas, revisão, próximo módulo, partilha |
| 16 | Painel do estudante | `#/painel` | `dashboard/DashboardScreen` | Competências, atividade, missões, liga |

### 1.4 Gamificação

| # | Tela | Rota | Ficheiro | Notas |
| --- | --- | --- | --- | --- |
| 17 | Desafio relâmpago (apresentação) | `#/desafio` | `challenge/ChallengeScreen` | Contagem, prémio, regras |
| 18 | Simulado a decorrer | fluxo | `challenge/ChallengeQuizScreen` | Cronómetro por questão, tabelas, adiar questão |
| 19 | Resultado do simulado | fluxo | `challenge/ChallengeFlow` | Acertos, XP com multiplicador |
| 20 | Ligas universitárias | `#/ligas` | `leagues/LeaguesScreen` | Zonas de promoção e despromoção |
| 21 | Hub de ofensiva | `#/ofensiva` | `streak/StreakHubScreen` | Calendário do mês, proteções de gelo |
| 22 | Cofre de medalhas | `#/medalhas` | `profile/BadgeVaultScreen` | Conquistadas e por conquistar, com progresso |
| 23 | Perfil académico | `#/perfil` | `profile/StudentProfileScreen` | Desempenho, cadeiras, sebentas, simulados |

### 1.5 Marketplace

| # | Tela | Rota | Ficheiro | Notas |
| --- | --- | --- | --- | --- |
| 24 | Vitrine do marketplace | `#/marketplace` | `marketplace/MarketplaceScreen` | Pesquisa sem acentos, filtros, paginação |
| 25 | Detalhe da sebenta e checkout | `#/sebenta` | `document/DocumentDetailScreen` | Amostra paginada, compra por Express |
| 26 | Vitrine do criador | `#/criador` | `creator-public/CreatorPublicProfileScreen` | Autoridade, materiais, metodologia, avaliações |

### 1.6 Modo criador

| # | Tela | Rota | Ficheiro | Notas |
| --- | --- | --- | --- | --- |
| 27 | Estúdio de criação | `#/estudio` | `studio/StudioScreen` | Editor de blocos, guardar automático |
| 28 | Pré-visualização como aluno | fluxo | `studio/StudioPreview` | Mesmo renderizador do leitor |
| 29 | Financeiro e vendas | `#/estudio/financeiro` | `creator-finance/CreatorFinanceScreen` | Saldo, levantamento, histórico |
| 30 | Seleção de plano | `#/estudio/plano` | `subscription/PlanSelectionScreen` | Grátis vs Pro |
| 31 | Checkout Express | fluxo | `subscription/ExpressCheckoutScreen` | Resumo e número de débito |
| 32 | Estado da transação | fluxo | `subscription/TransactionStatusScreen` | À espera, aprovado, falhado |
| 33 | Definições da conta | `#/estudio/definicoes` | `subscription/AccountSettingsScreen` | Perfil, notificações, número, subscrição |

### 1.7 Backoffice

| # | Tela | Rota | Ficheiro | Notas |
| --- | --- | --- | --- | --- |
| 34 | Visão executiva | `#/admin` | `admin/AdminOverviewScreen` | KPIs, telemetria data-lean, universidades |
| 35 | Estudantes e polos | `#/admin/estudantes` | `admin/StudentsScreen` + `StudentDrawer` | Filtros, inspeção, suspensão |
| 36 | Moderação de conteúdo | `#/admin/moderacao` | `admin/ModerationScreen` | Critérios obrigatórios antes de aprovar |
| 37 | Insights pedagógicos | `#/admin/insights` | `admin/InsightsScreen` | Dificuldade, formatos, NPS, procuras sem resultado |
| 38 | Financeiro e Express | `#/admin/financeiro` | `admin/FinanceScreen` | Transações, repasses em lote |
| 39 | Gamificação e ligas | `#/admin/gamificacao` | `admin/GamificationScreen` | Zonas somam 100%, multiplicador, desafios |

### 1.8 Infraestrutura partilhada

| Categoria | Peças |
| --- | --- |
| Molduras | `AppShell`, `CreatorShell`, `AdminShell` |
| Componentes de interface (27) | `Button3D`, `Icon`, `Asset3D`, `Avatar`, `Card`, `ProgressBar`, `SegmentedProgress`, `Stepper`, `StatusTimeline`, `LeaderboardRow`, `Field`, `TagInput`, `FileDropzone`, `PhoneInputAO`, `OtpInput`, `ConsentCheckbox`, `Switch`, `Segmented`, `RadioCard`, `CheckChip`, `Pill`, `SlideOver`, `Toast`, `TableScroll`, `XpBadge`, `DataSaverBadge`, `BrandMark` |
| Gráficos | `AreaChart`, `DonutChart` (SVG a partir dos dados, sem biblioteca) |
| Conteúdo | `blocks.ts` (8 tipos), `BlockRenderer`, `CheckpointBlock` |
| Hooks (9) | `useCountdown`, `useQuestionTimer`, `useCountUp`, `useActiveSection`, `useFeedbackSound`, `useFieldErrors`, `useFocusOnMount`, `useHashRoute`, `usePrefersReducedMotion` |
| Estado | `GamificationContext` (XP, sequência, gemas) |

---

## 2. Telas em falta

Marcação de prioridade: **P0** bloqueia o lançamento, **P1** necessário nos primeiros meses, **P2** escala e otimização.

### 2.1 Pós-compra do estudante (P0)

| Tela | O que resolve |
| --- | --- |
| Biblioteca "As minhas sebentas" | Onde ficam os materiais comprados; hoje a compra termina sem destino permanente |
| Gestor de descargas offline | A promessa data-lean é ler offline; não existe gestão do que está descarregado nem do espaço ocupado |
| Histórico de compras e recibos | Comprovativo por transação, exigível para consumidor e para disputas |
| Estado de pagamento da sebenta | O `TransactionStatusScreen` existe só para subscrições; a compra avulsa trata o estado dentro da página |

### 2.2 Ciclo de vida da subscrição (P0)

| Tela | O que resolve |
| --- | --- |
| Falha de renovação (dunning) | O que acontece quando o débito mensal falha: tolerância, aviso, nova tentativa |
| Confirmação de downgrade | Passagem de Pro para grátis: efeito nos 30% de comissão e nos materiais publicados |
| Recibo mensal da subscrição | Documento por cobrança, separado do painel financeiro |

### 2.3 Ciclo do criador (P0/P1)

| Tela | Prioridade | O que resolve |
| --- | --- | --- |
| Gestão de materiais publicados | P0 | Listar, editar, despublicar, alterar preço. Hoje publica-se sem ponto de retorno |
| Definição de preço e visibilidade na publicação | P0 | O estúdio publica sem perguntar preço; o marketplace assume que existe |
| Resultado da homologação | P0 | O criador submete a candidatura e nunca vê o veredito na aplicação |
| Analítica por material | P1 | Vendas, leitura concluída, acertos nos quizzes de cada sebenta |
| Caixa de dúvidas dos estudantes | P1 | As definições prometem notificação de dúvidas; não existe ecrã de dúvidas |
| Editor de diagrama de fluxo | P2 | O leitor já mostra o bloco; o estúdio ainda não o edita |

### 2.4 Conta e segurança do estudante (P0/P1)

| Tela | Prioridade | O que resolve |
| --- | --- | --- |
| Definições do estudante | P0 | Só existe a versão do criador. Notificações, idioma, dados móveis, conta |
| Alteração de número com confirmação | P0 | O número é a credencial de login e de pagamento |
| Recuperação sem acesso ao número | P0 | Cartão SIM perdido ou trocado: hoje a conta fica inacessível |
| Privacidade e dados pessoais | P1 | Exportar e eliminar conta, nos termos da lei angolana de proteção de dados |
| Centro de notificações | P1 | A plataforma promete avisos em três canais sem sítio para os consultar |
| Sessões e dispositivos | P2 | Ver e terminar sessões abertas |

### 2.5 Aprendizagem e conteúdo (P1)

| Tela | O que resolve |
| --- | --- |
| Mapa da trilha (nós sequenciais) | A especificação inicial descreve trilha linear com nós, cadeados e checkmarks; o feed mostra lista, não percurso |
| Trilha mista diagnóstica | O separador existe no feed sem ecrã próprio de recomendação adaptativa |
| Biblioteca livre (exploração) | Terceiro separador do feed, hoje só filtra a mesma lista |
| Resultados de pesquisa global | A pesquisa existe apenas dentro do marketplace |
| Leitor de áudio | O botão "ouvir" existe em três telas sem reprodutor, e é o maior risco para o orçamento de dados |
| Revisão espaçada / refazer quiz | Retenção a médio prazo: rever o que se errou dias depois |

### 2.6 Social e suporte (P1/P2)

| Tela | Prioridade | O que resolve |
| --- | --- | --- |
| Dúvidas e comentários num material | P1 | Contadores de comentários já aparecem na cadeira e no criador |
| Convidar colegas / referral | P2 | Crescimento orgânico numa base universitária |
| Suporte e ajuda | P1 | Só existe uma ligação para o WhatsApp |
| Mensagens diretas com o criador | P2 | O botão existe na vitrine do criador |

### 2.7 Backoffice (P1/P2)

| Tela | Prioridade | O que resolve |
| --- | --- | --- |
| Fila de homologação de criadores | P0 | A moderação existente é de conteúdo; as candidaturas de criador não têm onde ser aprovadas |
| Relatório de subscrições Pro | P1 | O separador existe como marcador de posição |
| Catálogo (universidades, cursos, cadeiras) | P1 | Hoje as listas são constantes no código |
| Permissões e registo de auditoria | P0 | Um único perfil "Super Admin" autoriza transferências, sem rasto |
| Suporte e tickets | P2 | Atendimento a estudantes e criadores |

### 2.8 Estados do sistema e aquisição (P1/P2)

| Tela | Prioridade | O que resolve |
| --- | --- | --- |
| Erro 404 e erro do servidor | P1 | Rotas inexistentes e falhas de API |
| Sem ligação / modo offline | P1 | Cenário frequente no público-alvo |
| Sessão expirada | P1 | Retomar sem perder contexto |
| Manutenção programada | P2 | Janelas de indisponibilidade |
| Página pública de entrada (landing) | P1 | Hoje entra-se diretamente no produto |
| Página pública da universidade | P2 | Aquisição por polo e prova social institucional |

---

## 3. Análise dos fluxos em falta

Cada fluxo abaixo está partido: o produto começa a promessa e não a fecha. As telas da secção 2 são exatamente as peças que faltam.

### 3.1 O dinheiro entra mas o estudante não tem onde guardar o que comprou

**Onde quebra:** `DocumentDetailScreen` confirma o pagamento e oferece "ler a sebenta". Fecha-se a aplicação e o material desaparece da vista.
**Peças em falta:** biblioteca de compras, gestor de descargas, histórico de recibos.
**Consequência:** o valor pago deixa de ser visível, o suporte recebe "paguei e não tenho", e a promessa de leitura offline não se cumpre.
**Nota:** é o fluxo com maior risco de reembolso e de perda de confiança.

### 3.2 A subscrição renova, mas não há resposta para quando falha

**Onde quebra:** `SubscriptionFlow` trata a primeira cobrança. A renovação mensal não tem ecrã.
**Peças em falta:** aviso de falha de renovação, período de tolerância, confirmação de downgrade.
**Consequência:** um criador Pro pode passar silenciosamente a 30% de comissão e só descobrir na venda seguinte.
**Dependência técnica:** saber se o Multicaixa Express suporta mandato de débito recorrente ou se cada mês exige nova autorização. Esta resposta muda o texto "renova todos os meses" que hoje está no checkout.

### 3.3 A candidatura de criador entra numa fila que não existe

**Onde quebra:** `CreatorConfirmationScreen` promete resposta em 4 a 24 horas. No backoffice só há moderação de conteúdo.
**Peças em falta:** fila de homologação de criadores no backoffice, ecrã de resultado para o criador.
**Consequência:** o prazo prometido não tem operação por trás, e o criador não sabe se foi aprovado.

### 3.4 Publica-se sem definir preço e sem poder corrigir

**Onde quebra:** `StudioScreen` tem o botão "Publicar"; o marketplace mostra preços.
**Peças em falta:** passo de preço e visibilidade na publicação, gestão de materiais publicados.
**Consequência:** não há como corrigir um erro, baixar um preço ou despublicar material com erro pedagógico.

### 3.5 A plataforma promete conversa e não a tem

**Onde quebra:** contadores de comentários na cadeira, botão "Mensagem" na vitrine do criador, notificação de dúvidas nas definições.
**Peças em falta:** dúvidas num material, mensagens diretas, centro de notificações.
**Consequência:** três promessas visíveis sem destino. É preferível esconder os controlos até existir o ecrã.

### 3.6 O número é a chave de tudo e não tem plano B

**Onde quebra:** login por SMS, pagamento por Express e repasses usam o mesmo número.
**Peças em falta:** alteração de número com dupla confirmação, recuperação sem acesso ao SIM.
**Consequência:** perder o cartão SIM significa perder a conta, o saldo e o histórico. Em Angola, a troca de número é frequente.

### 3.7 Fim de temporada da liga não existe

**Onde quebra:** o backoffice define zonas de promoção e despromoção; a tela de ligas mostra-as ao vivo.
**Peças em falta:** ecrã de fecho de temporada (subiste, desceste, mantiveste) e histórico.
**Consequência:** a competição semanal nunca tem um momento de conclusão, que é o que fecha o ciclo emocional.

### 3.8 Data-lean é a bandeira do produto e não tem controlos

**Onde quebra:** o selo "1,2 MB hoje" aparece em todas as telas, mas o número é fixo e não há definições.
**Peças em falta:** definições de dados do estudante, gestor de descargas, reprodutor de áudio com aviso de peso.
**Consequência:** a maior diferenciação do produto é hoje decorativa.

---

## 4. Análise de UX e UI

### 4.1 Erros encontrados e corrigidos durante a migração

| Categoria | Erro | Correção |
| --- | --- | --- |
| Matemática de produto | O exemplo do plano Pro dizia que 10 vendas a 1.500 Kz rendiam mais que o plano grátis; rendiam menos | Simulador com ponto de equilíbrio (12 vendas/mês) |
| Consistência | Preço do Pro em 5.000 Kz num ecrã e 6.500 noutro | Valor único em `plans.ts` |
| Consistência | Subscrição Pro listada com 30% de comissão e repasse ao criador | Receita da plataforma, sem repasse |
| Consistência | Prazos de homologação em 4 h, 12 h e 24 h | Prazo calculado e devolvido pela API |
| Consistência | Níveis de XP com três regras diferentes | `lib/levels.ts` como fonte única |
| Consistência | Datas de 2024 e 2025 em ecrãs de 2026 | Datas relativas ao momento |
| Jurídico | Declaração de autoria citava a Lei n.º 3/92, revogada | Lei n.º 15/14, de 31 de julho |
| Dados | XP do utilizador local a ordenar a tabela da liga | Classificação toda do servidor |
| Interação | Selecionar alternativa no simulado pintava-a de verde, revelando a resposta | Estado "selecionado" neutro |
| Interação | Zonas da liga em três sliders independentes que podiam não somar 100% | Zona neutra calculada |
| Interação | Barra "12 criadores selecionados" sem seleção possível | Tabela com seleção real |
| Interação | Dois temporizadores para o mesmo pagamento | Uma janela de autorização de 90 s |
| Acessibilidade | 12 tipos de violação no backoffice, 7 no leitor e estúdio, 4 nos perfis | Todas corrigidas; suites limpas |
| Acessibilidade | `--color-text-tertiary` a 4,35:1 e `--color-feedback-success-ink` a 4,44:1 | Tokens escurecidos para 4,9:1 e 5,3:1 |
| Acessibilidade | Tabelas com scroll horizontal inalcançáveis por teclado | `TableScroll` focável e anunciada |
| Acessibilidade | Interruptores de notificação sem nome acessível | Rótulo visualmente escondido |
| Conteúdo | "Mais popular", "98,4% de originalidade", "TLS 1.3" como factos | Reescritos como recomendação, verificação por amostragem e garantia verificável |
| Conteúdo | Código SMS pré-marcado e abas que saltavam passos | Fluxo linear de dois passos |

### 4.2 Melhorias introduzidas face aos originais

- **Validação com sentido:** aprovar material exige todos os critérios; rejeitar exige instruções escritas; suspender conta pede confirmação; o botão de publicar diz o que falta.
- **Estados que faltavam:** falha de pagamento, filtros sem resultados, medalhas por conquistar, dia falhado no calendário da ofensiva.
- **Feedback imediato:** resposta de quiz em menos de 100 ms, com som sintetizado (zero bytes descarregados).
- **Foco e teclado:** foco no título a cada mudança de ecrã, foco no primeiro campo inválido, foco preso nos painéis modais e devolvido ao fechar.
- **Data-lean real:** 12 fotografias substituídas por avatares com iniciais e ilustrações reutilizadas; gráficos em SVG sem biblioteca; sons sintetizados; código dividido por ecrã (2 a 10 KB gzip cada).
- **Uma só fonte de verdade:** conteúdo em blocos partilhado entre leitor, pré-visualização e estúdio; níveis, moeda e datas centralizados em `lib/`.

### 4.3 Observações

- **Tom:** os originais alternavam entre "tu" (estudante) e "você" (criador e backoffice). Ficou "tu" para o estudante e tratamento formal no modo criador, com grafia pt-AO.
- **Navegação:** três molduras distintas com a mesma linguagem visual. A barra do estudante segue o "modo aprendiz" das telas mais recentes, e o painel passou para o avatar.
- **Densidade:** o backoffice é a área com maior risco de sobrecarga. Resolvido com tabelas com cabeçalho fixo e gaveta no telemóvel, mas ainda sem ordenação nem paginação.
- **Vieses comportamentais:** os efeitos Zeigarnik, progresso concedido e feedback imediato da especificação inicial estão implementados. O "paradoxo da escolha" está parcialmente resolvido; a trilha mista ainda não tem ecrã.

### 4.4 Falhas e dívidas por resolver

| Área | Dívida | Risco |
| --- | --- | --- |
| Dados | Tudo em memória, com dados de exemplo | Alto: nenhuma tela foi validada com volume real |
| API | Sem camada de dados (TanStack Query ou equivalente), sem estados de carregamento e de erro por ecrã | Alto |
| Pagamentos | Sem chave de idempotência nem webhook | Alto: risco de cobrança dupla |
| Segurança | Gabarito dos quizzes no cliente; um único perfil de administrador | Alto |
| Escala | Pesquisa e paginação no cliente (3.420 estudantes, 685 páginas) | Médio |
| Testes | Só auditoria automática de acessibilidade; sem testes unitários nem de integração | Médio |
| Acessibilidade | Sem teste com leitor de ecrã real (TalkBack e VoiceOver) | Médio |
| Assets | Os 20 ícones 3D ainda não foram gerados; correm com fallback SVG | Baixo |
| Internacionalização | Textos fixos no código, em português | Baixo |
| Tema escuro | Tokens preparados, tema não implementado | Baixo |
| Desempenho | Sem medição de Core Web Vitals em rede 3G real | Médio |

### 4.5 Inovações que vale a pena manter

1. **Conteúdo em blocos partilhado.** O que o criador escreve é exatamente o que o estudante lê, com o mesmo renderizador. Elimina a divergência clássica entre editor e leitor.
2. **Simulador honesto de planos.** Mostra quando o plano pago não compensa, em vez de um exemplo escolhido a dedo.
3. **Som sintetizado por Web Audio.** Feedback sonoro sem um único byte descarregado, coerente com o data-lean.
4. **Física tátil separada por função.** Sombra sólida de 4px nos controlos, sombra difusa nas superfícies: o utilizador distingue o que é clicável.
5. **Fallback dos assets 3D.** Cada ilustração degrada para um ícone SVG, o que torna o produto utilizável antes de os assets existirem e em redes más.
6. **Pagamento assíncrono explícito.** A tela de estado assume que a confirmação acontece no telemóvel, com garantia de que nada foi debitado quando falha.
7. **Auditoria de acessibilidade no ciclo de trabalho.** Cada entrega passou pelo `axe-core` em duas larguras, e duas correções subiram ao nível dos tokens do design system.

---

## 5. Roadmap das telas em falta

Esforço: **P** até 1 dia, **M** 2 a 4 dias, **G** mais de 1 semana (uma pessoa em frontend, sem contar o back-end).

### Fase 0 — Fundações técnicas (antes de qualquer tela nova)

| Item | Esforço | Porquê primeiro |
| --- | --- | --- |
| Camada de dados e estados de carregamento/erro | G | Todas as telas seguintes dependem disto |
| Idempotência e webhook nos pagamentos | M | Risco financeiro direto |
| Correção dos quizzes no servidor | M | Integridade dos simulados com prémio |
| Permissões e registo de auditoria no backoffice | M | Hoje um perfil autoriza transferências sem rasto |
| Paginação e pesquisa no servidor | M | Backoffice e marketplace |

### Fase 1 — Fechar o ciclo do dinheiro (P0)

| # | Tela | Esforço | Depende de |
| --- | --- | --- | --- |
| 1 | Biblioteca "As minhas sebentas" | M | Fase 0 |
| 2 | Gestor de descargas offline | G | Biblioteca, service worker |
| 3 | Histórico de compras e recibos | P | Fase 0 |
| 4 | Gestão de materiais publicados | M | Fase 0 |
| 5 | Preço e visibilidade na publicação | P | Gestão de materiais |
| 6 | Fila de homologação de criadores (backoffice) | M | Permissões |
| 7 | Resultado da homologação (criador) | P | Fila de homologação |
| 8 | Falha de renovação e downgrade | M | Decisão sobre mandato de débito |
| 9 | Definições do estudante | M | Fase 0 |
| 10 | Alteração de número e recuperação sem SIM | G | Autenticação, suporte |

**Resultado da fase:** um estudante compra, guarda e lê; um criador publica, corrige e recebe; a operação aprova e audita.

### Fase 2 — Retenção e conteúdo (P1)

| # | Tela | Esforço | Depende de |
| --- | --- | --- | --- |
| 11 | Mapa da trilha com nós | M | Modelo de trilha no back-end |
| 12 | Trilha mista diagnóstica | M | Motor de recomendação |
| 13 | Biblioteca livre | P | Catálogo |
| 14 | Fim de temporada da liga | P | Motor de ligas |
| 15 | Centro de notificações | M | Serviço de notificações |
| 16 | Dúvidas num material | M | Moderação |
| 17 | Analítica por material | M | Eventos de leitura |
| 18 | Estados do sistema (404, erro, offline, sessão expirada) | P | Fase 0 |
| 19 | Revisão espaçada / refazer quiz | M | Histórico de respostas |
| 20 | Suporte e ajuda | P | — |

**Resultado da fase:** o estudante tem motivo para voltar amanhã e o criador percebe o que funciona.

### Fase 3 — Escala e aquisição (P1/P2)

| # | Tela | Esforço | Depende de |
| --- | --- | --- | --- |
| 21 | Relatório de subscrições Pro (backoffice) | P | Fase 0 |
| 22 | Catálogo de universidades e cadeiras (backoffice) | M | — |
| 23 | Resultados de pesquisa global | M | Pesquisa no servidor |
| 24 | Página pública de entrada | M | — |
| 25 | Página pública da universidade | M | Catálogo |
| 26 | Convidar colegas / referral | M | Notificações |
| 27 | Leitor de áudio | G | Decisão sobre o custo de dados |
| 28 | Mensagens diretas | G | Moderação e denúncia |
| 29 | Suporte e tickets (backoffice) | M | Permissões |
| 30 | Editor de diagrama de fluxo (estúdio) | M | — |
| 31 | Privacidade, exportar e eliminar conta | M | Requisitos legais |
| 32 | Sessões e dispositivos | P | Autenticação |

### Decisões de produto que bloqueiam telas

| Decisão | Bloqueia |
| --- | --- |
| Carrinho de compras ou compra única por item | Marketplace, detalhe da sebenta, checkout |
| O Multicaixa Express suporta mandato de débito recorrente? | Renovação, checkout, definições |
| Subscrição de explicador é produto real? | Vitrine do criador, financeiro |
| O áudio cabe no orçamento de dados? | Leitor, definições de dados |
| Quem aprova criadores e com que SLA | Fila de homologação, candidatura |

---

## 6. Resumo executivo

- **Construído:** 39 telas, 6 fluxos, 3 molduras de navegação, 27 componentes partilhados, sem violações de acessibilidade nas auditorias automáticas.
- **Maior lacuna:** o pós-compra do estudante. O produto recebe dinheiro e não entrega um sítio permanente para o material.
- **Maior risco técnico:** pagamentos sem idempotência nem webhook.
- **Maior risco de produto:** o data-lean é a bandeira e ainda não tem controlos reais.
- **Caminho mais curto para um piloto:** Fase 0 mais os pontos 1, 3, 4, 6 e 7 da Fase 1. Com isso, um polo universitário consegue usar a plataforma de ponta a ponta.
