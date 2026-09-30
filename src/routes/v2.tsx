import type { RouteObject } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import V2Layout from './V2Layout';

import OnboardingRoleScreen from '../features/onboarding/OnboardingRoleScreen';
import StudentOnboardingFlow from '../features/onboarding/StudentOnboardingFlow';
import { mockRecommendation } from '../features/onboarding/mockRecommendation';
import { MOCK_DIAGNOSTIC } from '../features/quiz/mockDiagnostic';

import AuthScreen from '../features/auth/AuthScreen';

import CreatorApplicationFlow from '../features/creator/CreatorApplicationFlow';
import { submitCreatorApplication } from '../services/creatorService';

import DashboardScreen from '../features/dashboard/DashboardScreen';
import { MOCK_DASHBOARD } from '../features/dashboard/mockDashboard';
import StudyFeedScreen from '../features/feed/StudyFeedScreen';
import { MOCK_FEED } from '../features/feed/mockFeed';
import ChallengeFlow from '../features/challenge/ChallengeFlow';
import MarketplaceScreen from '../features/marketplace/MarketplaceScreen';
import { MOCK_MATERIALS } from '../features/marketplace/mockMaterials';
import CourseScreen from '../features/course/CourseScreen';
import { MOCK_COURSE } from '../features/course/mockCourse';
import ReadingFlow from '../features/reading/ReadingFlow';
import { MOCK_ARTICLE } from '../features/content/mockArticle';
import LeaguesScreen from '../features/leagues/LeaguesScreen';
import { mockLeague } from '../features/leagues/mockLeague';
import StreakHubScreen from '../features/streak/StreakHubScreen';
import { MOCK_STREAK } from '../features/streak/mockStreak';
import StudentProfileScreen from '../features/profile/StudentProfileScreen';
import BadgeVaultScreen from '../features/profile/BadgeVaultScreen';
import { MOCK_PROFILE, BADGES } from '../features/profile/mockProfile';
import DocumentDetailScreen from '../features/document/DocumentDetailScreen';
import { MOCK_DOCUMENT } from '../features/document/mockDocument';
import CreatorPublicProfileScreen from '../features/creator-public/CreatorPublicProfileScreen';
import { MOCK_CREATOR } from '../features/creator-public/mockCreator';

import StudioScreen from '../features/studio/StudioScreen';
import { MOCK_DRAFT } from '../features/studio/mockDraft';
import CreatorFinanceScreen from '../features/creator-finance/CreatorFinanceScreen';
import { MOCK_FINANCE } from '../features/creator-finance/mockFinance';
import SubscriptionFlow from '../features/subscription/SubscriptionFlow';
import AccountSettingsScreen, { type AccountSettings } from '../features/subscription/AccountSettingsScreen';

import AdminOverviewScreen from '../features/admin/AdminOverviewScreen';
import StudentsScreen from '../features/admin/StudentsScreen';
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
import { CREATOR_MATERIALS } from '../features/creator-content/mockContent';

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
import GlobalSearchScreen from '../features/search/GlobalSearchScreen';
import { MOCK_SEARCH } from '../features/search/mockSearch';

import MaterialAnalyticsScreen from '../features/analytics/MaterialAnalyticsScreen';
import { MOCK_ANALYTICS } from '../features/analytics/mockAnalytics';
import MaterialQaScreen from '../features/qa/MaterialQaScreen';
import { MOCK_QA } from '../features/qa/mockQa';
import ReviewNotebookScreen from '../features/review/ReviewNotebookScreen';
import { MOCK_REVIEW } from '../features/review/mockReview';

/** Nomes de sessão de demonstração (sem backend ligado ainda). */
const STUDENT_NAME = 'João Kiala';
const CREATOR_NAME = 'Orlando Fortuna';

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

function AuthRoute() {
  const navigate = useNavigate();
  // Demo visual: sem tokens/sessao real (auth por SMS ainda sem endpoint no backend
  // e a ligar autenticacao real precisa de aprovacao do CTO -- ver CLAUDE.md).
  return <AuthScreen onAuthenticated={() => navigate('/v2/painel')} />;
}

function ReadingRoute() {
  const navigate = useNavigate();
  return (
    <ReadingFlow
      article={MOCK_ARTICLE}
      onExit={() => navigate('/v2/cadeira')}
      onNextArticle={() => navigate('/v2/cadeira')}
    />
  );
}

function DocumentRoute() {
  const navigate = useNavigate();
  return (
    <DocumentDetailScreen
      document={MOCK_DOCUMENT}
      userName={STUDENT_NAME}
      onRead={() => navigate('/v2/leitura')}
      onPurchase={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return { reference: `DEMO-${Date.now()}` };
      }}
    />
  );
}

function StudioRoute() {
  return (
    <StudioScreen
      initialDraft={MOCK_DRAFT}
      authorName={CREATOR_NAME}
      courseName={MOCK_COURSE.hero.title}
      onSave={async () => {
        /* Backend de rascunhos ainda nao existe; useDraft guarda so em memoria. */
      }}
    />
  );
}

const DEMO_SETTINGS: AccountSettings = {
  name: CREATOR_NAME,
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
  return <AccountSettingsScreen settings={DEMO_SETTINGS} onChangePlan={() => navigate('/v2/estudio/plano')} />;
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
  name: CREATOR_NAME,
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
  return <ReviewNotebookScreen queue={MOCK_REVIEW} userName={STUDENT_NAME} onStartSession={() => navigate('/v2/desafio')} />;
}

function RenewalFailureRoute() {
  const navigate = useNavigate();
  return (
    <RenewalFailureScreen
      creatorName={CREATOR_NAME}
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
  return (
    <SubscriptionFlow
      creatorName={CREATOR_NAME}
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

    { path: 'painel', element: <DashboardScreen data={MOCK_DASHBOARD} /> },
    { path: 'trilhas', element: <StudyFeedScreen feed={MOCK_FEED} /> },
    { path: 'desafio', element: <ChallengeFlow userName={STUDENT_NAME} /> },
    { path: 'marketplace', element: <MarketplaceScreen materials={MOCK_MATERIALS} userName={STUDENT_NAME} /> },
    { path: 'marketplace/:id', element: <DocumentRoute /> },
    { path: 'sebenta', element: <DocumentRoute /> },
    { path: 'cadeira', element: <CourseScreen course={MOCK_COURSE} userName={STUDENT_NAME} /> },
    { path: 'leitura', element: <ReadingRoute /> },
    { path: 'ligas', element: <LeaguesScreen league={mockLeague()} userName={STUDENT_NAME} /> },
    { path: 'ofensiva', element: <StreakHubScreen streak={MOCK_STREAK} userName={STUDENT_NAME} studyHref="/v2/trilhas" /> },
    { path: 'perfil', element: <StudentProfileScreen profile={MOCK_PROFILE} badgesHref="/v2/medalhas" /> },
    { path: 'medalhas', element: <BadgeVaultScreen badges={BADGES} userName={STUDENT_NAME} seasonTotal={BADGES.length} /> },
    { path: 'criador', element: <CreatorPublicProfileScreen creator={MOCK_CREATOR} userName={STUDENT_NAME} /> },

    { path: 'estudio', element: <StudioRoute /> },
    { path: 'estudio/financeiro', element: <CreatorFinanceScreen finance={MOCK_FINANCE} creatorName={CREATOR_NAME} /> },
    { path: 'estudio/plano', element: <SubscriptionRoute /> },
    { path: 'estudio/definicoes', element: <AccountSettingsRoute /> },

    { path: 'admin', element: <AdminOverviewScreen /> },
    { path: 'admin/estudantes', element: <StudentsScreen /> },
    { path: 'admin/criadores', element: <CreatorQueueScreen applications={CREATOR_QUEUE} /> },
    { path: 'admin/moderacao', element: <ModerationScreen /> },
    { path: 'admin/insights', element: <InsightsScreen /> },
    { path: 'admin/financeiro', element: <FinanceScreen /> },
    { path: 'admin/gamificacao', element: <GamificationScreen /> },

    { path: 'biblioteca', element: <StudentLibraryScreen items={LIBRARY_ITEMS} userName={STUDENT_NAME} downloadsHref="/v2/biblioteca/descargas" marketplaceHref="/v2/marketplace" /> },
    {
      path: 'biblioteca/descargas',
      element: (
        <OfflineDownloadsScreen
          items={LIBRARY_ITEMS}
          storage={OFFLINE_STORAGE}
          preferences={DOWNLOAD_PREFERENCES}
          userName={STUDENT_NAME}
          libraryHref="/v2/biblioteca"
        />
      ),
    },
    { path: 'perfil/compras', element: <PurchaseHistoryScreen purchases={PURCHASES} userName={STUDENT_NAME} profileHref="/v2/perfil" /> },
    { path: 'estudio/materiais', element: <CreatorContentHubScreen materials={CREATOR_MATERIALS} creatorName={CREATOR_NAME} plan="pro" /> },

    { path: 'definicoes', element: <StudentSettingsRoute /> },
    { path: 'conta/telemovel', element: <PhoneSecurityRoute /> },
    { path: 'trilha', element: <LearningTrailScreen trail={MOCK_TRAIL} userName={STUDENT_NAME} backHref="/v2/cadeira" /> },
    { path: 'trilha/mista', element: <AdaptiveTrailScreen trail={MOCK_ADAPTIVE} userName={STUDENT_NAME} diagnosticHref="/v2/painel" /> },
    { path: 'estudio/homologacao', element: <HomologationResultScreen studioHref="/v2/estudio" publicProfileHref="/v2/criador" result={HOMOLOGATION_APROVADO} /> },
    { path: 'estudio/homologacao/correcao', element: <HomologationResultScreen studioHref="/v2/estudio" publicProfileHref="/v2/criador" result={HOMOLOGATION_CORRECAO} /> },
    { path: 'estudio/renovacao', element: <RenewalFailureRoute /> },

    { path: 'offline', element: <OfflineScreen offlineItems={5} cachedKb={5_940} pendingAnswers={4} streakDays={12} libraryHref="/v2/biblioteca" /> },
    { path: 'sessao-expirada', element: <SessionExpiredRoute /> },
    { path: '404', element: <NotFoundRoute /> },

    { path: 'notificacoes', element: <NotificationCenterScreen notifications={NOTIFICATIONS} userName={STUDENT_NAME} settingsHref="/v2/definicoes" /> },
    { path: 'pesquisa', element: <GlobalSearchScreen results={MOCK_SEARCH} userName={STUDENT_NAME} /> },

    { path: 'estudio/analitica', element: <MaterialAnalyticsScreen analytics={MOCK_ANALYTICS} creatorName={CREATOR_NAME} materialsHref="/v2/estudio/materiais" /> },
    { path: 'duvidas', element: <MaterialQaScreen board={MOCK_QA} userName={STUDENT_NAME} /> },
    { path: 'revisao', element: <ReviewRoute /> },
  ],
};
