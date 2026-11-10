import { useEffect, useState } from 'react';
import { Crown, Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { rankingGlobalService } from '../services/rankingGlobalService';
import { useWorkspaceStore, WORKSPACE_MARKETPLACE } from '../stores/workspaceStore';

interface RankingUser {
  id: string;
  name: string;
  points: number;
  position: number;
  trend: 'up' | 'down' | 'same';
}

/**
 * O ranking é do workspace activo: o `X-Workspace` já segue em cada pedido (api.ts),
 * por isso basta recomeçar do zero quando o workspace muda -- sem esperar pela resposta
 * do contexto anterior nem manter uma página que só existia lá.
 */
export default function Ranking() {
  const ativo = useWorkspaceStore((s) => s.ativo);
  return <RankingDoWorkspace key={ativo} />;
}

function RankingDoWorkspace() {
  const { usuario } = useAuth();
  const ativo = useWorkspaceStore((s) => s.ativo);
  const escola = useWorkspaceStore((s) => s.memberships.find((m) => m.organizacaoId === s.ativo)?.nome);
  const titulo = ativo === WORKSPACE_MARKETPLACE ? 'Ranking Global' : `Ranking · ${escola ?? 'Escola'}`;
  const [rankingData, setRankingData] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    let cancelado = false;
    const fetchRanking = async () => {
      setLoading(true);
      setErro(false);
      try {
        const resposta = await rankingGlobalService.obter(pagina);
        if (cancelado) return;
        const data: RankingUser[] = resposta.utilizadores.map((u) => ({
          id: u.id,
          name: u.nome,
          points: u.pontos,
          position: u.posicao,
          trend: 'same' as const,
        }));

        if (usuario && resposta.minhaPosicao && !data.find((x) => x.id === usuario.id)) {
          data.push({
            id: usuario.id,
            name: usuario.nome,
            points: resposta.minhaPosicao.pontos,
            position: resposta.minhaPosicao.posicao,
            trend: 'same',
          });
        }

        data.sort((x, y) => x.position - y.position);
        setRankingData(data);
        setTotalPaginas(resposta.totalPaginas);
      } catch {
        if (cancelado) return;
        setRankingData([]);
        setErro(true);
      } finally {
        if (!cancelado) setLoading(false);
      }
    };
    fetchRanking();
    return () => {
      cancelado = true;
    };
  }, [usuario, pagina]);

  const getTrendIcon = (trend: RankingUser['trend']) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getAvatar = (name: string, isMe: boolean) => (
    <div className={`rounded-full flex items-center justify-center text-white font-bold ${isMe
      ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
      : 'bg-gradient-to-br from-gray-400 to-gray-600'}`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const top3 = pagina === 1 ? rankingData.slice(0, 3) : [];
  const resto = rankingData.slice(top3.length);
  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header com gradiente */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white pt-12 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
          <h1 className="text-4xl font-bold mb-2">{titulo}</h1>
          <p className="text-blue-200 text-lg">Classificação em tempo real dos melhores aprendizes</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16">

        {/* Pódio top 3 */}
        {top3.length >= 2 && (
          <div className="flex items-end justify-center gap-4 mb-8">
            {podiumOrder.map((user, podiumIdx) => {
              const pos = user.position;
              const isFirst = pos === 1;
              const isMe = usuario?.id === user.id;

              const heightClass = isFirst
                ? 'h-36'
                : podiumIdx === 0
                  ? 'h-28'
                  : 'h-24';

              const avatarSize = isFirst ? 'w-16 h-16 text-2xl' : 'w-12 h-12 text-lg';
              const cardBg = isFirst
                ? 'bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-800 border-yellow-300 dark:border-yellow-700'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';

              return (
                <div key={user.id} className={`flex-1 max-w-[160px] flex flex-col items-center ${isFirst ? 'order-2' : podiumIdx === 0 ? 'order-1' : 'order-3'}`}>
                  {/* Coroa para o 1.º */}
                  {isFirst && <Crown className="w-8 h-8 text-yellow-500 mb-1" />}

                  {/* Avatar */}
                  <div className={`${avatarSize} ${isMe ? 'ring-4 ring-blue-400' : ''} rounded-full mb-2`}>
                    {getAvatar(user.name, isMe)}
                  </div>

                  <p className="text-sm font-bold text-gray-900 dark:text-white text-center truncate w-full px-1">
                    {user.name}{isMe ? ' (Você)' : ''}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
                    {user.points.toLocaleString()} XP
                  </p>

                  {/* Bloco do pódio */}
                  <div className={`w-full ${heightClass} ${cardBg} border-2 rounded-t-xl flex items-center justify-center shadow-lg`}>
                    <span className={`font-black ${isFirst ? 'text-4xl text-yellow-500' : 'text-3xl text-gray-400'}`}>
                      {pos === 1 ? '🥇' : pos === 2 ? '🥈' : '🥉'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tabela restante (posição 4+) ou tabela completa se < 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-10">

          {rankingData.length === 0 ? (
            <div className="py-20 text-center">
              <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {erro ? 'Não foi possível carregar o ranking.' : 'Ainda não há utilizadores no ranking.'}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                {erro ? 'Tenta novamente dentro de instantes.' : 'Faz o teu primeiro quiz para aparecer aqui!'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                <div className="col-span-2 text-center">Posição</div>
                <div className="col-span-6">Utilizador</div>
                <div className="col-span-2 text-center">XP</div>
                <div className="col-span-2 text-center">Tendência</div>
              </div>

              {(top3.length >= 2 ? resto : rankingData).map((user) => {
                const pos = user.position;
                const isMe = usuario?.id === user.id;

                return (
                  <div
                    key={user.id}
                    className={`grid grid-cols-12 px-6 py-4 items-center border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors
                      ${isMe
                        ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'}`}
                  >
                    <div className="col-span-2 flex justify-center">
                      <span className={`text-sm font-bold ${isMe ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        #{pos}
                      </span>
                    </div>

                    <div className="col-span-6 flex items-center gap-3">
                      <div className={`w-9 h-9 text-sm rounded-full flex-shrink-0 ${isMe ? 'ring-2 ring-blue-400' : ''}`}>
                        {getAvatar(user.name, isMe)}
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${isMe ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                          {user.name}{isMe ? ' (Você)' : ''}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Nível {Math.floor(user.points / 100) + 1}
                        </p>
                      </div>
                    </div>

                    <div className={`col-span-2 text-center font-bold text-sm ${isMe ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {user.points.toLocaleString()}
                    </div>

                    <div className="col-span-2 flex justify-center">
                      {getTrendIcon(user.trend)}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {totalPaginas > 1 && (
          <nav aria-label="Paginação do ranking" className="flex items-center justify-center gap-4 mb-10">
            <button
              type="button"
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina <= 1}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-poppins text-sm shadow disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              type="button"
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina >= totalPaginas}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-poppins text-sm shadow disabled:opacity-50"
            >
              Seguinte
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
