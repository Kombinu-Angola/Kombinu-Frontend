import { api } from "./api";

export const CATEGORIAS = [
  { valor: "tecnologia", rotulo: "Tecnologia" },
  { valor: "negocios", rotulo: "Negócios" },
  { valor: "design", rotulo: "Design" },
] as const;

export const NIVEIS = ["Iniciante", "Intermediário", "Avançado"] as const;

export type Categoria = (typeof CATEGORIAS)[number]["valor"];
export type Nivel = (typeof NIVEIS)[number];

/** Conteúdo do backend (`/contents/`). Não tem preço nem avaliações: não se inventam. */
export interface Material {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  categoriaRotulo: string;
  nivel: string;
  duracao: string;
  miniatura: string | null;
  videoUrl: string;
  texto: string;
  etiquetas: string[];
  criadorId: string;
  criadorNome: string;
  criadoEm: string;
  quizId: string | null;
}

export interface PaginaMateriais {
  itens: Material[];
  total: number;
  proxima: number | null;
}

export interface FiltrosMateriais {
  categoria?: string;
  busca?: string;
  /** Id do criador (`?creator=`). */
  criador?: string;
  comQuiz?: boolean;
}

const rotulos: Record<string, string> = Object.fromEntries(CATEGORIAS.map((c) => [c.valor, c.rotulo]));

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor : "";
}

function mapear(raw: Record<string, unknown>): Material {
  const criador = (raw.creator ?? {}) as Record<string, unknown>;
  const categoria = texto(raw.category);
  return {
    id: texto(raw.id),
    titulo: texto(raw.title),
    descricao: texto(raw.description),
    categoria,
    categoriaRotulo: rotulos[categoria] ?? categoria,
    nivel: texto(raw.level),
    duracao: texto(raw.duration),
    miniatura: texto(raw.thumbnail) || null,
    videoUrl: texto(raw.video_url),
    texto: texto(raw.text_content),
    etiquetas: texto(raw.tags)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    criadorId: texto(criador.id) || String(criador.id ?? ""),
    criadorNome: texto(criador.name) || "Autor",
    criadoEm: texto(raw.created_at),
    quizId: texto(raw.quiz_id) || null,
  };
}

export const materialService = {
  /** `GET /contents/` (paginado, 20 por página); o workspace segue no `X-Workspace`. */
  async listar(filtros: FiltrosMateriais, pagina: number): Promise<PaginaMateriais> {
    const params: Record<string, string | number> = { page: pagina };
    if (filtros.categoria) params.category = filtros.categoria;
    if (filtros.busca) params.search = filtros.busca;
    if (filtros.criador) params.creator = filtros.criador;
    if (filtros.comQuiz !== undefined) params.has_quiz = String(filtros.comQuiz);
    const { data } = await api.get("/contents/", { params });
    const resultados: unknown[] = Array.isArray(data?.results) ? data.results : [];
    return {
      itens: resultados.map((r) => mapear(r as Record<string, unknown>)),
      total: typeof data?.count === "number" ? data.count : resultados.length,
      proxima: data?.next ? pagina + 1 : null,
    };
  },

  /** `GET /contents/{id}/`. Um conteúdo de outro contexto devolve 404. */
  async obter(id: string): Promise<Material> {
    const { data } = await api.get(`/contents/${encodeURIComponent(id)}/`);
    return mapear(data);
  },
};
