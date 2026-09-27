import type { Recommendation, StudentProfile } from "./types";

/** Em produção: GET /api/recommendations/first/?subject=…&university=… */
export function mockRecommendation(profile: StudentProfile): Recommendation {
  return {
    title: "Guia de 5 minutos: como funciona a Taxa BNA",
    excerpt:
      "Os pontos que mais saem nos exames, num resumo esquematizado com 2 quizzes para fixares logo a matéria.",
    subject: profile.criticalSubject || "Macroeconomia I",
    institution: profile.university || "UAN",
    minutes: 5,
    quizzes: 2,
    quizXp: 30,
    author: "Dra. Teresa Bento (UAN)",
    sizeLabel: "leve · menos de 300 KB",
    href: "/v2/leitura",
  };
}
