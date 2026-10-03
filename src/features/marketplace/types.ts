export type Area = "direito" | "economia" | "engenharia" | "saude";

/** Contrato esperado de GET /api/materials/?university=&area=&q=&page= */
export type Material = {
  id: string;
  title: string;
  kind: "Resumo" | "Exames resolvidos" | "Fórmulas" | "Sebenta";
  area: Area;
  university: string;
  author: string;
  rating: number;
  reviews: number;
  /** 0 = grátis */
  priceKz: number;
  bestseller?: boolean;
  href: string;
};
