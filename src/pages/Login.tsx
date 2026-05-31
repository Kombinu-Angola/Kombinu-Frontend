import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { login, usuario } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const usuarioLogado = await login(email, senha);
      if (usuarioLogado) {
        // Redireciona baseado no tipo do usuário recém logado
        if (usuarioLogado.tipo === 'criador') {
          navigate('/dashboard/creator');
        } else if (usuarioLogado.tipo === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/learner');
        }
      } else {
        setErro('Email ou senha incorretos');
      }
    } catch (error) {
      setErro('Erro ao fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      className="h-screen flex overflow-hidden"

    >
      <div className="hidden lg:flex w-1/2 relative h-full min-h-0 overflow-hidden">
        <img
          src="/profile.png"
          className="w-full "
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 h-full min-h-0 overflow-y-auto">
        <div className="max-w-md w-full space-y-8">

          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-blue-600">KOMBINU</span>
          </Link>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Bem-vindo de volta!
          </h2>
          <p className="text-gray-600">
            Entre na sua conta e continue sua jornada de aprendizado
          </p>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
        w-full
        pl-10
        pr-12
        py-3
        border
        border-gray-300
        bg-white
        text-gray-900
        rounded-lg
        placeholder-gray-500
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
        sm:text-sm

        transition-all
      "
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>

                <div className="relative">
                  {/* Ícone esquerda */}
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>

                  <input
                    id="senha"
                    name="senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Sua senha"
                    className="
        w-full
        pl-10
        pr-12
        py-3
        border
        border-gray-300
        bg-white
        text-gray-900
        rounded-lg
        placeholder-gray-500
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
        sm:text-sm

        transition-all
      "
                  />

                  {/* Botão mostrar senha */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    {mostrarSenha ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {erro}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={carregando}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Cadastre-se gratuitamente
                </Link>
              </p>
            </div>
          </form>
        </div>


      </div>
    </div >
  );
}