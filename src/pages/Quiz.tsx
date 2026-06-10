import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, ArrowLeft, Trophy, Star, Zap } from 'lucide-react';
import { quizService } from '../services/quizService';
import type { QuizData, QuizResult } from '../services/quizService';
import { useAuth } from '../contexts/AuthContext';

function BarraDinamica({ pct, className }: { pct: number; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.style.width = `${Math.min(100, pct)}%`;
  }, [pct]);
  return <div ref={ref} className={className} />;
}

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { atualizarPontos } = useAuth();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await quizService.getQuiz(id);
        setQuiz(data);
        setTimeLeft(data.timeLimit * 60);
      } catch (error) {
        console.error('Failed to load quiz', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleSubmitQuiz = useCallback(async (finalAnswers?: Record<string, string>) => {
    if (!quiz || !id) return;
    const answersToSubmit = finalAnswers ?? answers;
    try {
      setSubmitting(true);
      const quizResult = await quizService.submitQuiz(id, answersToSubmit);
      setResult(quizResult);
      const xpGanho = quizResult['xp earned'] ?? 0;
      if (xpGanho > 0) atualizarPontos(xpGanho);
    } catch (error) {
      console.error('Failed to submit quiz', error);
    } finally {
      setSubmitting(false);
    }
  }, [quiz, id, answers, atualizarPontos]);

  useEffect(() => {
    if (timeLeft > 0 && !result && !loading) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !result && !loading && quiz) {
      handleSubmitQuiz();
    }
  }, [timeLeft, result, loading, quiz, handleSubmitQuiz]);

  const handleOptionSelect = (optionId: string) => setSelectedOptionId(optionId);

  const handleNextQuestion = () => {
    if (!quiz || selectedOptionId === null) return;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const updatedAnswers = { ...answers, [currentQuestion.id]: selectedOptionId };
    setAnswers(updatedAnswers);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionId(null);
    } else {
      handleSubmitQuiz(updatedAnswers);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="text-gray-500 dark:text-gray-400">A carregar quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center flex-col gap-4">
        <AlertCircle className="w-16 h-16 text-yellow-500" />
        <h2 className="text-xl text-gray-800 dark:text-white">Quiz não encontrado.</h2>
        <button type="button" onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  if (result) {
    const totalMax = result.totalPoints > 0 ? result.totalPoints : result.totalQuestions;
    const pct = totalMax > 0 ? Math.round((result.correctAnswers / totalMax) * 100) : 0;
    const aprovado = pct >= 70;
    const xpGanho = result['xp earned'] ?? 0;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Cartão principal */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">

            {/* Faixa de cor no topo */}
            <div className={`h-2 ${aprovado ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-yellow-400 to-orange-400'}`} />

            <div className="p-8 text-center">
              {/* Ícone de resultado */}
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${aprovado
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                {aprovado
                  ? <Trophy className="w-12 h-12 text-green-500" />
                  : <AlertCircle className="w-12 h-12 text-yellow-500" />}
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {aprovado ? 'Parabéns!' : 'Continue a tentar!'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {aprovado
                  ? 'Excelente desempenho! Continua assim.'
                  : 'Cada tentativa é uma oportunidade de aprender.'}
              </p>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.correctAnswers}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Correctas</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pct}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Precisão</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <Zap className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">+{xpGanho}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">XP ganhos</p>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-8 overflow-hidden">
                <BarraDinamica
                  pct={pct}
                  className={`h-3 rounded-full transition-all duration-1000 ${aprovado ? 'bg-green-500' : 'bg-yellow-500'}`}
                />
              </div>

              {/* Acções */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/courses')}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Ver Cursos
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/ranking')}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Ver Ranking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progressPct = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isUrgent = timeLeft <= 30;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>

          <div className={`flex items-center space-x-2 rounded-lg px-4 py-2 shadow-sm transition-colors ${isUrgent
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            : 'bg-white dark:bg-gray-800'}`}>
            <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
            <span className={`font-bold text-lg ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Cartão do quiz */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Barra de progresso */}
          <div className="bg-gray-200 dark:bg-gray-700 h-2">
            <BarraDinamica
              pct={progressPct}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 transition-all duration-300"
            />
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl text-gray-500 dark:text-gray-400 font-medium">
                Questão {currentQuestionIndex + 1} de {quiz.questions.length}
              </h2>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-relaxed">
              {currentQuestion.text}
            </h3>

            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 group ${selectedOptionId === option.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-gray-800'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${selectedOptionId === option.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                      }`}>
                      {selectedOptionId === option.id && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      )}
                    </div>
                    <span className={`text-lg font-medium ${selectedOptionId === option.id
                      ? 'text-blue-900 dark:text-blue-100'
                      : 'text-gray-700 dark:text-gray-300'}`}>
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={selectedOptionId === null || submitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {submitting
                  ? 'A enviar...'
                  : currentQuestionIndex < quiz.questions.length - 1
                    ? 'Próxima Pergunta'
                    : 'Finalizar Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
