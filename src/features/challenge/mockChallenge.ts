import type { Challenge } from "./types";

export const mockChallenge = (): Challenge => ({
  id: "ch-2026-38",
  title: "Estruturas de Dados",
  subject: "Programação I",
  endsAt: new Date(Date.now() + (14 * 3600 + 22 * 60 + 5) * 1000).toISOString(),
  prize: {
    title: "Prémio para o top 10",
    description: "Um voucher de 5.000 Kz em cursos para cada um dos 10 primeiros classificados.",
  },
  rules: [
    { id: "q", icon: "target", title: "10 perguntas", description: "Escolha múltipla sobre pilhas, filas e árvores." },
    { id: "t", icon: "clock", title: "5 minutos", description: "O tempo conta a partir da primeira pergunta e não pode ser pausado." },
    { id: "x", icon: "star", title: "XP a triplicar", description: "Cada resposta certa vale 3 vezes mais XP do que o normal." },
  ],
  participants: 1284,
  completed: false,
});
