# Auditoria dos fluxos do utilizador — frontend Kombinu (26 Nov 2026)

> **O que é:** percurso completo de cada tipo de utilizador, do login à saída, com o que funciona, o que bloqueia, o que atrasa e o que corrigir; mais o **fluxo final** recomendado.
> **Estado auditado:** `develop` + os PRs abertos #117 a #125 (Do meu curso, notificações, Sair/perfil, registo sem papel, login único), com backend `main` (`fd1d273`) em local.
> **Método:** 6 percursos automáticos em Chromium a 375 px (registo→onboarding→painel→simulado→sair; aluno de escola; professor; criador de marketplace; admin; candidato a criador), com tempo por passo, pedidos à API, erros de consola e 4xx/5xx; análise estática do código (animação, acessibilidade, design); leitura (só leitura) do backend.
> **Honestidade:** os tempos são do servidor de desenvolvimento do Vite (frio, mais lento que produção); servem para comparar passos, não como valor absoluto. «Verificado» = visto a correr; «Inferido» = só lido no código.
> **Competências aplicadas:** `animate`, `animation-performance`, `choreograph`, `emil-design-eng`, `break-ui`, `impeccable`/`avoid-ai-design`, `site-architecture` e a forma de resposta do `i-have-adhd` (acção primeiro, passos numerados, no máximo 5 por grupo).

## 1. Próxima acção (por esta ordem)

1. **P0 — Dar ao criador um caminho que crie conteúdo** (F-01). Hoje o botão principal do estúdio volta para a lista.
2. **P0 — Backend recusar `creator` no registo** (F-02). O frontend já não envia; a API continua aberta.
3. **P1 — Fechar o ciclo do aprendiz** (F-03, F-04): resultado do simulado com «próximo passo»; vertente «Preparar a minha prova» a divergir da «Explorar».
4. **P1 — Retirar os ecrãs de exemplo** que o utilizador alcança (F-05).
5. **P2 — Limpeza e polimento** (F-06 a F-12).

## 2. Resultado dos percursos

| # | Percurso | Passos | Resultado | Onde trava |
|---|---|---:|---|---|
| 1 | Visitante → registo → onboarding → painel → simulado → ranking → perfil → sair | 21 | ✅ completo, sem 4xx/5xx nem erros de consola | Resultado do simulado sem próximo passo (F-04) |
| 2 | Aluno de escola (código de aluno) → painel → trilha → passo → enquetes → espaço → sair | 9 | ✅ completo | Trocar de espaço dispara 11 pedidos (F-09) |
| 3 | Professor → estúdio → **criar material** → enquete → modo estudante → sair | 9 | ⚠️ entra e sai, **não consegue criar** | «Escrever no estúdio» devolve à lista; simulado/trilha/importar são «Em breve» (F-01) |
| 3b | Criador de marketplace | 9 | ⚠️ igual ao 3 | F-01 |
| 4 | Admin da escola → membros → visão executiva → sair | 5 | ✅ completo | «Visão executiva» é «Em breve» (esperado) |
| 5 | Candidato a criador (`/v2/credenciamento`) | 4 | ⚠️ abre e percorre, **não envia** | Falta endpoint; sem ligação a partir do registo (F-02/F-10) |

Nenhum percurso gerou erro de consola nem resposta 4xx/5xx. Os problemas são de **lógica de fluxo**, não de falhas técnicas.

## 3. Achados

Gravidade: **P0** bloqueia o objectivo do utilizador ou é falha de segurança; **P1** estraga uma jornada importante; **P2** atrito, consistência ou dívida.

### P0

**F-01 — O criador não consegue criar conteúdo pela interface.** *(verificado)*
`/v2/estudio/materiais` → «Novo material» → `/v2/estudio/criar` → «Escrever no estúdio» aponta para `/v2/estudio`, que redireciona para `/v2/estudio/materiais`: **loop**. Os cartões Simulado, Trilha e Importar abrem páginas «Em breve». Só a enquete funciona. A única criação que funciona é o formulário antigo `/courses/create` (sem ligação em lado nenhum, cópia em PT-BR, outro desenho).
Correcção: (a) curto prazo — «Escrever no estúdio» abre `/courses/create`; os cartões sem ecrã mostram «Em breve» em vez de botão que leva a «Em breve»; (b) médio prazo — compositor `/v2/estudio/*` com a mesma gramática do resto.
Evidências: `evidencias-fluxos/fluxo_3_professor_3.png` (cartões), `fluxo_3_professor_5.png` (destino «Em breve»).

**F-02 — Registo como criador sem aprovação (backend).** *(verificado)*
A API aceita `user_type=creator` no registo público: o utilizador publica no marketplace sem credenciamento. Provado no percurso 1: o conteúdo de teste de uma conta que se registou como criador **apareceu na lista de sebentas de um aprendiz novo**. O frontend deixou de enviar `creator` (PR #123). **Falta o backend recusar** e promover só por aprovação. Contas já criadas como `creator` mantêm acesso: rever.

### P1

**F-03 — O CTA «Começar grátis» da landing não leva ao registo.** *(verificado)*
Aponta para `#simulado` (a demonstração); o registo só aparece depois de fazer o simulado ou no botão «Criar conta». Para quem já decidiu, são cliques a mais. Correcção: «Criar conta grátis» → `/register` como primário; «Experimentar um simulado» como secundário.

**F-04 — O ciclo do aprendiz não fecha.** *(verificado)*
- O **resultado do simulado** só tem «Tentar de novo» e «Ir ao painel». Mostra a resposta certa, mas não explica; não propõe o próximo simulado da cadeira, a trilha, nem o ranking. `evidencias-fluxos/fluxo_1_aprendiz_novo_16.png`.
- No onboarding a intenção «Preparar a minha prova» e «Explorar simulados» seguem **o mesmo caminho** (a intenção só se grava). A vertente «gerar conteúdo com IA» não existe em produção (`/v2/preparar*` só com `VITE_FLUXO_MOCKS`). O onboarding também só corre com `VITE_ONBOARDING_API=true`.
Correcção: cartão «Próximo passo» no fim do simulado (reutiliza `useDoMeuCurso`); quando houver backend, «Preparar» abre `/v2/preparar` em vez de ir ao painel.

**F-05 — Ecrãs de exemplo alcançáveis.** *(verificado; detalhe em `inventario-rotas-v2-nov-2026.md`)*
`/v2/definicoes`, `/v2/conta/telemovel`, `/v2/conta/sessoes` e `/v2/privacidade` mostram dados fixos (telemóvel, aparelhos, filiação). `/v2/definicoes` está ligada a partir do rodapé das notificações. Quebra a confiança. Correcção: «Em breve» ou ligar ao `/api/me/`.

### P2

| ID | Achado | Estado | Correcção |
|---|---|---|---|
| F-06 | **Duas aplicações em paralelo**: rotas antigas (`/courses`, `/courses/create`, `/courses/:id`, `/quiz/:id`, `/dashboard/admin`) com cópia PT-BR («engajar sua audiência», «Começar Grátis»), gradientes azul→índigo e `transition-all`; `/dashboard/admin` com percentagens fixas (78%/60%/85%) | verificado | Decidir: migrar o que serve (criar conteúdo, F-01) e apagar o resto (41 ficheiros mortos, ver C-F3) |
| F-07 | **Nomes diferentes para a mesma coisa**: «Sebentas» (separador), «Materiais» (migalhas), «Simulados» (separador) com URL `/v2/desafio`, «Marketplace» na URL | verificado | Um vocabulário só (sugestão: Sebentas / Simulados / Trilhas) e URLs a condizer |
| F-08 | Cabeçalho do criador a 375 px parte em duas linhas (seletor de espaço + «Modo estudante» + avatar) | verificado | Esconder o rótulo, deixar o ícone |
| F-09 | Pedidos a mais: perfil 7, trocar de espaço 11, painel 5 (`/dashboard/learner/*`, `/rankings/me/`, `/me/`, trilhas, contents) | verificado | Agregar estatísticas num pedido; manter `staleTime` ao trocar de espaço |
| F-10 | Sem ponto de entrada do criador (credenciamento só por URL) | verificado | Decisão de produto (Orlando): onde nasce o «Quero ser criador» |
| F-11 | Carregamento de rotas com um círculo a rodar a ecrã inteiro (`CarregarTela`) | inferido | Esqueleto da própria página (perceived performance) |
| F-12 | `transition-[padding]` ao fixar a barra do criador (anima layout); `transition-all` em 20 sítios (5 em componentes shadcn, 15 no legado) | inferido | `transform`/`opacity`; nomear propriedades |

**O que está bem (manter):** sem erros técnicos nos 6 percursos; `prefers-reduced-motion` tratado em 25 ficheiros; nenhum `scale(0)` nem `ease-in`; durações de 150 ms em quase tudo; hover só em dispositivos com rato (Tailwind 4); o sistema `/v2` (Montserrat, botões 3D, cartões «clay») é coerente e **não** é o «AI-slop» genérico — os tiques de IA (gradiente azul→índigo, `bg-clip-text`) estão só no legado (8 ocorrências); isolamento de espaços, onboarding de 5 passos saltáveis, «Do meu curso» e o aviso de menores a funcionar.

## 4. Fluxo final recomendado

### 4.1 Mapa (arquitectura de informação)

```
Público
├── /                  landing  → [Criar conta grátis] [Experimentar um simulado] [Entrar]
├── /login             um só formulário (e-mail ou código de aluno)
├── /register          um só formulário (todos entram como aprendiz)
└── /termos /privacidade

Aprendiz  (separadores: Trilhas · Simulados · Sebentas)
├── Onboarding (1.ª vez): intenção → onde estudas → ano/cadeira → tempo → pronto
│    ├── «Explorar» → Painel («Do meu curso»)
│    └── «Preparar a minha prova» → /v2/preparar (quando houver backend)
├── Painel → Trilha → passo → Simulado → Resultado → [Próximo passo]
├── Classificação · Notificações · Perfil (avatar) · Sair
└── Definições (só com dados reais)

Criador  (barra lateral: Estúdio · Os meus materiais · Conta)
├── Credenciamento (candidatura) → espera aprovação do admin → conta promovida
├── Criar: artigo / simulado / trilha / enquete
└── Os meus materiais → estatísticas · Voltar ao modo estudante · Sair

Escola
├── Aluno: login por código → painel da escola
├── Professor: estúdio da escola
└── Admin: membros · importar em lote · (relatórios «Em breve»)
```

### 4.2 Percurso por pessoa (alvo)

| Pessoa | Entra | Decide | Sai/continua | Passos | Regra de ouro |
|---|---|---|---|---:|---|
| **Aprendiz novo** | Landing → «Criar conta grátis» | Onboarding: explorar ou preparar prova | Painel com «Do meu curso» → 1.º simulado → resultado com «próximo passo» | 6 até ao 1.º simulado | Primeiro simulado em menos de 3 minutos; nada obrigatório além do registo |
| **Aprendiz regressado** | `/login` → painel | — | Continuar a trilha / simulado em curso | 2 | O painel diz o que fazer a seguir |
| **Aluno de escola** | `/login` (código de aluno + código da escola) | — | Painel da escola | 2 | Nunca vê o marketplace por engano |
| **Criador** | Credenciamento (candidatura) → aprovação | — | Estúdio → criar → publicar | 5 | Só publica depois de aprovado |
| **Professor** | `/login` (e-mail) | — | Estúdio da escola → criar | 3 | Publica só para a sua escola |
| **Admin** | `/login` (e-mail) | — | Membros / importar | 2 | Erros em PT, nada a meio |

**Sempre:** «Sair» visível, um só vocabulário, erros em PT-PT com próxima acção, sem ecrã com dados de exemplo, a 375 px sem scroll horizontal.

## 5. Parecer sobre os ecrãs (design)

| Ecrã | Veredicto | O que mexer |
|---|---|---|
| Login, registo | ✅ Claro, uma coluna | Registo: checklist de palavra-passe do protótipo (8+, letra, número); CTA da landing (F-03) |
| Onboarding | ✅ Bom ritmo | Transição por direcção (frente/trás); final com acção única |
| Painel | ✅ | Estado «zero» (conta nova) mostra 4 contadores a 0: trocar por «Faz o teu 1.º simulado» |
| Simulado / resultado | ⚠️ Resultado é um beco | «Próximo passo», explicação por pergunta, XP com contexto (ver F-04) |
| Notificações | ✅ (após #118) | — |
| Estúdio (criar) | ❌ Loop | F-01 |
| Definições, sessões, privacidade, compras, dúvidas, polo | ❌ Dados de exemplo | «Em breve» (F-05) |
| Ecrãs antigos (`/courses`, `/quiz`, `/dashboard/admin`) | ❌ Outro sistema visual | Migrar ou apagar (F-06) |

Contraste: iniciais do avatar abaixo de 3:1 (B-05, issue #114). Modo escuro: não existe (B-04, issue #113).

## 6. Limites desta auditoria

- Chromium a 375 px; só uma passagem a 1280 px na barra do criador. Sem Safari/Firefox/telemóvel real.
- Tempos do servidor de desenvolvimento; confirmar com `build` + `preview` e rede 3G.
- O percurso do aprendiz de **escola** não inclui responder a um simulado de uma trilha até ao fim.
- A vertente «gerar conteúdo com IA» não pôde ser auditada: depende de backend inexistente.
- Contas e conteúdo de teste (inclui «QA criador sem aprovacao») existem só na base local e **não devem subir jamais**.
