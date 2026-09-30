import { useEffect, useRef, useState } from "react";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { formatKz, formatSize } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { CreatorMaterial, Visibility } from "./types";

const FREE_PLAN_COMMISSION = 0.3;
const SUGGESTED = { min: 1000, max: 2500 };

const VISIBILITIES: ReadonlyArray<{ value: Visibility; title: string; hint: string }> = [
  { value: "publico", title: "Público no marketplace", hint: "Aparece nas pesquisas de todos os estudantes" },
  { value: "link", title: "Apenas por ligação", hint: "Só quem receber o endereço consegue abrir" },
  { value: "faculdade", title: "Só a minha faculdade", hint: "Visível apenas para quem estuda na instituição" },
];

export type PricingDecision = { priceKz: number; visibility: Visibility };

type PricingModalProps = {
  material: CreatorMaterial;
  /** Plano do criador: define a comissão aplicada. */
  plan: "pro" | "free";
  /** "publicar" no fim do estúdio; "editar" a partir da gestão de materiais. */
  mode?: "publicar" | "editar";
  onClose: () => void;
  onConfirm: (decision: PricingDecision) => void;
};

/** Passo de preço e visibilidade. Mostra sempre o que o criador recebe de facto, por venda. */
export function PricingModal({ material, plan, mode = "publicar", onClose, onConfirm }: PricingModalProps) {
  const [isPaid, setIsPaid] = useState(material.priceKz > 0);
  const [price, setPrice] = useState(material.priceKz || 1500);
  const [visibility, setVisibility] = useState<Visibility>(material.visibility);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement;
    panelRef.current?.querySelector<HTMLElement>("button, input")?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      openerRef.current?.focus();
    };
  }, [onClose]);

  const commission = plan === "pro" ? 0 : Math.round(price * FREE_PLAN_COMMISSION);
  const net = isPaid ? price - commission : 0;
  const netOnFree = Math.round(price * (1 - FREE_PLAN_COMMISSION));
  const outOfRange = isPaid && (price < SUGGESTED.min || price > SUGGESTED.max);
  const invalid = isPaid && (!Number.isFinite(price) || price < 100);

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center overflow-y-auto bg-surface-ink/60 p-4">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-title"
        className="my-8 w-full max-w-[580px] rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay-hover sm:p-7"
      >
        <header className="flex items-start justify-between gap-3 border-b-2 border-border-cloud pb-4">
          <div>
            <p className="text-overline text-primary uppercase">
              {mode === "publicar" ? "Passo final da publicação" : "Preço e visibilidade"}
            </p>
            <h2 id="pricing-title" className="mt-1 font-montserrat text-headline-h2 text-on-surface">
              {mode === "publicar" ? "Definir preço e publicar" : "Alterar preço e visibilidade"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar sem guardar"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-text-secondary transition-[background-color,color] duration-150 hover:bg-surface-soft hover:text-on-surface"
          >
            <Icon name="x" size={20} />
          </button>
        </header>

        <section aria-label="Material" className="mt-4 flex items-center gap-3.5 rounded-2xl bg-surface-soft p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <Icon name="file" size={22} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-body-md font-bold text-on-surface">{material.title}</p>
            <p className="mt-0.5 text-caption text-text-secondary tabular-nums">
              {material.pages} páginas · {material.quizzes} quizzes · {formatSize(material.sizeKb)} ·{" "}
              {material.university}
            </p>
          </div>
        </section>

        <form
          className="mt-5 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (invalid) return;
            onConfirm({ priceKz: isPaid ? price : 0, visibility });
          }}
        >
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="mb-2.5 text-body-md font-bold text-on-surface">Modelo de preço</legend>
            <div className="flex flex-col gap-2.5">
              {[
                { paid: false, title: "Gratuito para a comunidade", hint: "Qualquer estudante pode abrir sem pagar" },
                { paid: true, title: "Pago em Kwanzas", hint: "Recebes por Multicaixa Express a cada compra" },
              ].map((option) => (
                <label
                  key={String(option.paid)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3.5 rounded-xl border-2 p-3.5 transition-[border-color,background-color] duration-150",
                    "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
                    isPaid === option.paid
                      ? "border-brand-ocean bg-surface-sky shadow-[inset_0_0_0_1px_var(--color-brand-ocean)]"
                      : "border-border-cloud bg-surface-canvas hover:border-brand-ocean",
                  )}
                >
                  <input
                    type="radio"
                    name="pricing-model"
                    checked={isPaid === option.paid}
                    onChange={() => setIsPaid(option.paid)}
                    className="size-5 cursor-pointer accent-brand-ocean"
                  />
                  <span>
                    <span className="block text-body-md font-bold text-on-surface">{option.title}</span>
                    <span className="block text-caption text-text-secondary">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {isPaid && (
            <div>
              <label htmlFor="material-price" className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-body-md font-bold text-on-surface">Preço para o estudante</span>
                <span className="text-caption text-text-tertiary tabular-nums">
                  Média em Luanda: {formatKz(SUGGESTED.min)} a {formatKz(SUGGESTED.max)}
                </span>
              </label>
              <div
                className={cn(
                  "flex min-h-[52px] items-center gap-2 rounded-xl border-2 bg-surface-canvas px-4",
                  "has-[input:focus-visible]:border-brand-sky-ink",
                  invalid ? "border-feedback-error-ink" : "border-brand-ocean",
                )}
              >
                <span className="text-body-lg font-bold text-primary">Kz</span>
                <input
                  id="material-price"
                  type="number"
                  inputMode="numeric"
                  min={100}
                  step={100}
                  value={price}
                  aria-describedby="price-hint"
                  aria-invalid={invalid || undefined}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-transparent font-montserrat text-headline-h2 font-extrabold text-primary tabular-nums focus-visible:outline-none"
                />
              </div>
              <p
                id="price-hint"
                className={cn(
                  "mt-1.5 text-caption tabular-nums",
                  invalid ? "font-bold text-feedback-error-ink" : outOfRange ? "text-feedback-streak-ink" : "text-text-tertiary",
                )}
              >
                {invalid
                  ? "Indica um preço a partir de 100 Kz."
                  : outOfRange
                    ? `Fora do intervalo habitual para esta cadeira (${formatKz(SUGGESTED.min)} a ${formatKz(SUGGESTED.max)}).`
                    : "Dentro do intervalo habitual para esta cadeira."}
              </p>

              <div className="mt-3.5 rounded-2xl border-2 border-border-cloud bg-surface-soft p-4">
                <p className="flex items-center justify-between gap-3 text-caption text-text-secondary">
                  Preço cobrado ao estudante
                  <strong className="text-body-md text-on-surface tabular-nums">{formatKz(price)}</strong>
                </p>
                <p className="mt-2 flex items-center justify-between gap-3 text-caption text-text-secondary">
                  Comissão da Kombinu ({plan === "pro" ? "Plano Pro, 0%" : "Plano grátis, 30%"})
                  <strong className="tabular-nums text-on-surface">− {formatKz(commission)}</strong>
                </p>
                <p className="mt-3 flex items-center justify-between gap-3 rounded-xl border-2 border-feedback-success bg-surface-canvas p-3">
                  <span className="flex items-center gap-2 text-body-md font-bold text-on-surface">
                    <Icon name="wallet" size={20} className="text-feedback-success-ink" />O que recebes por venda
                  </span>
                  <strong className="font-montserrat text-headline-h3 font-extrabold text-feedback-success-ink tabular-nums">
                    {formatKz(net)}
                  </strong>
                </p>
                {plan === "pro" ? (
                  <p className="mt-2.5 text-caption text-text-tertiary tabular-nums">
                    No plano grátis receberias {formatKz(netOnFree)} por venda.
                  </p>
                ) : (
                  <p className="mt-2.5 text-caption text-text-tertiary tabular-nums">
                    Com o Criador Pro receberias {formatKz(price)} e pagarias 5.000 Kz por mês: compensa a partir de{" "}
                    {Math.floor(5000 / (price * FREE_PLAN_COMMISSION)) + 1} vendas mensais.
                  </p>
                )}
              </div>
            </div>
          )}

          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="mb-2.5 text-body-md font-bold text-on-surface">Quem pode ver</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {VISIBILITIES.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-3 transition-[border-color,background-color] duration-150",
                    "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
                    visibility === option.value
                      ? "border-brand-ocean bg-surface-sky"
                      : "border-border-cloud bg-surface-canvas hover:border-brand-ocean",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === option.value}
                      onChange={() => setVisibility(option.value)}
                      className="size-4 cursor-pointer accent-brand-ocean"
                    />
                    <span className="text-caption font-bold text-on-surface">{option.title}</span>
                  </span>
                  <span className="text-caption text-text-tertiary">{option.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-3 border-t-2 border-border-cloud pt-5 sm:flex-row">
            <Button3D variant="ghost" fullWidth onClick={onClose}>
              Cancelar
            </Button3D>
            <Button3D type="submit" fullWidth disabled={invalid} trailingIcon={<Icon name="arrow-right" size={20} />}>
              {mode === "publicar" ? "Publicar sebenta" : "Guardar alterações"}
            </Button3D>
          </div>
        </form>
      </div>
    </div>
  );
}
