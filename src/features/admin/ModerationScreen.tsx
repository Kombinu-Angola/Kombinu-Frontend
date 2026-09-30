import { useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { cn } from "@/lib/utils";
import { SUBMISSION } from "./mockAdmin";

/** ADM-03 — moderação: documento à esquerda, critérios de homologação à direita. */
export default function ModerationScreen() {
  const s = SUBMISSION;
  const [checked, setChecked] = useState<string[]>(s.criteria.filter((c) => c.prechecked).map((c) => c.id));
  const [feedback, setFeedback] = useState("");
  const [page, setPage] = useState(4);
  const [zoom, setZoom] = useState(100);
  const toast = useToast();

  const allChecked = checked.length === s.criteria.length;
  const missing = s.criteria.filter((c) => !checked.includes(c.id));

  function toggle(id: string) {
    setChecked((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  function approve() {
    if (!allChecked) return;
    toast.show("Material aprovado e publicado no marketplace.");
  }

  function reject() {
    if (!feedback.trim()) {
      document.getElementById("feedback-input")?.focus();
      return;
    }
    toast.show("Pedido de ajustes enviado ao criador.", "error");
  }

  return (
    <AdminShell
      active="moderacao"
      eyebrow={`Fila de espera · ${s.queueLength} pendentes`}
      title="Moderação de conteúdo"
      description={`${s.title} — submetido há ${s.submittedHoursAgo} h.`}
      actions={
        <p className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-border-cloud px-3 py-1.5 text-caption text-text-secondary">
            <Avatar name={s.author} size="sm" />
            {s.author} · {s.authorPlan}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-forest px-3 py-1.5 text-overline text-feedback-success uppercase tabular-nums">
            <Icon name="bolt" size={14} />
            {s.sizeKb} KB
          </span>
        </p>
      }
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section aria-labelledby="doc-title" className="rounded-3xl border-2 border-border-cloud bg-surface-soft p-4 sm:p-6">
          <h2 id="doc-title" className="sr-only">
            Documento submetido
          </h2>

          <article
            className="mx-auto max-w-xl rounded-2xl bg-surface-canvas p-6 shadow-clay sm:p-8"
            style={{ fontSize: `${zoom}%` }}
          >
            <header className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b-2 border-border-cloud pb-4">
              <p className="text-overline text-text-tertiary uppercase">
                {s.university} · {s.faculty}
              </p>
              <p className="text-caption text-text-secondary tabular-nums">
                Página {page} de {s.pages}
              </p>
            </header>

            <h3 className="mb-3 font-montserrat text-headline-h2 text-on-surface">Capítulo 3: limites laterais e continuidade</h3>
            <p className="mb-5 text-body-lg text-text-secondary">{s.excerpt}</p>

            <figure className="mb-5">
              <div className="flex h-40 items-center justify-center rounded-xl border-2 border-border-cloud bg-surface-soft">
                <svg viewBox="0 0 400 140" className="h-full w-full p-4" role="img" aria-label="Curva com um ponto de descontinuidade eliminável em x = a">
                  <path d="M20 120 C 110 20, 210 120, 380 40" fill="none" stroke="var(--color-brand-ocean)" strokeWidth="3" />
                  <circle cx="200" cy="78" r="6" fill="var(--color-feedback-streak)" />
                </svg>
              </div>
              <figcaption className="mt-2 text-center text-caption text-text-tertiary">
                Figura 3.1 — comportamento do gráfico nas proximidades de x = a.
              </figcaption>
            </figure>

            <div className="rounded-2xl border-2 border-primary-fixed bg-surface-sky p-4">
              <p className="mb-2 flex items-center gap-2 text-button text-primary uppercase">
                <Icon name="bolt" size={16} />
                Quiz proposto pelo criador
              </p>
              <p className="mb-3 text-body-md text-on-surface">{s.quiz.question}</p>
              <ul className="flex flex-col gap-2">
                {s.quiz.options.map((option, i) => (
                  <li
                    key={option}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-xl border-2 bg-surface-canvas p-2.5 text-body-md",
                      i === s.quiz.correctIndex ? "border-feedback-success font-bold text-on-surface" : "border-border-cloud text-text-secondary",
                    )}
                  >
                    {option}
                    {i === s.quiz.correctIndex && (
                      <span className="flex items-center gap-1 text-caption font-bold text-feedback-success-ink">
                        <Icon name="check" size={16} strokeWidth={3} />
                        Gabarito
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 rounded-full border-2 border-border-cloud bg-surface-canvas p-2">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(80, z - 10))}
              aria-label="Reduzir o zoom"
              className="flex size-11 items-center justify-center rounded-full text-on-surface hover:bg-surface-soft"
            >
              <Icon name="zoom-out" size={20} />
            </button>
            <span className="text-caption text-text-secondary tabular-nums" aria-live="polite">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              aria-label="Aumentar o zoom"
              className="flex size-11 items-center justify-center rounded-full text-on-surface hover:bg-surface-soft"
            >
              <Icon name="zoom-in" size={20} />
            </button>
            <span aria-hidden="true" className="mx-1 h-6 w-0.5 bg-border-cloud" />
            <Button3D variant="ghost" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} leadingIcon={<Icon name="arrow-left" size={18} />}>
              Anterior
            </Button3D>
            <Button3D variant="ghost" disabled={page === s.pages} onClick={() => setPage((p) => Math.min(s.pages, p + 1))} trailingIcon={<Icon name="arrow-right" size={18} />}>
              Seguinte
            </Button3D>
          </div>
        </section>

        <section aria-labelledby="criteria-title" className="flex flex-col rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
          <p className="text-overline text-brand-sky-ink uppercase">Validação institucional</p>
          <h2 id="criteria-title" className="font-montserrat text-headline-h2 text-on-surface">
            Critérios de homologação
          </h2>
          <p className="mt-1 mb-5 text-body-md text-text-secondary">
            Confirma todos os critérios antes de aprovar a publicação no marketplace.
          </p>

          <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
            <legend className="sr-only">Critérios de homologação pedagógica</legend>
            {s.criteria.map((c) => {
              const isChecked = checked.includes(c.id);
              return (
                <label
                  key={c.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-[border-color,background-color] duration-150",
                    isChecked ? "border-feedback-success bg-feedback-success-soft" : "border-border-cloud bg-surface-soft",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(c.id)}
                    className="mt-0.5 size-6 shrink-0 cursor-pointer accent-feedback-success-ink"
                  />
                  <span>
                    <span className="block text-body-md font-bold text-on-surface">{c.title}</span>
                    <span className="block text-caption text-text-secondary">{c.detail}</span>
                  </span>
                </label>
              );
            })}
          </fieldset>

          <div className="mt-5">
            <label htmlFor="feedback-input" className="mb-2 flex items-center justify-between gap-2 text-body-md font-bold text-on-surface">
              Instruções para o criador
              <span className="text-caption font-medium text-text-tertiary">Obrigatório para rejeitar</span>
            </label>
            <textarea
              id="feedback-input"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Ex.: inclui o passo a passo da regra de L'Hôpital na resolução da questão 4."
              className="field-sizing-content w-full resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3 text-body-md text-on-surface"
            />
          </div>

          <div className="mt-6 border-t-2 border-border-cloud pt-5">
            {!allChecked && (
              <p id="approve-hint" className="mb-3 flex items-start gap-2 text-caption text-text-secondary">
                <Icon name="alert" size={16} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
                Falta confirmar: {missing.map((m) => m.title.toLowerCase()).join("; ")}.
              </p>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button3D
                variant="ghost"
                fullWidth
                onClick={reject}
                className="border-feedback-error text-feedback-error-ink"
                leadingIcon={<Icon name="x" size={18} />}
              >
                Pedir ajustes
              </Button3D>
              <Button3D
                variant="success"
                fullWidth
                disabled={!allChecked}
                aria-describedby={allChecked ? undefined : "approve-hint"}
                onClick={approve}
                leadingIcon={<Icon name="check" size={18} strokeWidth={3} />}
              >
                Aprovar e publicar
              </Button3D>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
