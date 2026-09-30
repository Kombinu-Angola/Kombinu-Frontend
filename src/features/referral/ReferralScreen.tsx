import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useToast } from "../../components/ui/Toast";
import { formatActivityTime } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { ReferralProgram } from "./types";

type ReferralScreenProps = { program: ReferralProgram; userName: string; university: string; subject: string };

/** Convites de turma: progresso até à recompensa e partilha por WhatsApp. */
export default function ReferralScreen({ program, userName, university, subject }: ReferralScreenProps) {
  const [message, setMessage] = useState(
    `Malta da ${university}! Encontrei a sebenta de ${subject} com os simulados resolvidos na Kombinu. Dá para estudar no telemóvel gastando menos de 5 MB por hora. Entra pelo meu link e ganhamos os dois: ${program.link}`,
  );
  const toast = useToast();

  const validated = program.slots.filter((s) => s.status === "ativo").length;
  const pending = program.slots.filter((s) => s.status === "convidado").length;
  const missing = Math.max(0, program.goal - validated);
  const percent = Math.round((validated / program.goal) * 100);

  const slots = [
    ...program.slots,
    ...Array.from({ length: Math.max(0, program.goal - program.slots.length) }, (_, i) => ({
      id: `empty-${i}`,
      status: "vazio" as const,
    })),
  ].slice(0, program.goal);

  async function copy(text: string, label: string) {
    await navigator.clipboard?.writeText(text);
    toast.show(label);
  }

  return (
    <AppShell active="trilhas" userName={userName} campus={`${university} · ${subject}`}>
      <div className="mx-auto max-w-[840px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6 flex flex-col justify-between gap-6 rounded-3xl border-2 border-feedback-gem bg-surface-canvas p-6 shadow-clay md:flex-row md:items-center sm:p-7">
          <div>
            <p className="text-overline text-primary uppercase">Comunidade</p>
            <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
              Estuda em grupo e ganha sebentas
            </h1>
            <p className="mt-2 max-w-lg text-body-md text-pretty text-text-secondary tabular-nums">
              Convida {program.goal} colegas da tua universidade. Quando cada um resolver o primeiro quiz, ganhas{" "}
              {program.rewardLabel} e {program.rewardGems} gemas.
            </p>
          </div>
          <span
            aria-hidden="true"
            className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-feedback-gem/15 text-feedback-gem-ink"
          >
            <Icon name="gem" size={48} />
          </span>
        </header>

        <section aria-labelledby="progress-title" className="mb-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <h2 id="progress-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface tabular-nums">
              {validated} de {program.goal} colegas validados
            </h2>
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-caption font-bold tabular-nums",
                missing === 0 ? "bg-surface-forest text-feedback-success" : "bg-secondary-fixed text-on-secondary-fixed-variant",
              )}
            >
              <Icon name={missing === 0 ? "check" : "bolt"} size={15} />
              {missing === 0 ? "Recompensa desbloqueada" : missing === 1 ? "Falta 1 colega" : `Faltam ${missing} colegas`}
            </span>
          </div>

          <ProgressBar
            value={validated}
            max={program.goal}
            tone="gem"
            label="Progresso dos convites"
            valueText={`${validated} de ${program.goal} colegas validados`}
          />
          <p className="mt-1.5 text-caption text-text-tertiary tabular-nums">
            {percent}% do objetivo{pending > 0 && ` · ${pending} à espera de resolver o primeiro quiz`}
          </p>

          <ol className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {slots.map((slot, index) => (
              <li key={slot.id}>
                <article
                  className={cn(
                    "flex h-full flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center",
                    slot.status === "ativo"
                      ? "border-feedback-success bg-surface-canvas"
                      : slot.status === "convidado"
                        ? "border-feedback-streak bg-surface-canvas"
                        : "border-dashed border-border-input bg-surface-soft",
                  )}
                >
                  {slot.status === "vazio" ? (
                    <>
                      <span className="flex size-12 items-center justify-center rounded-full border-2 border-dashed border-border-input text-text-tertiary">
                        <Icon name="plus" size={22} />
                      </span>
                      <span className="text-body-md font-bold text-text-secondary">Lugar {index + 1} livre</span>
                      <span className="text-caption text-text-tertiary">Ainda por convidar</span>
                    </>
                  ) : (
                    <>
                      <Avatar name={slot.name!} />
                      <span className="text-body-md font-bold text-on-surface">{slot.name}</span>
                      <span className="text-caption text-text-tertiary">
                        {slot.course} · {slot.university}
                      </span>
                      <span
                        className={cn(
                          "mt-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-caption font-bold",
                          slot.status === "ativo"
                            ? "bg-feedback-success-soft text-feedback-success-ink"
                            : "bg-secondary-fixed text-on-secondary-fixed-variant",
                        )}
                      >
                        <Icon name={slot.status === "ativo" ? "check" : "clock"} size={14} strokeWidth={3} />
                        {slot.status === "ativo" ? "Quiz concluído" : "Convite aceite"}
                      </span>
                      {slot.invitedAt && (
                        <span className="text-caption text-text-tertiary">{formatActivityTime(slot.invitedAt)}</span>
                      )}
                    </>
                  )}
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="share-title" className="mb-6 rounded-3xl border-2 border-feedback-success bg-surface-canvas p-5 sm:p-6">
          <h2 id="share-title" className="flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface">
            <Icon name="comment" size={22} className="text-feedback-success-ink" />
            Partilhar com a turma
          </h2>
          <p className="mt-1 mb-4 text-body-md text-text-secondary">
            A mensagem já vem escrita. Podes mudá-la antes de enviar.
          </p>

          <label htmlFor="invite-message" className="sr-only">
            Mensagem de convite
          </label>
          <textarea
            id="invite-message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="field-sizing-content w-full resize-none rounded-2xl border-2 border-border-input bg-surface-soft p-4 text-body-md text-on-surface"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-feedback-success text-button text-surface-ink uppercase shadow-3d-success transition-[translate,box-shadow] duration-150 active:translate-y-1 active:shadow-none"
            >
              <Icon name="comment" size={20} />
              Enviar no WhatsApp
              <span className="sr-only">(abre numa nova janela)</span>
            </a>
            <Button3D
              variant="ghost"
              className="sm:w-auto"
              onClick={() => void copy(program.link, "Ligação copiada.")}
              leadingIcon={<Icon name="share" size={18} />}
            >
              Copiar ligação
            </Button3D>
          </div>

          <p className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-surface-soft p-3">
            <span className="min-w-0">
              <span className="block text-caption text-text-secondary">O teu código</span>
              <span className="block truncate font-bold text-on-surface tabular-nums">{program.code}</span>
            </span>
            <Button3D variant="ghost" onClick={() => void copy(program.code, "Código copiado.")}>
              Copiar código
            </Button3D>
          </p>
        </section>

        <section aria-labelledby="rules-title" className="rounded-2xl bg-surface-soft p-5">
          <h2 id="rules-title" className="text-overline text-text-secondary uppercase">
            Como funciona
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-caption text-text-secondary">
            {[
              program.validationRule,
              "A recompensa é creditada a ti e ao colega, uma vez por cada convite validado.",
              "Contas repetidas ou com o mesmo número não contam para o objetivo.",
            ].map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <Icon name="check" size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-feedback-success-ink" />
                {rule}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
