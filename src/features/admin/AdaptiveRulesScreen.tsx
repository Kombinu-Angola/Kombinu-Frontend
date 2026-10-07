import { useMemo, useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { Switch } from "../../components/ui/Switch";
import { useToast } from "../../components/ui/Toast";
import { cn } from "@/lib/utils";

type Rules = {
  accuracyThreshold: number;
  minAnswers: number;
  maxSimultaneousGaps: number;
  tiebreak: "curricular" | "recencia" | "reprovacao";
  xpMultiplier: number;
  weeklyBonusCap: number;
  requireReassessment: boolean;
};

const DEFAULTS: Rules = {
  accuracyThreshold: 60,
  minAnswers: 4,
  maxSimultaneousGaps: 2,
  tiebreak: "curricular",
  xpMultiplier: 1.5,
  weeklyBonusCap: 300,
  requireReassessment: true,
};

const TIEBREAKS = [
  { value: "curricular", label: "Peso do tópico no exame (recomendado)" },
  { value: "reprovacao", label: "Taxa de reprovação da cadeira" },
  { value: "recencia", label: "Erro mais recente primeiro" },
];

const SAMPLE = [
  { topic: "Lançamentos de amortização", accuracy: 42, answers: 7, weight: 30, lastErrorDays: 2 },
  { topic: "Provisões para cobrança duvidosa", accuracy: 55, answers: 6, weight: 25, lastErrorDays: 5 },
  { topic: "Balancete de verificação", accuracy: 100, answers: 5, weight: 20, lastErrorDays: 30 },
  { topic: "Consolidação de contas", accuracy: 58, answers: 3, weight: 25, lastErrorDays: 1 },
];

const decimal = new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 1 });

/** Editor das regras que geram a trilha mista. Sem simulador, ninguém afina regras com confiança. */
export default function AdaptiveRulesScreen() {
  const [rules, setRules] = useState(DEFAULTS);
  const [dirty, setDirty] = useState(false);
  const toast = useToast();

  const update = (patch: Partial<Rules>) => {
    setRules((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  // O simulador aplica as regras a um perfil de exemplo: é a prova de que a configuração faz o que se espera.
  const simulation = useMemo(() => {
    const detected = SAMPLE.filter((t) => t.accuracy < rules.accuracyThreshold && t.answers >= rules.minAnswers);
    const ordered = [...detected].sort((a, b) => {
      if (rules.tiebreak === "recencia") return a.lastErrorDays - b.lastErrorDays;
      if (rules.tiebreak === "reprovacao") return b.accuracy - a.accuracy;
      return b.weight - a.weight;
    });
    const treated = ordered.slice(0, rules.maxSimultaneousGaps);
    const waiting = ordered.slice(rules.maxSimultaneousGaps);
    const ignored = SAMPLE.filter((t) => !detected.includes(t));
    const stepsPerGap = rules.requireReassessment ? 3 : 2;
    const xp = treated.length * stepsPerGap * Math.round(100 * rules.xpMultiplier);
    return { treated, waiting, ignored, xp, capped: xp > rules.weeklyBonusCap };
  }, [rules]);

  return (
    <AdminShell
      active="adaptativo"
      eyebrow="Motor pedagógico"
      title="Regras de nivelamento adaptativo"
      description="Definem quando uma lacuna é detetada, quantas são tratadas ao mesmo tempo e quanto XP extra vale a remediação."
      actions={
        <>
          <Button3D
            variant="ghost"
            disabled={!dirty}
            onClick={() => {
              setRules(DEFAULTS);
              setDirty(false);
            }}
            leadingIcon={<Icon name="refresh" size={18} />}
          >
            Repor valores
          </Button3D>
          <Button3D
            disabled={!dirty}
            onClick={() => {
              setDirty(false);
              toast.show("Regras aplicadas. Os próximos diagnósticos já as usam.");
            }}
          >
            Guardar e aplicar
          </Button3D>
        </>
      }
    >
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <section aria-labelledby="threshold-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
            <h2 id="threshold-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              1. Quando é que isto conta como lacuna
            </h2>
            <p className="mt-1 mb-5 text-caption text-text-secondary">
              Uma lacuna só é declarada com dados suficientes. Com poucas respostas, o acerto é ruído.
            </p>

            <div className="mb-6">
              <label htmlFor="accuracy" className="flex items-center justify-between gap-3 text-body-md text-on-surface">
                Acerto abaixo de
                <output htmlFor="accuracy" className="font-montserrat text-headline-h3 font-extrabold text-primary tabular-nums">
                  {rules.accuracyThreshold}%
                </output>
              </label>
              <input
                id="accuracy"
                type="range"
                min={30}
                max={80}
                step={5}
                value={rules.accuracyThreshold}
                aria-valuetext={`${rules.accuracyThreshold} por cento`}
                onChange={(e) => update({ accuracyThreshold: Number(e.target.value) })}
                className="mt-2 h-6 w-full cursor-pointer accent-brand-ocean"
              />
              <p className="mt-1 text-caption text-text-tertiary">
                Mais alto deteta mais lacunas e enche o plano; mais baixo só apanha os casos graves.
              </p>
            </div>

            <div>
              <label htmlFor="min-answers" className="flex items-center justify-between gap-3 text-body-md text-on-surface">
                Com pelo menos
                <output htmlFor="min-answers" className="font-montserrat text-headline-h3 font-extrabold text-primary tabular-nums">
                  {rules.minAnswers} respostas
                </output>
              </label>
              <input
                id="min-answers"
                type="range"
                min={2}
                max={10}
                step={1}
                value={rules.minAnswers}
                aria-valuetext={`${rules.minAnswers} respostas`}
                onChange={(e) => update({ minAnswers: Number(e.target.value) })}
                className="mt-2 h-6 w-full cursor-pointer accent-brand-ocean"
              />
            </div>
          </section>

          <section aria-labelledby="load-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
            <h2 id="load-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              2. Quantas lacunas tratar ao mesmo tempo
            </h2>
            <p className="mt-1 mb-5 text-caption text-text-secondary">
              Um plano com cinco frentes deixa de ser um plano. As restantes ficam em fila e entram quando uma fechar.
            </p>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center overflow-hidden rounded-xl border-2 border-border-input bg-surface-canvas">
                <button
                  type="button"
                  onClick={() => update({ maxSimultaneousGaps: Math.max(1, rules.maxSimultaneousGaps - 1) })}
                  disabled={rules.maxSimultaneousGaps <= 1}
                  aria-label="Diminuir o número de lacunas simultâneas"
                  className="flex size-12 items-center justify-center text-on-surface hover:bg-surface-soft disabled:text-text-disabled"
                >
                  <Icon name="minus" size={18} />
                </button>
                <label htmlFor="max-gaps" className="sr-only">
                  Lacunas tratadas ao mesmo tempo
                </label>
                <input
                  id="max-gaps"
                  type="number"
                  min={1}
                  max={4}
                  value={rules.maxSimultaneousGaps}
                  onChange={(e) => update({ maxSimultaneousGaps: Number(e.target.value) })}
                  className="w-16 border-x-2 border-border-cloud bg-transparent py-2.5 text-center text-body-lg font-bold text-on-surface tabular-nums focus-visible:outline-none"
                />
                <button
                  type="button"
                  onClick={() => update({ maxSimultaneousGaps: Math.min(4, rules.maxSimultaneousGaps + 1) })}
                  disabled={rules.maxSimultaneousGaps >= 4}
                  aria-label="Aumentar o número de lacunas simultâneas"
                  className="flex size-12 items-center justify-center text-on-surface hover:bg-surface-soft disabled:text-text-disabled"
                >
                  <Icon name="plus" size={18} />
                </button>
              </div>
              {rules.maxSimultaneousGaps > 2 && (
                <p className="flex items-start gap-2 text-caption font-bold text-feedback-streak-ink">
                  <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
                  Acima de duas, a taxa de abandono do plano costuma subir.
                </p>
              )}
            </div>

            <SelectField
              id="tiebreak"
              label="Qual tratar primeiro, quando há empate"
              options={TIEBREAKS}
              value={rules.tiebreak}
              onChange={(e) => update({ tiebreak: e.target.value as Rules["tiebreak"] })}
            />
          </section>

          <section aria-labelledby="xp-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
            <h2 id="xp-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              3. XP da remediação e prevenção de abuso
            </h2>
            <p className="mt-1 mb-5 text-caption text-text-secondary">
              O bónus existe para compensar o esforço extra, não para ser o caminho mais rápido na liga.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="multiplier" className="flex items-center justify-between gap-3 text-body-md text-on-surface">
                  Multiplicador
                  <output htmlFor="multiplier" className="font-bold text-primary tabular-nums">
                    {decimal.format(rules.xpMultiplier)}×
                  </output>
                </label>
                <input
                  id="multiplier"
                  type="range"
                  min={1}
                  max={3}
                  step={0.5}
                  value={rules.xpMultiplier}
                  aria-valuetext={`${decimal.format(rules.xpMultiplier)} vezes`}
                  onChange={(e) => update({ xpMultiplier: Number(e.target.value) })}
                  className="mt-2 h-6 w-full cursor-pointer accent-brand-ocean"
                />
              </div>

              <div>
                <label htmlFor="cap" className="mb-2 block text-body-md text-on-surface">
                  Teto semanal de XP extra
                </label>
                <input
                  id="cap"
                  type="number"
                  min={0}
                  max={2000}
                  step={50}
                  value={rules.weeklyBonusCap}
                  onChange={(e) => update({ weeklyBonusCap: Number(e.target.value) })}
                  className="min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-4 text-body-md text-on-surface tabular-nums"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-surface-soft p-4">
              <span>
                <span className="block text-body-md text-on-surface">Exigir reavaliação para fechar a lacuna</span>
                <span id="reassess-hint" className="block text-caption text-text-tertiary">
                  Sem reavaliação, o plano dá XP sem provar que a matéria ficou.
                </span>
              </span>
              <Switch
                id="require-reassessment"
                checked={rules.requireReassessment}
                label="Exigir reavaliação"
                hideLabel
                describedBy="reassess-hint"
                onChange={(v) => update({ requireReassessment: v })}
              />
            </div>
          </section>
        </div>

        <aside aria-labelledby="sim-title" className="rounded-3xl border-2 border-brand-ocean bg-surface-canvas p-5 lg:col-span-5 lg:sticky lg:top-24 sm:p-6">
          <h2 id="sim-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
            Simulador de percurso
          </h2>
          <p className="mt-1 mb-4 text-caption text-text-secondary">
            Perfil de exemplo: estudante de Contabilidade II, 21 respostas no diagnóstico.
          </p>

          <div role="status" className="flex flex-col gap-4">
            <section>
              <h3 className="mb-2 text-overline text-feedback-error-ink uppercase tabular-nums">
                Tratadas agora ({simulation.treated.length})
              </h3>
              {simulation.treated.length === 0 ? (
                <p className="rounded-xl border-2 border-dashed border-border-input p-4 text-caption text-text-secondary">
                  Com estas regras, este estudante não teria nenhuma lacuna detetada.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {simulation.treated.map((gap) => (
                    <li key={gap.topic} className="rounded-xl border-2 border-feedback-error bg-surface-canvas p-3">
                      <p className="text-body-md font-bold text-on-surface">{gap.topic}</p>
                      <p className="text-caption text-text-secondary tabular-nums">
                        {gap.accuracy}% de acerto em {gap.answers} respostas · peso no exame {gap.weight}%
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {simulation.waiting.length > 0 && (
              <section>
                <h3 className="mb-2 text-overline text-feedback-streak-ink uppercase tabular-nums">
                  Em fila ({simulation.waiting.length})
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {simulation.waiting.map((gap) => (
                    <li key={gap.topic} className="flex items-center justify-between gap-2 rounded-lg bg-surface-soft px-3 py-2 text-caption">
                      <span className="text-on-surface">{gap.topic}</span>
                      <span className="text-text-tertiary tabular-nums">{gap.accuracy}%</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h3 className="mb-2 text-overline text-text-tertiary uppercase tabular-nums">
                Fora do plano ({simulation.ignored.length})
              </h3>
              <ul className="flex flex-col gap-1.5">
                {simulation.ignored.map((gap) => (
                  <li key={gap.topic} className="flex items-center justify-between gap-2 rounded-lg bg-surface-soft px-3 py-2 text-caption">
                    <span className="text-text-secondary">{gap.topic}</span>
                    <span className="text-text-tertiary tabular-nums">
                      {gap.accuracy}% · {gap.answers} respostas
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <p
              className={cn(
                "flex items-start gap-2 rounded-2xl p-4 text-caption tabular-nums",
                simulation.capped ? "border-2 border-feedback-streak bg-surface-canvas text-feedback-streak-ink" : "bg-surface-sky text-text-secondary",
              )}
            >
              <Icon name={simulation.capped ? "alert" : "bolt"} size={18} className="mt-0.5 shrink-0" />
              {simulation.capped
                ? `Este plano daria ${simulation.xp} XP, acima do teto semanal de ${rules.weeklyBonusCap}. O excedente não é creditado.`
                : `Este plano vale ${simulation.xp} XP, dentro do teto semanal de ${rules.weeklyBonusCap}.`}
            </p>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
