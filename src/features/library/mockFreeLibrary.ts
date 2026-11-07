import type { Asset3DName } from "../../lib/assets3d";

export type FreeMaterialFormat = "resumo" | "quizzes" | "infografico";

export type FreeMaterial = {
  id: string;
  title: string;
  author: { name: string; role: string };
  university: string;
  faculty: string;
  format: FreeMaterialFormat;
  minutes: number;
  quizzes: number;
  sizeKb: number;
  readers: number;
  cover: Asset3DName;
  href: string;
};

export const FREE_FACULTIES = [
  { value: "todas", label: "Todas as faculdades" },
  { value: "uan-economia", label: "UAN — Economia e Gestão" },
  { value: "uan-engenharia", label: "UAN — Engenharia" },
  { value: "ucan-direito", label: "UCAN — Direito" },
  { value: "isaf-financas", label: "ISAF — Finanças e Contabilidade" },
  { value: "isptec-exatas", label: "ISPTEC — Ciências exatas" },
];

export const FREE_FORMATS: ReadonlyArray<{ value: FreeMaterialFormat | "todos"; label: string }> = [
  { value: "todos", label: "Todos os formatos" },
  { value: "resumo", label: "Resumos em texto" },
  { value: "quizzes", label: "Baterias de quizzes" },
  { value: "infografico", label: "Infográficos" },
];

export const FREE_MATERIALS: FreeMaterial[] = [
  {
    id: "fl1",
    title: "Estruturas de dados: árvores binárias e grafos em Python",
    author: { name: "Vladimiro Baptista", role: "Monitor de Algoritmos" },
    university: "UAN",
    faculty: "uan-engenharia",
    format: "resumo",
    minutes: 8,
    quizzes: 12,
    sizeKb: 480,
    readers: 1240,
    cover: "cover-engenharia",
    href: "/v2/leitura",
  },
  {
    id: "fl2",
    title: "Síntese de Direito Constitucional angolano: a CRA de 2010",
    author: { name: "Teresa Bento", role: "Monitora de Direito" },
    university: "UCAN",
    faculty: "ucan-direito",
    format: "resumo",
    minutes: 12,
    quizzes: 8,
    sizeKb: 610,
    readers: 980,
    cover: "cover-direito",
    href: "/v2/leitura",
  },
  {
    id: "fl3",
    title: "Bateria de quizzes: Contabilidade Geral I",
    author: { name: "Domingos Pascoal", role: "Contabilista certificado" },
    university: "ISAF",
    faculty: "isaf-financas",
    format: "quizzes",
    minutes: 10,
    quizzes: 40,
    sizeKb: 220,
    readers: 1620,
    cover: "cover-economia",
    href: "/v2/desafio",
  },
  {
    id: "fl4",
    title: "Infográfico: como se forma a taxa de câmbio em Angola",
    author: { name: "Célia Ngola", role: "Assistente universitária" },
    university: "UAN",
    faculty: "uan-economia",
    format: "infografico",
    minutes: 4,
    quizzes: 3,
    sizeKb: 180,
    readers: 2310,
    cover: "cover-economia",
    href: "/v2/leitura",
  },
  {
    id: "fl5",
    title: "Cálculo I: limites e derivadas com exercícios resolvidos",
    author: { name: "Nzuzi Garcia", role: "Finalista de Informática" },
    university: "ISPTEC",
    faculty: "isptec-exatas",
    format: "resumo",
    minutes: 15,
    quizzes: 18,
    sizeKb: 720,
    readers: 870,
    cover: "cover-engenharia",
    href: "/v2/leitura",
  },
  {
    id: "fl6",
    title: "Quizzes de anatomia: sistema cardiovascular",
    author: { name: "Esperança Domingos", role: "Interna de Medicina" },
    university: "UAN",
    faculty: "uan-engenharia",
    format: "quizzes",
    minutes: 9,
    quizzes: 35,
    sizeKb: 260,
    readers: 1450,
    cover: "cover-saude",
    href: "/v2/desafio",
  },
];
