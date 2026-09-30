import { lazy, Suspense, useState } from "react";
import { Asset3D } from "../../components/ui/Asset3D";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { CHALLENGE_QUESTIONS } from "./challengeQuestions";
import { mockChallenge } from "./mockChallenge";
import ChallengeScreen from "./ChallengeScreen";
import type { ChallengeResult } from "./ChallengeQuizScreen";

const ChallengeQuizScreen = lazy(() => import("./ChallengeQuizScreen"));

function ChallengeSummary({ result, onDone }: { result: ChallengeResult; onDone: () => void }) {
  const headingRef = useFocusOnMount();
  const accuracy = Math.round((result.correct / result.total) * 100);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <main id="conteudo" className="w-full max-w-[560px] rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 text-center shadow-clay sm:p-10">
        <Asset3D name="trophy-complete" alt="" size={104} priority className="mx-auto mb-4 motion-safe:animate-pop-in" />
        <h1 ref={headingRef} tabIndex={-1} className="font-montserrat text-headline-h1-mobile text-on-surface outline-none sm:text-headline-h1">
          Simulado concluído
        </h1>
        <p className="mt-3 text-body-lg text-text-secondary">
          Acertaste <strong className="text-on-surface tabular-nums">{result.correct} de {result.total}</strong> ({accuracy}%).
          O teu lugar no ranking do desafio aparece quando a ronda fechar.
        </p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary-fixed px-4 py-1.5 text-overline text-on-secondary-fixed-variant uppercase tabular-nums">
          <Icon name="bolt" size={16} />+{result.xpEarned} XP com o multiplicador
        </p>
        <Button3D size="lg" className="mt-8 w-full sm:w-auto" onClick={onDone} trailingIcon={<Icon name="arrow-right" size={20} />}>
          Voltar ao desafio
        </Button3D>
      </main>
    </div>
  );
}

/** Desafio relâmpago: apresentação → simulado a decorrer → resultado. */
export default function ChallengeFlow({ userName }: { userName: string }) {
  const [challenge] = useState(mockChallenge);
  const [stage, setStage] = useState<"intro" | "playing">("intro");
  const [result, setResult] = useState<ChallengeResult | null>(null);

  if (result) {
    return (
      <ChallengeSummary
        result={result}
        onDone={() => {
          setResult(null);
          setStage("intro");
        }}
      />
    );
  }

  if (stage === "playing") {
    return (
      <Suspense fallback={<p role="status" className="flex min-h-dvh items-center justify-center text-caption text-text-tertiary">A carregar o simulado…</p>}>
        <ChallengeQuizScreen
          questions={CHALLENGE_QUESTIONS}
          prizeLabel={challenge.prize.title.toLowerCase()}
          onExit={() => setStage("intro")}
          onFinish={setResult}
        />
      </Suspense>
    );
  }

  return <ChallengeScreen challenge={challenge} userName={userName} onStart={() => setStage("playing")} />;
}
