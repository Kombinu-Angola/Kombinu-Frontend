import { Suspense, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { EsqueletoPagina } from '../components/layout/EsqueletoPagina';
import { useAuth } from '../contexts/AuthContext';
import { GamificationProvider } from '../contexts/GamificationContext';
import { destinoPorPapel } from '../lib/destinoPosLogin';
import { ONBOARDING_ACTIVO } from '../lib/fluxoFlags';
import { perfilService } from '../services/perfilService';

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

/** Entradas de /v2 que não precisam de sessão (onboarding, credenciamento e a entrada de demonstração). */
const ROTAS_PUBLICAS = ['/v2/entrar', '/v2/onboarding', '/v2/credenciamento'];

/**
 * Quem acabou de se registar (aprendiz sem escola) e ainda não fez o onboarding vai para `/v2/onboarding`
 * ao chegar ao painel. Só corre com o onboarding novo activo; sem ele não há consulta nenhuma.
 */
function GuardaOnboarding({ uid }: { uid: string }) {
  const perfil = useQuery({ queryKey: ['perfil', uid], queryFn: () => perfilService.obter(uid), retry: false });
  if (perfil.data && perfil.data.onboardingConcluidoEm === null) return <Navigate to="/v2/onboarding" replace />;
  return null;
}

/** Moldura de /v2. O estado de gamificação arranca a zeros: os números reais vêm da API (`useGamificacaoMe`). */
export default function V2Layout() {
  useInternalLinkInterceptor();
  const { usuario, loading } = useAuth();
  const { pathname, search } = useLocation();

  // Troca de senha obrigatória pendente: nenhuma tela de /v2 fica acessível até à troca.
  if (usuario?.mustChangePassword) return <Navigate to="/trocar-senha" replace />;

  // Fora das entradas públicas, as telas /v2 precisam de sessão: sem ela ficariam em "A carregar…"
  // para sempre. Vai para o login com o `from`, que o devolve aqui depois de entrar.
  const publica = pathname === '/v2' || pathname === '/v2/' || ROTAS_PUBLICAS.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  if (!publica) {
    if (loading) {
      return <EsqueletoPagina />;
    }
    if (!usuario) return <Navigate to="/login" state={{ from: { pathname, search } }} replace />;
  }

  // Defesa em profundidade: a API já recusa, mas a área de administração só abre a quem
  // é admin de uma escola (membership) ou admin da plataforma.
  if (pathname === '/v2/admin' || pathname.startsWith('/v2/admin/')) {
    const eAdmin =
      usuario?.tipo === 'admin' || (usuario?.memberships ?? []).some((m) => m.papel === 'admin');
    if (!eAdmin) return <Navigate to="/v2/trilhas" replace />;
  }

  // O estúdio é de quem cria: conta de criador, ou professor/admin de uma escola. Um estudante
  // que abra `/v2/estudio/*` à mão volta ao ecrã do seu papel (a API já recusa a criação).
  if (pathname === '/v2/estudio' || pathname.startsWith('/v2/estudio/')) {
    const podeCriar =
      usuario?.tipo === 'criador' ||
      usuario?.tipo === 'admin' ||
      (usuario?.memberships ?? []).some((m) => m.papel === 'teacher' || m.papel === 'admin');
    if (usuario && !podeCriar) return <Navigate to={destinoPorPapel(usuario)} replace />;
  }

  return (
    <GamificationProvider>
      {ONBOARDING_ACTIVO && pathname === '/v2/painel' && usuario?.tipo === 'aprendiz' && (usuario.memberships ?? []).length === 0 && (
        <GuardaOnboarding uid={usuario.id} />
      )}
      <Suspense fallback={<EsqueletoPagina />}>
        <Outlet />
      </Suspense>
    </GamificationProvider>
  );
}
