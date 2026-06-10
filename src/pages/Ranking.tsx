import { useEffect, useState } from 'react';
import { Crown, Medal, Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface RankingUser {
  id: string;
  name: string;
  points: number;
  trend: 'up' | 'down' | 'same';
}

export default function Ranking() {
  const { usuario } = useAuth();
  const [rankingData, setRankingData] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        const { api } = await import('../services/api');
        const response = await api.get('/rankings/global/');

        if (response.data && Array.isArray(response.data.top_users)) {
          const data: RankingUser[] = response.data.top_users.map((u: any) => ({
            id: String(u.user_id),
            name: u.email?.split('@')[0] || 'user',
            points: u.total_score,
            trend: 'same' as const,
          }));

          if (
            usuario &&
            response.data.user_position &&
            !data.find(x => x.id === usuario.id)
          ) {
            data.push({
              id: usuario.id,
              name: usuario.nome,
              points: response.data.user_position.total_score,
              trend: 'same',
            });
          }

          data.sort((a, b) => b.points - a.points);
          setRankingData(data);
        } else {
          setRankingData([]);
        }
      } catch {
        setRankingData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [usuario]);

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

  const top3 = rankingData.slice(0, 3);
  const resto = rankingData.slice(3);
  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header com gradiente */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white pt-12 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
          <h1 className="text-4xl font-bold mb-2">Ranking Global</h1>
          <p className="text-blue-200 text-lg">Classificação em tempo real dos melhores aprendizes</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16">

        {/* Pódio top 3 */}
        {top3.length >= 2 && (
          <div className="flex items-end justify-center gap-4 mb-8">
            {podiumOrder.map((user, podiumIdx) => {
              const realIndex = rankingData.findIndex(u => u.id === user.id);
              const pos = realIndex + 1;
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
              <p className="text-gray-500 dark:text-gray-400 text-lg">Ainda não há utilizadores no ranking.</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Faz o teu primeiro quiz para aparecer aqui!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                <div className="col-span-2 text-center">Posição</div>
                <div className="col-span-6">Utilizador</div>
                <div className="col-span-2 text-center">XP</div>
                <div className="col-span-2 text-center">Tendência</div>
              </div>

              {(top3.length >= 2 ? resto : rankingData).map((user, idx) => {
                const realIndex = rankingData.findIndex(u => u.id === user.id);
                const pos = realIndex + 1;
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
      </div>
    </div>
  );
}
