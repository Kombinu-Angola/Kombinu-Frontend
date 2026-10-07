import { useMemo, useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { cn } from "@/lib/utils";
import type { Question, Topic } from "./types";

/** Abaixo desta amostra, o índice de discriminação é ruído e não deve ser mostrado como número. */
const MIN_SAMPLE = 30;

const DIFFICULTY_LABEL = { 1: "Fácil", 2: "Média", 3: "Difícil" } as const;

type Diagnosis = {
  id: string;
  severity: "critico" | "atencao" | "ok" | "sem-dados";
  title: string;
  detail: string;
  suggestion?: { label: string; difficulty?: 1 | 2 | 3 };
};

/** O diagnóstico é derivado dos dados, e diz em português o que o número significa. */
function diagnose(question: Question): Diagnosis {
  const observed = question.observed;
  if (!observed || observed.answers < MIN_SAMPLE) {
    return {
      id: "sem-dados",
      severity: "sem-dados",
      title: "Amostra insuficiente",
      detail: `São precisas pelo menos ${MIN_SAMPLE} respostas para a leitura ser fiável. ${observed ? `Tem ${observed.answers}.` : "Ainda não foi respondida."}`,
    };
  }

  const correct = question.options.find((o) => o.id === question.correctOptionId);
  const topDistractor = question.options
    .filter((o) => o.id !== question.correctOptionId && o.share !== undefined)
    .sort((a, b) => (b.share ?? 0) - (a.share ?? 0))[0];

  if (topDistractor && correct?.share !== undefined && (topDistractor.share ?? 0) > correct.share) {
    return {
      id: "distrator",
      severity: "critico",
      title: "Distrator mais escolhido do que a resposta certa",
      detail: `${topDistractor.share}% escolhem "${topDistractor.text.slice(0, 48)}…" contra ${correct.share}% na correta. Costuma ser enunciado ambíguo, não matéria difícil.`,
      suggestion: { label: "Rever o enunciado e o distrator" },
    };
  }

  if (observed.accuracy < 40) {
    return {
      id: "dificil",
      severity: "critico",
      title: "Muito mais difícil do que o declarado",
      detail: `${observed.accuracy}% de acerto com dificuldade declarada "${DIFFICULTY_LABEL[question.declaredDifficulty].toLowerCase()}".`,
      suggestion: question.declaredDifficulty < 3 ? { label: "Passar a difícil", difficulty: 3 } : { label: "Rever o enunciado" },
    };
  }

  if (observed.accuracy > 92) {
    return {
      id: "facil",
      severity: "atencao",
      title: "Quase toda a gente acerta",
      detail: `${observed.accuracy}% de acerto: serve para aquecer, mas não distingue quem domina a matéria.`,
      suggestion: question.declaredDifficulty > 1 ? { label: "Passar a fácil", difficulty: 1 } : undefined,
    };
  }

  return {
    id: "ok",
    severity: "ok",
    title: "Calibrada",
    detail: `${observed.accuracy}% de acerto, dentro do intervalo útil para separar níveis.`,
  };
}

const SEVERITY = {
  critico: { label: "Rever", className: "border-feedback-error text-feedback-error-ink", icon: "alert" },
  atencao: { label: "Atenção", className: "border-feedback-streak text-feedback-streak-ink", icon: "alert" },
  ok: { label: "Calibrada", className: "border-feedback-success text-feedback-success-ink", icon: "check" },
  "sem-dados": { label: "Sem dados", className: "border-border-cloud text-text-secondary", icon: "clock" },
} as const;

type ItemCalibrationScreenProps = { questions: Question[]; topics: Topic[]; creatorName: string; subjectName: string };

/** Calibração: compara a dificuldade declarada com o comportamento real das respostas. */
export default function ItemCalibrationScreen({ questions, topics, creatorName, subjectName }: ItemCalibrationScreenProps) {
  const [applied, setApplied] = useState<string[]>([]);
  const toast = useToast();

  const rows = useMemo(() => questions.map((q) => ({ question: q, diagnosis: diagnose(q) })), [questions]);
  const critical = rows.filter((r) => r.diagnosis.severity === "critico");
  const noData = rows.filter((r) => r.diagnosis.severity === "sem-dados");
  const calibrated = rows.filter((r) => r.diagnosis.severity === "ok");
  const suggestions = rows.filter((r) => r.diagnosis.suggestion?.difficulty && !applied.includes(r.question.id));

  return (
    <CreatorShell active="materiais" creatorName={creatorName}>
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:py-8">
        <nav aria-label="Caminho" className="mb-3 flex flex-wrap items-center gap-2 text-caption text-text-secondary">
          <a href="/v2/estudio/questoes" className="hover:text-primary">
            Banco de questões
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-bold text-on-surface">
            Calibração
          </span>
        </nav>

        <header className="mb-6">
          <p className="text-overline text-primary uppercase">{subjectName}</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Calibração de dificuldade
          </h1>
          <p className="mt-1 max-w-3xl text-body-md text-text-secondary">
            Compara o que declaraste com o que acontece nas respostas. Uma questão mal calibrada distorce o
            diagnóstico, a trilha mista e o caderno de erros.
          </p>
        </header>

        <section aria-label="Resumo da calibração" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { id: "total", label: "Questões em análise", value: String(questions.length), note: `${calibrated.length} calibradas`, tone: "text-on-surface" },
            { id: "critico", label: "A precisar de revisão", value: String(critical.length), note: "Enunciado ou distrator a corrigir", tone: critical.length > 0 ? "text-feedback-error-ink" : "text-feedback-success-ink" },
            { id: "sugestoes", label: "Ajustes sugeridos", value: String(suggestions.length), note: "Mudanças de dificuldade por confirmar", tone: "text-primary" },
            { id: "sem", label: "Sem amostra suficiente", value: String(noData.length), note: `Menos de ${MIN_SAMPLE} respostas`, tone: "text-text-secondary" },
          ].map((tile) => (
            <article key={tile.id} className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
              <p className="text-overline text-text-tertiary uppercase">{tile.label}</p>
              <p className={cn("mt-1.5 font-montserrat text-headline-h1-mobile font-extrabold tabular-nums", tile.tone)}>
                {tile.value}
              </p>
              <p className="mt-1 text-caption text-text-secondary tabular-nums">{tile.note}</p>
            </article>
          ))}
        </section>

        {suggestions.length > 0 && (
          <section
            aria-labelledby="suggestions-title"
            className="mb-6 rounded-3xl border-2 border-brand-ocean bg-surface-sky p-5"
          >
            <h2 id="suggestions-title" className="font-montserrat text-headline-h3 font-extrabold text-primary tabular-nums">
              {suggestions.length} ajustes de dificuldade sugeridos
            </h2>
            <p className="mt-1 mb-4 text-caption text-text-secondary">
              Nada muda sem a tua confirmação: a dificuldade declarada é tua, e o sistema só mostra o que os dados
              indicam.
            </p>
            <ul className="flex flex-col gap-2">
              {suggestions.map(({ question, diagnosis }) => (
                <li
                  key={question.id}
                  className="flex flex-col items-start justify-between gap-3 rounded-xl bg-surface-canvas p-3 sm:flex-row sm:items-center"
                >
                  <span className="min-w-0">
                    <span className="block text-body-md font-bold text-on-surface">{question.stem}</span>
                    <span className="block text-caption text-text-secondary tabular-nums">
                      {DIFFICULTY_LABEL[question.declaredDifficulty]} declarada ·{" "}
                      {question.observed?.accuracy}% de acerto observado
                    </span>
                  </span>
                  <Button3D
                    className="shrink-0"
                    onClick={() => {
                      setApplied((prev) => [...prev, question.id]);
                      toast.show(`${question.id} atualizada para ${diagnosis.suggestion?.label.toLowerCase()}.`);
                    }}
                  >
                    {diagnosis.suggestion?.label}
                    <span className="sr-only">: {question.stem}</span>
                  </Button3D>
                </li>
              ))}
            </ul>
          </section>
        )}

        <TableScroll label="Tabela de calibração das questões">
          <table className={cn(table, "min-w-[1040px]")}>
            <caption className="sr-only">Comparação entre dificuldade declarada e desempenho observado</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>Questão e tópico</th>
                <th scope="col" className={cn(th, "text-right")}>Respostas</th>
                <th scope="col" className={th}>Declarada</th>
                <th scope="col" className={cn(th, "text-right")}>Acerto observado</th>
                <th scope="col" className={th}>O que os dados dizem</th>
                <th scope="col" className={cn(th, "text-right")}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ question, diagnosis }) => {
                const severity = SEVERITY[diagnosis.severity];
                return (
                  <tr key={question.id} className={tr}>
                    <th scope="row" className={cn(td, "min-w-[280px] font-normal")}>
                      <span className="block font-bold text-on-surface">{question.stem}</span>
                      <span className="mt-1 flex flex-wrap gap-1">
                        {question.topicIds.map((id) => (
                          <span key={id} className="rounded bg-surface-soft px-1.5 py-0.5 text-caption text-text-secondary">
                            {topics.find((t) => t.id === id)?.name}
                          </span>
                        ))}
                      </span>
                    </th>
                    <td className={cn(td, "text-right tabular-nums")}>
                      {question.observed?.answers ?? 0}
                      {question.observed && question.observed.answers < MIN_SAMPLE && (
                        <span className="block text-caption text-text-tertiary">de {MIN_SAMPLE} necessárias</span>
                      )}
                    </td>
                    <td className={cn(td, "whitespace-nowrap")}>
                      {applied.includes(question.id) ? (
                        <span className="rounded-md bg-feedback-success-soft px-2 py-0.5 text-caption font-bold text-feedback-success-ink">
                          Atualizada
                        </span>
                      ) : (
                        DIFFICULTY_LABEL[question.declaredDifficulty]
                      )}
                    </td>
                    <td className={cn(td, "text-right tabular-nums")}>
                      {question.observed ? (
                        <span
                          className={cn(
                            "font-bold",
                            question.observed.accuracy < 40
                              ? "text-feedback-error-ink"
                              : question.observed.accuracy > 92
                                ? "text-feedback-streak-ink"
                                : "text-on-surface",
                          )}
                        >
                          {question.observed.accuracy}%
                        </span>
                      ) : (
                        <span className="text-text-tertiary">—</span>
                      )}
                    </td>
                    <td className={cn(td, "max-w-sm")}>
                      <span className={cn("mb-1 inline-flex items-center gap-1.5 rounded-full border-2 bg-surface-canvas px-2.5 py-0.5 text-caption font-bold", severity.className)}>
                        <Icon name={severity.icon} size={14} strokeWidth={3} />
                        {diagnosis.title}
                      </span>
                      <span className="block text-caption text-text-secondary">{diagnosis.detail}</span>
                    </td>
                    <td className={cn(td, "text-right")}>
                      <Button3D
                        variant={diagnosis.severity === "critico" ? "primary" : "ghost"}
                        onClick={() => (window.location.assign("/v2/estudio/questoes"))}
                      >
                        Abrir
                        <span className="sr-only">: {question.stem}</span>
                      </Button3D>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableScroll>

        <p className="mt-5 flex items-start gap-2 rounded-2xl bg-surface-soft p-4 text-caption text-text-secondary tabular-nums">
          <Icon name="lightbulb" size={18} className="mt-0.5 shrink-0 text-primary" />
          Abaixo de {MIN_SAMPLE} respostas não mostramos leitura estatística: com poucas tentativas, qualquer
          percentagem oscila demais para servir de base a uma decisão.
        </p>
      </div>
    </CreatorShell>
  );
}
