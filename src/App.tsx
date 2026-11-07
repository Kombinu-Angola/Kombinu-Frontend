import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useEffect, useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Toaster } from './components/ui/sonner';

function App() {

  const [Loading, setLoading] = useState(true)

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
    <AuthProvider>
      <ThemeProvider >
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
