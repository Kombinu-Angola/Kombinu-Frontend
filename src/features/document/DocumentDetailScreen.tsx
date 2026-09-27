import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { isValidAOPhone, PhoneInputAO } from "../../components/ui/PhoneInputAO";
import { useToast } from "../../components/ui/Toast";
import { formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { DocumentDetail, PurchaseState } from "./types";

const rating = new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

type DocumentDetailScreenProps = {
  document: DocumentDetail;
  userName: string;
  /** Pede a autorização no telemóvel (Multicaixa Express). Devolve a referência. */
  onPurchase?: (phone: string) => Promise<{ reference: string }>;
  onRead: () => void;
};

/** MKT-02 — detalhe da sebenta com amostra e pré-checkout por Multicaixa Express. */
export default function DocumentDetailScreen({ document: doc, userName, onPurchase, onRead }: DocumentDetailScreenProps) {
  const [page, setPage] = useState(0);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string>();
  const [purchase, setPurchase] = useState<PurchaseState>({ status: "idle" });
  const toast = useToast();

  const current = doc.sample[page];
  const discount = doc.anchorKz ? Math.round((1 - doc.priceKz / doc.anchorKz) * 100) : 0;
  const busy = purchase.status === "pending";

  async function buy() {
    if (!isValidAOPhone(phone)) {
      setPhoneError("O número tem de ter 9 dígitos e começar por 9, por exemplo 923 000 000.");
      window.document.getElementById("express-phone")?.focus();
      return;
    }
    setPhoneError(undefined);
    setPurchase({ status: "pending", reference: "…" });
    try {
      const { reference } = (await onPurchase?.(phone)) ?? { reference: "MCX-0000" };
      setPurchase({ status: "done", reference });
      toast.show("Pagamento confirmado. A sebenta já é tua.");
    } catch {
      setPurchase({ status: "error", message: "Não recebemos a confirmação. Verifica o telemóvel e tenta de novo." });
    }
  }

  return (
    <AppShell active="sebentas" userName={userName} campus={`${doc.subject} · ${doc.university}`}>
      <div className="mx-auto max-w-[1240px] px-4 py-6 md:px-6 lg:py-8">
        <nav aria-label="Caminho" className="mb-5 flex flex-wrap items-center gap-2 border-b-2 border-border-cloud pb-4 text-caption text-text-secondary">
          <a href="#/marketplace" className="hover:text-primary">
            Sebentas
          </a>
          <span aria-hidden="true">/</span>
          <a href="#/marketplace" className="hover:text-primary">
            {doc.faculty} — {doc.university}
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-bold text-on-surface">
            {doc.subject}
          </span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <section aria-labelledby="sample-title" className="flex flex-col gap-4 lg:col-span-8">
            <div className="flex flex-col justify-between gap-2 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 sm:flex-row sm:items-center">
              <p className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary-fixed px-3 py-1 text-overline text-on-primary-fixed uppercase">
                  Amostra gratuita
                </span>
                <span className="text-caption text-text-secondary tabular-nums">
                  Primeiras {doc.freePages} páginas de {doc.pages}
                </span>
              </p>
              <p className="inline-flex items-center gap-1.5 self-start rounded-full bg-surface-forest px-3 py-1 text-overline text-feedback-success uppercase tabular-nums sm:self-auto">
                <Icon name="bolt" size={14} />
                {doc.sampleKb} KB nesta amostra
              </p>
            </div>

            <article className="relative overflow-hidden rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 shadow-clay sm:p-9">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex -rotate-12 items-center justify-center text-center font-montserrat text-[64px] leading-none font-extrabold text-surface-ink uppercase opacity-[0.04] sm:text-[88px]"
              >
                Amostra
                <br />
                Kombinu
              </span>

              <header className="relative mb-5 border-b-2 border-border-cloud pb-4">
                <h1 id="sample-title" className="font-montserrat text-headline-h2 text-on-surface">
                  {doc.title}
                </h1>
                <p className="mt-1 text-caption text-text-secondary">
                  {doc.subject} · {doc.faculty} — {doc.university}
                </p>
              </header>

              <div className="relative flex flex-col gap-4">
                {current.heading && <h2 className="text-headline-h3 text-on-surface">{current.heading}</h2>}
                {current.paragraphs.map((text) => (
                  <p key={text.slice(0, 24)} className="text-body-lg leading-relaxed text-on-surface">
                    {text}
                  </p>
                ))}

                {current.formula && (
                  <aside aria-label="Fórmula" className="rounded-2xl border-l-8 border-brand-ocean bg-surface-soft p-4">
                    <p className="text-overline text-primary uppercase">{current.formula.label}</p>
                    <p className="my-2 text-center font-montserrat text-headline-h3 font-extrabold text-surface-ink">
                      {current.formula.expression}
                    </p>
                    <p className="text-caption text-text-secondary">{current.formula.note}</p>
                  </aside>
                )}

                {current.callout && (
                  <aside className="flex gap-3 rounded-2xl bg-secondary-fixed/40 p-4">
                    <Icon name="lightbulb" size={22} className="mt-0.5 shrink-0 text-brand-sunbeam-ink" />
                    <p className="text-body-md text-on-surface">
                      <strong className="block">{current.callout.title}</strong>
                      {current.callout.text}
                    </p>
                  </aside>
                )}
              </div>

              <div className="relative mt-6 flex items-center justify-between gap-2 border-t-2 border-border-cloud pt-4">
                <Button3D
                  variant="ghost"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  leadingIcon={<Icon name="arrow-left" size={18} />}
                >
                  Anterior
                </Button3D>
                <p aria-live="polite" className="text-caption font-bold text-on-surface tabular-nums">
                  Página {page + 1} de {doc.sample.length} da amostra
                </p>
                <Button3D
                  disabled={page >= doc.sample.length - 1}
                  onClick={() => setPage((p) => p + 1)}
                  trailingIcon={<Icon name="arrow-right" size={18} />}
                >
                  Seguinte
                </Button3D>
              </div>

              {page >= doc.sample.length - 1 && purchase.status !== "done" && (
                <div className="relative mt-6 flex flex-col items-center rounded-2xl border-2 border-border-cloud bg-surface-soft p-6 text-center">
                  <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-secondary-container text-surface-ink">
                    <Icon name="lock" size={24} />
                  </span>
                  <h2 className="text-headline-h3 text-on-surface">A amostra termina aqui</h2>
                  <p className="mt-1 mb-4 max-w-xl text-body-md text-text-secondary tabular-nums">
                    Faltam {doc.pages - doc.freePages} páginas e {doc.quizzes} quizzes. O pagamento é feito no telemóvel,
                    por Multicaixa Express.
                  </p>
                  <Button3D
                    onClick={() => window.document.getElementById("express-phone")?.focus()}
                    leadingIcon={<Icon name="bolt" size={18} />}
                  >
                    Ir para o pagamento
                  </Button3D>
                </div>
              )}
            </article>
          </section>

          <aside aria-labelledby="buy-title" className="flex flex-col gap-4 lg:col-span-4 lg:sticky lg:top-28">
            <div className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 shadow-clay sm:p-6">
              <h2 id="buy-title" className="sr-only">
                Comprar a sebenta
              </h2>

              <div className="flex items-center gap-3 border-b-2 border-border-cloud pb-4">
                <Avatar name={doc.author.name} />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-body-md font-bold text-on-surface">
                    {doc.author.name}
                    {doc.author.verified && (
                      <>
                        <Icon name="seal" size={15} className="text-brand-sky-ink" />
                        <span className="sr-only">autora verificada</span>
                      </>
                    )}
                  </p>
                  <p className="flex items-center gap-1 text-caption text-text-secondary">
                    <Icon name="star" size={14} className="fill-feedback-streak text-feedback-streak" />
                    <strong className="text-on-surface tabular-nums">{rating.format(doc.author.rating)}</strong>
                    <span className="text-text-tertiary tabular-nums">({doc.author.reviews} avaliações)</span>
                  </p>
                </div>
              </div>

              <div className="py-4">
                {doc.anchorKz && (
                  <p className="flex items-center justify-between gap-2 text-caption">
                    <span className="text-text-tertiary line-through tabular-nums">
                      Cópia impressa: {formatKz(doc.anchorKz)}
                    </span>
                    <span className="rounded-full bg-feedback-success px-2.5 py-0.5 text-overline text-surface-ink uppercase tabular-nums">
                      Poupas {discount}%
                    </span>
                  </p>
                )}
                <p className="mt-1 font-montserrat text-display-l font-extrabold text-primary tabular-nums">
                  {formatKz(doc.priceKz)}
                </p>
                <p className="text-caption text-text-secondary">Pagamento único. Fica tua para sempre.</p>
              </div>

              {purchase.status === "done" ? (
                <div className="rounded-2xl border-2 border-feedback-success bg-feedback-success-soft p-4">
                  <p className="flex items-center gap-2 text-body-md font-bold text-feedback-success-ink">
                    <Icon name="check" size={20} strokeWidth={3} />
                    Pagamento confirmado
                  </p>
                  <p className="mt-1 text-caption text-text-secondary tabular-nums">Referência {purchase.reference}</p>
                  <Button3D variant="success" fullWidth className="mt-4" onClick={onRead} trailingIcon={<Icon name="arrow-right" size={20} />}>
                    Ler a sebenta
                  </Button3D>
                </div>
              ) : (
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!busy) void buy();
                  }}
                  noValidate
                >
                  <PhoneInputAO
                    id="express-phone"
                    label="Número Multicaixa Express"
                    hint="Recebes um pedido de confirmação neste telemóvel."
                    value={phone}
                    error={phoneError}
                    onChange={(v) => {
                      setPhone(v);
                      setPhoneError(undefined);
                    }}
                  />

                  {purchase.status === "pending" && (
                    <p role="status" className="flex items-start gap-2 rounded-2xl border-2 border-feedback-streak bg-surface-canvas p-3 text-caption text-text-secondary">
                      <Icon name="phone" size={18} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
                      Confirma o pagamento no teu telemóvel. Assim que autorizares, a sebenta abre aqui.
                    </p>
                  )}

                  {purchase.status === "error" && (
                    <p role="alert" className="flex items-start gap-2 rounded-2xl border-2 border-feedback-error bg-surface-canvas p-3 text-caption font-bold text-feedback-error-ink">
                      <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
                      {purchase.message}
                    </p>
                  )}

                  <Button3D
                    type="submit"
                    size="lg"
                    fullWidth
                    aria-disabled={busy || undefined}
                    leadingIcon={busy ? undefined : <Icon name="bolt" size={20} />}
                  >
                    {busy ? "À espera da confirmação…" : "Comprar por Multicaixa Express"}
                  </Button3D>
                </form>
              )}

              <ul className="mt-5 flex flex-col gap-2 border-t-2 border-border-cloud pt-4">
                {doc.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-caption text-text-secondary">
                    <Icon name="check" size={16} strokeWidth={3} className="mt-0.5 shrink-0 text-feedback-success-ink" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className={cn("flex items-start gap-2 rounded-2xl bg-surface-forest p-4 text-caption text-feedback-success")}>
              <Icon name="shield" size={18} className="mt-0.5 shrink-0" />
              Descarga completa de {doc.sizeKb} KB, feita uma única vez. Depois lês offline, sem gastar mais dados.
            </p>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
