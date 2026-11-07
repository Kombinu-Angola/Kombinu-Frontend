import type { CampusPage } from "./CampusPageScreen";

/** Números alinhados com o catálogo curricular do backoffice (UAN, Faculdade de Economia). */
export const MOCK_CAMPUS: CampusPage = {
  university: "UAN",
  universityFull: "Universidade Agostinho Neto",
  faculty: "Faculdade de Economia",
  campus: "Campus Universitário",
  city: "Camama, Luanda",
  description:
    "Resumos, sebentas e simulados dos cursos de Economia, Gestão e Contabilidade, feitos por docentes e monitores da própria faculdade.",
  students: 2085,
  materials: 60,
  division: "Divisão Ouro",
  divisionRank: 2,
  leagueHref: "/v2/ligas",
  topStudents: [
    { rank: 1, name: "Mateus Kiala", course: "3.º ano · Economia", xp: 2140, streakDays: 14 },
    { rank: 2, name: "Orlando Fortuna", course: "2.º ano · Gestão", xp: 1850, streakDays: 7 },
    { rank: 3, name: "Jéssica Manuel", course: "2.º ano · Contabilidade", xp: 1620, streakDays: 5 },
  ],
  materialsList: [
    {
      id: "cm1",
      title: "Manual de exercícios: Macroeconomia I",
      subject: "Macroeconomia I",
      author: "Orlando Fortuna · docente verificado",
      priceKz: 1500,
      rating: 4.9,
      sizeKb: 1434,
      cover: "cover-economia",
      href: "/v2/sebenta",
    },
    {
      id: "cm2",
      title: "Contabilidade Geral I: lançamentos e PGC",
      subject: "Contabilidade Geral I",
      author: "Domingos Pascoal · contabilista certificado",
      priceKz: 1000,
      rating: 4.7,
      sizeKb: 980,
      cover: "cover-economia",
      href: "/v2/sebenta",
    },
    {
      id: "cm3",
      title: "Estatística aplicada: inferência sem dor de cabeça",
      subject: "Estatística Aplicada",
      author: "Célia Ngola · assistente universitária",
      priceKz: 0,
      rating: 4.8,
      sizeKb: 420,
      cover: "cover-engenharia",
      href: "/v2/sebenta",
    },
  ],
};
