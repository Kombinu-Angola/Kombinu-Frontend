# Assets 3D (Claymorphism) — mapeamento e prompts

## Regra de uso

Só as ilustrações (≥ 24px) passam a 3D. Os ícones pequenos de interface — check, seta, ajuda, voltar, ✕, sinal de dados — ficam em SVG inline (`Icon.tsx`): mudam de cor por estado, não custam pedidos de rede e respeitam a regra -ink do design system. O logótipo nunca é gerado por IA: usa o monograma oficial em `/public/assets/brand/`.

## Prefixo de estilo comum (colar antes de cada prompt)

```
3D clay-style icon, soft matte plasticine material, rounded chunky shapes, subtle subsurface glow,
soft studio lighting from top-left, gentle ambient occlusion, no outlines, no text, no letters,
brand palette: ocean blue #1658B3, deep blue #0D3C88, sunbeam yellow #FFD500, white #FFFFFF,
accent green #58CC02, isometric three-quarter view, centered, single object, isolated on
transparent background, clean edges, 1024x1024
```

Midjourney: acrescentar `--style raw --v 7 --ar 1:1 --no text, letters, background, shadow on floor`.
Recraft: estilo "3D render / Clay", fundo transparente ativado.
DALL·E 3: pedir explicitamente "transparent PNG background" e remover o fundo depois se necessário.

## Mapeamento

| Ficheiro (`/public/assets/3d/`) | Substitui no HTML original | Onde aparece | Tamanho | Prompt (depois do prefixo) |
| --- | --- | --- | --- | --- |
| `kombi-student` | `local_library` (Material Symbols) no cartão de estudante | `RoleCard` (estudante) | 112px | `a friendly round mascot character made of blue clay, big curious eyes, holding an open yellow book, small graduation cap tilted on its head, cheerful and energetic pose` |
| `creator-sebentas` | `verified` no cartão de criador | `RoleCard` (criador) | 112px | `a neat stack of three blue and white study notebooks bound with spiral rings, a round yellow verification seal with a white checkmark leaning on the stack, one golden coin beside it` |
| `diagnostic-target` | ícone de monitor na caixa de contexto do quiz | `DiagnosticQuizScreen` | 40px | `a round archery target with blue and white rings and a yellow center, a small green clay dart stuck near the center, playful and precise` |
| `xp-bolt` | emoji ⚡ do selo "+50 XP em jogo" | `XpBadge` | 24px | `a chunky yellow lightning bolt with rounded edges inside a small blue circular coin rim, glossy highlight on top edge, reads clearly at very small sizes` |
| `trophy-complete` | (novo) ecrã de fim do diagnóstico | `DiagnosticSummary` | 120px | `a small rounded golden-yellow trophy cup with blue handles on a short blue pedestal, a white star on the cup, tiny confetti pieces floating around` |
| `document-upload` | ícone de documento na zona de envio (Creator-02) | `FileDropzone` | 56px | `a single white document sheet with rounded corners and two blue text lines, a round blue badge with a white upward arrow overlapping its bottom-right corner` |
| `studio-draft` | amostra (Creator-02) e cartão "comece a criar" (Creator-04) | `FileDropzone` compacto, `CreatorConfirmationScreen` | 40–64px | `an open spiral notebook in white and blue with a chunky yellow pencil resting diagonally across it, a small green sparkle near the pencil tip` |
| `wallet-express` | `phone_iphone` na secção de recebimentos (Creator-03) | `StepMonetization` | 48px | `a rounded blue smartphone standing slightly tilted, a golden coin floating out of its screen, a small green checkmark bubble beside it` |
| `shield-verified` | escudo SVG com anel pulsante (Creator-04) | `CreatorConfirmationScreen` | 88px | `a rounded blue shield with a thick white checkmark in the center and a thin yellow rim, soft glow behind it` |
| `kombi-celebrate` | mascote com capelo do ecrã final (ON-04) | `ProfileActivatedScreen` | 128px | `the same friendly round blue clay mascot, arms raised in celebration, small black graduation cap with a yellow tassel, tiny yellow stars around its head` |
| `badge-caloiro` | troféu SVG do emblema "Caloiro" | `ProfileActivatedScreen` | 56px | `a round yellow medal badge with a blue ribbon on top and a small white star embossed in the center, thick rounded rim` |
| `streak-flame` | `local_fire_department` da sequência | `ProfileActivatedScreen` | 56px | `a chunky rounded orange flame (#FF9600) with a yellow inner core, soft glossy highlight, friendly and warm, no face` |
| `challenge-bolt` | `bolt` gigante do banner do desafio | `ChallengeScreen` | 72px | `a chunky rounded lightning bolt in dark ink blue (#0B1215) with a thin yellow rim, slight tilt, designed to sit on a bright orange background` |
| `cover-direito` | fotografias de capa (Direito) | `MaterialCard` | 80px | `a rounded blue balance scale with two small golden pans, standing on a short white base` |
| `cover-economia` | fotografias de capa (Economia) | `MaterialCard` | 80px | `three rounded blue bar-chart columns of rising height with a small golden coin on top of the tallest` |
| `cover-engenharia` | fotografias de capa (Engenharia) | `MaterialCard` | 80px | `a rounded square microchip in blue with white pins and a small yellow gear beside it` |
| `cover-saude` | fotografias de capa (Saúde) | `MaterialCard` | 80px | `a rounded red-coral clay heart with a small white medical cross badge on its lower right` |
| `sms-code` | `sms_failed` do ecrã de entrada | `AuthScreen` | 72px | `a rounded blue smartphone standing upright with a small white chat bubble floating above it showing three yellow dots, and a tiny green padlock badge at its base` |
| `figure-porto-luanda` | fotografia do artigo sobre o Porto de Luanda | `BlockRenderer` (bloco figura) | 140px | `a rounded clay cargo ship in blue and white carrying three stacked containers in yellow, blue and white, beside a small dock crane` |
| `figure-escassez` | imagem do rascunho do estúdio | `BlockRenderer` (bloco figura) | 140px | `three rounded clay geometric solids — a blue cube, a yellow sphere and a white pyramid — grouped on a small light base` |

Nota: nada de marcas de terceiros nos assets (ex.: logótipo Multicaixa Express); o pagamento é referido em texto.

## Exportação (data-lean)

1. Gerar a 1024px, remover fundo (se necessário) e recortar ao objeto com ~4% de margem.
2. Exportar `@2x` ao dobro do tamanho de uso e `@1x` ao tamanho de uso (ex.: 224px e 112px).
3. Converter para WebP com transparência: `cwebp -q 78 -alpha_q 85 -resize 224 0 in.png -o kombi-student@2x.webp`
4. Orçamento: ≤ 12 KB (@1x) e ≤ 25 KB (@2x). Os vinte assets juntos ficam abaixo de ~400 KB. As capas substituem uma fotografia por cartão (~80 KB cada) por quatro ilustrações reutilizadas e só carregam uma vez (cache).
