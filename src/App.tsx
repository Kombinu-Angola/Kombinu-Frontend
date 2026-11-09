import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useEffect, useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Toaster } from './components/ui/sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { useWorkspaceStore } from './stores/workspaceStore';

function App() {

  const [Loading, setLoading] = useState(true)
  const workspaceAtivo = useWorkspaceStore((s) => s.ativo);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);

  }, []);

  if (Loading) {
    return <SplashScreen />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider >
          {/* `key`: ao trocar de workspace, os ecrãs remontam e voltam a pedir os dados do novo contexto. */}
          <RouterProvider key={workspaceAtivo} router={router} />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
