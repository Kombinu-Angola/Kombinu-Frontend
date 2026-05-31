/**
 * Hook personalizado para gerenciar rankings dinâmicos
 *
 * RESPONSABILIDADES:
 * - Fornecer interface React para o RankingService
 * - Gerenciar estado local dos rankings
 * - Atualizar automaticamente quando há mudanças
 * - Fornecer funções utilitárias para componentes
 *
 * USO:
 * const {
 *   rankings,
 *   posicaoUsuario,
 *   atualizarRanking
 * } = useRanking(usuario?.id);
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import { rankingService } from '../services/rankingService';

import type {
  RankingData,
  RankingEntry
} from '../services/rankingService';

import { logger } from '../utils/logger';

/**
 * Filtros de ranking
 */
type FiltroRanking =
  | 'global'
  | 'semanal'
  | 'mensal';

/**
 * Estatísticas reais do ranking
 * (compatível com rankingService.obterEstatisticasGerais)
 */
interface EstatisticasRanking {
  totalUsuarios: number;
  usuariosAtivosUltimaSemana: number;
  usuariosAtivosUltimoMes: number;
  categorias: number;
  ultimaAtualizacao: Date;
}

/**
 * Interface de retorno do hook
 */
interface UseRankingReturn {
  // Estado
  rankings: RankingData;
  rankingAtual: RankingEntry[];
  filtroAtivo: FiltroRanking;
  carregando: boolean;

  // Usuário atual
  posicaoUsuario: number;
  entradaUsuario?: RankingEntry;

  // Controle
  alterarFiltro: (
    filtro: FiltroRanking
  ) => void;

  atualizarRanking: (
    usuarioId: string,
    quizId: string,
    categoria: string,
    pontos: number,
    acertos: number,
    total: number,
    tempoGasto: number
  ) => void;

  // Utilidades
  obterPosicaoAnterior: (
    usuarioId: string
  ) => number;

  obterTendencia: (
    usuarioId: string
  ) =>
    | 'subiu'
    | 'desceu'
    | 'manteve'
    | 'novo';

  obterEstatisticas: () => EstatisticasRanking;
}

/**
 * Hook principal
 */
export const useRanking = (
  usuarioId?: string
): UseRankingReturn => {
  /**
   * Estado dos rankings
   */
  const [rankings, setRankings] =
    useState<RankingData>({
      global: [],
      semanal: [],
      mensal: [],
      categoria: {}
    });

  const [filtroAtivo, setFiltroAtivo] =
    useState<FiltroRanking>('global');

  const [carregando, setCarregando] =
    useState(true);

  /**
   * Atualiza rankings localmente
   */
  const atualizarRankingsLocais =
    useCallback(
      (novosRankings: RankingData) => {
        setRankings(novosRankings);

        setCarregando(false);

        logger.debug(
          'Rankings atualizados no hook',
          'useRanking',
          {
            totalGlobal:
              novosRankings.global.length,
            totalSemanal:
              novosRankings.semanal.length,
            totalMensal:
              novosRankings.mensal.length
          }
        );
      },
      []
    );

  /**
   * Inicialização
   */
  useEffect(() => {
    let mounted = true;

    logger.debug(
      'Inicializando hook useRanking',
      'useRanking',
      { usuarioId }
    );

    const carregarRankings =
      async (): Promise<void> => {
        try {
          const rankingsIniciais: RankingData =
          {
            global:
              rankingService.obterRankingGlobal,

            semanal:
              rankingService.obterRankingSemanal,

            mensal:
              rankingService.obterRankingMensal,

            categoria: {}
          };

          if (mounted) {
            setRankings(
              rankingsIniciais
            );

            setCarregando(false);
          }
        } catch (error) {
          logger.error(
            'Erro ao carregar rankings',
            'useRanking',
            {},
            error as Error
          );

          if (mounted) {
            setCarregando(false);
          }
        }
      };

    carregarRankings();

    /**
     * Listener automático
     */
    rankingService.adicionarListener(
      atualizarRankingsLocais
    );

    /**
     * Cleanup
     */
    return () => {
      mounted = false;

      rankingService.removerListener(
        atualizarRankingsLocais
      );

      logger.debug(
        'Hook desmontado',
        'useRanking'
      );
    };
  }, [
    atualizarRankingsLocais,
    usuarioId
  ]);

  /**
   * Ranking atual
   */
  const rankingAtual =
    useMemo<RankingEntry[]>(() => {
      switch (filtroAtivo) {
        case 'semanal':
          return rankings.semanal;

        case 'mensal':
          return rankings.mensal;

        default:
          return rankings.global;
      }
    }, [filtroAtivo, rankings]);

  /**
   * Posição do usuário
   */
  const posicaoUsuario =
    useMemo<number>(() => {
      if (!usuarioId) {
        return 0;
      }

      return rankingService.obterPosicaoUsuario(
        usuarioId
      );
    }, [usuarioId, rankings]);

  /**
   * Entrada do usuário
   */
  const entradaUsuario =
    useMemo<
      RankingEntry | undefined
    >(() => {
      if (!usuarioId) {
        return undefined;
      }

      return rankingService.obterEntradaUsuario(
        usuarioId
      );
    }, [usuarioId, rankings]);

  /**
   * Alterar filtro
   */
  const alterarFiltro =
    useCallback(
      (
        novoFiltro: FiltroRanking
      ): void => {
        setFiltroAtivo(
          (filtroAnterior) => {
            logger.debug(
              'Filtro alterado',
              'useRanking',
              {
                filtroAnterior,
                novoFiltro
              }
            );

            return novoFiltro;
          }
        );
      },
      []
    );

  /**
   * Atualizar ranking
   */
  const atualizarRanking =
    useCallback(
      (
        usuarioIdParam: string,
        quizId: string,
        categoria: string,
        pontos: number,
        acertos: number,
        total: number,
        tempoGasto: number
      ): void => {
        logger.info(
          'Atualizando ranking',
          'useRanking.atualizarRanking',
          {
            usuarioId:
              usuarioIdParam,
            quizId,
            categoria,
            pontos,
            acertos,
            total,
            tempoGasto
          }
        );



        rankingService.processarQuizCompletado(
          usuarioIdParam,
          quizId,
          categoria,
          pontos,
          acertos,
          total,
          tempoGasto
        );
      },
      []
    );

  /**
   * Posição anterior
   */
  const obterPosicaoAnterior =
    useCallback(
      (
        usuarioIdParam: string
      ): number => {
        const entrada =
          rankingService.obterEntradaUsuario(
            usuarioIdParam
          );

        return (
          entrada?.posicaoAnterior ??
          0
        );
      },
      []
    );

  /**
   * Tendência
   */
  const obterTendencia =
    useCallback(
      (
        usuarioIdParam: string
      ):
        | 'subiu'
        | 'desceu'
        | 'manteve'
        | 'novo' => {
        const entrada =
          rankingService.obterEntradaUsuario(
            usuarioIdParam
          );

        return (
          entrada?.tendencia ??
          'novo'
        );
      },
      []
    );

  /**
   * Estatísticas
   */
  const obterEstatisticas =
    useCallback(
      (): EstatisticasRanking => {
        return rankingService.obterEstatisticasGerais();
      },
      []
    );

  /**
   * Retorno memoizado
   */
  return useMemo(
    () => ({
      rankings,
      rankingAtual,
      filtroAtivo,
      carregando,

      posicaoUsuario,
      entradaUsuario,

      alterarFiltro,
      atualizarRanking,

      obterPosicaoAnterior,
      obterTendencia,
      obterEstatisticas
    }),
    [
      rankings,
      rankingAtual,
      filtroAtivo,
      carregando,

      posicaoUsuario,
      entradaUsuario,

      alterarFiltro,
      atualizarRanking,

      obterPosicaoAnterior,
      obterTendencia,
      obterEstatisticas
    ]
  );
};

/**
 * Hook para estatísticas
 */
export const useRankingStats =
  (): EstatisticasRanking => {
    const [
      estatisticas,
      setEstatisticas
    ] =
      useState<EstatisticasRanking>(
        rankingService.obterEstatisticasGerais()
      );

    useEffect(() => {
      const atualizarEstatisticas =
        () => {
          setEstatisticas(
            rankingService.obterEstatisticasGerais()
          );
        };

      rankingService.adicionarListener(
        atualizarEstatisticas
      );

      return () => {
        rankingService.removerListener(
          atualizarEstatisticas
        );
      };
    }, []);

    return estatisticas;
  };