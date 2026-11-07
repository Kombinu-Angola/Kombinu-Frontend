import type { CreatorApplicationRow } from "./creatorQueueTypes";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

const baseCriteria = [
  { id: "identidade", title: "Identidade e vínculo confirmados", detail: "Nome no documento coincide com o da candidatura.", prechecked: true },
  { id: "credencial", title: "Credencial académica válida", detail: "Cartão docente, declaração ou cédula dentro da validade.", prechecked: true },
  { id: "express", title: "Número Multicaixa Express registado", detail: "Titularidade confirmada por SMS; o teste de 1 Kz corre após a aprovação.", prechecked: true },
  { id: "amostra", title: "Amostra com qualidade pedagógica", detail: "Estrutura, correção técnica e gabarito nos quizzes.", prechecked: false },
];

export const CREATOR_QUEUE: CreatorApplicationRow[] = [
  {
    protocol: "PROT-CRE-2026-8942",
    submittedAt: hoursAgo(2.5),
    slaHours: 4,
    candidate: { name: "Mateus Silva", specialty: "Macroeconomia I e II" },
    university: "UAN",
    faculty: "Economia",
    affiliation: "Docente titular",
    phone: "923456789",
    sampleIncluded: true,
    documents: [
      { id: "d1", name: "cartao-docente.pdf", sizeKb: 420, ok: true },
      { id: "d2", name: "amostra-sebenta.pdf", sizeKb: 780, ok: true },
    ],
    criteria: baseCriteria,
  },
  {
    protocol: "PROT-CRE-2026-8943",
    submittedAt: hoursAgo(9),
    slaHours: 24,
    candidate: { name: "Hamilton Kiala", specialty: "Direito Civil III" },
    university: "UCAN",
    faculty: "Direito",
    affiliation: "Explicador independente",
    phone: "941887302",
    sampleIncluded: false,
    documents: [{ id: "d1", name: "declaracao-habilitacoes.pdf", sizeKb: 310, ok: true }],
    criteria: baseCriteria.map((c) =>
      c.id === "amostra" ? { ...c, detail: "Sem amostra submetida: avaliar só pelas credenciais.", prechecked: false } : c,
    ),
  },
  {
    protocol: "PROT-CRE-2026-8944",
    submittedAt: hoursAgo(21),
    slaHours: 24,
    candidate: { name: "Esperança Manuel", specialty: "Gestão Bancária" },
    university: "ISAF",
    faculty: "Administração e Finanças",
    affiliation: "Monitor académico",
    phone: "931890456",
    sampleIncluded: true,
    documents: [
      { id: "d1", name: "declaracao-monitor.jpg", sizeKb: 1240, ok: false, note: "Imagem desfocada na zona do carimbo." },
      { id: "d2", name: "amostra-resumo.pdf", sizeKb: 520, ok: true },
    ],
    criteria: baseCriteria.map((c) => (c.id === "credencial" ? { ...c, prechecked: false } : c)),
  },
  {
    protocol: "PROT-CRE-2026-8945",
    submittedAt: hoursAgo(30),
    slaHours: 24,
    candidate: { name: "Nzuzi Garcia", specialty: "Bases de Dados II" },
    university: "ISPTEC",
    faculty: "Engenharia Informática",
    affiliation: "Estudante finalista",
    phone: "928112334",
    sampleIncluded: true,
    documents: [
      { id: "d1", name: "cartao-estudante.pdf", sizeKb: 260, ok: true },
      { id: "d2", name: "amostra-arvores-b.pdf", sizeKb: 900, ok: true },
    ],
    criteria: baseCriteria,
  },
];
