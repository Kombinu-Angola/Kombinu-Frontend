import type { CreatorPublicProfile } from "./types";

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

export const MOCK_CREATOR: CreatorPublicProfile = {
  name: "Orlando Fortuna",
  handle: "@orlandofortuna",
  university: "Universidade Agostinho Neto (UAN)",
  faculty: "Faculdade de Ciências",
  bio: "Finalista de Engenharia Informática na UAN. Explicador de estruturas de dados, algoritmos e programação web. Mais de 850 estudantes acompanhados.",
  verified: true,
  plan: "pro",
  stats: { students: 1240, rating: 4.95, reviews: 142, materials: 8, passRate: 99.4 },
  methodology: [
    "Cada sebenta começa pelos exames dos últimos três anos da cadeira.",
    "Os conceitos aparecem sempre com um exemplo resolvido antes da teoria formal.",
    "Todos os materiais têm quizzes com explicação de cada alternativa, certa ou errada.",
  ],
  quizzes: 14,
  subscriptionKz: 2500,
  materials: [
    { id: "m1", title: "Algoritmos estruturados em Python: da teoria ao exame", subject: "Programação I", cover: "cover-engenharia", priceKz: 1500, rating: 4.9, students: 320, href: "#/sebenta" },
    { id: "m2", title: "Estruturas de dados: listas, pilhas e árvores", subject: "Estruturas de Dados", cover: "cover-engenharia", priceKz: 1800, rating: 5, students: 210, href: "#/sebenta" },
    { id: "m3", title: "Complexidade assintótica sem dor de cabeça", subject: "Algoritmos", cover: "cover-economia", priceKz: 0, rating: 4.8, students: 480, href: "#/sebenta" },
    { id: "m4", title: "Programação web: do HTML ao deploy", subject: "Tecnologias Web", cover: "cover-direito", priceKz: 2000, rating: 4.7, students: 132, href: "#/sebenta" },
  ],
  reviewList: [
    { id: "r1", student: "Jandira M.", course: "Gestão de Empresas · UAN", rating: 5, text: "Os exemplos resolvidos antes da teoria mudaram a forma como estudo. Passei a cadeira à primeira.", at: daysAgo(4) },
    { id: "r2", student: "Cláudio B.", course: "Direito Público · UCAN", rating: 5, text: "Explicações curtas e diretas. Os quizzes apanham exatamente o que sai no exame.", at: daysAgo(12) },
    { id: "r3", student: "Nelson D.", course: "Economia · UAN", rating: 4, text: "Muito bom, só faltam mais exercícios resolvidos na parte de árvores.", at: daysAgo(20) },
  ],
};
