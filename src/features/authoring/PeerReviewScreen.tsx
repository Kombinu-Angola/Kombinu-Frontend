import { useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { ConsentCheckbox } from "../../components/ui/ConsentCheckbox";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { cn } from "@/lib/utils";

type Verdict = "aprovar" | "ajustes" | "rejeitar";

const RUBRIC = [
  {
    id: "rigor",
    title: "Rigor técnico do conteúdo",
    options: [
      { value: "3", label: "Sem erros detetados" },
      { value: "2", label: "Pequenas imprecisões" },
      { value: "1", label: "Erros graves" },
    ],
  },
  {
    id: "explicacoes",
    title: "Explicações das alternativas",
    options: [
      { value: "3", label: "Completas em todas as opções" },
      { value: "2", label: "Só nas principais" },
      { value: "1", label: "Genéricas ou apenas gabarito" },
    ],
  },
  {
    id: "curriculo",
    title: "Alinhamento com o plano curricular",
    options: [
      { value: "3", label: "Alinhado com a cadeira e o ano" },
      { value: "2", label: "Parcialmente alinhado" },
      { value: "1", label: "Fora do âmbito" },
    ],
  },
  {
    id: "clareza",
    title: "Clareza para o ano a que se destina",
    options: [
      { value: "3", label: "Adequada" },
      { value: "2", label: "Densa em partes" },
      { value: "1", label: "Difícil de seguir" },
    ],
  },
] as const;

const SECTIONS = [
  {
    id: "s1",
    title: "1. O equilíbrio externo sob câmbio flutuante",
    body: "Numa economia aberta com mobilidade de capitais, a taxa de câmbio ajusta-se até igualar o retorno esperado dos ativos internos e externos. É este ajustamento que torna a política fiscal menos eficaz: a entrada de capitais aprecia a moeda e reduz as exportações líquidas.",
  },
  {
    id: "s2",
    title: "2. O caso angolano: choques no preço do petróleo",
    body: "Com receitas de exportação concentradas num só produto, um choque no preço reduz a oferta de divisas e pressiona as reservas. O modelo ajuda a prever a sequência: reservas, liquidez, taxa interbancária, crédito.",
  },
  {
    id: "s3",
    title: "3. Checkpoint: eficácia da política monetária",
    body: "Com câmbio fixo e mobilidade perfeita de capitais, a política monetária perde eficácia sobre o produto, porque a defesa da paridade drena as reservas emitidas.",
  },
];

type PeerReviewScreenProps = { materialTitle: string; author: string; reviewerName: string };

/** Revisão por pares: rubrica, notas ancoradas às secções e parecer com justificação obrigatória. */
export default function PeerReviewScreen({ materialTitle, author, reviewerName }: PeerReviewScreenProps) {
  const [scores, setScores] = useState<Record<string, string>>({ rigor: "3", explicacoes: "2" });
  const [notes, setNotes] = useState<Array<{ id: string; sectionId: string; text: string }>>([]);
  const [draftNote, setDraftNote] = useState("");
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [justification, setJustification] = useState("");
  const [declared, setDeclared] = useState(false);
  const toast = useToast();

  const scored = RUBRIC.filter((r) => scores[r.id]).length;
  const needsJustification = verdict === "ajustes" || verdict === "rejeitar";
  const canSubmit =
    verdict !== null &&
    scored === RUBRIC.length &&
    declared &&
    (!needsJustification || justification.trim().length >= 20);

  function addNote() {
    if (draftNote.trim().length < 5) return;
    setNotes((prev) => [...prev, { id: `n${prev.length + 1}`, sectionId: activeSection, text: draftNote.trim() }]);
    setDraftNote("");
    toast.show("Nota adicionada à secção.");
  }

  return (
    <CreatorShell active="materiais" creatorName={reviewerName}>
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6">
          <p className="flex flex-wrap items-center gap-2 text-overline text-primary uppercase">
            Revisão por pares
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-soft px-2.5 py-1 text-caption normal-case text-text-secondary">
              <Avatar name={author} size="sm" />
              Autor: {author}
            </span>
          </p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
            {materialTitle}
          </h1>
          <p className="mt-1 text-body-md text-text-secondary">
            O teu parecer vai para o autor e para a moderação. É assinado com o teu nome.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <section aria-labelledby="material-title" className="rounded-3xl border-2 border-border-cloud bg-surface-soft p-5 lg:col-span-7 sm:p-6">
            <h2 id="material-title" className="sr-only">
              Material em revisão
            </h2>

            <article className="rounded-2xl bg-surface-canvas p-5 shadow-clay sm:p-7">
              {SECTIONS.map((section) => {
                const sectionNotes = notes.filter((n) => n.sectionId === section.id);
                const active = section.id === activeSection;
                return (
                  <section key={section.id} className="mb-6 last:mb-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-headline-h3 text-on-surface">{section.title}</h3>
                      <button
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        aria-pressed={active}
                        className={cn(
                          "flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border-2 px-3 text-caption font-bold transition-[border-color,background-color,color] duration-150",
                          active ? "border-brand-ocean bg-surface-sky text-primary" : "border-border-cloud text-text-secondary hover:border-brand-ocean",
                        )}
                      >
                        <Icon name="comment" size={15} />
                        {active ? "A comentar aqui" : "Comentar"}
                        <span className="sr-only"> na secção {section.title}</span>
                      </button>
                    </div>

                    <p className="mt-2 text-body-lg leading-relaxed text-text-secondary">{section.body}</p>

                    {sectionNotes.length > 0 && (
                      <ul className="mt-3 flex flex-col gap-2 border-l-4 border-feedback-streak pl-3">
                        {sectionNotes.map((note) => (
                          <li key={note.id} className="flex items-start justify-between gap-2 text-caption">
                            <span className="text-on-surface">{note.text}</span>
                            <button
                              type="button"
                              onClick={() => setNotes((prev) => prev.filter((n) => n.id !== note.id))}
                              aria-label="Remover nota"
                              className="flex size-8 shrink-0 items-center justify-center rounded text-text-tertiary hover:text-feedback-error-ink"
                            >
                              <Icon name="x" size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </article>

            <div className="mt-4 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4">
              <label htmlFor="note-input" className="mb-2 block text-body-md font-bold text-on-surface">
                Nota sobre {SECTIONS.find((s) => s.id === activeSection)?.title.toLowerCase()}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="note-input"
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  placeholder="O que deve mudar nesta secção?"
                  className="min-h-12 flex-1 rounded-xl border-2 border-border-input bg-surface-canvas px-4 text-body-md text-on-surface"
                />
                <Button3D onClick={addNote} disabled={draftNote.trim().length < 5}>
                  Adicionar nota
                </Button3D>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-5 lg:col-span-5 lg:sticky lg:top-24">
            <section aria-labelledby="rubric-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
              <h2 id="rubric-title" className="flex items-center justify-between gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface">
                Rubrica
                <span className="text-caption font-medium text-text-secondary tabular-nums">
                  {scored} de {RUBRIC.length}
                </span>
              </h2>

              <div className="mt-4 flex flex-col gap-5">
                {RUBRIC.map((criterion) => (
                  <fieldset key={criterion.id} className="m-0 min-w-0 border-0 p-0">
                    <legend className="mb-2 text-body-md font-bold text-on-surface">{criterion.title}</legend>
                    <div className="flex flex-col gap-1.5">
                      {criterion.options.map((option) => (
                        <label
                          key={option.value}
                          className={cn(
                            "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border-2 px-3 text-caption transition-[border-color,background-color] duration-150",
                            "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-sky-ink",
                            scores[criterion.id] === option.value
                              ? "border-brand-ocean bg-surface-sky font-bold text-primary"
                              : "border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean",
                          )}
                        >
                          <input
                            type="radio"
                            name={criterion.id}
                            checked={scores[criterion.id] === option.value}
                            onChange={() => setScores((prev) => ({ ...prev, [criterion.id]: option.value }))}
                            className="size-4 cursor-pointer accent-brand-ocean"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            </section>

            <section aria-labelledby="verdict-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5">
              <h2 id="verdict-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
                Parecer
              </h2>

              <fieldset className="m-0 mt-3 min-w-0 border-0 p-0">
                <legend className="sr-only">Decisão do parecer</legend>
                <div className="flex flex-col gap-2">
                  {[
                    { value: "aprovar" as const, label: "Recomendar aprovação", tone: "border-feedback-success text-feedback-success-ink" },
                    { value: "ajustes" as const, label: "Pedir ajustes menores", tone: "border-feedback-streak text-feedback-streak-ink" },
                    { value: "rejeitar" as const, label: "Não recomendar publicação", tone: "border-feedback-error text-feedback-error-ink" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 text-body-md font-bold transition-[border-color,background-color] duration-150",
                        verdict === option.value ? cn(option.tone, "bg-surface-canvas") : "border-border-cloud text-text-secondary hover:border-brand-ocean",
                      )}
                    >
                      <input
                        type="radio"
                        name="verdict"
                        checked={verdict === option.value}
                        onChange={() => setVerdict(option.value)}
                        className="size-5 cursor-pointer accent-brand-ocean"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {needsJustification && (
                <div className="mt-4">
                  <label htmlFor="justification" className="mb-2 block text-body-md font-bold text-on-surface">
                    Justificação para o autor
                  </label>
                  <textarea
                    id="justification"
                    rows={3}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Diz o que corrigir e onde. As notas que deixaste nas secções seguem junto."
                    className="field-sizing-content w-full resize-none rounded-xl border-2 border-border-input bg-surface-canvas p-3 text-body-md text-on-surface"
                  />
                  <p className="mt-1 text-caption text-text-tertiary tabular-nums">
                    {notes.length} notas ancoradas às secções serão enviadas com o parecer.
                  </p>
                </div>
              )}

              <div className="mt-4">
                <ConsentCheckbox
                  id="plagiarism-declaration"
                  checked={declared}
                  onChange={setDeclared}
                  title="Declaração do revisor"
                >
                  Verifiquei por amostragem e não encontrei reprodução integral de manuais com direitos. Não tenho
                  conflito de interesse com o autor.
                </ConsentCheckbox>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                {!canSubmit && (
                  <p id="submit-hint" className="text-caption text-text-secondary">
                    Falta: {scored < RUBRIC.length && "preencher a rubrica"}
                    {scored < RUBRIC.length && !verdict && ", "}
                    {!verdict && "escolher o parecer"}
                    {needsJustification && justification.trim().length < 20 && ", escrever a justificação"}
                    {!declared && ", confirmar a declaração"}.
                  </p>
                )}
                <Button3D variant="ghost" fullWidth onClick={() => toast.show("Parecer guardado como rascunho.")}>
                  Guardar rascunho
                </Button3D>
                <Button3D
                  fullWidth
                  disabled={!canSubmit}
                  aria-describedby={canSubmit ? undefined : "submit-hint"}
                  onClick={() => toast.show("Parecer enviado ao autor e à moderação.")}
                  trailingIcon={<Icon name="arrow-right" size={20} />}
                >
                  Enviar parecer
                </Button3D>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </CreatorShell>
  );
}
