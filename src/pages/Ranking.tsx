import React, { useEffect, useState } from 'react';
import {
  Crown,
  Medal,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

interface RankingUser {
  id: string;
  name: string;
  points: number;
  trend: 'up' | 'down' | 'same';
  avatar?: string;
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
          const data: RankingUser[] = response.data.top_users.map(
            (u: any) => ({
              id: String(u.user_id),
              name: u.email?.split('@')[0] || 'user',
              points: u.total_score,
              trend: 'same'
            })
          );

          // adiciona utilizador logado se não estiver no top
          if (
            usuario &&
            response.data.user_position &&
            !data.find(x => x.id === usuario.id)
          ) {
            data.push({
              id: usuario.id,
              name: usuario.nome,
              points: response.data.user_position.total_score,
              trend: 'same'
            });
          }

          // ordena sempre por pontos (IMPORTANTE)
          data.sort((a, b) => b.points - a.points);

          setRankingData(data);
        } else {
          setRankingData([]);
        }
      } catch (err) {
        console.error('Erro ranking:', err);
        setRankingData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [usuario]);

  const getPositionIcon = (index: number) => {
    if (index === 0)
      return <Crown className="w-6 h-6 text-yellow-500" />;
    if (index === 1)
      return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2)
      return <Medal className="w-6 h-6 text-orange-400" />;

    return (
      <span className="text-sm font-bold text-gray-500">
        #{index + 1}
      </span>
    );
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Ranking Global 🏆
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Classificação em tempo real dos utilizadores
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-12 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300">
            <div className="col-span-2 text-center">Posição</div>
            <div className="col-span-6">Utilizador</div>
            <div className="col-span-2 text-center">Pontos</div>
            <div className="col-span-2 text-center">Tendência</div>
          </div>

          {/* ROWS */}
          {rankingData.map((user, index) => (
            <div
              key={user.id}
              className={`grid grid-cols-12 px-6 py-4 items-center border-b border-gray-100 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700/40 transition
              ${usuario?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
            >

              {/* POSITION */}
              <div className="col-span-2 flex justify-center">
                {getPositionIcon(index)}
              </div>

              {/* USER */}
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user.name}
                    {usuario?.id === user.id && ' (Você)'}
                  </p>

                  <p className="text-xs text-gray-500">
                    Nível {Math.floor(user.points / 1000) + 1}
                  </p>
                </div>
              </div>

              {/* POINTS */}
              <div className="col-span-2 text-center font-bold text-gray-900 dark:text-white">
                {user.points.toLocaleString()}
              </div>

              {/* TREND */}
              <div className="col-span-2 flex justify-center">
                {getTrendIcon(user.trend)}
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}