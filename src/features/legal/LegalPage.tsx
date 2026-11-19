import { Fragment, useCallback, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PRIVACIDADE } from "./data/privacidade";
import { TERMOS } from "./data/termos";
import type { Block, LegalDoc, Section, SummaryItem } from "./data/types";
import { EASE_OUT } from "@/components/fluxo/motion";
import { BottomSheet } from "@/components/fluxo/BottomSheet";
import {
  AlertIcon, ArrowRightIcon, ArrowUpIcon, BoltIcon, CheckIcon, ChevronLeftIcon, ListIcon, LockIcon, MailIcon, PrinterIcon,
  RefreshIcon, ScaleIcon, ShieldIcon, SparkIcon, StoreIcon, UserIcon, UsersIcon, WalletIcon,
} from "@/components/fluxo/icons";
import { Logo, ScreenTitle } from "@/components/fluxo/layout";

export const TermsScreen = () => <LegalPage doc={TERMOS} />;
export const PrivacyScreen = () => <LegalPage doc={PRIVACIDADE} />;

const CONTACTS: Record<LegalDoc["slug"], { label: string; email: string }[]> = {
  termos: [
    { label: "Suporte e reembolsos", email: "suporte@kombinu.co.ao" },
    { label: "Assuntos jurídicos e denúncias", email: "juridico@kombinu.co.ao" },
  ],
  privacidade: [
    { label: "Exercer os teus direitos", email: "privacidade@kombinu.co.ao" },
    { label: "Suporte geral", email: "suporte@kombinu.co.ao" },
  ],
};

/**
 * Página de documento legal (/termos, /privacidade). Pública, sem login.
 * Leitura longa: índice com secção ativa, barra de leitura, ligações diretas por cláusula e impressão.
 */
function LegalPage({ doc }: { doc: LegalDoc }) {
  const active = useScrollSpy(doc.sections.map((s) => s.id));
  const [tocOpen, setTocOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const reduce = useReducedMotion();

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    el.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  }, [reduce]);

  // ligação direta para uma cláusula (ex.: /termos#sec-6)
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 80);
  }, [doc.slug]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 1200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function fromSheet(id: string) {
    setTocOpen(false);
    setTimeout(() => goTo(id), 60); // depois de a folha libertar o scroll da página
  }

  const other = doc.slug === "termos" ? PRIVACIDADE : TERMOS;

  return (
    <div className="min-h-dvh bg-white font-sans-landing text-kombinu-ink">
      <LegalHeader slug={doc.slug} />

      <div className="mx-auto w-full max-w-[1120px] px-5 pt-8 pb-24 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 lg:pt-12">
        <aside className="hidden lg:block print:hidden">
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain pr-2 pb-6">
            <Toc doc={doc} active={active} onGo={goTo} />
          </div>
        </aside>

        <main className="min-w-0">
          <ScreenTitle eyebrow={<span className="inline-flex items-center gap-2 text-sm font-bold text-kombinu-blue"><ScaleIcon className="size-4" /> Documento legal</span>}>
            {doc.title}
          </ScreenTitle>

          <dl className="mt-5 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
            <dt className="font-semibold text-neutral-500">Última atualização</dt>
            <dd className="font-semibold">{doc.updated}</dd>
            <dt className="font-semibold text-neutral-500">Versão</dt>
            <dd className="text-neutral-700">{doc.version}</dd>
          </dl>

          <div className="mt-5">
            <p className="mb-2 text-xs font-bold tracking-[0.1em] text-neutral-500 uppercase">Enquadramento legal</p>
            <ul className="flex flex-wrap gap-2">
              {doc.framework.map((f) => (
                <li key={f} className="rounded-full bg-kombinu-surface px-3 py-1.5 text-xs font-semibold text-neutral-700">{f}</li>
              ))}
            </ul>
          </div>

          {doc.intro && (
            <div className="mt-8 flex max-w-[72ch] flex-col gap-4">
              {doc.intro.map((t) => <p key={t} className="leading-relaxed text-pretty text-neutral-700"><Rich text={t} /></p>)}
            </div>
          )}

          <Summary items={doc.summary} sections={doc.sections} onGo={goTo} />

          <div className="mt-12 flex max-w-[72ch] flex-col gap-14">
            {doc.sections.map((s) => <SectionView key={s.id} section={s} />)}
          </div>

          {doc.signoff && (
            <footer className="mt-14 max-w-[72ch] border-t border-neutral-200 pt-6">
              <p className="font-display font-bold">{doc.signoff[0]}</p>
              {doc.signoff.slice(1).map((l) => <p key={l} className="mt-1 text-neutral-600 italic">{l}</p>)}
            </footer>
          )}

          <section aria-labelledby="contact-h" className="mt-14 max-w-[72ch] rounded-[28px] bg-kombinu-surface p-6 sm:p-8 print:hidden">
            <h2 id="contact-h" className="font-display text-xl font-bold">Tens dúvidas sobre este documento?</h2>
            <p className="mt-2 text-neutral-700">Escreve-nos. Respondemos pelo canal oficial da Kombinu.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {CONTACTS[doc.slug].map((c) => (
                <a key={c.email} href={`mailto:${c.email}`}
                  className="group flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5 ring-inset hover:bg-neutral-50 focus-ring">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-kombinu-blue-soft text-kombinu-blue"><MailIcon className="size-5" /></span>
                  <span className="min-w-0">
                    <span className="block text-sm text-neutral-600">{c.label}</span>
                    <span className="block truncate font-semibold text-kombinu-blue">{c.email}</span>
                  </span>
                </a>
              ))}
            </div>
            <Link to={`/${other.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-md font-semibold text-kombinu-blue underline-offset-4 hover:underline focus-ring">
              Ler também: {other.shortTitle} <ArrowRightIcon className="size-4" />
            </Link>
          </section>
        </main>
      </div>

      {/* Ações flutuantes: índice (telemóvel) e voltar ao topo */}
      <div className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex flex-col items-end gap-2 print:hidden">
        <AnimatePresence>
          {showTop && (
            <motion.button key="top" type="button" aria-label="Voltar ao topo"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: EASE_OUT }}
              onClick={() => { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); history.replaceState(null, "", " "); }}
              className="grid size-12 place-items-center rounded-full bg-white text-kombinu-ink shadow-lg ring-1 ring-black/10 focus-ring active:scale-95">
              <ArrowUpIcon className="size-5" />
            </motion.button>
          )}
        </AnimatePresence>
        <button type="button" onClick={() => setTocOpen(true)}
          className="flex h-12 items-center gap-2 rounded-full bg-kombinu-blue px-5 font-display text-sm font-bold text-white shadow-lg focus-ring active:scale-[0.97] lg:hidden">
          <ListIcon className="size-5" /> Índice
        </button>
      </div>

      <BottomSheet open={tocOpen} onClose={() => setTocOpen(false)} title="Índice" description={doc.shortTitle}>
        <div className="pb-2"><Toc doc={doc} active={active} onGo={fromSheet} /></div>
      </BottomSheet>
    </div>
  );
}

/* ───────── Cabeçalho com troca de documento e barra de leitura ───────── */

function LegalHeader({ slug }: { slug: LegalDoc["slug"] }) {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  const { key } = useLocation();
  // Com histórico da app volta ao sítio de onde veio; aberto directamente (link externo), vai ao início.
  const voltar = () => (key !== "default" ? navigate(-1) : navigate("/"));
  const tabs = [
    { slug: "termos", label: "Termos" },
    { slug: "privacidade", label: "Privacidade" },
  ] as const;
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-100 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur print:static print:border-0">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center gap-3 px-5">
        <button type="button" onClick={voltar} aria-label="Voltar"
          className="-ml-2 grid size-11 shrink-0 place-items-center rounded-xl text-neutral-600 hover:bg-kombinu-surface hover:text-kombinu-ink focus-ring print:hidden">
          <ChevronLeftIcon className="size-6" />
        </button>
        <Link to="/" className="rounded-md focus-ring" aria-label="Kombinu — início"><Logo size="sm" /></Link>
        <nav aria-label="Documentos legais" className="ml-auto grid h-11 grid-cols-2 rounded-2xl bg-kombinu-surface p-1 print:hidden">
          {tabs.map((t) => {
            const on = t.slug === slug;
            return (
              <Link key={t.slug} to={`/${t.slug}`} aria-current={on ? "page" : undefined}
                className={`flex items-center justify-center rounded-xl px-3 text-sm font-bold focus-ring sm:px-4 ${on ? "bg-white text-kombinu-blue shadow-sm" : "text-neutral-600 hover:text-kombinu-ink"}`}>
                {t.label}
              </Link>
            );
          })}
        </nav>
        <button type="button" onClick={() => window.print()} aria-label="Imprimir ou guardar em PDF"
          className="hidden size-11 shrink-0 place-items-center rounded-xl text-neutral-600 hover:bg-kombinu-surface hover:text-kombinu-ink focus-ring sm:grid print:hidden">
          <PrinterIcon className="size-5" />
        </button>
      </div>
      {/* Barra de leitura: scaleX ligado ao scroll (composta pela GPU) */}
      <motion.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="h-[3px] origin-left bg-kombinu-blue print:hidden" />
    </header>
  );
}

/* ───────── Índice ───────── */

function Toc({ doc, active, onGo }: { doc: LegalDoc; active?: string; onGo: (id: string) => void }) {
  return (
    <nav aria-label={`Índice — ${doc.shortTitle}`}>
      <p className="mb-3 hidden text-xs font-bold tracking-[0.1em] text-neutral-500 uppercase lg:block">Índice</p>
      <ol className="flex flex-col gap-0.5">
        {doc.sections.map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a href={`#${s.id}`} aria-current={on ? "location" : undefined}
                onClick={(e) => { e.preventDefault(); onGo(s.id); }}
                className={`flex gap-3 rounded-xl px-3 py-2.5 text-sm leading-snug focus-ring ${
                  on ? "bg-kombinu-blue-soft font-semibold text-kombinu-blue" : "text-neutral-600 hover:bg-kombinu-surface hover:text-kombinu-ink"
                }`}>
                <span className={`w-5 shrink-0 text-right font-display font-bold tabular-nums ${on ? "" : "text-neutral-400"}`}>{s.number}</span>
                <span>{s.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>();
  const key = ids.join("|");
  useEffect(() => {
    const visible = new Set<string>();
    const order = key.split("|");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        const first = order.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      { rootMargin: "-96px 0px -55% 0px" },
    );
    order.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [key]);
  return active;
}

/* ───────── Resumo em linguagem simples ───────── */

const SUMMARY_ICONS: Record<SummaryItem["icon"], typeof UserIcon> = {
  user: UserIcon, wallet: WalletIcon, refresh: RefreshIcon, store: StoreIcon, shield: ShieldIcon,
  bolt: BoltIcon, spark: SparkIcon, lock: LockIcon, mail: MailIcon, users: UsersIcon,
};

function Summary({ items, sections, onGo }: { items: SummaryItem[]; sections: Section[]; onGo: (id: string) => void }) {
  return (
    <section aria-labelledby="summary-h" className="mt-10 rounded-[28px] bg-kombinu-blue-soft p-5 sm:p-7 print:hidden">
      <h2 id="summary-h" className="font-display text-xl font-bold">Em resumo</h2>
      <p className="mt-1.5 flex items-start gap-2 text-sm text-kombinu-blue-dark">
        <AlertIcon className="mt-0.5 size-4 shrink-0" />
        Resumo em linguagem simples, só para orientação. Não substitui o texto completo, que é o que vale.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((it) => {
          const Icon = SUMMARY_ICONS[it.icon];
          const n = sections.find((s) => s.id === it.ref)?.number;
          return (
            <li key={it.title} className="flex flex-col gap-2 rounded-2xl bg-white p-4">
              <span className="flex items-center gap-2.5 font-display font-bold">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-kombinu-blue text-white"><Icon className="size-[18px]" /></span>
                {it.title}
              </span>
              <p className="text-[0.95rem] leading-relaxed text-neutral-700"><Rich text={it.text} /></p>
              <a href={`#${it.ref}`} onClick={(e) => { e.preventDefault(); onGo(it.ref); }}
                className="mt-auto inline-flex w-fit items-center gap-1 rounded-md pt-1 text-sm font-semibold text-kombinu-blue underline-offset-4 hover:underline focus-ring">
                Ler a cláusula {n} <ArrowRightIcon className="size-4" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ───────── Secções e blocos ───────── */

function SectionView({ section }: { section: Section }) {
  const hId = `${section.id}-h`;
  return (
    <section id={section.id} aria-labelledby={hId} className="scroll-mt-24">
      <h2 id={hId} tabIndex={-1} className="group flex items-start gap-3 font-display text-xl leading-snug font-bold text-balance outline-none sm:text-2xl">
        <span className="grid h-9 min-w-9 shrink-0 place-items-center rounded-xl bg-kombinu-ink px-2 text-base text-white tabular-nums print:bg-transparent print:text-kombinu-ink print:ring-1 print:ring-neutral-400">{section.number}</span>
        <span className="pt-0.5">
          {section.title}
          <a href={`#${section.id}`} aria-label={`Ligação direta para a cláusula ${section.number}`}
            className="ml-2 inline-flex translate-y-[-2px] rounded-md align-middle text-neutral-300 opacity-0 group-hover:opacity-100 hover:text-kombinu-blue focus:opacity-100 focus-ring print:hidden">
            #
          </a>
        </span>
      </h2>
      <div className="mt-5 flex flex-col gap-5">
        {section.blocks.map((b, i) => <BlockView key={i} block={b} />)}
      </div>
    </section>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="leading-relaxed text-pretty text-neutral-800"><Rich text={block.text} /></p>;

    case "sub":
      return (
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-lg leading-snug font-bold">
            {block.number && <span className="mr-2 text-kombinu-blue tabular-nums">{block.number}.</span>}
            {block.title}
          </h3>
          {block.blocks.map((b, i) => <BlockView key={i} block={b} />)}
        </div>
      );

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className="flex flex-col gap-3">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 leading-relaxed text-neutral-800">
              {block.ordered ? (
                <span aria-hidden="true" className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-kombinu-surface font-display text-xs font-bold text-neutral-700">
                  {block.marker === "alpha" ? String.fromCharCode(97 + i) : i + 1}
                </span>
              ) : (
                <span aria-hidden="true" className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-kombinu-blue" />
              )}
              <span className="min-w-0">
                {it.title && <strong className="font-semibold text-kombinu-ink">{it.title}: </strong>}
                <Rich text={it.text} />
              </span>
            </li>
          ))}
        </Tag>
      );
    }

    case "callout": {
      const tone = {
        info: "bg-kombinu-blue-soft text-kombinu-blue-dark",
        warning: "bg-kombinu-yellow-soft text-[#5c4500]",
        success: "bg-kombinu-success-soft text-[#1f6b30]",
      }[block.tone];
      const Icon = block.tone === "success" ? CheckIcon : AlertIcon;
      return (
        <div className={`flex gap-3 rounded-2xl p-4 leading-relaxed ${tone}`}>
          <Icon className="mt-1 size-4 shrink-0" strokeWidth={block.tone === "success" ? 3 : 2} />
          <div>
            {block.title && <p className="font-bold">{block.title}</p>}
            <p className={block.title ? "mt-1" : ""}><Rich text={block.text} /></p>
          </div>
        </div>
      );
    }

    case "facts":
      return (
        <dl className="divide-y divide-neutral-200 overflow-hidden rounded-2xl ring-1 ring-neutral-200 ring-inset">
          {block.items.map((f) => (
            <div key={f.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4">
              <dt className="text-sm font-semibold text-neutral-500">{f.label}</dt>
              <dd className="font-medium break-words"><Rich text={f.value} /></dd>
            </div>
          ))}
        </dl>
      );

    case "cards":
      return (
        <div className="grid gap-3">
          {block.items.map((c) => (
            <article key={c.title} className="rounded-2xl p-4 ring-1 ring-neutral-200 ring-inset sm:p-5">
              <h4 className="font-display font-bold">{c.title}</h4>
              <dl className="mt-3 flex flex-col gap-3">
                {c.fields.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs font-bold tracking-[0.06em] text-neutral-500 uppercase">{f.label}</dt>
                    <dd className="mt-1 leading-relaxed text-neutral-800"><Rich text={f.value} /></dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      );
  }
}

/* ───────── Texto rico mínimo ───────── */

const TOKEN = /(\*\*[^*]+\*\*|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|\/(?:termos|privacidade)\b)/g;

function Rich({ text }: { text: string }): ReactNode {
  const parts = text.split(TOKEN);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**")) return <strong key={i} className="font-bold text-kombinu-ink">{part.slice(2, -2)}</strong>;
    if (part.includes("@")) {
      return <a key={i} href={`mailto:${part}`} className="font-semibold break-words text-kombinu-blue underline underline-offset-2 focus-ring rounded-sm">{part}</a>;
    }
    if (part === "/termos" || part === "/privacidade") {
      return <Link key={i} to={part} className="font-semibold text-kombinu-blue underline underline-offset-2 focus-ring rounded-sm">{part}</Link>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
