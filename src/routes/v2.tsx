/* Ficheiro de rotas: exporta o objecto do router e declara telas locais; o Fast Refresh nao se aplica. */
/* eslint-disable react-refresh/only-export-components */
import type { RouteObject } from 'react-router-dom';
import { lazy, useState, type ReactNode } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import V2Layout from './V2Layout';

import { mockRecommendation } from '../features/onboarding/mockRecommendation';
import { MOCK_DIAGNOSTIC } from '../features/quiz/mockDiagnostic';

import { AppShell } from '../components/layout/AppShell';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { MOCK_COURSE } from '../features/course/mockCourse';



import { MOCK_TRAIL } from '../features/trail/mockTrail';

import { NOTIFICATIONS } from '../features/notifications/mockNotifications';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { EmBreve, EmBrevePagina } from '../components/EmBreve';
import { destinoPorPapel } from '../lib/destinoPosLogin';
import { FLUXO_MOCKS } from '../lib/fluxoFlags';
import { useAccoesNotificacoes, useListaNotificacoes } from '../hooks/useNotificacoes';




import { useAccoesEnquetes, useListaEnquetes, useResultadosEnquete } from '../hooks/useEnquetes';
import { mensagemErroEnquete } from '../services/surveyService';


// Telas carregadas sob pedido: cada ecra vira o seu proprio ficheiro e so se descarrega quando a rota abre.
const OnboardingNovo = lazy(() => import('../features/onboarding-novo/OnboardingNovo'));
const CredenciamentoFlow = lazy(() => import('../features/credenciamento/CredenciamentoFlow'));
const B1Preparar = lazy(() => import('../features/preparar/B1Preparar'));
const B3Calibrar = lazy(() => import('../features/preparar/B3Calibrar'));
const B4Previa = lazy(() => import('../features/preparar/B4Previa'));
const MinhasPreparacoes = lazy(() => import('../features/preparar/MinhasPreparacoes'));
const B6Modulo = lazy(() => import('../features/preparar/B6Modulo'));
const SimuladoCompleto = lazy(() => import('../features/preparar/SimuladoCompleto'));
const StudentOnboardingFlow = lazy(() => import('../features/onboarding/StudentOnboardingFlow'));
const AuthScreen = lazy(() => import('../features/auth/AuthScreen'));
const SchoolLoginScreen = lazy(() => import('../features/auth/SchoolLoginScreen'));
const DashboardScreen = lazy(() => import('../features/dashboard/DashboardScreen'));
const StudyFeedScreen = lazy(() => import('../features/feed/StudyFeedScreen'));
const SimuladoFlow = lazy(() => import('../features/challenge/SimuladoFlow'));
const MarketplaceScreen = lazy(() => import('../features/marketplace/MarketplaceScreen'));
const CourseScreen = lazy(() => import('../features/course/CourseScreen'));
const Ranking = lazy(() => import('../pages/Ranking'));
const StudentProfileScreen = lazy(() => import('../features/profile/StudentProfileScreen'));
const MaterialDetailScreen = lazy(() => import('../features/marketplace/MaterialDetailScreen'));
const ContaCriadorScreen = lazy(() => import('../features/subscription/ContaCriadorScreen'));
const AdminEstudantesScreen = lazy(() => import('../features/admin/AdminEstudantesScreen'));
const CreatorContentHubScreen = lazy(() => import('../features/creator-content/CreatorContentHubScreen'));
const LearningTrailScreen = lazy(() => import('../features/trail/LearningTrailScreen'));
const SessionExpiredScreen = lazy(() => import('../features/system/RecoveryScreens').then((m) => ({ default: m.SessionExpiredScreen })));
const NotFoundScreen = lazy(() => import('../features/system/RecoveryScreens').then((m) => ({ default: m.NotFoundScreen })));
const NotificationCenterScreen = lazy(() => import('../features/notifications/NotificationCenterScreen'));
const GlobalSearchScreen = lazy(() => import('../features/search/GlobalSearchScreen'));
const FreeLibraryScreen = lazy(() => import('../features/library/FreeLibraryScreen'));
const SurveyComposerScreen = lazy(() => import('../features/survey/SurveyComposerScreen'));
const SurveyResultsScreen = lazy(() => import('../features/survey/SurveyResultsScreen'));
const SurveyListScreen = lazy(() => import('../features/survey/SurveyListScreen'));
const CreationHubScreen = lazy(() => import('../features/authoring/CreationHubScreen'));

/** Nomes de sessão de demonstração (sem backend ligado ainda). */
/** Entrega o nome do utilizador autenticado às telas que ainda o recebem por prop. */
function ComUtilizador({ children }: { children: (nome: string) => ReactNode }) {
  const { usuario } = useAuth();
  return <>{children(usuario?.nome ?? '')}</>;
}

/**
 * Entrada de `/v2`: já não pergunta "estudante ou criador" (o onboarding vive depois do registo).
 * Com sessão, leva ao ecrã do papel (admin: membros, professor: estúdio, estudante: painel); sem sessão, ao login.
 */
function EntradaV2Route() {
  const { usuario, loading } = useAuth();
  if (loading) return null;
  if (usuario) return <Navigate to={destinoPorPapel(usuario)} replace />;
  return <Navigate to="/login" replace />;
}

function StudentOnboardingRoute() {
  const navigate = useNavigate();
  return (
    <StudentOnboardingFlow
      onExit={() => navigate('/v2')}
      getDiagnostic={() => MOCK_DIAGNOSTIC}
      getRecommendation={mockRecommendation}
      feedHref="/v2/trilhas"
    />
  );
}

function NotificationsRoute() {
  const { usuario } = useAuth();
  const lista = useListaNotificacoes();
  const { marcarLida, marcarTodasLidas } = useAccoesNotificacoes();
  const itens = useMemo(() => lista.data?.pages.flatMap((p) => p.itens) ?? [], [lista.data]);

  useEffect(() => {
    if (lista.isError) toast.error('Não foi possível carregar as notificações.', { id: 'erro-notificacoes' });
  }, [lista.isError]);

  // Sem sessão iniciada continua a demonstração com dados de exemplo.
  if (!usuario) {
    return <NotificationCenterScreen notifications={NOTIFICATIONS} userName="" />;
  }

  if (lista.isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="size-10 animate-spin rounded-full border-b-2 border-primary" role="status" aria-label="A carregar notificações" />
      </div>
    );
  }

  const falhou = () => toast.error('Não foi possível actualizar a notificação.', { id: 'erro-notificacao-leitura' });

  return (
    <NotificationCenterScreen
      notifications={itens}
      userName={usuario.nome}
      onMarkRead={(id) => void marcarLida(id).catch(falhou)}
      onMarkAllRead={() => void marcarTodasLidas().catch(falhou)}
      hasMore={lista.hasNextPage}
      onLoadMore={() => void lista.fetchNextPage()}
      loadingMore={lista.isFetchingNextPage}
    />
  );
}

function SessaoNecessariaEnquetes() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-4 text-center">
      <p className="text-body-md text-on-surface">Inicia sessão para ver e gerir enquetes.</p>
      <a href="/login" className="font-bold text-primary underline">
        Entrar
      </a>
    </div>
  );
}

function CarregarEnquetes({ rotulo }: { rotulo: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="size-10 animate-spin rounded-full border-b-2 border-primary" role="status" aria-label={rotulo} />
    </div>
  );
}

function SurveyComposerRoute() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { criar, publicar } = useAccoesEnquetes();
  if (!usuario) return <SessaoNecessariaEnquetes />;
  return (
    <SurveyComposerScreen
      creatorName={usuario.nome}
      onSaveDraft={criar}
      onPublish={publicar}
      onPublished={(enquete) => navigate(`/v2/estudio/enquete/resultados?id=${encodeURIComponent(enquete.id)}`)}
    />
  );
}

function SurveyResultsRoute() {
  const { usuario } = useAuth();
  const [params] = useSearchParams();
  const id = params.get('id');
  const resultados = useResultadosEnquete(id);
  const { fechar } = useAccoesEnquetes();
  if (!usuario) return <SessaoNecessariaEnquetes />;
  if (!id) return <Navigate to="/v2/enquetes" replace />;
  if (resultados.isPending) return <CarregarEnquetes rotulo="A carregar resultados" />;
  if (resultados.isError || !resultados.data) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <p className="text-body-md text-on-surface">
          {mensagemErroEnquete(resultados.error, 'Não foi possível carregar os resultados.')}
        </p>
        <a href="/v2/enquetes" className="font-bold text-primary underline">
          Voltar às enquetes
        </a>
      </div>
    );
  }
  return <SurveyResultsScreen result={resultados.data} creatorName={usuario.nome} onClose={async () => void (await fechar(id))} />;
}

function SurveyListRoute() {
  const { usuario } = useAuth();
  const [params] = useSearchParams();
  const lista = useListaEnquetes();
  const { votar, publicar } = useAccoesEnquetes();
  const itens = useMemo(() => lista.data?.pages.flatMap((p) => p.itens) ?? [], [lista.data]);

  useEffect(() => {
    if (lista.isError) toast.error('Não foi possível carregar as enquetes.', { id: 'erro-enquetes' });
  }, [lista.isError]);

  if (!usuario) return <SessaoNecessariaEnquetes />;
  if (lista.isPending) return <CarregarEnquetes rotulo="A carregar enquetes" />;

  return (
    <SurveyListScreen
      userName={usuario.nome}
      isCreator={usuario.tipo === 'criador'}
      items={itens}
      highlightId={params.get('id')}
      onVote={votar}
      onPublish={async (id) => void (await publicar(id))}
      hasMore={lista.hasNextPage}
      onLoadMore={() => void lista.fetchNextPage()}
      loadingMore={lista.isFetchingNextPage}
    />
  );
}

function AuthRoute() {
  const navigate = useNavigate();
  // Demo visual: sem tokens/sessao real (auth por SMS ainda sem endpoint no backend
  // e a ligar autenticacao real precisa de aprovacao do CTO -- ver CLAUDE.md).
  const [modoEscola, setModoEscola] = useState(false);

  // A entrada com a conta da escola e real (POST /auth/institutional/login/); a de SMS continua demo.
  if (modoEscola) {
    return (
      <SchoolLoginScreen
        onAuthenticated={(usuario) => navigate(usuario.mustChangePassword ? '/trocar-senha' : '/v2/painel')}
        onBack={() => setModoEscola(false)}
      />
    );
  }

  return <AuthScreen onAuthenticated={() => navigate('/v2/painel')} onSchoolLogin={() => setModoEscola(true)} />;
}

function MaterialRoute() {
  const { id } = useParams();
  const [params] = useSearchParams();
  return <MaterialDetailScreen id={id ?? params.get('id')} />;
}

function SearchRoute() {
  const [params] = useSearchParams();
  return <GlobalSearchScreen initialQuery={params.get('q') ?? ''} />;
}

function SimuladoRoute() {
  const [params] = useSearchParams();
  return <SimuladoFlow quizId={params.get('quizId')} />;
}


function SessionExpiredRoute() {
  const navigate = useNavigate();
  return (
    <SessionExpiredScreen
      phone="923891024"
      onVerify={async (code) => code === '729104'}
      onUseAnother={() => navigate('/v2/entrar')}
    />
  );
}

function RankingRoute() {
  return (
    <ProtectedRoute>
      <AppShell active="ligas">
        <Ranking />
      </AppShell>
    </ProtectedRoute>
  );
}

function NotFoundRoute() {
  return (
    <NotFoundScreen
      searchHref="/v2/pesquisa"
      homeHref="/v2/trilhas"
      suggestions={[
        { label: 'As minhas sebentas', href: '/v2/biblioteca' },
        { label: 'Marketplace de sebentas', href: '/v2/marketplace' },
        { label: 'Biblioteca livre', href: '/v2/biblioteca-livre' },
      ]}
    />
  );
}

/**
 * Rotas paralelas das 39 telas novas (docs/INTEGRACAO-TELAS.md, passo 11).
 * Cada ecra usa o seu proprio mock (feature/mock*.ts); ligar aos servicos reais
 * fica para "Depois de integrar" (secao 6 do documento), excepto AuthScreen
 * (fica demo, ver AuthRoute) e CreatorApplicationFlow (ja usa creatorService real).
 */
export const v2Routes: RouteObject = {
  path: 'v2',
  element: <V2Layout />,
  children: [
    { index: true, element: <EntradaV2Route /> },
    { path: 'onboarding', element: <OnboardingNovo /> },
    { path: 'onboarding/estudante', element: <StudentOnboardingRoute /> },
    { path: 'credenciamento', element: <CredenciamentoFlow /> },
    { path: 'entrar', element: <AuthRoute /> },

    { path: 'painel', element: <DashboardScreen /> },
    { path: 'trilhas', element: <StudyFeedScreen /> },
    { path: 'desafio', element: <SimuladoRoute /> },
    { path: 'marketplace', element: <MarketplaceScreen /> },
    { path: 'marketplace/:id', element: <MaterialRoute /> },
    { path: 'sebenta', element: <MaterialRoute /> },
    { path: 'cadeira', element: <CourseScreen course={MOCK_COURSE} /> },
    { path: 'leitura', element: <MaterialRoute /> },
    { path: 'classificacao', element: <RankingRoute /> },
    { path: 'ligas', element: <EmBrevePagina area="aluno" nome="Ligas" /> },
    { path: 'ofensiva', element: <EmBrevePagina area="aluno" nome="Ofensiva" /> },
    { path: 'perfil', element: <StudentProfileScreen /> },
    { path: 'medalhas', element: <EmBrevePagina area="aluno" nome="Medalhas" /> },
    { path: 'criador', element: <EmBrevePagina area="criador" nome="Perfil público" /> },

    { path: 'estudio', element: <Navigate to="/v2/estudio/materiais" replace /> },
    { path: 'estudio/financeiro', element: <EmBrevePagina area="criador" nome="Financeiro" /> },
    { path: 'estudio/plano', element: <EmBrevePagina area="criador" nome="Subscrição" secao="definicoes" /> },
    { path: 'estudio/definicoes', element: <ContaCriadorScreen /> },

    { path: 'admin', element: <EmBrevePagina area="admin" nome="Visão executiva" /> },
    { path: 'admin/estudantes', element: <Navigate to="/v2/admin/membros" replace /> },
    { path: 'admin/membros', element: <AdminEstudantesScreen /> },
    { path: 'admin/criadores', element: <EmBrevePagina area="admin" nome="Homologação de criadores" /> },
    { path: 'admin/moderacao', element: <EmBrevePagina area="admin" nome="Moderação de conteúdo" /> },
    { path: 'admin/insights', element: <EmBrevePagina area="admin" nome="Insights" /> },
    { path: 'admin/financeiro', element: <EmBrevePagina area="admin" nome="Financeiro" /> },
    { path: 'admin/gamificacao', element: <EmBrevePagina area="admin" nome="Gamificação e ligas" /> },

    { path: 'biblioteca', element: <EmBrevePagina area="aluno" nome="Biblioteca" /> },
    { path: 'biblioteca/descargas', element: <EmBrevePagina area="aluno" nome="Descargas offline" /> },
    { path: 'perfil/compras', element: <EmBrevePagina area="aluno" nome="Compras e recibos" /> },
    { path: 'estudio/materiais', element: <CreatorContentHubScreen /> },

    { path: 'definicoes', element: <EmBrevePagina area="aluno" nome="Definições" /> },
    { path: 'conta/telemovel', element: <EmBrevePagina area="aluno" nome="Número de telemóvel" /> },
    { path: 'trilha', element: <ComUtilizador>{(nome) => <LearningTrailScreen trail={MOCK_TRAIL} userName={nome} backHref="/v2/cadeira" />}</ComUtilizador> },
    { path: 'trilha/mista', element: <EmBrevePagina area="aluno" nome="Trilha mista" /> },
    { path: 'estudio/homologacao', element: <EmBrevePagina area="criador" nome="Homologação" /> },
    { path: 'estudio/homologacao/correcao', element: <EmBrevePagina area="criador" nome="Homologação" /> },
    { path: 'estudio/renovacao', element: <EmBrevePagina area="criador" nome="Subscrição" secao="definicoes" /> },

    { path: 'offline', element: <EmBrevePagina area="aluno" nome="Estudo offline" /> },
    { path: 'sessao-expirada', element: <SessionExpiredRoute /> },
    { path: '404', element: <NotFoundRoute /> },

    { path: 'notificacoes', element: <NotificationsRoute /> },
    { path: 'pesquisa', element: <SearchRoute /> },

    { path: 'estudio/analitica', element: <EmBrevePagina area="criador" nome="Analítica" /> },
    { path: 'duvidas', element: <EmBrevePagina area="aluno" nome="Dúvidas" /> },
    { path: 'revisao', element: <EmBrevePagina area="aluno" nome="Revisão" /> },

    { path: 'admin/catalogo', element: <EmBrevePagina area="admin" nome="Catálogo curricular" /> },
    { path: 'admin/subscricoes', element: <EmBrevePagina area="admin" nome="Subscrições" /> },
    { path: 'ligas/temporada', element: <EmBrevePagina area="aluno" nome="Ligas" /> },
    { path: 'biblioteca-livre', element: <FreeLibraryScreen /> },

    { path: 'audio', element: <EmBrevePagina area="aluno" nome="Áudio" /> },
    { path: 'polo', element: <EmBrevePagina area="aluno" nome="Página da faculdade" /> },

    { path: 'convidar', element: <EmBrevePagina area="aluno" nome="Convidar amigos" /> },
    { path: 'conta/sessoes', element: <EmBrevePagina area="aluno" nome="Sessões e dispositivos" /> },
    { path: 'privacidade', element: <EmBrevePagina area="aluno" nome="Privacidade e dados" /> },

    { path: 'admin/suporte', element: <EmBrevePagina area="admin" nome="Suporte e disputas" /> },

    { path: 'estudio/criar', element: <ComUtilizador>{(nome) => <CreationHubScreen creatorName={nome} />}</ComUtilizador> },
    { path: 'estudio/comecar', element: <EmBrevePagina area="criador" nome="Primeiros passos do estúdio" /> },
    { path: 'estudio/questoes', element: <EmBrevePagina area="criador" nome="Banco de questões" /> },
    { path: 'estudio/simulado', element: <EmBrevePagina area="criador" nome="Construtor de simulado" /> },
    { path: 'estudio/trilha', element: <EmBrevePagina area="criador" nome="Compositor de trilha" /> },
    { path: 'estudio/importar', element: <EmBrevePagina area="criador" nome="Importação em massa" /> },
    { path: 'estudio/versoes', element: <EmBrevePagina area="criador" nome="Histórico de versões" /> },

    { path: 'admin/adaptativo', element: <EmBrevePagina area="admin" nome="Nivelamento adaptativo" /> },
    { path: 'admin/fiscal', element: <EmBrevePagina area="admin" nome="Exportação fiscal" /> },
    { path: 'admin/equipa', element: <EmBrevePagina area="admin" nome="Equipa e permissões" /> },

    { path: 'u/:slug', element: <EmBreve nome="Páginas das universidades" /> },

    // Fluxo "Preparar a minha prova": só existe em desenvolvimento, com `VITE_FLUXO_MOCKS=true` (o backend ainda não tem a API).
    ...(FLUXO_MOCKS
      ? [
          { path: 'preparar', element: <B1Preparar /> },
          { path: 'preparar/calibrar', element: <B3Calibrar /> },
          { path: 'preparar/previa', element: <B4Previa /> },
          { path: 'preparar/materiais', element: <MinhasPreparacoes /> },
          { path: 'preparar/modulo/:id', element: <B6Modulo /> },
          { path: 'preparar/simulado/:id', element: <SimuladoCompleto /> },
        ]
      : []),

    { path: 'enquetes', element: <SurveyListRoute /> },
    { path: 'estudio/enquete', element: <SurveyComposerRoute /> },
    { path: 'estudio/enquete/resultados', element: <SurveyResultsRoute /> },
  ],
};
