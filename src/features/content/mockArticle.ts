import type { Article } from "./blocks";

/** Em produção: GET /api/articles/<id>/ devolve exatamente esta forma. */
export const MOCK_ARTICLE: Article = {
  id: "art-cambio-importacao",
  eyebrow: "Economia monetária",
  title: "Como a flutuação cambial afeta a importação de bens em Angola",
  author: { name: "Teresa Bento", role: "Economia e Finanças · UAN" },
  publishedAt: "2026-08-15",
  minutes: 6,
  audioMinutes: 6,
  completionXp: 50,
  keyPoints: [
    "A depreciação do Kwanza encarece de imediato os bens importados.",
    "O pass-through cambial em Angola é rápido e quase integral.",
    "Os custos logísticos indexados a moeda estrangeira multiplicam o efeito.",
  ],
  blocks: [
    {
      type: "takeaways",
      id: "t1",
      title: "Princípios-chave desta sessão",
      items: [
        {
          term: "Canal de absorção primária",
          text: "as vendas de divisas do BNA aos bancos comerciais retiram Kwanzas do mercado interbancário.",
        },
        {
          term: "Reservas internacionais líquidas",
          text: "o nível de reservas define a margem de amortecimento face a choques no preço do petróleo.",
        },
        {
          term: "Efeito nas taxas",
          text: "a escassez de divisas alarga o câmbio paralelo e faz oscilar as taxas entre bancos.",
        },
      ],
    },
    {
      type: "paragraph",
      id: "p1",
      text: "A dinâmica cambial em economias muito dependentes de importações, como a angolana, traz desafios próprios. Quando o Kwanza se deprecia face ao dólar e ao euro, o custo de comprar bens no exterior sobe na mesma proporção.",
    },
    {
      type: "callout",
      id: "c1",
      title: "Conceito fundamental em 30 segundos",
      text: "O pass-through cambial é a parte da variação da taxa de câmbio que passa para os preços internos. Em Angola, como há pouca substituição de importações na cesta básica, esse repasse é rápido e quase total, e chega depressa à inflação.",
    },
    {
      type: "quote",
      id: "q1",
      text: "A rigidez de divisas numa economia que importa quase tudo traduz-se numa drenagem imediata dos depósitos em moeda nacional.",
      source: "Teresa Bento, Cátedra de Macroeconomia, UAN",
    },
    {
      type: "flow",
      id: "fl1",
      title: "Transmissão cambial e drenagem de liquidez",
      caption: "Diagrama 2.1 — das vendas de divisas do banco central ao aperto no mercado interbancário.",
      steps: [
        { label: "Origem", title: "O BNA vende divisas", text: "Leilões de moeda estrangeira para os importadores." },
        { label: "Intermediação", title: "Débito de reservas", text: "Os bancos pagam as divisas com saldos em Kwanza." },
        { label: "Impacto", title: "Contração monetária", text: "Menos liquidez nos bancos, taxas interbancárias a subir." },
      ],
    },
    { type: "heading", id: "h1", text: "A cadeia de fornecimento em Luanda" },
    {
      type: "paragraph",
      id: "p2",
      text: "No Porto de Luanda, principal porta de entrada de bens, os custos logísticos também estão indexados a moeda estrangeira. O efeito multiplica-se: o importador paga mais pelo bem na origem, paga fretes mais caros e ainda tarifas portuárias ajustadas.",
    },
    {
      type: "figure",
      id: "f1",
      asset: "figure-porto-luanda",
      alt: "Navio de carga a descarregar contentores num porto",
      caption: "Fig. 1 — Fluxo de custos na importação pelo Porto de Luanda e os pontos de pressão cambial.",
    },
    {
      type: "checkpoint",
      id: "cp1",
      xp: 20,
      question: "Qual é o efeito imediato de o BNA aumentar a taxa de juro básica?",
      options: [
        { id: "a", label: "A", text: "Redução da liquidez e contenção da pressão inflacionária." },
        { id: "b", label: "B", text: "Aumento automático da importação de bens de consumo." },
        { id: "c", label: "C", text: "Desvalorização imediata da moeda nacional." },
        { id: "d", label: "D", text: "Isenção total de taxas aduaneiras." },
      ],
      correctOptionId: "a",
      explanation: {
        correct: "A contração monetária reduz o excesso de procura agregada e alivia a pressão sobre os preços.",
        incorrect: "Subir a taxa encarece o crédito e retira liquidez do mercado: o efeito é travar a procura.",
      },
    },
    {
      type: "paragraph",
      id: "p3",
      text: "Para reduzir estes efeitos, os agentes económicos recorrem a estratégias de cobertura cambial, embora os instrumentos disponíveis no mercado local ainda tenham liquidez limitada face a mercados mais maduros.",
    },
  ],
  next: { title: "Módulo 2: o sistema financeiro angolano", author: "Teresa Bento", minutes: 7, href: "/v2/leitura" },
};
