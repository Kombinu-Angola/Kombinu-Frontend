import { useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { Button3D } from "../../components/ui/Button3D";
import { SelectField, TextField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { Switch } from "../../components/ui/Switch";
import { useToast } from "../../components/ui/Toast";
import { formatInt } from "../../lib/format";
import { cn } from "@/lib/utils";
import { CHALLENGE_DRAFT, LEAGUE_SETTINGS, LIVE_CHALLENGE } from "./mockAdmin";

const REWARDS = [
  { value: "pro", label: "Passe Pro de 1 mês (acesso offline ilimitado)" },
  { value: "xp", label: "Bónus extraordinário de 500 XP" },
  { value: "voucher", label: "Voucher de formação de 5.000 Kz" },
];

const MULTIPLIER = { min: 1, max: 3, step: 0.1 };

/** ADM-06 e ADM-07 — regras das ligas e agendamento do desafio relâmpago. */
export default function GamificationScreen() {
  const [league, setLeague] = useState(LEAGUE_SETTINGS);
  const [draft, setDraft] = useState(CHALLENGE_DRAFT);
  const toast = useToast();

  // A zona neutra é o que sobra: as três zonas somam sempre 100%.
  const neutral = 100 - league.promotionPct - league.relegationPct;
  const zonesValid = neutral >= 10;

  const setMultiplier = (value: number) =>
    setLeague((l) => ({ ...l, xpMultiplier: Math.min(MULTIPLIER.max, Math.max(MULTIPLIER.min, Number(value.toFixed(1)))) }));

  const challengeReady = draft.question.trim() && draft.correct.trim() && draft.distractors.every((d) => d.trim());

  return (
    <AdminShell
      active="gamificacao"
      eyebrow="Motor de gamificação"
      title="Gamificação e ligas"
      description="Limiares das ligas universitárias, multiplicadores de XP e agendamento dos desafios relâmpago."
    >
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <section aria-labelledby="league-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 id="league-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              Temporada e limiares de liga
            </h2>
            <span className="rounded-full bg-primary-fixed px-2.5 py-0.5 text-overline text-on-primary-fixed uppercase">Ativa</span>
          </div>

          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!zonesValid) return;
              toast.show("Regras da liga guardadas.");
            }}
          >
            <TextField
              id="season"
              label="Temporada académica"
              value={league.season}
              onChange={(e) => setLeague((l) => ({ ...l, season: e.target.value }))}
            />

            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="mb-1 text-body-md font-bold text-on-surface">Zonas da tabela</legend>
              <p id="zones-hint" className="mb-4 text-caption text-text-secondary">
                A zona neutra é calculada automaticamente para as três zonas somarem 100%.
              </p>

              {(
                [
                  { key: "promotionPct" as const, id: "promo", label: "Promoção (topo)", max: 25, min: 5, dot: "bg-feedback-success" },
                  { key: "relegationPct" as const, id: "releg", label: "Despromoção (fundo)", max: 45, min: 15, dot: "bg-feedback-error" },
                ]
              ).map((zone) => (
                <div key={zone.id} className="mb-5">
                  <label htmlFor={zone.id} className="flex items-center justify-between gap-3 text-body-md text-on-surface">
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className={cn("size-2.5 rounded-full", zone.dot)} />
                      {zone.label}
                    </span>
                    <output htmlFor={zone.id} className="font-bold text-primary tabular-nums">
                      {league[zone.key]}%
                    </output>
                  </label>
                  <input
                    id={zone.id}
                    type="range"
                    min={zone.min}
                    max={zone.max}
                    value={league[zone.key]}
                    aria-describedby="zones-hint"
                    aria-valuetext={`${league[zone.key]} por cento`}
                    onChange={(e) => setLeague((l) => ({ ...l, [zone.key]: Number(e.target.value) }))}
                    className="mt-2 h-6 w-full cursor-pointer accent-brand-ocean"
                  />
                </div>
              ))}

              <p
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border-2 p-3 text-body-md",
                  zonesValid ? "border-border-cloud bg-surface-soft text-on-surface" : "border-feedback-error-ink bg-feedback-error-soft text-feedback-error-ink",
                )}
              >
                <span className="flex items-center gap-2">
                  {!zonesValid && <Icon name="alert" size={18} />}
                  Zona neutra
                </span>
                <strong className="tabular-nums">{neutral}%</strong>
              </p>
              {!zonesValid && (
                <p className="mt-2 text-caption font-bold text-feedback-error-ink">
                  A zona neutra tem de ficar com pelo menos 10%. Reduz a promoção ou a despromoção.
                </p>
              )}
            </fieldset>

            <div>
              <label htmlFor="xp-multiplier" className="mb-2 block text-body-md font-bold text-on-surface">
                Multiplicador global de XP
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center overflow-hidden rounded-xl border-2 border-border-input bg-surface-canvas">
                  <button
                    type="button"
                    onClick={() => setMultiplier(league.xpMultiplier - MULTIPLIER.step)}
                    aria-label="Diminuir o multiplicador"
                    disabled={league.xpMultiplier <= MULTIPLIER.min}
                    className="flex size-12 items-center justify-center text-on-surface hover:bg-surface-soft disabled:text-text-disabled"
                  >
                    <Icon name="minus" size={18} />
                  </button>
                  <input
                    id="xp-multiplier"
                    type="number"
                    inputMode="decimal"
                    min={MULTIPLIER.min}
                    max={MULTIPLIER.max}
                    step={MULTIPLIER.step}
                    value={league.xpMultiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    aria-valuetext={`${league.xpMultiplier} vezes`}
                    className="w-20 border-x-2 border-border-cloud bg-transparent py-2.5 text-center text-body-lg font-bold text-on-surface tabular-nums focus-visible:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMultiplier(league.xpMultiplier + MULTIPLIER.step)}
                    aria-label="Aumentar o multiplicador"
                    disabled={league.xpMultiplier >= MULTIPLIER.max}
                    className="flex size-12 items-center justify-center text-on-surface hover:bg-surface-soft disabled:text-text-disabled"
                  >
                    <Icon name="plus" size={18} />
                  </button>
                </div>
                <Switch
                  id="weekend-boost"
                  checked={league.weekendBoost}
                  onChange={(v) => setLeague((l) => ({ ...l, weekendBoost: v }))}
                  label="Aplicar ao fim de semana"
                />
              </div>
              <p className="mt-2 text-caption text-text-secondary tabular-nums">
                Um quiz de 10 XP passa a dar {Math.round(10 * league.xpMultiplier)} XP
                {league.weekendBoost ? " ao fim de semana." : " sempre que estiver ativo."}
              </p>
            </div>

            <Button3D type="submit" size="lg" fullWidth disabled={!zonesValid} leadingIcon={<Icon name="check" size={20} strokeWidth={3} />}>
              Guardar regras da liga
            </Button3D>
          </form>
        </section>

        <section aria-labelledby="challenge-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 id="challenge-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              Agendamento do desafio relâmpago
            </h2>
            <Icon name="bolt" size={22} className="text-feedback-streak-ink" />
          </div>

          <div className="mb-6 rounded-2xl bg-feedback-streak p-4 text-surface-ink">
            <p className="text-overline uppercase">Estado operacional</p>
            <p className="mt-1 font-montserrat text-headline-h3 font-extrabold tabular-nums">
              Desafio a decorrer · faltam {LIVE_CHALLENGE.hoursLeft} h {LIVE_CHALLENGE.minutesLeft} min
            </p>
            <p className="mt-1 text-caption tabular-nums">
              {formatInt(LIVE_CHALLENGE.participants)} estudantes a participar em {LIVE_CHALLENGE.campuses}
            </p>
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!challengeReady) return;
              toast.show("Próximo desafio agendado.");
            }}
          >
            <div>
              <label htmlFor="starts-at" className="mb-2 block text-body-md font-bold text-on-surface">
                Data de lançamento (WAT)
              </label>
              <input
                id="starts-at"
                type="datetime-local"
                value={draft.startsAt}
                onChange={(e) => setDraft((d) => ({ ...d, startsAt: e.target.value }))}
                className="min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-4 text-body-md text-on-surface"
              />
            </div>

            <div>
              <label htmlFor="question" className="mb-2 block text-body-md font-bold text-on-surface">
                Pergunta interdisciplinar
              </label>
              <textarea
                id="question"
                rows={2}
                value={draft.question}
                onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))}
                className="field-sizing-content w-full resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3 text-body-lg font-bold text-on-surface"
              />
            </div>

            <div>
              <label htmlFor="correct" className="mb-2 block text-body-md font-bold text-on-surface">
                Resposta correta
              </label>
              <input
                id="correct"
                value={draft.correct}
                onChange={(e) => setDraft((d) => ({ ...d, correct: e.target.value }))}
                className="min-h-12 w-full rounded-xl border-2 border-feedback-success bg-feedback-success-soft px-4 text-body-md font-bold text-on-surface"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {draft.distractors.map((value, i) => (
                <div key={i}>
                  <label htmlFor={`distractor-${i}`} className="mb-2 block text-body-md font-bold text-on-surface">
                    Alternativa errada {i + 1}
                  </label>
                  <input
                    id={`distractor-${i}`}
                    value={value}
                    onChange={(e) =>
                      setDraft((d) => {
                        const next: [string, string] = [...d.distractors];
                        next[i] = e.target.value;
                        return { ...d, distractors: next };
                      })
                    }
                    className="min-h-12 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-4 text-body-md text-on-surface"
                  />
                </div>
              ))}
            </div>

            <SelectField
              id="reward"
              label="Recompensa associada"
              options={REWARDS}
              value={REWARDS.find((r) => r.label === draft.reward)?.value ?? REWARDS[0].value}
              onChange={(e) =>
                setDraft((d) => ({ ...d, reward: REWARDS.find((r) => r.value === e.target.value)?.label ?? d.reward }))
              }
            />

            <Button3D
              type="submit"
              size="lg"
              fullWidth
              variant="success"
              disabled={!challengeReady}
              leadingIcon={<Icon name="bolt" size={20} />}
            >
              Agendar próximo desafio
            </Button3D>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}
