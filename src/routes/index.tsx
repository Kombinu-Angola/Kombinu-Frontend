import { createBrowserRouter } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardAprendiz from '../pages/DashboardAprendiz';
import DashboardCriador from '../pages/DashboardCriador';
import Marketplace from '../pages/Marketplace';
import Quiz from '../pages/Quiz';
import Ranking from '../pages/Ranking';
import CriarConteudo from '../pages/CriarConteudo';
import VisualizarConteudo from '../pages/VisualizarConteudo';
import PainelAdmin from '../pages/PainelAdmin';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AuthLayout from '@/components/layout/authLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
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
            element: <ProtectedRoute><DashboardAprendiz /></ProtectedRoute>,
          },
          {
            path: 'creator',
            element: <ProtectedRoute><DashboardCriador /></ProtectedRoute>,
          },
          {
            path: 'admin',
            element: <ProtectedRoute allowedRoles={['admin']}><PainelAdmin /></ProtectedRoute>,
          },
        ],
      },
      {
        path: 'courses',
        children: [
          {
            index: true,
            element: <Marketplace />,
          },
          {
            path: 'create',
            element: <ProtectedRoute><CriarConteudo /></ProtectedRoute>,
          },
          {
            path: ':id',
            element: <ProtectedRoute><VisualizarConteudo /></ProtectedRoute>,
          },
        ],
      },
      {
        path: 'quiz/:id',
        element: <ProtectedRoute><Quiz /></ProtectedRoute>,
      },
      {
        path: 'ranking',
        element: <ProtectedRoute><Ranking /></ProtectedRoute>,
      },
    ],
  },
]);
