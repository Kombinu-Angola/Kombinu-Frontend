import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
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

  return (
    <GamificationProvider initialXp={650} initialStreak={12} initialGems={450}>
      <Outlet />
    </GamificationProvider>
  );
}
