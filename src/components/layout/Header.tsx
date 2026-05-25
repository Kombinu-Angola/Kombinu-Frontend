// components/layout/Header.tsx

/**
 * Header reutilizável para visitantes e utilizadores autenticados
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

import {
  LogOut,
  User,
  Home,
  BookOpen,
  Trophy,
  Menu,
  X,
  Plus,
  BarChart3,
  Moon,
  Sun,
  ArrowRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const { usuario, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = (): void => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavigation = (): void => {
    setMobileMenuOpen(false);
  };

  /**
   * Links autenticados
   */
  const authenticatedLinks = [
    {
      to:
        usuario?.tipo === 'criador'
          ? '/dashboard/creator'
          : '/dashboard/learner',
      icon: Home,
      label: 'Dashboard',
      show: true
    },
    {
      to: '/courses',
      icon: BookOpen,
      label: 'Marketplace',
      show: true
    },
    {
      to: '/courses/create',
      icon: Plus,
      label: 'Criar',
      show: usuario?.tipo === 'criador'
    },
    {
      to: '/ranking',
      icon: Trophy,
      label: 'Ranking',
      show: true
    },
    {
      to: '/admin',
      icon: BarChart3,
      label: 'Admin',
      show: usuario?.tipo === 'admin'
    }
  ].filter(link => link.show);

  /**
   * Links públicos
   */
  const publicLinks = [
    {
      to: '#sobre',
      label: 'Sobre'
    },
    {
      to: '#funcionalidades',
      label: 'Funcionalidades'
    },
    {
      to: '#pesquisas',
      label: 'Pesquisas'
    },
    {
      to: '#contacto',
      label: 'Contacto'
    }
  ];

  const isActiveLink = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <header className="dark-bg-primary/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-dark-border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" clickable />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">

            {usuario ? (
              authenticatedLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActiveLink(link.to);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-lato ${isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm dark:bg-dark-bg-hover dark:text-dark-interactive-primary'
                      : 'dark-text-secondary hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-dark-bg-hover dark:hover:text-dark-interactive-primary'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })
            ) : (
              publicLinks.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-lato dark-text-secondary hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-dark-bg-hover dark:hover:text-dark-interactive-primary"
                >
                  {link.label}
                </a>
              ))
            )}

          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 dark-text-muted hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200 dark:hover:bg-dark-bg-hover dark:hover:text-dark-interactive-primary"
            >
              {theme === 'dark'
                ? <Sun className="w-5 h-5" />
                : <Moon className="w-5 h-5" />
              }
            </button>

            {usuario ? (
              <>
                {/* User */}
                <div className="hidden sm:flex items-center space-x-3">

                  <div className="text-right">
                    <p className="text-sm font-semibold dark-text-primary truncate max-w-32 font-montserrat">
                      {usuario.nome}
                    </p>

                    <div className="flex items-center justify-end space-x-2 text-xs dark-text-muted font-lato">
                      <span className="flex items-center space-x-1">
                        <Trophy className="w-3 h-3" />
                        <span>{usuario.pontos.toLocaleString()}</span>
                      </span>

                      <span>•</span>

                      <span>Nível {usuario.nivel}</span>
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex p-2 dark-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 dark:hover:bg-dark-bg-hover dark:hover:text-dark-interactive-error"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>

                {/* Register */}
                <Link to="/register">
                  <Button
                    variant="primary"
                    size="sm"
                    className="font-poppins bg-kombinu-neon-blue text-gray-900 hover:bg-kombinu-dark-blue hover:text-white shadow-lg hover:shadow-xl transition-all dark:bg-dark-interactive-primary dark:text-white"
                  >
                    Começar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 dark-text-secondary hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-dark-bg-hover dark:hover:text-dark-text-primary"
            >
              {mobileMenuOpen
                ? <X className="w-6 h-6" />
                : <Menu className="w-6 h-6" />
              }
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t dark-border-primary py-4 space-y-2">

            {usuario ? (
              <>
                {authenticatedLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={handleNavigation}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 font-lato dark-text-secondary hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-dark-bg-hover dark:hover:text-dark-interactive-primary"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full text-left dark:hover:bg-dark-bg-hover dark:text-dark-interactive-error font-lato"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair da conta</span>
                </button>
              </>
            ) : (
              <>
                {publicLinks.map((link) => (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={handleNavigation}
                    className="block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 font-lato dark-text-secondary hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-dark-bg-hover dark:hover:text-dark-interactive-primary"
                  >
                    {link.label}
                  </a>
                ))}

                <Link
                  to="/login"
                  onClick={handleNavigation}
                  className="block px-4 py-3"
                >
                  Entrar
                </Link>

                <Link
                  to="/register"
                  onClick={handleNavigation}
                  className="block px-4 py-3"
                >
                  Começar Gratuitamente
                </Link>
              </>
            )}

          </div>
        )}
      </div>
    </header>
  );
};