import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon, ClockIcon, CompassIcon, SparkIcon } from "@/components/fluxo/icons";
import { ScreenTitle } from "@/components/fluxo/layout";
import { RadioCardGroup } from "@/components/fluxo/choice";
import { Field, SelectField } from "../auth-novo/ui";
import { PROVINCIAS, perfilService, type Instituicao, type Intencao, type MinutosPorDia } from "../../services/perfilService";
import type { Rascunho } from "./rascunho";

type Mudar = (patch: Partial<Rascunho>) => void;

/* ───────── Intenção (E2) ───────── */

const CARTOES: { intencao: Intencao; titulo: string; texto: string; meta: string; Icone: typeof SparkIcon; tom: string }[] = [
  {
    intencao: "exam_prep",
    titulo: "Preparar a minha prova",
    texto: "Carrega a tua sebenta ou os slides do professor e prepara-te só com essa matéria.",
    meta: "Começas pelo teu perfil",
    Icone: SparkIcon,
    tom: "bg-kombinu-blue text-white",
  },
  {
    intencao: "explore",
    titulo: "Explorar simulados",
    texto: "Escolhe o teu curso e faz um simulado curto já. Ganha XP e começa a tua ofensiva diária.",
    meta: "Primeiro simulado em poucos minutos",
    Icone: CompassIcon,
    tom: "bg-kombinu-yellow text-kombinu-ink",
  },
];

export function PassoIntencao({ onEscolher, onDepois }: { onEscolher: (i: Intencao) => void; onDepois: () => void }) {
  return (
    <>
      <ScreenTitle subtitle="Podes mudar a qualquer momento.">O que queres fazer hoje?</ScreenTitle>
      <div className="mt-8 grid gap-4">
        {CARTOES.map(({ intencao, titulo, texto, meta, Icone, tom }) => (
          <button
            key={intencao}
            type="button"
            onClick={() => onEscolher(intencao)}
            className="group block w-full rounded-[28px] bg-kombinu-edge pb-1.5 text-left focus-ring"
          >
            <span className="flex flex-col gap-4 rounded-[28px] bg-white p-6 ring-1 ring-black/5 ring-inset transition-transform duration-100 ease-out-strong group-hover:bg-neutral-50 group-active:translate-y-1">
              <span className={`grid size-14 place-items-center rounded-2xl ${tom}`}>
                <Icone className="size-7" />
              </span>
              <span>
                <span className="block font-display text-xl font-bold">{titulo}</span>
                <span className="mt-2 block leading-relaxed text-neutral-600">{texto}</span>
              </span>
              <span className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-4 text-sm font-bold text-kombinu-blue">
                {meta}
                <ArrowRightIcon className="size-5 transition-transform duration-150 ease-out-strong group-hover:translate-x-1" />
              </span>
            </span>
          </button>
        ))}
      </div>
      <button type="button" onClick={onDepois} className="mx-auto mt-6 flex min-h-11 items-center rounded-md px-3 text-sm font-bold text-neutral-600 underline underline-offset-2 hover:text-kombinu-ink focus-ring">
        Decidir depois
      </button>
    </>
  );
}

/* ───────── Passo 1: onde estudas ───────── */

export function PassoOnde({ r, mudar, instituicoes }: { r: Rascunho; mudar: Mudar; instituicoes: Instituicao[] }) {
  const escolhida = instituicoes.find((i) => String(i.id) === r.instituicao);
  const cursos = useQuery({ queryKey: ["cadeiras", "todas"], queryFn: () => perfilService.cadeiras() });
  const sugestoes = Array.from(new Set((cursos.data ?? []).map((c) => c.curso))).sort();
  const provinciaNome = PROVINCIAS.find((p) => p.id === escolhida?.provincia)?.nome;
  return (
    <>
      <ScreenTitle subtitle="Assim mostramos-te o que é do teu curso. Podes saltar este passo.">Onde estudas?</ScreenTitle>
      <div className="mt-8 flex flex-col gap-5">
        <SelectField
          label="Instituição"
          value={r.instituicao}
          onChange={(e) => mudar({ instituicao: e.target.value, cadeira: "" })}
          hint={provinciaNome ? `Província: ${provinciaNome}` : undefined}
        >
          <option value="">Escolhe a instituição</option>
          {instituicoes.map((i) => <option key={i.id} value={i.id}>{i.nome} ({i.sigla})</option>)}
          <option value="outra">Outra</option>
        </SelectField>
        {r.instituicao === "outra" && (
          <>
            <Field label="Qual é a instituição?" value={r.instituicaoOutra} maxLength={120} onChange={(e) => mudar({ instituicaoOutra: e.target.value })} />
            <SelectField label="Província" value={r.provincia} onChange={(e) => mudar({ provincia: e.target.value })}>
              <option value="">Escolhe a província</option>
              {PROVINCIAS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </SelectField>
          </>
        )}
        <Field
          label="Curso"
          list="cursos-sugeridos"
          value={r.curso}
          maxLength={120}
          autoComplete="off"
          placeholder="Ex.: Direito"
          onChange={(e) => mudar({ curso: e.target.value, cadeira: "" })}
        />
        <datalist id="cursos-sugeridos">
          {sugestoes.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>
    </>
  );
}

/* ───────── Passo 2: ano e cadeira ───────── */

const ANOS = [1, 2, 3, 4, 5, 6];

export function PassoAno({ r, mudar }: { r: Rascunho; mudar: Mudar }) {
  const curso = r.curso.trim();
  const cadeiras = useQuery({ queryKey: ["cadeiras", curso], queryFn: () => perfilService.cadeiras(curso), enabled: curso.length > 0 });
  const lista = cadeiras.data ?? [];
  const semLista = !cadeiras.isPending && lista.length === 0;
  return (
    <>
      <ScreenTitle subtitle="Mostramos primeiro o que mais te ajuda. Podes saltar este passo.">Em que ano estás e que cadeira te preocupa mais?</ScreenTitle>
      <div className="mt-8 flex flex-col gap-5">
        <SelectField label="Ano curricular" value={r.ano} onChange={(e) => mudar({ ano: e.target.value })}>
          <option value="">Escolhe o ano</option>
          {ANOS.map((a) => <option key={a} value={a}>{a}.º ano</option>)}
        </SelectField>
        <SelectField
          label="Cadeira que mais te preocupa"
          value={r.cadeira}
          disabled={curso.length === 0 || semLista}
          onChange={(e) => mudar({ cadeira: e.target.value })}
          hint={
            curso.length === 0
              ? "Indica o teu curso no passo anterior para veres as cadeiras."
              : semLista
                ? "Ainda não temos as cadeiras deste curso. Podes saltar este passo."
                : undefined
          }
        >
          <option value="">Escolhe a cadeira</option>
          {lista.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </SelectField>
      </div>
    </>
  );
}

/* ───────── Passo 3: tempo por dia ───────── */

const TEMPOS: { value: `${MinutosPorDia}`; title: string; description: string }[] = [
  { value: "5", title: "5 minutos", description: "Uma questão rápida por dia." },
  { value: "15", title: "15 minutos", description: "Um simulado curto." },
  { value: "30", title: "30 minutos", description: "Uma sessão focada." },
  { value: "60", title: "60 minutos", description: "Preparação intensiva." },
];

export function PassoTempo({ r, mudar }: { r: Rascunho; mudar: Mudar }) {
  return (
    <>
      <ScreenTitle subtitle="Ajustamos o ritmo ao tempo que tens. Podes saltar este passo.">Quanto tempo queres estudar por dia?</ScreenTitle>
      <div className="mt-8">
        <RadioCardGroup
          legend="Tempo por dia"
          hideLegend
          value={r.minutos ? (String(r.minutos) as `${MinutosPorDia}`) : undefined}
          onChange={(v) => mudar({ minutos: Number(v) as MinutosPorDia })}
          options={TEMPOS.map((t) => ({ ...t, icon: <ClockIcon className="size-5" /> }))}
        />
      </div>
    </>
  );
}
