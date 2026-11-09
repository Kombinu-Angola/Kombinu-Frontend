import React, { createContext, useContext, useEffect, useState } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import type { ReactNode } from "react";
import { authService, ErroLogin, type CodigoErroLogin } from '../services/authService';
import type { Usuario } from '@/types';


/** Resultado de um login que o ecrã consegue apresentar sem apanhar excepções. */
export type ResultadoLogin = { ok: true; usuario: Usuario } | { ok: false; codigo: CodigoErroLogin };

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, senha: string) => Promise<Usuario | null>;
  register: (dadosUsuario: {
    nome: string;
    email: string;
    senha: string;
    tipo: 'criador' | 'aprendiz';
  }) => Promise<Usuario | null>;
  /** Login por email com o resultado tipado (distingue credenciais, senha temporária expirada e limite). */
  entrar: (email: string, senha: string) => Promise<ResultadoLogin>;
  /** Login institucional (código da escola, código do aluno, senha). */
  entrarInstitucional: (codigoEscola: string, codigoAluno: string, senha: string) => Promise<ResultadoLogin>;
  /** Troca a senha, renova os tokens e levanta o bloqueio de troca obrigatória. Lança `ErroTrocaSenha` se o backend recusar. */
  trocarSenha: (senhaAtual: string, novaSenha: string) => Promise<void>;
  logout: () => void;
  atualizarUsuario: (dados: Partial<Usuario>) => void;
  atualizarPontos: (delta: number) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const { executeWithErrorHandling, error, clearError } =
    useErrorHandler('AuthContext');

  // 🔥 CARREGAR USER DO LOCALSTORAGE
  useEffect(() => {
    const data = localStorage.getItem('kombinu_usuario');

    if (data) {
      setUsuario(JSON.parse(data));
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email: string, senha: string) => {
    return executeWithErrorHandling(async () => {


      const user = await authService.login(email, senha);

      setUsuario(user);
      localStorage.setItem('kombinu_usuario', JSON.stringify(user));

      return user;
    }, 'login') ?? null;
  };

  const iniciarSessao = async (operacao: () => Promise<Usuario>): Promise<ResultadoLogin> => {
    try {
      const user = await operacao();
      setUsuario(user);
      localStorage.setItem('kombinu_usuario', JSON.stringify(user));
      return { ok: true, usuario: user };
    } catch (err) {
      return { ok: false, codigo: err instanceof ErroLogin ? err.codigo : 'indisponivel' };
    }
  };

  const entrar = (email: string, senha: string) => iniciarSessao(() => authService.login(email, senha));

  const entrarInstitucional = (codigoEscola: string, codigoAluno: string, senha: string) =>
    iniciarSessao(() => authService.loginInstitucional(codigoEscola, codigoAluno, senha));

  const trocarSenha = async (senhaAtual: string, novaSenha: string) => {
    await authService.trocarSenha(senhaAtual, novaSenha);
    setUsuario((atual) => {
      if (!atual) return atual;
      const atualizado = { ...atual, mustChangePassword: false };
      localStorage.setItem('kombinu_usuario', JSON.stringify(atualizado));
      return atualizado;
    });
  };

  // REGISTER
  const register = async (dadosUsuario: {
    nome: string;
    email: string;
    senha: string;
    tipo: 'criador' | 'aprendiz';
  }) => {
    return executeWithErrorHandling(async () => {
      const user = await authService.register(dadosUsuario);

      setUsuario(user);
      localStorage.setItem('kombinu_usuario', JSON.stringify(user));

      return user;
    }, 'register') ?? null;
  };

  // LOGOUT
  const logout = () => {
    authService.logout();
    setUsuario(null);
    localStorage.removeItem('kombinu_usuario');
  };

  // ATUALIZAR USUÁRIO
  const atualizarUsuario = (dados: Partial<Usuario>) => {
    if (!usuario) return;

    const atualizado = { ...usuario, ...dados };

    setUsuario(atualizado);
    localStorage.setItem('kombinu_usuario', JSON.stringify(atualizado));
  };

  // ATUALIZAR PONTOS
  const atualizarPontos = (delta: number) => {
    if (!usuario) return;

    const atualizado = {
      ...usuario,
      pontos: usuario.pontos + delta,
    };

    setUsuario(atualizado);
    localStorage.setItem('kombinu_usuario', JSON.stringify(atualizado));
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        error,
        login,
        register,
        entrar,
        entrarInstitucional,
        trocarSenha,
        logout,
        atualizarUsuario,
        atualizarPontos,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
};