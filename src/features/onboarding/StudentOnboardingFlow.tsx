import { lazy, Suspense, useState } from "react";
import { useGamification } from "../../contexts/GamificationContext";
import type { DiagnosticQuizData, DiagnosticResult } from "../quiz/types";
import { ProfileActivatedScreen } from "./ProfileActivatedScreen";
import { StepAffiliation } from "./StepAffiliation";
import { StepRoutine } from "./StepRoutine";
import { ONBOARDING_XP } from "./steps";
import type { Recommendation, StudentProfile } from "./types";

// O quiz traz o motor de som e feedback: só é descarregado quando o passo 1 fica feito.
const DiagnosticQuizScreen = lazy(() => import("../quiz/DiagnosticQuizScreen"));

const INITIAL: StudentProfile = {
  university: "",
  course: "",
  year: "",
  criticalSubject: "",
  dailyGoal: "15",
  formats: ["text"],
  reminder: "2000",
  smsReminder: false,
  phone: "",
};

type StudentOnboardingFlowProps = {
  onExit: () => void;
  /** Em produção, vem da API a partir da cadeira escolhida no passo 1. */
  getDiagnostic: (profile: StudentProfile) => DiagnosticQuizData;
  getRecommendation: (profile: StudentProfile) => Recommendation;
  /** Guardar o perfil (POST). Chamado ao concluir o passo 3. */
  onSaveProfile?: (profile: StudentProfile, diagnostic: DiagnosticResult | null) => void;
  feedHref: string;
};

/**
 * Onboarding do estudante (4 passos). O perfil vive aqui, por isso voltar atrás
 * nunca apaga respostas (WCAG 3.3.7).
 */
export default function StudentOnboardingFlow({
  onExit,
  getDiagnostic,
  getRecommendation,
  onSaveProfile,
  feedHref,
}: StudentOnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(INITIAL);
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const { addXp } = useGamification();

  const update = (patch: Partial<StudentProfile>) => setProfile((prev) => ({ ...prev, ...patch }));
  // Voltar ao quiz recomeça-o: devolve o XP ganho antes para não o contar duas vezes.
  function enterDiagnostic() {
    if (diagnostic) {
      addXp(-diagnostic.xpEarned);
      setDiagnostic(null);
    }
    setStep(1);
  }

  const accuracy = diagnostic ? Math.round((diagnostic.correctCount / diagnostic.total) * 100) : undefined;

  switch (step) {
    case 0:
      return <StepAffiliation profile={profile} update={update} onBack={onExit} onNext={enterDiagnostic} />;
    case 1:
      return (
        <Suspense
          fallback={
            <p role="status" className="flex min-h-dvh items-center justify-center text-caption text-text-tertiary">
              A preparar o diagnóstico…
            </p>
          }
        >
          <DiagnosticQuizScreen
            quiz={getDiagnostic(profile)}
            onBack={() => setStep(0)}
            onComplete={(result) => {
              setDiagnostic(result);
              setStep(2);
            }}
          />
        </Suspense>
      );
    case 2:
      return (
        <StepRoutine
          profile={profile}
          update={update}
          accuracy={accuracy}
          onBack={enterDiagnostic}
          onNext={() => {
            onSaveProfile?.(profile, diagnostic);
            addXp(ONBOARDING_XP.completion);
            setStep(3);
          }}
        />
      );
    default:
      return (
        <ProfileActivatedScreen profile={profile} recommendation={getRecommendation(profile)} feedHref={feedHref} />
      );
  }
}
