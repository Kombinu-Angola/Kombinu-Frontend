import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { BoltIcon, CheckIcon, CompassIcon, FlameIcon, TargetIcon } from "@/components/fluxo/icons";
import { ScreenTitle } from "@/components/fluxo/layout";
import { useGamificacaoMe } from "../../hooks/useV2Dados";
import { perfilService, type PerfilEstudante } from "../../services/perfilService";

function Estatistica({ icone, rotulo, valor }: { icone: ReactNode; rotulo: string; valor: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-kombinu-surface px-4 py-5 text-center">
      <span className="text-kombinu-blue">{icone}</span>
      <span className="font-display text-2xl font-extrabold tabular-nums">{valor}</span>
      <span className="text-sm font-medium text-neutral-600">{rotulo}</span>
    </div>
  );
}

/**
 * Ecrã final: tudo pronto. XP e ofensiva vêm da API (a zero num utilizador novo, nunca inventados);
 * o primeiro passo é a trilha da cadeira escolhida ou, sem trilha, um simulado dela.
 */
export function Pronto({ perfil }: { perfil: PerfilEstudante | undefined }) {
  const gamificacao = useGamificacaoMe();
  const cadeiraId = perfil?.cadeiraFoco?.id ?? null;
  const passo = useQuery({
    queryKey: ["onboarding", "primeiro-passo", cadeiraId],
    queryFn: () => perfilService.primeiroPasso(cadeiraId as number),
    enabled: cadeiraId !== null,
  });
  const ano = perfil?.anoEntrada ?? new Date().getFullYear();
  return (
    <>
      <ScreenTitle align="center" subtitle="O teu perfil está activo. Já podes estudar.">Está tudo pronto</ScreenTitle>

      <div className="mt-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-kombinu-yellow px-4 py-2 font-display font-bold text-kombinu-ink">
          <TargetIcon className="size-5" />
          Caloiro {ano}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Estatistica icone={<BoltIcon className="size-6" />} rotulo="XP" valor={gamificacao.data ? String(gamificacao.data.xpTotal) : "—"} />
        <Estatistica
          icone={<FlameIcon className="size-6" />}
          rotulo={gamificacao.data?.ofensiva === 1 ? "dia de ofensiva" : "dias de ofensiva"}
          valor={gamificacao.data ? String(gamificacao.data.ofensiva) : "—"}
        />
      </div>

      <section aria-labelledby="primeiro-passo" className="mt-8 rounded-[28px] bg-kombinu-surface p-5">
        <h2 id="primeiro-passo" className="text-[0.8rem] font-bold tracking-[0.06em] uppercase">
          O teu primeiro passo
        </h2>
        {cadeiraId === null ? (
          <p className="mt-2 flex items-start gap-3 leading-relaxed text-neutral-700">
            <CompassIcon className="mt-0.5 size-5 shrink-0 text-kombinu-blue" />
            Ainda não escolheste a cadeira. Começa por explorar os simulados do teu curso.
          </p>
        ) : passo.isPending ? (
          <p role="status" className="mt-2 text-neutral-600">A procurar a tua primeira trilha…</p>
        ) : passo.data ? (
          <p className="mt-2 flex items-start gap-3 leading-relaxed text-neutral-700">
            <CheckIcon className="mt-0.5 size-5 shrink-0 text-kombinu-blue" />
            <span>
              <span className="block font-display font-bold">{passo.data.titulo}</span>
              <span className="block text-sm text-neutral-600">
                {passo.data.tipo === "trilha" ? "Trilha da tua cadeira" : "Simulado da tua cadeira"}
                {passo.data.exemplo && " · exemplo do modo de desenvolvimento"}
              </span>
            </span>
          </p>
        ) : (
          <p className="mt-2 flex items-start gap-3 leading-relaxed text-neutral-700">
            <CompassIcon className="mt-0.5 size-5 shrink-0 text-kombinu-blue" />
            Ainda não há trilha para {perfil?.cadeiraFoco?.nome ?? "esta cadeira"}. Começa por explorar os simulados.
          </p>
        )}
      </section>
    </>
  );
}
