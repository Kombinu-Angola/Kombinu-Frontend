import { api } from "./api";
import type { IconName } from "../components/ui/Icon";
import type {
  AppNotification,
  NotificationCategory,
  NotificationTone,
} from "../features/notifications/types";

type RawTarget = { kind: string; id: string };

type RawNotification = {
  id: string;
  category: string;
  tone: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  target: RawTarget | null;
};

type RawPage = { count?: number; next?: string | null; results?: RawNotification[] };

export type PaginaNotificacoes = {
  itens: AppNotification[];
  total: number;
  /** Próxima página (1-based), ou `null` na última. */
  proxima: number | null;
};

const CATEGORIAS: ReadonlyArray<NotificationCategory> = ["gamificacao", "conteudo", "conta"];
const TONS: ReadonlyArray<NotificationTone> = ["urgente", "informativo", "neutro"];

const ICONE: Record<NotificationCategory, IconName> = {
  gamificacao: "flame",
  conteudo: "book",
  conta: "bell",
};

/**
 * O backend envia `target`; o `href` é decidido aqui (a rota é do SPA). As rotas /v2 ainda
 * não têm `:id`, por isso o alvo segue em query string, como no `trilhaService`.
 */
function accaoDoAlvo(target: RawTarget | null): AppNotification["action"] {
  if (!target || typeof target.id !== "string" || !target.id) return undefined;
  const id = encodeURIComponent(target.id);
  if (target.kind === "trilha") return { label: "Abrir trilha", href: `/v2/trilha?id=${id}`, primary: true };
  if (target.kind === "enquete") {
    return { label: "Ver enquete", href: `/v2/estudio/enquete/resultados?id=${id}`, primary: true };
  }
  return undefined;
}

/** As notificações vêm do backend (não confiáveis): valores fora do contrato caem em padrões seguros. */
function mapear(raw: RawNotification): AppNotification {
  const category = CATEGORIAS.includes(raw.category as NotificationCategory)
    ? (raw.category as NotificationCategory)
    : "conta";
  const tone = TONS.includes(raw.tone as NotificationTone) ? (raw.tone as NotificationTone) : "neutro";
  return {
    id: String(raw.id),
    category,
    tone,
    icon: ICONE[category],
    title: String(raw.title ?? ""),
    body: String(raw.body ?? ""),
    at: String(raw.at ?? ""),
    read: raw.read === true,
    action: accaoDoAlvo(raw.target ?? null),
  };
}

/**
 * Notificações do utilizador no contexto activo: o filtro por workspace é feito pelo
 * backend através do `X-Workspace` que o `api` já envia; nada é filtrado aqui.
 */
export const notificationService = {
  listar: async (pagina = 1, apenasNaoLidas = false): Promise<PaginaNotificacoes> => {
    const { data } = await api.get<RawPage>("/notifications/", {
      params: { page: pagina, ...(apenasNaoLidas ? { unread: true } : {}) },
    });
    const itens = Array.isArray(data?.results) ? data.results.map(mapear) : [];
    return { itens, total: typeof data?.count === "number" ? data.count : itens.length, proxima: data?.next ? pagina + 1 : null };
  },

  /** Limitado a 60 pedidos/min pelo backend: chamar com polling de 60 s. */
  contarNaoLidas: async (): Promise<number> => {
    const { data } = await api.get<{ count?: number }>("/notifications/unread-count/");
    return typeof data?.count === "number" ? data.count : 0;
  },

  marcarLida: async (id: string): Promise<void> => {
    await api.post(`/notifications/${encodeURIComponent(id)}/read/`);
  },

  /** Só no contexto activo. */
  marcarTodasLidas: async (): Promise<number> => {
    const { data } = await api.post<{ updated?: number }>("/notifications/read-all/");
    return typeof data?.updated === "number" ? data.updated : 0;
  },
};
