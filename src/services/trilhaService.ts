// src/services/trilhaService.ts
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { progressService } from "./progressService";

export type TrilhaStatus = "draft" | "published" | "archived";
export type TrilhaItemKind = "course" | "lesson" | "quiz" | "document";

export interface TrilhaItem {
  id: string;
  kind: TrilhaItemKind;
  targetId: string; // ID do curso, aula ou quiz
  titulo: string;
  descricao?: string;
  ordem: number;
  concluido?: boolean;
}

export interface Trilha {
  id: string;
  titulo: string;
  descricao: string;
  status: TrilhaStatus;
  itens: TrilhaItem[];
  progressoPercentual?: number;
  itensConcluidos?: number;
}

export interface CriarTrilhaPayload {
  titulo: string;
  descricao?: string;
}

export interface AdicionarItemTrilhaPayload {
  kind: TrilhaItemKind;
  targetId: string;
  titulo?: string;
  descricao?: string;
  ordem?: number;
}

const STORAGE_KEY_TRILHAS = "kombinu_trilhas_cache";

class TrilhaService {
  // =========================================================================
  // 1. LEITURA E PROGRESSO (Telas: feed, trail, course)
  // =========================================================================

  async listarTrilhas(usuarioId?: string): Promise<Trilha[]> {
    let trilhas: Trilha[] = [];

    try {
      const response = await axios.get(`${API_BASE_URL}/api/trilhas/`);
      const rawList = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];
      trilhas = rawList.map((item: any) => this.mapTrilhaFromApi(item));
      localStorage.setItem(STORAGE_KEY_TRILHAS, JSON.stringify(trilhas));
    } catch (error) {
      console.warn("API /api/trilhas/ indisponível, usando cache:", error);
      const cached = localStorage.getItem(STORAGE_KEY_TRILHAS);
      trilhas = cached ? JSON.parse(cached) : [];
    }

    if (!usuarioId) return trilhas;

    const progressos = await progressService.carregarProgressos();
    const concluidosSet = new Set(
      progressos
        .filter((p) => p.usuarioId === usuarioId && p.concluido)
        .map((p) => p.conteudoId),
    );

    return trilhas.map((trilha) =>
      this.calcularProgressoTrilha(trilha, concluidosSet),
    );
  }

  async obterTrilhaPorId(
    trilhaId: string,
    usuarioId?: string,
  ): Promise<Trilha | undefined> {
    let trilha: Trilha | undefined;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/trilhas/${trilhaId}/`,
      );
      trilha = this.mapTrilhaFromApi(response.data);
    } catch (error) {
      console.warn(`Erro ao buscar trilha ${trilhaId}, tentando cache:`, error);
      const cached = localStorage.getItem(STORAGE_KEY_TRILHAS);
      const lista: Trilha[] = cached ? JSON.parse(cached) : [];
      trilha = lista.find((t) => t.id === trilhaId);
    }

    if (!trilha) return undefined;

    trilha.itens = [...(trilha.itens || [])].sort((a, b) => a.ordem - b.ordem);

    if (!usuarioId) return trilha;

    const progressos = await progressService.carregarProgressos();
    const concluidosSet = new Set(
      progressos
        .filter((p) => p.usuarioId === usuarioId && p.concluido)
        .map((p) => p.conteudoId),
    );

    return this.calcularProgressoTrilha(trilha, concluidosSet);
  }

  async concluirItemTrilha(
    usuarioId: string,
    trilhaId: string,
    itemId: string,
    targetId: string,
    pontos = 10,
    tempoGasto = 0,
  ): Promise<{ proximoItem?: TrilhaItem; trilhaAtualizada?: Trilha }> {
    await progressService.salvarProgresso({
      usuarioId,
      conteudoId: targetId,
      progresso: 100,
      concluido: true,
      pontos,
      tempoGasto,
      dataInicio: new Date(),
      dataConclusao: new Date(),
    });

    try {
      await axios.post(
        `${API_BASE_URL}/api/trilhas/${trilhaId}/items/${itemId}/complete/`,
      );
    } catch {
      // Silencioso caso o endpoint ainda não esteja ativo
    }

    const trilhaAtualizada = await this.obterTrilhaPorId(trilhaId, usuarioId);
    if (!trilhaAtualizada) return {};

    const idxAtual = trilhaAtualizada.itens.findIndex((i) => i.id === itemId);
    const proximoItem =
      idxAtual !== -1 && idxAtual + 1 < trilhaAtualizada.itens.length
        ? trilhaAtualizada.itens[idxAtual + 1]
        : undefined;

    return { proximoItem, trilhaAtualizada };
  }

  // =========================================================================
  // 2. CRIAÇÃO, EDIÇÃO E CICLO DE VIDA (Novos Contratos da API)
  // =========================================================================

  /** POST /api/trilhas/ -> cria uma trilha em rascunho */
  async criarTrilha(payload: CriarTrilhaPayload): Promise<Trilha> {
    const response = await axios.post(`${API_BASE_URL}/api/trilhas/`, {
      title: payload.titulo,
      titulo: payload.titulo,
      description: payload.descricao || "",
      descricao: payload.descricao || "",
    });
    return this.mapTrilhaFromApi(response.data);
  }

  /** PATCH /api/trilhas/{id}/ -> edita metadados da trilha */
  async editarTrilha(
    trilhaId: string,
    payload: Partial<CriarTrilhaPayload>,
  ): Promise<Trilha> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/trilhas/${trilhaId}/`,
      {
        ...(payload.titulo !== undefined && {
          title: payload.titulo,
          titulo: payload.titulo,
        }),
        ...(payload.descricao !== undefined && {
          description: payload.descricao,
          descricao: payload.descricao,
        }),
      },
    );
    return this.mapTrilhaFromApi(response.data);
  }

  /** DELETE /api/trilhas/{id}/ -> apaga (retorna erro claro se der 409) */
  async apagarTrilha(trilhaId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/api/trilhas/${trilhaId}/`);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        throw new Error(
          "Não é possível apagar esta trilha porque já existem alunos com progresso registado. Arquiva a trilha em vez de apagar.",
        );
      }
      throw error;
    }
  }

  /** POST /api/trilhas/{id}/publish/ -> publica (exige >= 1 item) */
  async publicarTrilha(trilhaId: string): Promise<Trilha> {
    const response = await axios.post(
      `${API_BASE_URL}/api/trilhas/${trilhaId}/publish/`,
    );
    return this.mapTrilhaFromApi(response.data);
  }

  /** POST /api/trilhas/{id}/archive/ -> arquiva */
  async arquivarTrilha(trilhaId: string): Promise<Trilha> {
    const response = await axios.post(
      `${API_BASE_URL}/api/trilhas/${trilhaId}/archive/`,
    );
    return this.mapTrilhaFromApi(response.data);
  }

  /** POST /api/trilhas/{id}/unarchive/ -> desarquiva */
  async desarquivarTrilha(trilhaId: string): Promise<Trilha> {
    const response = await axios.post(
      `${API_BASE_URL}/api/trilhas/${trilhaId}/unarchive/`,
    );
    return this.mapTrilhaFromApi(response.data);
  }

  // =========================================================================
  // 3. GESTÃO E ORDENAÇÃO DE ITENS DA TRILHA
  // =========================================================================

  /** POST /api/trilhas/{id}/items/ com { kind, targetId, ... } */
  async adicionarItem(
    trilhaId: string,
    payload: AdicionarItemTrilhaPayload,
  ): Promise<TrilhaItem> {
    const response = await axios.post(
      `${API_BASE_URL}/api/trilhas/${trilhaId}/items/`,
      {
        kind: payload.kind,
        targetId: payload.targetId,
        target_id: payload.targetId,
        ...(payload.titulo && {
          title: payload.titulo,
          titulo: payload.titulo,
        }),
        ...(payload.descricao && {
          description: payload.descricao,
          descricao: payload.descricao,
        }),
        ...(payload.ordem !== undefined && {
          order: payload.ordem,
          ordem: payload.ordem,
        }),
      },
    );
    return this.mapItemFromApi(response.data, 0);
  }

  /** PATCH /api/trilhas/{id}/items/{itemId}/ */
  async editarItem(
    trilhaId: string,
    itemId: string,
    payload: Partial<AdicionarItemTrilhaPayload>,
  ): Promise<TrilhaItem> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/trilhas/${trilhaId}/items/${itemId}/`,
      {
        ...(payload.kind && { kind: payload.kind }),
        ...(payload.targetId && {
          targetId: payload.targetId,
          target_id: payload.targetId,
        }),
        ...(payload.titulo && {
          title: payload.titulo,
          titulo: payload.titulo,
        }),
        ...(payload.descricao !== undefined && {
          description: payload.descricao,
          descricao: payload.descricao,
        }),
      },
    );
    return this.mapItemFromApi(response.data, 0);
  }

  /** DELETE /api/trilhas/{id}/items/{itemId}/ */
  async removerItem(trilhaId: string, itemId: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/api/trilhas/${trilhaId}/items/${itemId}/`,
    );
  }

  /** POST /api/trilhas/{id}/items/reorder/ com { itemIds: [...] } */
  async reordenarItens(trilhaId: string, itemIds: string[]): Promise<void> {
    await axios.post(`${API_BASE_URL}/api/trilhas/${trilhaId}/items/reorder/`, {
      itemIds,
    });
  }

  // =========================================================================
  // 4. MAPPERS E CÁLCULO DE PROGRESSO
  // =========================================================================

  private mapTrilhaFromApi(raw: any): Trilha {
    const rawItens = raw.items || raw.itens || [];
    return {
      id: String(raw.id),
      titulo: raw.title || raw.titulo || "",
      descricao: raw.description || raw.descricao || "",
      status: raw.status || "draft",
      progressoPercentual: raw.progress_percentage ?? raw.progressoPercentual,
      itensConcluidos: raw.completed_items ?? raw.itensConcluidos,
      itens: rawItens.map((item: any, idx: number) =>
        this.mapItemFromApi(item, idx),
      ),
    };
  }

  private mapItemFromApi(item: any, idx: number): TrilhaItem {
    return {
      id: String(item.id),
      kind: item.kind || "course",
      targetId: String(item.target_id ?? item.targetId ?? ""),
      titulo: item.title || item.titulo || `Item ${idx + 1}`,
      descricao: item.description || item.descricao,
      ordem: item.order ?? item.ordem ?? idx + 1,
      concluido: Boolean(
        item.is_completed ?? item.completed ?? item.concluido ?? false,
      ),
    };
  }

  private calcularProgressoTrilha(
    trilha: Trilha,
    concluidosSet: Set<string>,
  ): Trilha {
    const itensOrdenados = [...(trilha.itens || [])]
      .sort((a, b) => a.ordem - b.ordem)
      .map((item) => ({
        ...item,
        concluido:
          concluidosSet.has(item.targetId) || concluidosSet.has(item.id),
      }));

    const total = itensOrdenados.length;
    const itensConcluidos = itensOrdenados.filter((i) => i.concluido).length;
    const progressoPercentual =
      total > 0 ? Math.round((itensConcluidos / total) * 100) : 0;

    return {
      ...trilha,
      itens: itensOrdenados,
      itensConcluidos,
      progressoPercentual,
    };
  }
}

export const trilhaService = new TrilhaService();
