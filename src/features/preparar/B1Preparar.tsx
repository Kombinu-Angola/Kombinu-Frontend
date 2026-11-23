import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FlowLayout } from "@/components/fluxo/flow";
import { Alert, Badge } from "@/components/fluxo/feedback";
import { ShieldIcon, SparkIcon } from "@/components/fluxo/icons";
import { ScreenTitle } from "@/components/fluxo/layout";
import { Field, PrimaryButton, SelectField } from "../auth-novo/ui";
import { mensagemDe } from "../../lib/formatoFluxo";
import { fluxoService } from "../../services/fluxoService";
import { FileDropzone } from "./FileDropzone";

type Erros = Partial<Record<"titulo" | "cadeira" | "ficheiro" | "form", string>>;

/** B1: tema, cadeira e ficheiro. Ao enviar, a IA começa a preparar a prévia e segue-se a calibração (B2/B3). */
export default function B1Preparar() {
  const navigate = useNavigate();
  const quota = useQuery({ queryKey: ["fluxo", "quota"], queryFn: fluxoService.quota });
  const cadeiras = useQuery({ queryKey: ["fluxo", "cadeiras"], queryFn: () => fluxoService.subjects() });
  const consent = useQuery({ queryKey: ["fluxo", "consentimento"], queryFn: fluxoService.consentimento });

  const [titulo, setTitulo] = useState("");
  const [cadeira, setCadeira] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ficheiro, setFicheiro] = useState<File | null>(null);
  const [erros, setErros] = useState<Erros>({});
  const [aEnviar, setAEnviar] = useState(false);
  const tituloRef = useRef<HTMLInputElement>(null);
  const cadeiraRef = useRef<HTMLSelectElement>(null);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const proximos: Erros = {};
    if (titulo.trim().length < 3) proximos.titulo = "Escreve o tema da prova (ex.: Normalização até à 3FN).";
    if (!cadeira) proximos.cadeira = "Escolhe a cadeira.";
    if (!ficheiro) proximos.ficheiro = erros.ficheiro ?? "Escolhe o ficheiro da matéria.";
    setErros(proximos);
    if (proximos.titulo) return tituloRef.current?.focus();
    if (proximos.cadeira) return cadeiraRef.current?.focus();
    if (proximos.ficheiro) return document.querySelector<HTMLElement>('input[type="file"]')?.focus();

    setAEnviar(true);
    try {
      const job = await fluxoService.createJob({ title: titulo.trim(), subjectId: cadeira, description: descricao.trim(), file: ficheiro! });
      navigate(`/v2/preparar/calibrar?job=${encodeURIComponent(job.id)}`);
    } catch (err) {
      setErros({ form: mensagemDe(err, "Não foi possível enviar o ficheiro. Verifica a ligação e tenta outra vez.") });
    } finally {
      setAEnviar(false);
    }
  }

  const q = quota.data;
  const bloqueado = consent.data === "pending";

  return (
    <FlowLayout back={{ href: "/v2/painel", label: "Voltar ao painel" }} progress={{ value: 10, label: "Preparar prova: passo 1" }}>
      <p className="mb-4 rounded-xl bg-kombinu-yellow-soft px-3 py-2 text-sm font-medium text-neutral-700">
        Modo de desenvolvimento: este fluxo usa dados de exemplo e ainda não tem backend.
      </p>
      <ScreenTitle
        eyebrow={
          q ? (
            q.freeGenerationsLeft > 0 ? <Badge tone="green">1 geração grátis este mês</Badge> : <Badge tone="neutral">Prévia grátis · módulo com passe</Badge>
          ) : (
            <span aria-hidden="true" className="inline-block h-7 w-48 animate-pulse rounded-full bg-kombinu-surface" />
          )
        }
        subtitle="Enquanto a IA lê o teu ficheiro, fazemos-te 3 perguntas rápidas para acertar o nível."
      >
        Que prova vais fazer?
      </ScreenTitle>

      {bloqueado ? (
        <div className="mt-8">
          <Alert tone="warning" icon={<ShieldIcon className="size-4" />} title="Precisa da autorização do teu encarregado">
            Como tens menos de 18 anos, a geração por IA fica disponível quando o encarregado autorizar a conta.
          </Alert>
        </div>
      ) : (
        <form onSubmit={enviar} noValidate className="mt-8 flex flex-col gap-6">
          {erros.form && <Alert tone="danger">{erros.form}</Alert>}

          <Field
            ref={tituloRef}
            label="Tema ou título"
            placeholder="Ex.: Normalização até à 3FN"
            maxLength={90}
            value={titulo}
            error={erros.titulo}
            autoCapitalize="sentences"
            onChange={(e) => setTitulo(e.target.value)}
          />

          <SelectField ref={cadeiraRef} label="Cadeira" value={cadeira} error={erros.cadeira} disabled={cadeiras.isPending} onChange={(e) => setCadeira(e.target.value)}>
            <option value="" disabled>{cadeiras.isPending ? "A carregar cadeiras…" : "Escolhe a cadeira"}</option>
            {cadeiras.data?.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.course}</option>)}
          </SelectField>

          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <label htmlFor="preparar-dificuldade" className="text-[0.8rem] font-bold tracking-[0.06em] uppercase">Onde tens mais dificuldade?</label>
              <span className="text-xs font-medium text-neutral-600">opcional</span>
            </div>
            <textarea
              id="preparar-dificuldade"
              rows={3}
              maxLength={280}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex.: não percebo a diferença entre 2FN e 3FN."
              className="w-full resize-none rounded-2xl bg-kombinu-surface px-4 py-3 text-base text-kombinu-ink outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-kombinu-blue focus:ring-inset"
            />
          </div>

          <FileDropzone ficheiro={ficheiro} onFicheiro={setFicheiro} erro={erros.ficheiro} onErro={(m) => setErros((x) => ({ ...x, ficheiro: m }))} />

          <p className="flex items-start gap-2 text-sm text-neutral-600">
            <ShieldIcon className="mt-0.5 size-4 shrink-0 text-kombinu-blue" />
            O ficheiro e o que gerarmos são privados. Só tu vês, a não ser que decidas publicar.
          </p>

          <PrimaryButton type="submit" loading={aEnviar} loadingText="A enviar o ficheiro…">
            <SparkIcon className="size-5" />
            Gerar com IA
          </PrimaryButton>
        </form>
      )}
    </FlowLayout>
  );
}
