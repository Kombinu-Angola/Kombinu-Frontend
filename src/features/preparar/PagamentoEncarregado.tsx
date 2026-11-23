import { useState, type FormEvent, type ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Spinner } from "@/components/fluxo/feedback";
import { BookIcon, CalendarIcon, CheckIcon, ShieldIcon, TargetIcon } from "@/components/fluxo/icons";
import { Logo } from "@/components/fluxo/layout";
import { FLUXO_MOCKS } from "../../lib/fluxoFlags";
import { Field, PrimaryButton } from "../auth-novo/ui";
import { formatarTelefone, kz, mensagemDe, telefoneValido } from "../../lib/formatoFluxo";
import { fluxoService } from "../../services/fluxoService";

/**
 * Link público do encarregado (sem login): resumo claro do material e pagar em 1 toque.
 * Só existe com os dados simulados; o `token` é o identificador do pedido.
 */
export default function PagamentoEncarregado() {
  const { token } = useParams();
  if (!token || !FLUXO_MOCKS) return <Navigate to="/" replace />;
  return <Pagina token={token} />;
}

function Pagina({ token }: { token: string }) {
  const qc = useQueryClient();
  const chave = ["fluxo", "encarregado", token];
  const vista = useQuery({
    queryKey: chave,
    queryFn: () => fluxoService.guardianOrder(token),
    retry: false,
    refetchInterval: (q) => (q.state.data?.status === "awaiting_confirmation" ? 1500 : false),
  });
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState<string>();
  const [aPagar, setAPagar] = useState(false);

  async function pagar(e: FormEvent) {
    e.preventDefault();
    if (!telefoneValido(telefone)) {
      setErro("Número Multicaixa Express com 9 dígitos.");
      return;
    }
    setErro(undefined);
    setAPagar(true);
    try {
      qc.setQueryData(chave, await fluxoService.guardianPay(token, telefone));
    } catch (err) {
      setErro(mensagemDe(err, "O pagamento não foi concluído. Não foi cobrado nada."));
    } finally {
      setAPagar(false);
    }
  }

  const v = vista.data;
  const erroDoTelefone = erro?.startsWith("Número") ? erro : undefined;

  return (
    <main className="min-h-dvh bg-kombinu-surface">
      <div className="mx-auto w-full max-w-[480px] px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-10">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <p className="mb-4 rounded-xl bg-kombinu-yellow-soft px-3 py-2 text-sm font-medium text-neutral-700">
          Modo de desenvolvimento: este pagamento é simulado e não cobra nada.
        </p>
        {vista.isError && <Alert tone="danger" title="Link indisponível">Este link expirou ou não existe.</Alert>}
        {vista.isPending && <span className="block h-96 animate-pulse rounded-[28px] bg-white" aria-busy="true" />}

        {v && (
          <div className="rounded-[28px] bg-white p-6 shadow-[0_6px_0_0_var(--color-kombinu-edge)]">
            {v.status === "paid" ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center" role="status">
                <span className="grid size-16 place-items-center rounded-full bg-emerald-600 text-white"><CheckIcon className="size-8" strokeWidth={3} /></span>
                <h1 className="font-display text-2xl font-bold">Obrigado!</h1>
                <p className="text-neutral-700">{v.studentFirstName} já tem acesso ao material de {v.subjectName}.</p>
              </div>
            ) : v.status === "expired" ? (
              <Alert tone="warning" title="Este pedido expirou">Pede ao teu educando para enviar um novo link.</Alert>
            ) : (
              <div className="flex flex-col gap-6">
                <header>
                  <h1 className="font-display text-2xl leading-tight font-bold text-balance">{v.studentFirstName} pediu ajuda para a prova de {v.subjectName}</h1>
                  <p className="mt-2 text-neutral-600">Material de estudo preparado a partir da matéria da faculdade: «{v.materialTitle}».</p>
                </header>

                <ul className="grid gap-2">
                  <Item icone={<BookIcon className="size-5" />}>{v.blocks} blocos de resumo</Item>
                  <Item icone={<TargetIcon className="size-5" />}>{v.questions} perguntas de simulado com explicação</Item>
                  <Item icone={<CalendarIcon className="size-5" />}>Plano de estudo de {v.planDays} dias até à prova</Item>
                </ul>

                <div className="flex items-baseline justify-between border-t border-neutral-100 pt-5">
                  <span className="text-neutral-600">Total</span>
                  <span className="font-display text-3xl font-extrabold">{kz(v.amountKz)}</span>
                </div>

                {v.status === "awaiting_confirmation" ? (
                  <div role="status" className="flex items-center gap-3 rounded-2xl bg-kombinu-blue-soft p-4 font-medium text-kombinu-blue-dark">
                    <Spinner className="size-5" /> Confirma o pagamento na app Multicaixa Express.
                  </div>
                ) : (
                  <form onSubmit={pagar} noValidate className="flex flex-col gap-4">
                    {erro && !erroDoTelefone && <Alert tone="danger">{erro}</Alert>}
                    <Field
                      label="Número Multicaixa Express"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="923 000 000"
                      value={formatarTelefone(telefone)}
                      error={erroDoTelefone}
                      leading={<span className="shrink-0 font-bold text-neutral-600">+244</span>}
                      onChange={(e) => {
                        setTelefone(e.target.value.replace(/\D/g, "").slice(0, 9));
                        setErro(undefined);
                      }}
                    />
                    <PrimaryButton type="submit" loading={aPagar} loadingText="A enviar pedido…">Pagar {kz(v.amountKz)}</PrimaryButton>
                  </form>
                )}
                <p className="flex items-start gap-2 text-sm text-neutral-600">
                  <ShieldIcon className="mt-0.5 size-4 shrink-0" /> Não precisas de criar conta. Só pagas depois de confirmar na tua app.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function Item({ icone, children }: { icone: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-kombinu-surface px-4 py-3 font-medium">
      <span className="text-kombinu-blue">{icone}</span>
      {children}
    </li>
  );
}
