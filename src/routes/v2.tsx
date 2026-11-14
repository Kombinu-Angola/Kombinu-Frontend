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

import CreatorApplicationFlow from '../features/creator/CreatorApplicationFlow';
import { submitCreatorApplication } from '../services/creatorService';

import DashboardScreen from '../features/dashboard/DashboardScreen';
import StudyFeedScreen from '../features/feed/StudyFeedScreen';
import { MOCK_FEED } from '../features/feed/mockFeed';
import SimuladoFlow from '../features/challenge/SimuladoFlow';
import MarketplaceScreen from '../features/marketplace/MarketplaceScreen';
import CourseScreen from '../features/course/CourseScreen';
import { AppShell } from '../components/layout/AppShell';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Ranking from '../pages/Ranking';
import { MOCK_COURSE } from '../features/course/mockCourse';
import LeaguesScreen from '../features/leagues/LeaguesScreen';
import { mockLeague } from '../features/leagues/mockLeague';
import StreakHubScreen from '../features/streak/StreakHubScreen';
import { MOCK_STREAK } from '../features/streak/mockStreak';
import StudentProfileScreen from '../features/profile/StudentProfileScreen';
import BadgeVaultScreen from '../features/profile/BadgeVaultScreen';
import { BADGES } from '../features/profile/mockProfile';
import MaterialDetailScreen from '../features/marketplace/MaterialDetailScreen';
import CreatorPublicProfileScreen from '../features/creator-public/CreatorPublicProfileScreen';
import { MOCK_CREATOR } from '../features/creator-public/mockCreator';

import StudioScreen from '../features/studio/StudioScreen';
import { MOCK_DRAFT } from '../features/studio/mockDraft';
import CreatorFinanceScreen from '../features/creator-finance/CreatorFinanceScreen';
import { MOCK_FINANCE } from '../features/creator-finance/mockFinance';
import SubscriptionFlow from '../features/subscription/SubscriptionFlow';
import AccountSettingsScreen, { type AccountSettings } from '../features/subscription/AccountSettingsScreen';

import AdminOverviewScreen from '../features/admin/AdminOverviewScreen';
import AdminEstudantesScreen from '../features/admin/AdminEstudantesScreen';
import ModerationScreen from '../features/admin/ModerationScreen';
import FinanceScreen from '../features/admin/FinanceScreen';
import InsightsScreen from '../features/admin/InsightsScreen';
import GamificationScreen from '../features/admin/GamificationScreen';
import CreatorQueueScreen from '../features/admin/CreatorQueueScreen';
import { CREATOR_QUEUE } from '../features/admin/mockCreatorQueue';

import StudentLibraryScreen from '../features/library/StudentLibraryScreen';
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

import { OfflineScreen } from '../features/system/OfflineScreen';
import { SessionExpiredScreen, NotFoundScreen } from '../features/system/RecoveryScreens';

import NotificationCenterScreen from '../features/notifications/NotificationCenterScreen';
import { NOTIFICATIONS } from '../features/notifications/mockNotifications';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useAccoesNotificacoes, useListaNotificacoes } from '../hooks/useNotificacoes';
import GlobalSearchScreen from '../features/search/GlobalSearchScreen';

import MaterialAnalyticsScreen from '../features/analytics/MaterialAnalyticsScreen';
import { MOCK_ANALYTICS } from '../features/analytics/mockAnalytics';
import MaterialQaScreen from '../features/qa/MaterialQaScreen';
import { MOCK_QA } from '../features/qa/mockQa';
import ReviewNotebookScreen from '../features/review/ReviewNotebookScreen';
import { MOCK_REVIEW } from '../features/review/mockReview';

import CurriculumCatalogScreen from '../features/admin/CurriculumCatalogScreen';
import { CATALOG } from '../features/admin/mockCatalog';
import SubscriptionsReportScreen from '../features/admin/SubscriptionsReportScreen';
import SeasonFinaleScreen from '../features/leagues/SeasonFinaleScreen';
import { mockSeasonResult } from '../features/leagues/mockLeague';
import FreeLibraryScreen from '../features/library/FreeLibraryScreen';

import AudioPlayerScreen from '../features/audio/AudioPlayerScreen';
import { MOCK_AUDIO } from '../features/audio/mockAudio';
import CampusPageScreen from '../features/campus/CampusPageScreen';
import { MOCK_CAMPUS } from '../features/campus/mockCampus';
import PublicUniversityScreen from '../features/campus/PublicUniversityScreen';

import ReferralScreen from '../features/referral/ReferralScreen';
import { MOCK_REFERRAL } from '../features/referral/mockReferral';
import PrivacyScreen from '../features/account/PrivacyScreen';
import SessionsScreen from '../features/account/SessionsScreen';
import { SESSIONS } from '../features/account/mockAccount';

import SupportTicketsScreen from '../features/admin/SupportTicketsScreen';
import { SUPPORT_TICKETS } from '../features/admin/mockSupport';
import AdaptiveRulesScreen from '../features/admin/AdaptiveRulesScreen';
import FiscalExportScreen from '../features/governance/FiscalExportScreen';
import TeamPermissionsScreen from '../features/governance/TeamPermissionsScreen';
import SurveyComposerScreen from '../features/survey/SurveyComposerScreen';
import SurveyResultsScreen from '../features/survey/SurveyResultsScreen';
import SurveyListScreen from '../features/survey/SurveyListScreen';
import { useAccoesEnquetes, useListaEnquetes, useResultadosEnquete } from '../hooks/useEnquetes';
import { mensagemErroEnquete } from '../services/surveyService';

import CreationHubScreen from '../features/authoring/CreationHubScreen';
import StudioOnboardingScreen from '../features/authoring/StudioOnboardingScreen';
import QuestionBankScreen from '../features/authoring/QuestionBankScreen';
import ExamComposerScreen from '../features/authoring/ExamComposerScreen';
import TrailComposerScreen from '../features/authoring/TrailComposerScreen';
import BulkImportScreen from '../features/authoring/BulkImportScreen';
import VersionHistoryScreen from '../features/authoring/VersionHistoryScreen';
import { TOPICS, QUESTIONS, VERSIONS, IMPORTED_ROWS } from '../features/authoring/mockAuthoring';

/** Nomes de sessão de demonstração (sem backend ligado ainda). */
/** Entrega o nome do utilizador autenticado às telas que ainda o recebem por prop. */
function ComUtilizador({ children }: { children: (nome: string) => ReactNode }) {
  const { usuario } = useAuth();
  return <>{children(usuario?.nome ?? '')}</>;
}

function OnboardingRoute() {
  const navigate = useNavigate();
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

function CreatorApplicationRoute() {
  const navigate = useNavigate();
  return (
    <CreatorApplicationFlow
      onExit={() => navigate('/v2')}
      submit={submitCreatorApplication}
      links={{ studio: '/v2/estudio', home: '/v2/painel', support: '/v2' }}
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

function ReviewRoute() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  return <ReviewNotebookScreen queue={MOCK_REVIEW} userName={usuario?.nome ?? ''} onStartSession={() => navigate('/v2/desafio')} />;
}

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
    { path: 'trilhas', element: <StudyFeedScreen feed={MOCK_FEED} /> },
    { path: 'desafio', element: <SimuladoRoute /> },
    { path: 'marketplace', element: <MarketplaceScreen /> },
    { path: 'marketplace/:id', element: <MaterialRoute /> },
    { path: 'sebenta', element: <MaterialRoute /> },
    { path: 'cadeira', element: <CourseScreen course={MOCK_COURSE} /> },
    { path: 'leitura', element: <MaterialRoute /> },
    { path: 'classificacao', element: <RankingRoute /> },
    { path: 'ligas', element: <ComUtilizador>{(nome) => <LeaguesScreen league={mockLeague()} userName={nome} />}</ComUtilizador> },
    { path: 'ofensiva', element: <ComUtilizador>{(nome) => <StreakHubScreen streak={MOCK_STREAK} userName={nome} studyHref="/v2/trilhas" />}</ComUtilizador> },
    { path: 'perfil', element: <StudentProfileScreen /> },
    { path: 'medalhas', element: <ComUtilizador>{(nome) => <BadgeVaultScreen badges={BADGES} userName={nome} seasonTotal={BADGES.length} />}</ComUtilizador> },
    { path: 'criador', element: <ComUtilizador>{(nome) => <CreatorPublicProfileScreen creator={MOCK_CREATOR} userName={nome} />}</ComUtilizador> },

    { path: 'estudio', element: <StudioRoute /> },
    { path: 'estudio/financeiro', element: <ComUtilizador>{(nome) => <CreatorFinanceScreen finance={MOCK_FINANCE} creatorName={nome} />}</ComUtilizador> },
    { path: 'estudio/plano', element: <SubscriptionRoute /> },
    { path: 'estudio/definicoes', element: <AccountSettingsRoute /> },

    { path: 'admin', element: <AdminOverviewScreen /> },
    { path: 'admin/estudantes', element: <Navigate to="/v2/admin/membros" replace /> },
    { path: 'admin/membros', element: <AdminEstudantesScreen /> },
    { path: 'admin/criadores', element: <CreatorQueueScreen applications={CREATOR_QUEUE} /> },
    { path: 'admin/moderacao', element: <ModerationScreen /> },
    { path: 'admin/insights', element: <InsightsScreen /> },
    { path: 'admin/financeiro', element: <FinanceScreen /> },
    { path: 'admin/gamificacao', element: <GamificationScreen /> },

    { path: 'biblioteca', element: <ComUtilizador>{(nome) => <StudentLibraryScreen items={LIBRARY_ITEMS} userName={nome} downloadsHref="/v2/biblioteca/descargas" marketplaceHref="/v2/marketplace" />}</ComUtilizador> },
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

    { path: 'offline', element: <OfflineScreen offlineItems={5} cachedKb={5_940} pendingAnswers={4} streakDays={12} libraryHref="/v2/biblioteca" /> },
    { path: 'sessao-expirada', element: <SessionExpiredRoute /> },
    { path: '404', element: <NotFoundRoute /> },

    { path: 'notificacoes', element: <NotificationsRoute /> },
    { path: 'pesquisa', element: <SearchRoute /> },

    { path: 'estudio/analitica', element: <ComUtilizador>{(nome) => <MaterialAnalyticsScreen analytics={MOCK_ANALYTICS} creatorName={nome} materialsHref="/v2/estudio/materiais" />}</ComUtilizador> },
    { path: 'duvidas', element: <ComUtilizador>{(nome) => <MaterialQaScreen board={MOCK_QA} userName={nome} />}</ComUtilizador> },
    { path: 'revisao', element: <ReviewRoute /> },

    { path: 'admin/catalogo', element: <CurriculumCatalogScreen institutions={CATALOG} /> },
    { path: 'admin/subscricoes', element: <SubscriptionsReportScreen /> },
    { path: 'ligas/temporada', element: <ComUtilizador>{(nome) => <SeasonFinaleScreen result={mockSeasonResult()} userName={nome} leagueHref="/v2/ligas" />}</ComUtilizador> },
    { path: 'biblioteca-livre', element: <FreeLibraryScreen /> },

    { path: 'audio', element: <ComUtilizador>{(nome) => <AudioPlayerScreen audio={MOCK_AUDIO} userName={nome} />}</ComUtilizador> },
    { path: 'polo', element: <ComUtilizador>{(nome) => <CampusPageScreen page={MOCK_CAMPUS} userName={nome} />}</ComUtilizador> },

    { path: 'convidar', element: <ComUtilizador>{(nome) => <ReferralScreen program={MOCK_REFERRAL} userName={nome} university="UAN" subject="Macroeconomia I" />}</ComUtilizador> },
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

    { path: 'admin/suporte', element: <SupportTicketsScreen tickets={SUPPORT_TICKETS} agentName="Hamilton Kiala" /> },

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
    { path: 'estudio/questoes', element: <ComUtilizador>{(nome) => <QuestionBankScreen questions={QUESTIONS} topics={TOPICS} creatorName={nome} subjectName="Macroeconomia I · UAN" />}</ComUtilizador> },
    { path: 'estudio/simulado', element: <ComUtilizador>{(nome) => <ExamComposerScreen questions={QUESTIONS} topics={TOPICS} creatorName={nome} subjectName="Macroeconomia I" />}</ComUtilizador> },
    { path: 'estudio/trilha', element: <ComUtilizador>{(nome) => <TrailComposerScreen topics={TOPICS} creatorName={nome} subjectName="Macroeconomia I" readersOnCurrent={83} />}</ComUtilizador> },
    { path: 'estudio/importar', element: <ComUtilizador>{(nome) => <BulkImportScreen rows={IMPORTED_ROWS} topics={TOPICS} creatorName={nome} />}</ComUtilizador> },
    { path: 'estudio/versoes', element: <ComUtilizador>{(nome) => <VersionHistoryScreen materialTitle="Manual de exercícios: Macroeconomia I" versions={VERSIONS} creatorName={nome} />}</ComUtilizador> },

    { path: 'admin/adaptativo', element: <AdaptiveRulesScreen /> },
    { path: 'admin/fiscal', element: <FiscalExportScreen entityName="Kombinu EdTech, Lda" nif="5412894210" /> },
    { path: 'admin/equipa', element: <TeamPermissionsScreen /> },

    { path: 'u/:slug', element: <PublicUniversityScreen page={MOCK_CAMPUS} signUpHref="/v2/entrar" signInHref="/v2/entrar" /> },

    { path: 'enquetes', element: <SurveyListRoute /> },
    { path: 'estudio/enquete', element: <SurveyComposerRoute /> },
    { path: 'estudio/enquete/resultados', element: <SurveyResultsRoute /> },
  ],
};
