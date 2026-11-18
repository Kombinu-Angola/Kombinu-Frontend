import type { ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';

import Login from '../pages/Login';
import ChangePasswordScreen from '../features/auth/ChangePasswordScreen';
import Register from '../pages/Register';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AuthLayout from '@/components/layout/authLayout';
import { LandingPage } from '@/pages/LandingPage';
import { Error } from '@/pages/error';
import { NotFound } from '@/pages/notFound';
import { v2Routes } from './v2';

/** Pagina carregada sob pedido; `protegida` exige sessao (e papeis, se indicados) antes de a mostrar. */
const pagina = (carregar: () => Promise<{ default: ComponentType }>) => async () => ({ Component: (await carregar()).default });
const protegida = (carregar: () => Promise<{ default: ComponentType }>, allowedRoles?: Array<'admin'>) => async () => {
  const { default: Pagina } = await carregar();
  return { Component: () => <ProtectedRoute allowedRoles={allowedRoles}><Pagina /></ProtectedRoute> };
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <Error />,
  },
  // Documentos legais: carregados à parte (o texto pesa ~60 kB e só se lê quando se abre).
  { path: '/termos', lazy: async () => ({ Component: (await import('@/features/legal/LegalPage')).TermsScreen }), errorElement: <Error /> },
  { path: '/privacidade', lazy: async () => ({ Component: (await import('@/features/legal/LegalPage')).PrivacyScreen }), errorElement: <Error /> },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'trocar-senha',
        element: <ChangePasswordScreen />,
      },

    ]
  },
  {
    path: '/',
    element: <BaseLayout />,

    children: [

      {
        path: 'dashboard',
        children: [
          {
            path: 'learner',
            element: <Navigate to="/v2/painel" replace />,
          },
          {
            path: 'creator',
            element: <Navigate to="/v2/estudio/materiais" replace />,
          },
          {
            path: 'admin',
            lazy: protegida(() => import('../pages/PainelAdmin'), ['admin']),
          },
        ],
      },
      {
        path: 'courses',
        children: [
          {
            index: true,
            lazy: pagina(() => import('../pages/Marketplace')),
          },
          {
            path: 'create',
            lazy: protegida(() => import('../pages/CriarConteudo')),
          },
          {
            path: ':id',
            lazy: protegida(() => import('../pages/VisualizarConteudo')),
          },
        ],
      },
      {
        path: 'quiz/:id',
        lazy: protegida(() => import('../pages/Quiz')),
      },
      {
        path: 'ranking',
        element: <Navigate to="/v2/classificacao" replace />,
      },
    ],
  },
  v2Routes,
  {
    path: "*",
    element: <NotFound />
  }
]);
