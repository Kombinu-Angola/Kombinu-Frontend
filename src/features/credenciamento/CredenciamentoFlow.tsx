import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { FlowLayout } from "@/components/fluxo/flow";
import { RadioCardGroup } from "@/components/fluxo/choice";
import { ClockIcon, ShieldIcon, UserIcon, WalletIcon } from "@/components/fluxo/icons";
import { ScreenTitle } from "@/components/fluxo/layout";
import { useAuth } from "../../contexts/AuthContext";
import { destinoPorPapel } from "../../lib/destinoPosLogin";
import { Field, PrimaryButton, SelectField } from "../auth-novo/ui";
import { AFFILIATIONS, INSTITUTIONS } from "../creator/constants";
import { ArquivoCampo, CadeirasCampo } from "./campos";

type Vinculo = (typeof AFFILIATIONS)[number]["value"];

interface Candidatura {
  nome: string;
  instituicao: string;
  instituicaoOutra: string;
  vinculo: Vinculo;
  cadeiras: string[];
  documento: File | null;
  amostra: File | null;
  autoria: boolean;
  /** Só dígitos: "923000302". */
  telefone: string;
}

type Erros = Partial<Record<keyof Candidatura | "geral", string>>;

const PASSOS = 4;
const nomePasso = (i: number) => `Passo ${i + 1} de ${PASSOS}`;
const ICONES_VINCULO: Record<Vinculo, ReactNode> = {
  finalist: <UserIcon className="size-5" />,
  lecturer: <ShieldIcon className="size-5" />,
  tutor: <ClockIcon className="size-5" />,
};

const telefoneValido = (t: string) => /^9\d{8}$/.test(t);
const rotuloInstituicao = (c: Candidatura) =>
  c.instituicao === "other" ? c.instituicaoOutra.trim() : (INSTITUTIONS.find((i) => i.value === c.instituicao)?.label ?? c.instituicao);

/**
 * Credenciamento de criador (F8), no estilo do fluxo novo: dados e vínculo, comprovativo e amostra,
 * pagamentos e revisão. O envio está desligado até o backend ter `POST /creators/applications/`:
 * nada é enviado nem guardado, e o ecrã diz isso. O estado vive aqui, por isso voltar atrás nunca apaga respostas.
 */
export default function CredenciamentoFlow() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [passo, setPasso] = useState(0);
  const [c, setC] = useState<Candidatura>({
    nome: usuario?.nome ?? "", instituicao: "UAN", instituicaoOutra: "", vinculo: "finalist", cadeiras: [],
    documento: null, amostra: null, autoria: false, telefone: "",
  });
  const [erros, setErros] = useState<Erros>({});

  const mudar = (patch: Partial<Candidatura>) => {
    setC((a) => ({ ...a, ...patch }));
    setErros((e) => {
      const novo = { ...e, geral: undefined };
      for (const k of Object.keys(patch)) delete novo[k as keyof Candidatura];
      return novo;
    });
  };

  function validar(): Erros {
    const e: Erros = {};
    if (passo === 0) {
      if (c.nome.trim().split(/\s+/).filter(Boolean).length < 2) e.nome = "Escreve o teu nome e apelido, como no documento de identificação.";
      if (c.instituicao === "other" && !c.instituicaoOutra.trim()) e.instituicaoOutra = "Indica o nome da instituição.";
      if (c.cadeiras.length === 0) e.cadeiras = "Adiciona pelo menos uma cadeira que queres ensinar.";
    } else if (passo === 1) {
      if (!c.documento) e.documento = "Carrega o comprovativo do teu vínculo.";
      if (!c.amostra) e.amostra = "Carrega uma amostra do teu trabalho.";
      if (!c.autoria) e.autoria = "Precisas de confirmar que a amostra é da tua autoria.";
    } else if (passo === 2) {
      if (!telefoneValido(c.telefone)) e.telefone = "Número angolano com 9 dígitos, a começar por 9 (ex.: 923 000 000).";
    }
    return e;
  }

  function continuar() {
    const e = validar();
    if (Object.keys(e).length) {
      setErros({ ...e, geral: "Corrige os campos assinalados para continuar." });
      return;
    }
    setErros({});
    setPasso((p) => Math.min(p + 1, PASSOS - 1));
  }

  const sair = () => navigate(usuario ? destinoPorPapel(usuario) : "/");
  const voltar = () => (passo === 0 ? sair() : setPasso((p) => p - 1));

  const rodape =
    passo < PASSOS - 1 ? (
      <PrimaryButton type="button" onClick={continuar}>Continuar</PrimaryButton>
    ) : (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="flex min-h-14 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-2xl bg-neutral-200 px-6 py-3 font-display text-base font-bold text-neutral-600"
        >
          Enviar candidatura
          <span className="rounded-full bg-kombinu-yellow px-2 py-0.5 font-sans text-[0.7rem] font-bold text-kombinu-ink">Em breve</span>
        </button>
        <button type="button" onClick={sair} className="mx-auto flex min-h-11 items-center rounded-md px-3 text-sm font-bold text-neutral-600 underline underline-offset-2 hover:text-kombinu-ink focus-ring">
          Sair
        </button>
      </div>
    );

  return (
    <FlowLayout
      back={{ onClick: voltar, label: passo === 0 ? "Sair do credenciamento" : "Passo anterior" }}
      progress={{ value: ((passo + 1) / PASSOS) * 100, label: nomePasso(passo) }}
      footer={rodape}
    >
      <p className="mb-4 rounded-xl bg-kombinu-yellow-soft px-3 py-2 text-sm font-medium text-neutral-700">
        O envio da candidatura abre em breve. Podes preencher já e ver como funciona: nada é enviado nem guardado.
      </p>
      {erros.geral && <p role="alert" className="mb-4 rounded-xl bg-kombinu-danger-soft px-3 py-2 text-sm font-medium text-kombinu-danger">{erros.geral}</p>}

      <div key={passo} className="motion-safe:animate-panel-in">
        {passo === 0 && (
          <>
            <ScreenTitle subtitle="Todos os autores passam por uma auditoria antes de publicar. Assim, os estudantes sabem que cada sebenta vem de quem domina a matéria.">
              Quem és e o que ensinas
            </ScreenTitle>
            <div className="mt-8 flex flex-col gap-5">
              <Field label="Nome completo" autoComplete="name" value={c.nome} maxLength={120} error={erros.nome} hint="Tal como consta no documento que carregas a seguir." onChange={(e) => mudar({ nome: e.target.value })} />
              <SelectField label="Instituição" value={c.instituicao} onChange={(e) => mudar({ instituicao: e.target.value })}>
                {INSTITUTIONS.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
              </SelectField>
              {c.instituicao === "other" && (
                <Field label="Qual é a instituição?" value={c.instituicaoOutra} maxLength={120} error={erros.instituicaoOutra} onChange={(e) => mudar({ instituicaoOutra: e.target.value })} />
              )}
              <RadioCardGroup
                legend="O teu vínculo"
                value={c.vinculo}
                onChange={(v) => mudar({ vinculo: v })}
                options={AFFILIATIONS.map((a) => ({ value: a.value, title: a.label, icon: ICONES_VINCULO[a.value] }))}
              />
              <CadeirasCampo valor={c.cadeiras} onChange={(v) => mudar({ cadeiras: v })} erro={erros.cadeiras} />
            </div>
          </>
        )}

        {passo === 1 && (
          <>
            <ScreenTitle subtitle="Serve só para confirmar quem és e a qualidade do teu trabalho. Não aparece aos estudantes.">
              Comprovativo e amostra
            </ScreenTitle>
            <div className="mt-8 flex flex-col gap-5">
              <ArquivoCampo
                label="Comprovativo do vínculo"
                dica="Declaração, cartão ou certificado. PDF, JPG ou PNG, até 10 MB."
                aceita=".pdf,.jpg,.jpeg,.png"
                ficheiro={c.documento}
                onChange={(f) => mudar({ documento: f })}
                erro={erros.documento}
              />
              <ArquivoCampo
                label="Amostra do teu trabalho"
                dica="Uma sebenta, um resumo ou um simulado teu. PDF ou Word, até 10 MB."
                aceita=".pdf,.doc,.docx"
                ficheiro={c.amostra}
                onChange={(f) => mudar({ amostra: f })}
                erro={erros.amostra}
              />
              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed font-medium text-neutral-700">
                  <input
                    type="checkbox"
                    checked={c.autoria}
                    aria-invalid={erros.autoria ? true : undefined}
                    onChange={(e) => mudar({ autoria: e.target.checked })}
                    className="mt-0.5 size-5 shrink-0 cursor-pointer accent-kombinu-blue"
                  />
                  <span>Confirmo que a amostra é da minha autoria e que tenho direito a publicá-la.</span>
                </label>
                {erros.autoria && <p className="mt-2 text-sm font-medium text-red-700">{erros.autoria}</p>}
              </div>
            </div>
          </>
        )}

        {passo === 2 && (
          <>
            <ScreenTitle subtitle="É o número onde recebes o que ganhares com as tuas vendas. O plano escolhes depois de seres aprovado.">
              Onde recebes os pagamentos
            </ScreenTitle>
            <div className="mt-8">
              <Field
                label="Número Multicaixa Express"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="923 000 000"
                value={c.telefone.replace(/(\d{3})(?=\d)/g, "$1 ")}
                error={erros.telefone}
                hint="9 dígitos, em teu nome."
                leading={<span className="shrink-0 font-bold text-neutral-600">+244</span>}
                onChange={(e) => mudar({ telefone: e.target.value.replace(/\D/g, "").slice(0, 9) })}
              />
            </div>
          </>
        )}

        {passo === 3 && (
          <>
            <ScreenTitle subtitle="Confirma que está tudo certo antes de enviares.">Revê a tua candidatura</ScreenTitle>
            <dl className="mt-8 divide-y divide-neutral-100 rounded-2xl bg-kombinu-surface px-4">
              {[
                ["Nome", c.nome.trim()],
                ["Instituição", rotuloInstituicao(c)],
                ["Vínculo", AFFILIATIONS.find((a) => a.value === c.vinculo)?.label ?? ""],
                ["Cadeiras", c.cadeiras.join(", ")],
                ["Comprovativo", c.documento?.name ?? "—"],
                ["Amostra", c.amostra?.name ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 py-3">
                  <dt className="text-[0.75rem] font-bold tracking-[0.06em] text-neutral-600 uppercase">{k}</dt>
                  <dd className="font-bold break-words">{v}</dd>
                </div>
              ))}
              <div className="flex items-center gap-2 py-3">
                <WalletIcon className="size-5 shrink-0 text-kombinu-blue" />
                <span className="font-bold">+244 {c.telefone.replace(/(\d{3})(?=\d)/g, "$1 ")}</span>
              </div>
            </dl>
          </>
        )}
      </div>
    </FlowLayout>
  );
}
