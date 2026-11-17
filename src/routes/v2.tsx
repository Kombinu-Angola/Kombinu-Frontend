import type { RouteObject } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import V2Layout from './V2Layout';

import OnboardingRoleScreen from '../features/onboarding/OnboardingRoleScreen';
import StudentOnboardingFlow from '../features/onboarding/StudentOnboardingFlow';
import { mockRecommendation } from '../features/onboarding/mockRecommendation';
import { MOCK_DIAGNOSTIC } from '../features/quiz/mockDiagnostic';

import AuthScreen from '../features/auth/AuthScreen';
import SchoolLoginScreen from '../features/auth/SchoolLoginScreen';


import DashboardScreen from '../features/dashboard/DashboardScreen';
import StudyFeedScreen from '../features/feed/StudyFeedScreen';
import SimuladoFlow from '../features/challenge/SimuladoFlow';
import MarketplaceScreen from '../features/marketplace/MarketplaceScreen';
import CourseScreen from '../features/course/CourseScreen';
import { AppShell } from '../components/layout/AppShell';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Ranking from '../pages/Ranking';
import { MOCK_COURSE } from '../features/course/mockCourse';
import StudentProfileScreen from '../features/profile/StudentProfileScreen';
import MaterialDetailScreen from '../features/marketplace/MaterialDetailScreen';

import StudioScreen from '../features/studio/StudioScreen';
import { MOCK_DRAFT } from '../features/studio/mockDraft';
import SubscriptionFlow from '../features/subscription/SubscriptionFlow';
import AccountSettingsScreen, { type AccountSettings } from '../features/subscription/AccountSettingsScreen';

import AdminEstudantesScreen from '../features/admin/AdminEstudantesScreen';

import OfflineDownloadsScreen from '../features/library/OfflineDownloadsScreen';
import { LIBRARY_ITEMS, DOWNLOAD_PREFERENCES, OFFLINE_STORAGE } from '../features/library/mockLibrary';
import PurchaseHistoryScreen from '../features/purchases/PurchaseHistoryScreen';
import { PURCHASES } from '../features/purchases/mockPurchases';
import CreatorContentHubScreen from '../features/creator-content/CreatorContentHubScreen';

import StudentSettingsScreen from '../features/account/StudentSettingsScreen';
import PhoneSecurityScreen from '../features/account/PhoneSecurityScreen';
import { MOCK_ACCOUNT } from '../features/account/mockAccount';
import LearningTrailScreen from '../features/trail/LearningTrailScreen';
import AdaptiveTrailScreen from '../features/trail/AdaptiveTrailScreen';
import { MOCK_TRAIL, MOCK_ADAPTIVE } from '../features/trail/mockTrail';
import HomologationResultScreen, { type HomologationResult } from '../features/creator/HomologationResultScreen';
import RenewalFailureScreen from '../features/subscription/RenewalFailureScreen';

import { SessionExpiredScreen, NotFoundScreen } from '../features/system/RecoveryScreens';

import NotificationCenterScreen from '../features/notifications/NotificationCenterScreen';
import { NOTIFICATIONS } from '../features/notifications/mockNotifications';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { EmBreve, EmBrevePagina } from '../components/EmBreve';
import { destinoPorPapel } from '../lib/destinoPosLogin';
import { useAccoesNotificacoes, useListaNotificacoes } from '../hooks/useNotificacoes';
import GlobalSearchScreen from '../features/search/GlobalSearchScreen';

import MaterialQaScreen from '../features/qa/MaterialQaScreen';
import { MOCK_QA } from '../features/qa/mockQa';

import FreeLibraryScreen from '../features/library/FreeLibraryScreen';

import CampusPageScreen from '../features/campus/CampusPageScreen';
import { MOCK_CAMPUS } from '../features/campus/mockCampus';
import PublicUniversityScreen from '../features/campus/PublicUniversityScreen';

import PrivacyScreen from '../features/account/PrivacyScreen';
import SessionsScreen from '../features/account/SessionsScreen';
import { SESSIONS } from '../features/account/mockAccount';

import SurveyComposerScreen from '../features/survey/SurveyComposerScreen';
import SurveyResultsScreen from '../features/survey/SurveyResultsScreen';
import SurveyListScreen from '../features/survey/SurveyListScreen';
import { useAccoesEnquetes, useListaEnquetes, useResultadosEnquete } from '../hooks/useEnquetes';
import { mensagemErroEnquete } from '../services/surveyService';

import CreationHubScreen from '../features/authoring/CreationHubScreen';
import StudioOnboardingScreen from '../features/authoring/StudioOnboardingScreen';
import TrailComposerScreen from '../features/authoring/TrailComposerScreen';
import { TOPICS, QUESTIONS } from '../features/authoring/mockAuthoring';

/** Nomes de sessão de demonstração (sem backend ligado ainda). */
/** Entrega o nome do utilizador autenticado às telas que ainda o recebem por prop. */
function ComUtilizador({ children }: { children: (nome: string) => ReactNode }) {
  const { usuario } = useAuth();
  return <>{children(usuario?.nome ?? '')}</>;
}

function OnboardingRoute() {
  const navigate = useNavigate();
  const { usuario, loading } = useAuth();
  // Com sessão iniciada, `/v2` leva ao ecrã do papel (admin: membros, professor: estúdio, estudante: painel), sem Onboarding.
  if (loading) return null;
  if (usuario) return <Navigate to={destinoPorPapel(usuario)} replace />;
  return (
    <OnboardingRoleScreen
      onSelectRole={(role) => navigate(role === 'creator' ? '/v2/credenciamento' : '/v2/onboarding/estudante')}
    />
  );
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

/** O credenciamento de criador ainda não tem API (`POST /creators/applications/` não existe): mostra "Em breve" em vez de dar 404 ao submeter. */
function CreatorApplicationRoute() {
  return <EmBreve nome="Credenciamento de criador" />;
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
    return <NotificationCenterScreen notifications={NOTIFICATIONS} userName="" settingsHref="/v2/definicoes" />;
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
      settingsHref="/v2/definicoes"
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

function StudioRoute() {
  const { usuario } = useAuth();
  return (
    <StudioScreen
      initialDraft={MOCK_DRAFT}
      authorName={usuario?.nome ?? ''}
      courseName={MOCK_COURSE.hero.title}
      onSave={async () => {
        /* Backend de rascunhos ainda nao existe; useDraft guarda so em memoria. */
      }}
    />
  );
}

const DEMO_SETTINGS: AccountSettings = {
  name: '',
  institution: 'uan-economia',
  bio: 'Explico Economia e Macroeconomia de forma simples, com sebentas revistas e simulados semanais.',
  phone: '923000302',
  phoneVerified: true,
  plan: 'pro',
  planPriceKz: 5000,
  renewsAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
  notifications: { streak: true, questions: true, sales: true },
};

function AccountSettingsRoute() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  return <AccountSettingsScreen settings={{ ...DEMO_SETTINGS, name: usuario?.nome ?? '' }} onChangePlan={() => navigate('/v2/estudio/plano')} />;
}

function StudentSettingsRoute() {
  return (
    <StudentSettingsScreen
      account={MOCK_ACCOUNT}
      phoneHref="/v2/conta/telemovel"
      downloadsHref="/v2/biblioteca/descargas"
    />
  );
}

function PhoneSecurityRoute() {
  return (
    <PhoneSecurityScreen
      currentPhone={MOCK_ACCOUNT.phone}
      institutionalEmail={MOCK_ACCOUNT.institutionalEmail}
      emailVerified={MOCK_ACCOUNT.emailVerified}
      university={MOCK_ACCOUNT.university}
      userName={MOCK_ACCOUNT.name}
      settingsHref="/v2/definicoes"
      onChangePhone={async (_novo, codeNew, codeCurrent) => codeNew === '842913' && codeCurrent === '100200'}
    />
  );
}

const HOMOLOGATION_CREATOR = {
  name: '',
  university: 'Universidade Agostinho Neto (UAN)',
  faculty: 'Faculdade de Ciências',
  specialty: 'Estruturas de Dados',
  phone: '923456789',
};

const HOMOLOGATION_APROVADO: HomologationResult = {
  status: 'aprovado',
  protocol: 'PROT-CRE-2026-8942',
  decidedAt: new Date().toISOString(),
  creator: HOMOLOGATION_CREATOR,
};

const HOMOLOGATION_CORRECAO: HomologationResult = {
  status: 'correcao',
  protocol: 'PROT-CRE-2026-8944',
  decidedAt: new Date(Date.now() - 86_400_000).toISOString(),
  creator: HOMOLOGATION_CREATOR,
  feedback:
    'A declaração enviada tem a data de validade ilegível no canto inferior direito. A amostra está aprovada.',
  required: ['Declaração institucional com a validade legível, em PDF ou fotografia nítida.'],
};

function RenewalFailureRoute() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  return (
    <RenewalFailureScreen
      creatorName={usuario?.nome ?? ''}
      priceKz={5000}
      phone="923891024"
      failedAt={new Date(Date.now() - 2 * 86_400_000).toISOString()}
      graceEndsAt={new Date(Date.now() + 5 * 86_400_000).toISOString()}
      authorize={async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return { reference: 'EXP-2026-9014', approvedAt: new Date().toISOString() };
      }}
      onDowngrade={() => navigate('/v2/estudio/definicoes')}
      changePhoneHref="/v2/conta/telemovel"
    />
  );
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

function SubscriptionRoute() {
  const { usuario } = useAuth();
  return (
    <SubscriptionFlow
      creatorName={usuario?.nome ?? ''}
      currentPlan="free"
      studioHref="/v2/estudio"
      authorize={async (_phone, _amountKz) => {
        await new Promise((resolve) => setTimeout(resolve, 2500));
        return { reference: `EXP-${Date.now()}`, approvedAt: new Date().toISOString() };
      }}
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
    { index: true, element: <OnboardingRoute /> },
    { path: 'onboarding/estudante', element: <StudentOnboardingRoute /> },
    { path: 'credenciamento', element: <CreatorApplicationRoute /> },
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

    { path: 'estudio', element: <StudioRoute /> },
    { path: 'estudio/financeiro', element: <EmBrevePagina area="criador" nome="Financeiro" /> },
    { path: 'estudio/plano', element: <SubscriptionRoute /> },
    { path: 'estudio/definicoes', element: <AccountSettingsRoute /> },

    { path: 'admin', element: <EmBrevePagina area="admin" nome="Visão executiva" /> },
    { path: 'admin/estudantes', element: <Navigate to="/v2/admin/membros" replace /> },
    { path: 'admin/membros', element: <AdminEstudantesScreen /> },
    { path: 'admin/criadores', element: <EmBrevePagina area="admin" nome="Homologação de criadores" /> },
    { path: 'admin/moderacao', element: <EmBrevePagina area="admin" nome="Moderação de conteúdo" /> },
    { path: 'admin/insights', element: <EmBrevePagina area="admin" nome="Insights" /> },
    { path: 'admin/financeiro', element: <EmBrevePagina area="admin" nome="Financeiro" /> },
    { path: 'admin/gamificacao', element: <EmBrevePagina area="admin" nome="Gamificação e ligas" /> },

    { path: 'biblioteca', element: <EmBrevePagina area="aluno" nome="Biblioteca" /> },
    {
      path: 'biblioteca/descargas',
      element: (
        <ComUtilizador>
          {(nome) => (
            <OfflineDownloadsScreen
              items={LIBRARY_ITEMS}
              storage={OFFLINE_STORAGE}
              preferences={DOWNLOAD_PREFERENCES}
              userName={nome}
              libraryHref="/v2/biblioteca"
            />
          )}
        </ComUtilizador>
      ),
    },
    { path: 'perfil/compras', element: <ComUtilizador>{(nome) => <PurchaseHistoryScreen purchases={PURCHASES} userName={nome} profileHref="/v2/perfil" />}</ComUtilizador> },
    { path: 'estudio/materiais', element: <CreatorContentHubScreen /> },

    { path: 'definicoes', element: <StudentSettingsRoute /> },
    { path: 'conta/telemovel', element: <PhoneSecurityRoute /> },
    { path: 'trilha', element: <ComUtilizador>{(nome) => <LearningTrailScreen trail={MOCK_TRAIL} userName={nome} backHref="/v2/cadeira" />}</ComUtilizador> },
    { path: 'trilha/mista', element: <ComUtilizador>{(nome) => <AdaptiveTrailScreen trail={MOCK_ADAPTIVE} userName={nome} diagnosticHref="/v2/painel" />}</ComUtilizador> },
    { path: 'estudio/homologacao', element: <ComUtilizador>{(nome) => <HomologationResultScreen studioHref="/v2/estudio" publicProfileHref="/v2/criador" result={{ ...HOMOLOGATION_APROVADO, creator: { ...HOMOLOGATION_CREATOR, name: nome } }} />}</ComUtilizador> },
    { path: 'estudio/homologacao/correcao', element: <ComUtilizador>{(nome) => <HomologationResultScreen studioHref="/v2/estudio" publicProfileHref="/v2/criador" result={{ ...HOMOLOGATION_CORRECAO, creator: { ...HOMOLOGATION_CREATOR, name: nome } }} />}</ComUtilizador> },
    { path: 'estudio/renovacao', element: <RenewalFailureRoute /> },

    { path: 'offline', element: <EmBrevePagina area="aluno" nome="Estudo offline" /> },
    { path: 'sessao-expirada', element: <SessionExpiredRoute /> },
    { path: '404', element: <NotFoundRoute /> },

    { path: 'notificacoes', element: <NotificationsRoute /> },
    { path: 'pesquisa', element: <SearchRoute /> },

    { path: 'estudio/analitica', element: <EmBrevePagina area="criador" nome="Analítica" /> },
    { path: 'duvidas', element: <ComUtilizador>{(nome) => <MaterialQaScreen board={MOCK_QA} userName={nome} />}</ComUtilizador> },
    { path: 'revisao', element: <EmBrevePagina area="aluno" nome="Revisão" /> },

    { path: 'admin/catalogo', element: <EmBrevePagina area="admin" nome="Catálogo curricular" /> },
    { path: 'admin/subscricoes', element: <EmBrevePagina area="admin" nome="Subscrições" /> },
    { path: 'ligas/temporada', element: <EmBrevePagina area="aluno" nome="Ligas" /> },
    { path: 'biblioteca-livre', element: <FreeLibraryScreen /> },

    { path: 'audio', element: <EmBrevePagina area="aluno" nome="Áudio" /> },
    { path: 'polo', element: <ComUtilizador>{(nome) => <CampusPageScreen page={MOCK_CAMPUS} userName={nome} />}</ComUtilizador> },

    { path: 'convidar', element: <EmBrevePagina area="aluno" nome="Convidar amigos" /> },
    { path: 'conta/sessoes', element: <SessionsScreen sessions={SESSIONS} userName={MOCK_ACCOUNT.name} securityHref="/v2/definicoes" /> },
    {
      path: 'privacidade',
      element: (
        <PrivacyScreen
          userName={MOCK_ACCOUNT.name}
          settings={{ ranking: true, recommendations: true, telemetry: true }}
          walletKz={0}
          settingsHref="/v2/definicoes"
          financeHref="/v2/estudio/financeiro"
          exportContents={[
            'Histórico de simulados, respostas e XP',
            'Comprovativos e recibos Multicaixa Express em PDF',
            'Sebentas compradas e notas guardadas no leitor',
            'Extrato de criador, quando aplicável',
          ]}
        />
      ),
    },

    { path: 'admin/suporte', element: <EmBrevePagina area="admin" nome="Suporte e disputas" /> },

    { path: 'estudio/criar', element: <ComUtilizador>{(nome) => <CreationHubScreen creatorName={nome} questionCount={QUESTIONS.length} draftCount={2} />}</ComUtilizador> },
    {
      path: 'estudio/comecar',
      element: (
        <ComUtilizador>
          {(nome) => (
        <StudioOnboardingScreen
          creatorName={nome}
          university="UAN · Faculdade de Ciências"
          steps={[
            { id: 's1', label: 'Credenciais homologadas', detail: 'Aprovado pela equipa de auditoria.', done: true, href: '/v2/estudio/homologacao' },
            { id: 's2', label: 'Publicar o primeiro material', detail: 'Começa por um modelo e adapta o conteúdo.', done: false, href: '/v2/estudio/criar' },
            { id: 's3', label: 'Definir preço e visibilidade', detail: 'Entre 1.000 e 2.500 Kz na tua cadeira.', done: false, href: '/v2/estudio/materiais' },
            { id: 's4', label: 'Confirmar o Multicaixa Express', detail: 'Teste de 1 Kz para validar a titularidade.', done: false, href: '/v2/estudio/financeiro' },
          ]}
        />
          )}
        </ComUtilizador>
      ),
    },
    { path: 'estudio/questoes', element: <EmBrevePagina area="criador" nome="Banco de questões" /> },
    { path: 'estudio/simulado', element: <EmBrevePagina area="criador" nome="Construtor de simulado" /> },
    { path: 'estudio/trilha', element: <ComUtilizador>{(nome) => <TrailComposerScreen topics={TOPICS} creatorName={nome} subjectName="Macroeconomia I" readersOnCurrent={83} />}</ComUtilizador> },
    { path: 'estudio/importar', element: <EmBrevePagina area="criador" nome="Importação em massa" /> },
    { path: 'estudio/versoes', element: <EmBrevePagina area="criador" nome="Histórico de versões" /> },

    { path: 'admin/adaptativo', element: <EmBrevePagina area="admin" nome="Nivelamento adaptativo" /> },
    { path: 'admin/fiscal', element: <EmBrevePagina area="admin" nome="Exportação fiscal" /> },
    { path: 'admin/equipa', element: <EmBrevePagina area="admin" nome="Equipa e permissões" /> },

    { path: 'u/:slug', element: <PublicUniversityScreen page={MOCK_CAMPUS} signUpHref="/v2/entrar" signInHref="/v2/entrar" /> },

    { path: 'enquetes', element: <SurveyListRoute /> },
    { path: 'estudio/enquete', element: <SurveyComposerRoute /> },
    { path: 'estudio/enquete/resultados', element: <SurveyResultsRoute /> },
  ],
};
