import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { BottomSheet } from "@/components/fluxo/BottomSheet";
import { RadioCardGroup } from "@/components/fluxo/choice";
import { Alert, Spinner } from "@/components/fluxo/feedback";
import { ArrowRightIcon, ChatIcon, CheckIcon, CopyIcon, DownloadIcon, LockIcon, TicketIcon, UsersIcon, WalletIcon } from "@/components/fluxo/icons";
import { fade } from "@/components/fluxo/motion";
import { Field, PrimaryButton } from "../auth-novo/ui";
import { formatarTelefone, kz, mensagemDe, telefoneValido } from "../../lib/formatoFluxo";
import { fluxoService, type Order, type PassPlanId } from "../../services/fluxoService";

type Vista = "escolher" | "pagar" | "encarregado";
type EstadoPagamento = "formulario" | "a-aguardar" | "manual" | "pago";

type Props = {
  open: boolean;
  onClose: () => void;
  contentId: string;
  resumo: { title: string; subjectName: string; totalBlocks: number; totalQuestions: number; planDays: number };
  /** Esconde "Guardar e decidir depois" quando já se está em "As minhas preparações". */
  emPreparacoes?: boolean;
};

const BOTAO_SECUNDARIO =
  "flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-kombinu-surface px-6 py-3 font-display text-base font-bold text-kombinu-ink transition-transform duration-150 hover:bg-neutral-200 active:scale-[0.98] focus-ring";
const BOTAO_TEXTO = "mx-auto flex min-h-11 items-center rounded-md px-3 text-sm font-bold text-neutral-600 underline underline-offset-2 hover:text-kombinu-ink focus-ring";

/**
 * B5, folha de decisão: pagar o passe, pedir ao encarregado ou guardar. Só corre com os dados simulados:
 * os preços e os vouchers são de exemplo e o pagamento é fingido.
 */
export function FolhaDecisao({ open, onClose, contentId, resumo, emPreparacoes }: Props) {
  const navigate = useNavigate();
  const [vista, setVista] = useState<Vista>("escolher");
  const [plano, setPlano] = useState<PassPlanId>("subject");
  const [metodo, setMetodo] = useState<"express" | "voucher">("express");
  const [telefone, setTelefone] = useState("");
  const [voucher, setVoucher] = useState("");
  const [pedido, setPedido] = useState<Order>();
  const [estado, setEstado] = useState<EstadoPagamento>("formulario");
  const [ligacao, setLigacao] = useState<string>();
  const [copiado, setCopiado] = useState(false);
  const [aTrabalhar, setATrabalhar] = useState(false);
  const [erros, setErros] = useState<Partial<Record<"telefone" | "voucher" | "form", string>>>({});

  const planos = useQuery({ queryKey: ["fluxo", "planos"], queryFn: fluxoService.plans, enabled: open });
  const aAguardar = open && (estado === "a-aguardar" || estado === "manual");

  useEffect(() => {
    if (open) {
      setVista("escolher");
      setErros({});
    }
  }, [open]);

  // Confirmação do Multicaixa Express ou do voucher manual: consulta até o pedido ficar pago.
  const consulta = useQuery({
    queryKey: ["fluxo", "pedido", pedido?.id],
    queryFn: () => fluxoService.order(pedido!.id),
    enabled: aAguardar && Boolean(pedido),
    refetchInterval: 1500,
  });
  useEffect(() => {
    if (consulta.data?.status === "paid") {
      setPedido(consulta.data);
      setEstado("pago");
    }
  }, [consulta.data]);

  const escolhido = planos.data?.find((p) => p.id === plano);

  async function garantirPedido(planId: PassPlanId) {
    const o = await fluxoService.createOrder({ contentId, planId });
    setPedido(o);
    return o;
  }

  async function pagar(e: FormEvent) {
    e.preventDefault();
    if (metodo === "express" && !telefoneValido(telefone)) {
      setErros({ telefone: "Número Multicaixa Express com 9 dígitos." });
      return;
    }
    if (metodo === "voucher" && voucher.trim().length < 4) {
      setErros({ voucher: "Introduz o código impresso no voucher." });
      return;
    }
    setErros({});
    setATrabalhar(true);
    try {
      const o = await garantirPedido(plano);
      const r = metodo === "express" ? await fluxoService.payExpress(o.id, telefone) : await fluxoService.redeemVoucher(o.id, voucher.trim());
      setPedido(r);
      setEstado(r.status === "paid" ? "pago" : metodo === "voucher" ? "manual" : "a-aguardar");
    } catch (err) {
      setErros({ form: mensagemDe(err, "O pagamento não foi concluído. Não foi cobrado nada.") });
    } finally {
      setATrabalhar(false);
    }
  }

  async function pedirAoEncarregado() {
    setVista("encarregado");
    if (ligacao) return;
    setATrabalhar(true);
    setErros({});
    try {
      const o = pedido ?? (await garantirPedido("subject"));
      setLigacao((await fluxoService.guardianLink(o.id)).url);
    } catch (err) {
      setErros({ form: mensagemDe(err) });
    } finally {
      setATrabalhar(false);
    }
  }

  async function copiar() {
    if (!ligacao) return;
    try {
      await navigator.clipboard.writeText(ligacao);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* sem permissão para a área de transferência */
    }
  }

  function guardar() {
    onClose();
    navigate(`/v2/preparar/materiais?novo=${encodeURIComponent(contentId)}`);
  }

  const titulos: Record<Vista, string> = {
    escolher: "Desbloqueia o módulo completo",
    pagar: estado === "pago" ? "Pagamento confirmado" : "Pagar passe",
    encarregado: "Pedir ao encarregado",
  };
  const mensagem = ligacao
    ? `Olá! Preparei um material de estudo para a prova de ${resumo.subjectName} na Kombinu. Podes ajudar a desbloquear (${kz(pedido?.amountKz ?? 0)})? Pagas aqui em 1 toque, sem criar conta: ${ligacao}`
    : "";

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={titulos[vista]}
      dismissible={!aAguardar && !aTrabalhar}
      description={vista === "escolher" ? `${resumo.totalBlocks} blocos de sebenta, ${resumo.totalQuestions} perguntas e um plano de ${resumo.planDays} dias para «${resumo.title}».` : undefined}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={`${vista}-${estado}`} variants={fade} initial="initial" animate="enter" exit="exit" className="flex flex-col gap-4 pb-2">
          {erros.form && <Alert tone="danger">{erros.form}</Alert>}

          {vista === "escolher" && (
            <>
              <Caminho primario icone={<WalletIcon className="size-6" />} titulo="Pagar o passe agora" corpo="Multicaixa Express ou voucher da reprografia." onClick={() => setVista("pagar")} />
              <Caminho icone={<UsersIcon className="size-6" />} titulo="Pedir ao encarregado" corpo="Geramos um link para o teu encarregado pagar em 1 toque, sem criar conta." onClick={() => void pedirAoEncarregado()} />
              {!emPreparacoes && <Caminho icone={<DownloadIcon className="size-6" />} titulo="Guardar e decidir depois" corpo="Fica em «As minhas preparações»." onClick={guardar} />}
            </>
          )}

          {vista === "pagar" && estado === "formulario" && (
            <form onSubmit={pagar} noValidate className="flex flex-col gap-5">
              <RadioCardGroup
                legend="Escolhe o passe"
                value={plano}
                onChange={(v) => setPlano(v as PassPlanId)}
                options={(planos.data ?? []).map((p) => ({
                  value: p.id,
                  title: `${p.label} · ${kz(p.priceKz)}`,
                  description: p.exemplo ? `${p.detail}. Preço de exemplo.` : p.detail,
                }))}
              />

              <div role="group" aria-label="Método de pagamento" className="grid grid-cols-2 gap-1 rounded-2xl bg-kombinu-surface p-1">
                {(
                  [
                    ["express", "Multicaixa Express", WalletIcon],
                    ["voucher", "Voucher", TicketIcon],
                  ] as const
                ).map(([m, rotulo, Icone]) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={metodo === m}
                    onClick={() => {
                      setMetodo(m);
                      setErros({});
                    }}
                    className={`flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold focus-ring ${metodo === m ? "bg-white text-kombinu-blue shadow-sm" : "text-neutral-600"}`}
                  >
                    <Icone className="size-4" /> {rotulo}
                  </button>
                ))}
              </div>

              {metodo === "express" ? (
                <Field
                  label="Número Multicaixa Express"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="923 000 000"
                  value={formatarTelefone(telefone)}
                  error={erros.telefone}
                  leading={<span className="shrink-0 font-bold text-neutral-600">+244</span>}
                  onChange={(e) => {
                    setTelefone(e.target.value.replace(/\D/g, "").slice(0, 9));
                    setErros((x) => ({ ...x, telefone: undefined }));
                  }}
                />
              ) : (
                <Field
                  label="Código do voucher"
                  placeholder="KMB-XXXX"
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  value={voucher}
                  error={erros.voucher}
                  onChange={(e) => {
                    setVoucher(e.target.value.toUpperCase());
                    setErros((x) => ({ ...x, voucher: undefined }));
                  }}
                  hint="Modo de desenvolvimento: KMB-TESTE paga logo; KMB-MANUAL fica a aguardar confirmação."
                  leading={<TicketIcon className="size-5 shrink-0" />}
                />
              )}

              <p className="text-sm leading-relaxed text-neutral-600">
                O conteúdo fica disponível logo após a confirmação. Depois de o abrires ou começares um quiz, não há reembolso, salvo os casos da{" "}
                <a href="/termos#sec-6" target="_blank" rel="noreferrer" className="font-semibold text-kombinu-blue underline underline-offset-2">cláusula 6 dos Termos</a>.
              </p>
              <PrimaryButton type="submit" loading={aTrabalhar} loadingText="A iniciar pagamento…">
                {metodo === "express" ? `Pagar ${escolhido ? kz(escolhido.priceKz) : ""}` : "Usar voucher"}
              </PrimaryButton>
              <button type="button" onClick={() => setVista("escolher")} className={BOTAO_TEXTO}>Ver outras opções</button>
            </form>
          )}

          {vista === "pagar" && estado === "a-aguardar" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center" role="status">
              <span className="grid size-16 place-items-center rounded-full bg-kombinu-blue-soft text-kombinu-blue"><Spinner className="size-7" /></span>
              <p className="font-display text-lg font-bold">Confirma na app Multicaixa Express</p>
              <p className="max-w-[36ch] text-neutral-600">Enviámos um pedido de {kz(pedido?.amountKz ?? 0)} para +244 {formatarTelefone(telefone)}. Esta janela atualiza sozinha.</p>
            </div>
          )}

          {vista === "pagar" && estado === "manual" && (
            <div className="flex flex-col gap-4" role="status">
              <Alert tone="info" title="Voucher recebido">
                Estamos a confirmar o voucher manualmente. Podes fechar esta janela: o módulo desbloqueia quando for confirmado.
              </Alert>
              <button type="button" onClick={emPreparacoes ? onClose : guardar} className={BOTAO_SECUNDARIO}>
                {emPreparacoes ? "Fechar" : "Ir para As minhas preparações"}
              </button>
            </div>
          )}

          {vista === "pagar" && estado === "pago" && (
            <div className="flex flex-col items-center gap-4 py-2 text-center" role="status">
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.45, bounce: 0.25 }}
                className="grid size-16 place-items-center rounded-full bg-emerald-600 text-white"
              >
                <CheckIcon className="size-8" strokeWidth={3} />
              </motion.span>
              <p className="max-w-[36ch] text-neutral-600">A sebenta completa, o simulado e o plano de {resumo.planDays} dias já são teus.</p>
              <PrimaryButton
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/v2/preparar/modulo/${encodeURIComponent(contentId)}`);
                }}
              >
                Abrir o módulo completo
              </PrimaryButton>
            </div>
          )}

          {vista === "encarregado" && (
            <div className="flex flex-col gap-4">
              {aTrabalhar || !ligacao ? (
                <p className="flex items-center gap-2 py-6 text-neutral-600" role="status"><Spinner className="size-4" /> A criar o link…</p>
              ) : (
                <>
                  <p className="text-neutral-700">O teu encarregado vê o resumo do material e o valor ({kz(pedido?.amountKz ?? 0)}), e paga sem criar conta.</p>
                  <a href={`https://wa.me/?text=${encodeURIComponent(mensagem)}`} target="_blank" rel="noreferrer" className={BOTAO_SECUNDARIO}>
                    <ChatIcon className="size-5" /> Enviar no WhatsApp
                  </a>
                  <button type="button" onClick={() => void copiar()} className={BOTAO_SECUNDARIO}>
                    {copiado ? <CheckIcon className="size-5" /> : <CopyIcon className="size-5" />}
                    {copiado ? "Link copiado" : "Copiar link"}
                  </button>
                  <span className="sr-only" aria-live="polite">{copiado ? "Link copiado" : ""}</span>
                  {!emPreparacoes && <button type="button" onClick={guardar} className={BOTAO_TEXTO}>Guardar em As minhas preparações</button>}
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </BottomSheet>
  );
}

function Caminho({ icone, titulo, corpo, onClick, primario }: { icone: ReactNode; titulo: string; corpo: string; onClick: () => void; primario?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`group block w-full rounded-2xl pb-1 text-left focus-ring ${primario ? "bg-kombinu-blue-edge" : "bg-kombinu-edge"}`}>
      <span
        className={`flex items-center gap-4 rounded-2xl p-4 transition-transform duration-100 ease-out-strong group-active:translate-y-[3px] ${
          primario ? "bg-kombinu-blue text-white" : "bg-white ring-1 ring-black/5 ring-inset group-hover:bg-neutral-50"
        }`}
      >
        <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${primario ? "bg-white/15" : "bg-kombinu-surface text-kombinu-blue"}`}>{icone}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-bold">{titulo}</span>
          <span className={`mt-0.5 block text-sm leading-snug ${primario ? "text-white/85" : "text-neutral-600"}`}>{corpo}</span>
        </span>
        <ArrowRightIcon className="size-5 shrink-0 opacity-70" />
      </span>
    </button>
  );
}

/** Aviso do que o módulo completo traz a mais. Os números vêm da prévia, nunca fixos. */
export function ConteudoBloqueado({ blocos, perguntas }: { blocos: number; perguntas: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-neutral-300 p-4 text-neutral-600">
      <LockIcon className="size-5 shrink-0" />
      <p className="text-sm font-medium">
        Mais <strong className="text-kombinu-ink">{blocos} blocos</strong> e <strong className="text-kombinu-ink">{perguntas} perguntas</strong> no módulo completo. Desbloqueia ao pagar.
      </p>
    </div>
  );
}
