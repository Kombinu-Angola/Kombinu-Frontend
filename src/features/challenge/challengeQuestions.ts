export type ChallengeOption = { id: string; label: string; text: string };

export type ChallengeQuestion = {
  id: string;
  stem: string;
  /** Tabela de apoio opcional (ex.: balanço de pagamentos). */
  table?: { caption: string; columns: string[]; rows: Array<[string, string, string]> };
  options: ChallengeOption[];
  correctOptionId: string;
  explanation: string;
  /** XP base; o desafio aplica o multiplicador. */
  xp: number;
};

/** Em produção: GET /api/challenges/<id>/questions/ (sem o gabarito, validado no servidor). */
export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    id: "q1",
    stem: "Analisa a tabela do balanço de pagamentos e identifica o saldo da conta corrente.",
    table: {
      caption: "Balanço de pagamentos do período, em Kwanzas",
      columns: ["Indicador", "Créditos (Kz)", "Débitos (Kz)"],
      rows: [
        ["Balança comercial (bens)", "4.500.000", "2.100.000"],
        ["Rendimento primário", "300.000", "1.200.000"],
        ["Rendimento secundário (transferências)", "150.000", "450.000"],
      ],
    },
    options: [
      { id: "a", label: "A", text: "Excedente de 1.200.000 Kz" },
      { id: "b", label: "B", text: "Défice de 800.000 Kz" },
      { id: "c", label: "C", text: "Excedente de 1.200.000 Kz na balança comercial apenas" },
      { id: "d", label: "D", text: "Equilíbrio: saldo zero" },
    ],
    correctOptionId: "a",
    explanation:
      "Créditos 4.950.000 menos débitos 3.750.000 dá um excedente de 1.200.000 Kz na conta corrente.",
    xp: 20,
  },
  {
    id: "q2",
    stem: "O BNA sobe o coeficiente de reservas obrigatórias. Qual é o efeito direto na banca comercial?",
    options: [
      { id: "a", label: "A", text: "Mais liquidez livre para conceder crédito." },
      { id: "b", label: "B", text: "Menos liquidez livre e menor capacidade de crédito." },
      { id: "c", label: "C", text: "Aumento imediato das reservas cambiais do país." },
      { id: "d", label: "D", text: "Redução automática da taxa de inflação." },
    ],
    correctOptionId: "b",
    explanation: "Reservas obrigatórias mais altas retêm fundos no banco central e reduzem o crédito disponível.",
    xp: 20,
  },
  {
    id: "q3",
    stem: "Numa economia muito dependente de importações, o que acontece aos preços internos quando o Kwanza se deprecia?",
    options: [
      { id: "a", label: "A", text: "Sobem, porque o repasse cambial é rápido e quase integral." },
      { id: "b", label: "B", text: "Descem, porque as exportações ficam mais baratas." },
      { id: "c", label: "C", text: "Ficam iguais, porque os preços são fixados por lei." },
      { id: "d", label: "D", text: "Só mudam no ano seguinte." },
    ],
    correctOptionId: "a",
    explanation: "Com pouca substituição de importações, a depreciação chega depressa aos preços da cesta básica.",
    xp: 20,
  },
];
