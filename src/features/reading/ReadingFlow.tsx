import { useState } from "react";
import { useGamification } from "../../contexts/GamificationContext";
import type { Article } from "../content/blocks";
import ModuleCompleteScreen from "./ModuleCompleteScreen";
import ReadingPlayerScreen, { type ReadingResult } from "./ReadingPlayerScreen";

const GEMS_PER_MODULE = 15;

type ReadingFlowProps = {
  article: Article;
  onExit: () => void;
  onNextArticle: () => void;
};

/** Ler → concluir. O XP e as gemas só são creditados uma vez, ao marcar como lido. */
export default function ReadingFlow({ article, onExit, onNextArticle }: ReadingFlowProps) {
  const [result, setResult] = useState<ReadingResult | null>(null);
  const { addXp, addGems } = useGamification();

  if (result) {
    return (
      <ModuleCompleteScreen article={article} result={result} gemsEarned={GEMS_PER_MODULE} onNext={onNextArticle} />
    );
  }

  return (
    <ReadingPlayerScreen
      article={article}
      onBack={onExit}
      onComplete={(r) => {
        addXp(r.xpEarned);
        addGems(GEMS_PER_MODULE);
        setResult(r);
      }}
    />
  );
}
