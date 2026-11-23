import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BottomSheet } from "@/components/fluxo/BottomSheet";
import { FlowLayout, ProgressBar } from "@/components/fluxo/flow";
import { Alert, Badge } from "@/components/fluxo/feedback";
import { CalendarIcon, ChevronDownIcon, ClockIcon, LockIcon, PlayIcon, ShieldIcon, StoreIcon } from "@/components/fluxo/icons";
import { ScreenTitle } from "@/components/fluxo/layout";
import { useAuth } from "../../contexts/AuthContext";
import { Field, PrimaryButton } from "../auth-novo/ui";
import { dataLonga, mensagemDe, toISODate } from "../../lib/formatoFluxo";
import { fluxoService, type FullModule } from "../../services/fluxoService";
import { FolhaDecisao } from "./FolhaDecisao";
import { BlocoDaSebenta } from "./BlocoDaSebenta";

const chavePlano = (id: string) => `kombinu.plan.${id}`;

/** B6: módulo completo (plano diário, simulado completo e sebenta modular) e submissão ao Marketplace. */
export default function B6Modulo() {
  const { id } = useParams();
  if (!id) return <Navigate to="/v2/preparar/materiais" replace />;
  return <Modulo id={id} />;
}

function Modulo({ id }: { id: string }) {
  const { usuario } = useAuth();
  const qc = useQueryClient();
  const modulo = useQuery({ queryKey: ["fluxo", "modulo", id], queryFn: () => fluxoService.module(id), retry: false });
  const [folha, setFolha] = useState(false);
  const [declaracao, setDeclaracao] = useState(false);
  const [feitos, setFeitos] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(chavePlano(id)) ?? "[]") as number[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chavePlano(id), JSON.stringify(feitos));
    } catch {
      /* sem armazenamento: o progresso só vale nesta sessão */
    }
  }, [feitos, id]);

  const m = modulo.data;
  const hoje = toISODate(new Date());
  const alternar = (dia: number) => setFeitos((d) => (d.includes(dia) ? d.filter((x) => x !== dia) : [...d, dia]));
  // Quem pode vender: criadores e professores (a mesma regra do estúdio).
  const podeVender = usuario?.tipo === "criador" || usuario?.tipo === "admin" || (usuario?.memberships ?? []).some((x) => x.papel === "teacher" || x.papel === "admin");

  return (
    <FlowLayout width="wide" back={{ href: "/v2/preparar/materiais", label: "Voltar a As minhas preparações" }}>
      {modulo.isError && <Alert tone="danger" title="Não encontramos este material">Pode ter sido preparado noutro dispositivo.</Alert>}
      {modulo.isPending && <span className="block h-48 animate-pulse rounded-2xl bg-kombinu-surface" aria-busy="true" />}

      {m && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blue">{m.subjectName}</Badge>
            {m.status === "pending_review" && <Badge tone="yellow" icon={<ClockIcon className="size-3.5" />}>Pendente de revisão</Badge>}
          </div>
          <div className="mt-3"><ScreenTitle>{m.title}</ScreenTitle></div>

          {m.status === "locked" || m.status === "preparing" || m.status === "failed" ? (
            <div className="mt-8 flex flex-col gap-4 rounded-[28px] bg-kombinu-surface p-6 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-white text-kombinu-blue"><LockIcon className="size-6" /></span>
              <p className="font-display text-lg font-bold">Desbloqueia ao pagar</p>
              <p className="mx-auto max-w-[40ch] text-neutral-600">A prévia continua jogável. O módulo completo abre assim que o pagamento for confirmado.</p>
              <div className="mx-auto w-full max-w-xs"><PrimaryButton type="button" onClick={() => setFolha(true)}>Ver opções</PrimaryButton></div>
              <FolhaDecisao
                open={folha}
                emPreparacoes
                onClose={() => {
                  setFolha(false);
                  void qc.invalidateQueries({ queryKey: ["fluxo", "modulo", id] });
                }}
                contentId={m.id}
                resumo={{ title: m.title, subjectName: m.subjectName, totalBlocks: m.blocks.length, totalQuestions: m.questions.length, planDays: m.plan.length }}
              />
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-10">
              <section aria-labelledby="plano-h">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <h2 id="plano-h" className="flex items-center gap-2 font-display text-xl font-bold">
                    <CalendarIcon className="size-5 text-kombinu-blue" /> Plano de {m.plan.length} dias
                  </h2>
                  <span className="text-sm font-semibold text-neutral-600 tabular-nums">{feitos.length}/{m.plan.length}</span>
                </div>
                <ProgressBar value={(feitos.length / m.plan.length) * 100} label="Progresso do plano" />
                <ol className="mt-4 grid gap-2">
                  {m.plan.map((d) => {
                    const eHoje = d.date === hoje;
                    const feito = feitos.includes(d.day);
                    return (
                      <li key={d.day} className={`rounded-2xl px-4 py-3 ${eHoje ? "bg-kombinu-blue-soft ring-2 ring-kombinu-blue ring-inset" : "bg-kombinu-surface"}`}>
                        <label className="flex cursor-pointer items-start gap-3">
                          <input type="checkbox" checked={feito} onChange={() => alternar(d.day)} className="mt-0.5 size-5 shrink-0 cursor-pointer accent-kombinu-blue" />
                          <span>
                            <span className={`block font-semibold ${feito ? "text-neutral-500 line-through" : "text-kombinu-ink"}`}>
                              Dia {d.day} · {eHoje ? "Hoje" : dataLonga(d.date)}
                            </span>
                            <span className="block text-neutral-600">{d.task}</span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ol>
              </section>

              <section className="flex flex-col gap-4 rounded-[28px] bg-kombinu-blue p-6 text-white sm:flex-row sm:items-center">
                <div className="flex-1">
                  <h2 className="font-display text-xl font-bold">Simulado completo</h2>
                  <p className="mt-1 text-white/85">{m.questions.length} perguntas sobre toda a tua matéria, com explicação de cada resposta.</p>
                </div>
                <Link to={`/v2/preparar/simulado/${encodeURIComponent(m.id)}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-kombinu-yellow px-6 font-display font-bold text-kombinu-ink focus-ring">
                  <PlayIcon className="size-4" /> Começar
                </Link>
              </section>

              <section aria-labelledby="seb-h">
                <h2 id="seb-h" className="mb-3 font-display text-xl font-bold">Sebenta modular</h2>
                <div className="grid gap-3">
                  {m.blocks.map((b, i) => (
                    <details key={b.id} open={i === 0} className="group rounded-2xl ring-1 ring-neutral-200 ring-inset [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-2xl px-4 font-display font-bold focus-ring">
                        <span className="flex-1">{b.title}</span>
                        <ChevronDownIcon className="size-5 shrink-0 text-neutral-500 transition-transform duration-200 ease-out-strong group-open:rotate-180" />
                      </summary>
                      <div className="px-2 pb-2 sm:px-3 sm:pb-3"><BlocoDaSebenta bloco={b} /></div>
                    </details>
                  ))}
                </div>
              </section>

              {podeVender && m.status === "unlocked" && (
                <section className="rounded-[28px] bg-kombinu-surface p-6">
                  <h2 className="flex items-center gap-2 font-display text-lg font-bold"><StoreIcon className="size-5 text-kombinu-blue" /> Vender no Marketplace</h2>
                  <p className="mt-2 max-w-[56ch] text-neutral-700">Este material é privado. Se o resumo for teu, podes submetê-lo. A equipa revê e define o preço antes de ficar público.</p>
                  <button type="button" onClick={() => setDeclaracao(true)} className="mt-4 inline-flex min-h-12 items-center rounded-2xl bg-white px-6 font-display font-bold ring-1 ring-neutral-200 ring-inset hover:bg-neutral-50 focus-ring">
                    Submeter para revisão
                  </button>
                </section>
              )}
              {m.status === "pending_review" && (
                <Alert tone="info" icon={<ClockIcon className="size-4" />} title="Em revisão">
                  Recebemos a tua declaração de autoria. O material continua privado até ser aprovado e ter preço definido.
                </Alert>
              )}
            </div>
          )}

          <DeclaracaoDeAutoria
            open={declaracao}
            onClose={() => setDeclaracao(false)}
            contentId={m.id}
            nomeInicial={usuario?.nome ?? ""}
            aoSubmeter={(novo: FullModule) => qc.setQueryData(["fluxo", "modulo", id], novo)}
          />
        </>
      )}
    </FlowLayout>
  );
}

function DeclaracaoDeAutoria({ open, onClose, contentId, nomeInicial, aoSubmeter }: { open: boolean; onClose: () => void; contentId: string; nomeInicial: string; aoSubmeter: (m: FullModule) => void }) {
  const [nome, setNome] = useState(nomeInicial);
  const [autor, setAutor] = useState(false);
  const [semTerceiros, setSemTerceiros] = useState(false);
  const [erros, setErros] = useState<Partial<Record<"nome" | "autor" | "semTerceiros" | "form", string>>>({});
  const [aEnviar, setAEnviar] = useState(false);

  async function submeter(e: FormEvent) {
    e.preventDefault();
    const novos: typeof erros = {};
    if (nome.trim().split(/\s+/).filter(Boolean).length < 2) novos.nome = "Escreve o teu nome completo.";
    if (!autor) novos.autor = "Tens de confirmar que és o autor.";
    if (!semTerceiros) novos.semTerceiros = "Tens de confirmar que não incluis conteúdo de terceiros sem autorização.";
    setErros(novos);
    if (Object.keys(novos).length) return;
    setAEnviar(true);
    try {
      aoSubmeter(await fluxoService.submitToMarketplace(contentId, { fullName: nome.trim(), isAuthor: true, noThirdPartyCopyright: true }));
      onClose();
    } catch (err) {
      setErros({ form: mensagemDe(err) });
    } finally {
      setAEnviar(false);
    }
  }

  const caixa = "mt-0.5 size-5 shrink-0 cursor-pointer accent-kombinu-blue";
  return (
    <BottomSheet open={open} onClose={onClose} title="Declaração de autoria" description="Lei n.º 15/14 — Direitos de Autor e Conexos" dismissible={!aEnviar}>
      <form onSubmit={submeter} noValidate className="flex flex-col gap-5 pb-2">
        {erros.form && <Alert tone="danger">{erros.form}</Alert>}
        <Field label="Nome completo" autoComplete="name" value={nome} error={erros.nome} onChange={(e) => setNome(e.target.value)} />
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed font-medium text-neutral-700">
            <input type="checkbox" checked={autor} onChange={(e) => setAutor(e.target.checked)} className={caixa} />
            <span>Declaro que sou o autor deste resumo e que o organizei a partir do meu estudo.</span>
          </label>
          {erros.autor && <p className="mt-2 text-sm font-medium text-red-700">{erros.autor}</p>}
        </div>
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed font-medium text-neutral-700">
            <input type="checkbox" checked={semTerceiros} onChange={(e) => setSemTerceiros(e.target.checked)} className={caixa} />
            <span>Não inclui partes copiadas de livros, slides ou sebentas de outras pessoas sem autorização.</span>
          </label>
          {erros.semTerceiros && <p className="mt-2 text-sm font-medium text-red-700">{erros.semTerceiros}</p>}
        </div>
        <p className="flex items-start gap-2 text-sm text-neutral-600">
          <ShieldIcon className="mt-0.5 size-4 shrink-0" />
          <span>
            Fica «Pendente» até a equipa rever e definir o preço. Só depois fica público. Ficas com 70% de cada venda.{" "}
            <a href="/termos#sec-8" target="_blank" rel="noreferrer" className="font-semibold text-kombinu-blue underline underline-offset-2">Lê a cláusula 8 dos Termos</a>.
          </span>
        </p>
        <PrimaryButton type="submit" loading={aEnviar} loadingText="A submeter…">Assinar e submeter</PrimaryButton>
      </form>
    </BottomSheet>
  );
}
