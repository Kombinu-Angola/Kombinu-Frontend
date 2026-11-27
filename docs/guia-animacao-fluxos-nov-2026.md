# Guia de animação por fluxo — frontend Kombinu (26 Nov 2026)

> **Para quê:** dizer, ecrã a ecrã dos fluxos de `auditoria-fluxos-frontend-nov-2026.md`, **o que anima, o que não anima, com que ferramenta e com que valores**. Nenhum código foi alterado: é a especificação para depois implementar.
> **Base:** competências `animate`, `choreograph`, `animation-performance` e `emil-design-eng`; regras do CLAUDE.md (Tailwind, sem `style={{}}` fora de valores dinâmicos, testar a 375 px, `dark:` nos componentes novos).
> **Honestidade:** a sensação (feel) não se decide só pelo código. O que pede teste em aparelho está marcado **[testar]**.

## 1. O que o projecto já tem (aproveitar)

| Peça | Onde | Estado |
|---|---|---|
| Biblioteca `motion` 13 | 11 ficheiros (fluxo de preparar, folhas, cabeçalho público, legal) | ✅ usar só onde há gesto/mola/saída |
| Keyframes: `panel-in` (180 ms, opacidade + 4 px) e `fade-in` (150 ms) em `src/styles/kombinu-auth.css`; `pop-in` (320 ms), `feedback-in` (200 ms), `confetti-fall`, `pulse-ring` em `src/index.css` (~linha 413) | ver ficheiros | ✅ |
| **Duas curvas**: `--ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1)` (auth/fluxo, a curva forte recomendada) e `--ease-out-quint: cubic-bezier(0.2, 0, 0, 1)` (`index.css:413`) | — | ⚠️ ver 2: uniformizar |
| `prefers-reduced-motion` | 25 ficheiros + bloco global | ✅ manter em tudo o que se acrescentar |
| `hover:` | 115 ficheiros | ✅ Tailwind 4 só aplica `hover` em dispositivos com rato |
| Durações | 105× `duration-150`, 27× `200`, 6× `300` | ✅ dentro do alvo (< 300 ms) |
| Nenhum `scale(0)` nem `ease-in` | — | ✅ |

## 2. Tokens (uma tabela, sem inventar valores)

| Uso | Valor | Nota |
|---|---|---|
| Entrar/sair, resposta ao utilizador | `ease-out` forte: `cubic-bezier(0.23, 1, 0.32, 1)` | **Já existe** como `--ease-out-strong`. Uniformizar: o que usa `--ease-out-quint` (`pop-in`, `feedback-in`, `confetti-fall`) passa a `--ease-out-strong` (não é urgente) |
| Mover/transformar no ecrã | `cubic-bezier(0.77, 0, 0.175, 1)` | Gaveta do criador, barra lateral |
| Folha/gaveta (padrão iOS) | `cubic-bezier(0.32, 0.72, 0, 1)` | `BottomSheet` |
| Progresso contínuo | `linear` | Barra de onboarding |
| Pressão de botão | `scale(0.97)`, 100–160 ms | Os botões 3D já usam `active:translate-y-1`: manter |
| Mola (só com gesto) | `{ type: "spring", duration: 0.5, bounce: 0.2 }` | Arrastar folhas |
| Teto de duração de UI | **250 ms** (modais/folhas até 300) | |

**Regra de propriedades:** só `transform` e `opacity`. Nada de `width`, `height`, `padding`, `margin`, `top`, `left`. Nunca `transition: all`: nomear as propriedades.

## 3. Fluxo → ecrã → animação

Frequência: **A** = dezenas de vezes por dia (quase nada), **B** = ocasional, **C** = raro/primeira vez (aqui cabe encanto).

### 3.1 Entrada (visitante)

| Ecrã / momento | Freq. | Propósito | Anima? | Como |
|---|---|---|---|---|
| Landing: entrada do conteúdo | C | Orientar | Sim, pouco | Já existe `reveal-up`; manter, sem escalonar o que o utilizador vai clicar |
| `/login`, `/register`: abrir página | B | — | **Não** | Página estática; é o primeiro ecrã e deve aparecer já |
| Campo «Código da escola» (login) | B | Estado | Sim | `animate-panel-in` (180 ms, opacidade + 4 px) ✅ já feito; sem altura animada |
| Erro de campo / `FormAlert` | B | Feedback | Sim | `feedback-in` 200 ms; **sem abanar** (shake) em login: parece punição |
| Aviso de menor (registo) | B | Estado | Sim, mínimo | Mesmo `feedback-in`; `role="status"` |
| Botão «A entrar…» | A | Feedback | Sim | Spinner `animate-spin` já existe; `aria-busy` ✅ |

### 3.2 Onboarding (aprendiz novo) — coreografia

Um só movimento por passo: **o painel do passo** entra; barra de progresso acompanha; nada mais se mexe.

| Momento | Freq. | Como | Duração |
|---|---|---|---|
| Passo seguinte | C | Painel novo: `opacity 0→1` + `translateX(16px→0)` (para a frente) | 200 ms, `ease-out` |
| Passo anterior | C | Igual, mas `translateX(-16px→0)` (direcção contrária; passar a direcção por `custom` se usar `motion`) | 200 ms |
| Barra de progresso | C | `transform: scaleX` com `linear`; **não** animar `width` | 300 ms |
| Cartões de intenção (E2) | C | Sem escalonamento: dois cartões aparecem juntos (uma entrada por contentor) | — |
| Ecrã final «Está tudo pronto» | C | Selo de caloiro com `pop-in` (320 → **250 ms**); números (XP, ofensiva) **sem** contagem animada (valem 0) | 250 ms |
| Confetti | C | Só se houve conquista real. Em conta nova (0 XP) **não** usar | — |
| «Ir para o painel» | C | Sem transição de página | — |

Reduced motion: sem `translate`; só `opacity` (150 ms); sem confetti.

### 3.3 Painel e navegação (frequência A → quase nada)

| Momento | Anima? | Como / porquê |
|---|---|---|
| Trocar de separador (Trilhas/Simulados/Sebentas) | **Não** | Separadores são pares, não hierarquia; deslizar sugere profundidade que não existe |
| Abrir o painel, mudar de espaço | **Não** | Frequente. Mostrar esqueleto da própria página, não círculo a ecrã inteiro (F-11) |
| Cartão «Do meu curso» | **Não** | Faz parte do conteúdo; sem entrada |
| Cartões de material | Só `hover` (rato) | `transform: translateY(-2px)` 150 ms, em `@media (hover:hover)`; sem sombra animada (usar `drop-shadow` se for preciso) |
| Esqueleto de carregamento | Sim | `animate-pulse` já existe (11×); manter |

### 3.4 Simulado e resultado (o momento que merece mais cuidado)

| Momento | Freq. | Propósito | Como | Duração |
|---|---|---|---|---|
| Carregar numa opção | A | Feedback | Cor/contorno por `transition-[background-color,border-color]` + `scale(0.98)` ao premir; **sem** `transition-all` | 120 ms |
| Resposta certa/errada | A | Feedback | Cor + ícone; `feedback-in`; **sem** abanar | 200 ms |
| Mudar de pergunta | A | Continuidade | Crossfade `opacity` | 120–150 ms |
| Cronómetro/progresso | A | Estado | `scaleX` linear | — |
| **Resultado** (1.ª vez) | C | Encanto | 1) título; 2) chip de XP com `pop-in` 250 ms; 3) cartão «Próximo passo» entra 80 ms depois (2 itens, não mais). Os restantes itens da lista aparecem juntos | ≤ 330 ms no total |
| Resultado (repetido) | B | — | Sem encanto, só entrada simples | 150 ms |
| «Tentar de novo» | A | — | Sem transição, reinicia | — |

Proibido: contar o número de acertos a subir em simulados repetidos; confetti com 1 acerto em 3.
**[testar]** o chip de XP e o cartão a 375 px em Android modesto.

### 3.5 Notificações

| Momento | Anima? | Como |
|---|---|---|
| Abrir a lista | Não | Frequente |
| Marcar como lida | Sim, mínimo | Ponto de «por ler» desaparece com `opacity` 150 ms; cartão passa de realçado a normal sem mexer no layout |
| «Marcar todas» | Sim | O mesmo, todos ao mesmo tempo (sem escalonar) |
| Estado de erro (#118) | Sim | `feedback-in` 200 ms |

### 3.6 Estúdio do criador

| Momento | Freq. | Como | Nota de desempenho |
|---|---|---|---|
| Barra lateral expande ao passar o rato | A | Largura **não** anima (é sobreposição): mostrar rótulos com `opacity` 150 ms | Hoje `transition-[padding]` ao **fixar** a barra anima layout: trocar por `transform` no contentor (F-12) |
| Gaveta a 375 px | B | `translateX(-100% → 0)`, curva de gaveta, 250 ms; fundo `opacity` 200 ms | Sair mais rápido (150 ms) |
| Cartões «O que queres criar?» | C | Sem escalonamento (uma entrada por contentor) | Quando o compositor existir (F-01) |
| Guardar/publicar | B | Botão em estado de carregamento → `feedback-in` de confirmação; toast `sonner` já existe | — |
| Apagar | B | Linha sai com `opacity` + `transform`, e **as vizinhas fecham o espaço enquanto sai** (`position:absolute` no que sai / `AnimatePresence mode="popLayout"`) | Evita a pausa antes do fecho |

### 3.7 Sair e erros

| Momento | Anima? |
|---|---|
| Botão «Sair» | Não (acção rara e final; recarrega em `/login`) |
| `ErrorBoundary`, 404 | Não |
| Sessão expirada | Não |

## 4. Desempenho (do `animation-performance`)

1. **Diagnóstico antes de `will-change`.** Só acrescentar `will-change: transform` se se vir um salto de 1 px ou quedas de frames. Nunca em contentores grandes.
2. **Padding da barra do criador** (`CreatorShell.tsx:199`): anima layout. Trocar por `transform` ou aceitar sem animação.
3. **`transition-all`**: 20 sítios. 15 estão em páginas antigas (apagar com a limpeza F-06); 5 são componentes shadcn (`badge`, `button`, `progress`, `sidebar`, `tabs`): nomear as propriedades.
4. **CSS variáveis herdadas:** não animar uma variável do pai para o filho (arrasto de folhas, `BottomSheet`): escrever `transform` no próprio elemento.
5. **`motion` no thread principal:** `layoutId`/`layout` não correm fora do thread principal; durante a navegação (carregamento) preferir animação CSS. Já no projecto: só o fluxo de preparar usa `motion` para gestos.
6. **Desfoque:** só `blur()` ≤ 20 px, e só em transições raras (não em listas).
7. **Medir em rede 3G e telemóvel médio**, não no portátil: orçamento de 8 ms por frame em ecrãs de 120 Hz.

## 5. Acessibilidade e movimento reduzido (obrigatório em tudo o que se acrescentar)

- `prefers-reduced-motion: reduce` → sem `translate`/`scale`/confetti; manter só `opacity` e cor.
- Estados novos usam `aria-live`/`role="status"` (já assim no aviso de menores e nas notificações).
- Nenhuma informação só por movimento: a cor/ícone da resposta certa/errada tem texto.
- Alvos de toque ≥ 44 px (já respeitado nos botões e filtros).

## 6. Ordem de implementação sugerida (cada ponto = um PR pequeno)

1. **Resultado do simulado:** cartão «Próximo passo» + entrada em 2 tempos (3.4). Junta F-04.
2. **Onboarding:** transição por direcção (3.2).
3. **Estúdio:** substituir `transition-[padding]` (3.6) e nomear propriedades nos 5 componentes shadcn.
4. **Esqueleto** no lugar do círculo a ecrã inteiro (`CarregarTela`).
5. Só depois: uniformizar na curva `--ease-out-strong` (já existe).

## 7. O que NÃO animar (decisão tomada)

Separadores de navegação, abertura de painel/lista/notificações, mudança de espaço, `/login` e `/register` ao abrir, contadores do painel, qualquer coisa disparada por teclado, confetti em contas sem conquista, «shake» em erros de login.

## 8. Verificação de sensação (só em aparelho)

1. Premir uma opção do simulado e largar a meio: volta sem salto?
2. Marcar 3 notificações seguidas: o ponto não pisca?
3. Gaveta do criador: abrir e fechar depressa três vezes (interrupção).
4. Resultado do simulado: o chip de XP e o cartão lêem-se como um só gesto, não como fila?
5. Android modesto com «Reduzir animações» ligado: tudo continua legível?
6. Rever tudo no dia seguinte, com olhos frescos.
