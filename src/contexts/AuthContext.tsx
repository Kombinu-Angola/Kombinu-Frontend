import React, { createContext, useContext, useEffect, useState } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import type { ReactNode } from "react";
import { authService } from '../services/authService';
import type { Usuario } from '@/types';


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
      setLoading(true);

      const user = await authService.login(email, senha);

      setUsuario(user);
      localStorage.setItem('kombinu_usuario', JSON.stringify(user));

      return user;
    }, 'login') ?? null;
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