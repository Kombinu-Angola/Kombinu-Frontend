import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GamificationProvider } from '../contexts/GamificationContext';

/**
 * As telas novas (features/*) navegam por <a href="/v2/..."> simples, não por <Link>
 * (ver docs/kombinu-mapeamento.md do pacote de origem). Sem isto, cada clique faria um
 * reload completo da página e perderia o estado partilhado (XP, sequência, gemas).
 * Este intercetor delega esses cliques ao router, mantendo a navegação client-side.
 */
function useInternalLinkInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('/v2') || anchor.target === '_blank') return;

      event.preventDefault();
      navigate(href);
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);
}

/** Moldura de /v2: sessão de demonstração (XP 650, sequência 12, 450 gemas) partilhada entre as telas novas. */
export default function V2Layout() {
  useInternalLinkInterceptor();
  const { usuario, loading } = useAuth();
  const { pathname } = useLocation();

  // Troca de senha obrigatória pendente: nenhuma tela de /v2 fica acessível até à troca.
  if (usuario?.mustChangePassword) return <Navigate to="/trocar-senha" replace />;

  // Defesa em profundidade: a API já recusa, mas a área de administração só abre a quem
  // é admin de uma escola (membership) ou admin da plataforma.
  if (pathname === '/v2/admin' || pathname.startsWith('/v2/admin/')) {
    if (loading) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-background">
          <div className="size-12 animate-spin rounded-full border-b-2 border-brand-ocean" />
        </div>
      );
    }
    if (!usuario) return <Navigate to="/login" state={{ from: { pathname } }} replace />;
    const eAdmin =
      usuario.tipo === 'admin' || (usuario.memberships ?? []).some((m) => m.papel === 'admin');
    if (!eAdmin) return <Navigate to="/v2/trilhas" replace />;
  }

  return (
    <GamificationProvider initialXp={650} initialStreak={12} initialGems={450}>
      <Outlet />
    </GamificationProvider>
  );
}
