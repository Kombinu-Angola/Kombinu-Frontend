import type { Material } from "./types";

const base: Omit<Material, "id" | "href">[] = [
  { title: "Resumo completo de Direito Constitucional I", kind: "Resumo", area: "direito", university: "UAN", author: "António J.", rating: 4.8, reviews: 124, priceKz: 1500 },
  { title: "Exames resolvidos de Macroeconomia I", kind: "Exames resolvidos", area: "economia", university: "UCAN", author: "Maria C.", rating: 4.9, reviews: 89, priceKz: 0, bestseller: true },
  { title: "Fórmulas essenciais de Cálculo II", kind: "Fórmulas", area: "engenharia", university: "ISPTEC", author: "Paulo F.", rating: 4.6, reviews: 45, priceKz: 800 },
  { title: "Sebenta completa de Anatomia Humana", kind: "Sebenta", area: "saude", university: "UAN", author: "Ana S.", rating: 5, reviews: 210, priceKz: 2500 },
  { title: "Direito das Obrigações em esquemas", kind: "Resumo", area: "direito", university: "UCAN", author: "Luísa M.", rating: 4.7, reviews: 63, priceKz: 1200 },
  { title: "Contabilidade Financeira: exercícios resolvidos", kind: "Exames resolvidos", area: "economia", university: "ISAF", author: "Domingos P.", rating: 4.5, reviews: 38, priceKz: 1000 },
  { title: "Programação I: estruturas de dados", kind: "Resumo", area: "engenharia", university: "UAN", author: "Kelson A.", rating: 4.8, reviews: 72, priceKz: 0 },
  { title: "Fisiologia: mapas de revisão", kind: "Resumo", area: "saude", university: "UCAN", author: "Rosa T.", rating: 4.4, reviews: 21, priceKz: 900 },
  { title: "Microeconomia I: resumo por capítulos", kind: "Resumo", area: "economia", university: "UAN", author: "Célio V.", rating: 4.6, reviews: 57, priceKz: 1100 },
  { title: "Álgebra Linear: exames de anos anteriores", kind: "Exames resolvidos", area: "engenharia", university: "ISPTEC", author: "Paulo F.", rating: 4.9, reviews: 101, priceKz: 1500 },
];

export const MOCK_MATERIALS: Material[] = base.map((m, i) => ({ ...m, id: `mat-${i + 1}`, href: `#/marketplace/${i + 1}` }));
