import { api } from './api';
import type { RankingGlobalPagina } from '../types';

type RawTopUser = {
  user_id: number | string;
  name?: string;
  total_score: number;
  position: number;
};

type RawRankingGlobal = {
  top_users?: RawTopUser[];
  user_position?: { position: number; total_score: number } | null;
  workspace?: string | null;
  count?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
};

const numero = (valor: unknown, omissao: number): number =>
  typeof valor === 'number' && Number.isFinite(valor) ? valor : omissao;

/**
 * Ranking do contexto activo (`GET /rankings/global/`, paginado). O backend devolve
 * `name` (nunca o email) e a posição já calculada (RANK()). A resposta é tratada como
 * não confiável: campos em falta caem em valores seguros. Ainda sem `X-Workspace`:
 * o contrato do workspace está por combinar, por isso pede sempre o marketplace.
 */
export const rankingGlobalService = {
  obter: async (pagina = 1, tamanho = 100): Promise<RankingGlobalPagina> => {
    const { data } = await api.get<RawRankingGlobal>('/rankings/global/', {
      params: { page: pagina, page_size: tamanho },
    });

    const utilizadores = Array.isArray(data?.top_users)
      ? data.top_users.map((u) => ({
          id: String(u.user_id),
          nome: typeof u.name === 'string' && u.name.trim() ? u.name : 'Utilizador',
          pontos: numero(u.total_score, 0),
          posicao: numero(u.position, 0),
        }))
      : [];

    return {
      utilizadores,
      minhaPosicao: data?.user_position
        ? {
            posicao: numero(data.user_position.position, 0),
            pontos: numero(data.user_position.total_score, 0),
          }
        : null,
      total: numero(data?.count, utilizadores.length),
      pagina: numero(data?.page, pagina),
      totalPaginas: Math.max(1, numero(data?.total_pages, 1)),
      workspace: data?.workspace ?? null,
    };
  },
};
