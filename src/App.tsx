import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import type { ReactNode } from 'react';
import { useAuth } from './contexts/AuthContext';
import { SplashScreen } from './components/SplashScreen';
import { Toaster } from './components/ui/sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { useWorkspaceStore } from './stores/workspaceStore';

/** O splash só aparece enquanto a sessão carrega (sem tempo fixo); com a sessão resolvida, a app abre logo. */
function SessaoPronta({ children }: { children: ReactNode }) {
  const { loading } = useAuth();
  if (loading) return <SplashScreen />;
  return <>{children}</>;
}

function App() {
  const workspaceAtivo = useWorkspaceStore((s) => s.ativo);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider >
          <SessaoPronta>
          {/* `key`: ao trocar de workspace, os ecrãs remontam e voltam a pedir os dados do novo contexto. */}
          <RouterProvider key={workspaceAtivo} router={router} />
          <Toaster />
          </SessaoPronta>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
