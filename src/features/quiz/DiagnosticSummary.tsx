import { useEffect, useRef } from "react";
import { Asset3D } from "../../components/ui/Asset3D";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";

type DiagnosticSummaryProps = {
  courseName: string;
  correctCount: number;
  total: number;
  xpEarned: number;
  onContinue: () => void;
};

export function DiagnosticSummary({ courseName, correctCount, total, xpEarned, onContinue }: DiagnosticSummaryProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Mudança de "ecrã": o foco vai para o novo título para o leitor de ecrã anunciar.
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <section className="flex flex-col items-center py-6 text-center" aria-labelledby="diag-summary-title">
      <Asset3D
        name="trophy-complete"
        alt=""
        size={120}
        priority
        className="mb-4 motion-safe:animate-pop-in"
      />
      <h2
        id="diag-summary-title"
        ref={headingRef}
        tabIndex={-1}
        className="font-montserrat text-headline-h2 text-on-surface outline-none"
      >
        Diagnóstico concluído
      </h2>
      <p className="mt-2 max-w-md text-body-lg text-text-secondary">
        Acertaste <strong className="text-on-surface tabular-nums">{correctCount} de {total}</strong>. Já
        ajustámos os resumos de {courseName} ao teu nível.
      </p>
      <p className="mt-4 inline-flex rounded-full bg-secondary-fixed px-3 py-1 text-overline text-on-secondary-fixed-variant uppercase tabular-nums">
        +{xpEarned} XP ganhos
      </p>
      <Button3D
        size="lg"
        className="mt-8 w-full sm:w-auto sm:min-w-[260px]"
        onClick={onContinue}
        trailingIcon={<Icon name="arrow-right" size={20} />}
      >
        Continuar
      </Button3D>
    </section>
  );
}
