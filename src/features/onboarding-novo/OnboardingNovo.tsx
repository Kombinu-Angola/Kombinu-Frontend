import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FlowLayout } from "@/components/fluxo/flow";
import { useAuth } from "../../contexts/AuthContext";
import { destinoPorPapel } from "../../lib/destinoPosLogin";
import { FLUXO_MOCKS, ONBOARDING_ACTIVO } from "../../lib/fluxoFlags";
import { perfilService, type PerfilPatch } from "../../services/perfilService";
import { PrimaryButton } from "../auth-novo/ui";
import { PassoAno, PassoIntencao, PassoOnde, PassoTempo } from "./Passos";
import { RASCUNHO_VAZIO, type Rascunho } from "./rascunho";
import { Pronto } from "./Pronto";

type Passo = "intencao" | "onde" | "ano" | "tempo" | "pronto";
const ORDEM: Passo[] = ["intencao", "onde", "ano", "tempo", "pronto"];
const PROGRESSO: Record<Passo, number> = { intencao: 8, onde: 35, ano: 60, tempo: 85, pronto: 100 };

/** Rota `/v2/onboarding`: só existe quando o onboarding novo está activo (mocks em dev ou `VITE_ONBOARDING_API`). */
export default function OnboardingNovo() {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (!ONBOARDING_ACTIVO) return <Navigate to={destinoPorPapel(usuario)} replace />;
  return <Fluxo uid={usuario.id} destino={destinoPorPapel(usuario)} />;
}

function Fluxo({ uid, destino }: { uid: string; destino: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [passo, setPasso] = useState<Passo>("intencao");
  const [r, setR] = useState<Rascunho>(RASCUNHO_VAZIO);
  const [aviso, setAviso] = useState<string | null>(null);
  const [aTerminar, setATerminar] = useState(false);

  const perfil = useQuery({ queryKey: ["perfil", uid], queryFn: () => perfilService.obter(uid) });
  const instituicoes = useQuery({ queryKey: ["instituicoes"], queryFn: perfilService.instituicoes });

  // Retoma respostas anteriores (quem volta ao onboarding não recomeça do zero).
  useEffect(() => {
    const p = perfil.data;
    if (!p) return;
    setR((a) => ({
      intencao: a.intencao ?? p.intent,
      instituicao: a.instituicao || (p.instituicao ? String(p.instituicao.id) : p.instituicaoOutra ? "outra" : ""),
      instituicaoOutra: a.instituicaoOutra || p.instituicaoOutra,
      provincia: a.provincia || p.provincia,
      curso: a.curso || p.curso,
      ano: a.ano || (p.ano ? String(p.ano) : ""),
      cadeira: a.cadeira || (p.cadeiraFoco ? String(p.cadeiraFoco.id) : ""),
      minutos: a.minutos ?? p.minutosPorDia,
    }));
  }, [perfil.data]);

  const mudar = (patch: Partial<Rascunho>) => setR((a) => ({ ...a, ...patch }));

  /** Guarda sem bloquear: se a gravação falhar, o utilizador continua e tentamos de novo no fim. */
  function guardar(patch: PerfilPatch) {
    setAviso(null);
    perfilService
      .actualizar(uid, patch)
      .then((p) => qc.setQueryData(["perfil", uid], p))
      .catch(() => setAviso("Não conseguimos guardar este passo agora. Podes continuar; tentamos de novo no fim."));
  }

  const irPara = (p: Passo) => setPasso(p);
  const seguinte = () => irPara(ORDEM[Math.min(ORDEM.indexOf(passo) + 1, ORDEM.length - 1)]);
  const anterior = () => irPara(ORDEM[Math.max(ORDEM.indexOf(passo) - 1, 0)]);

  function continuar() {
    if (passo === "onde") {
      const idInst = r.instituicao && r.instituicao !== "outra" ? Number(r.instituicao) : null;
      guardar({
        instituicaoId: idInst,
        instituicaoOutra: r.instituicao === "outra" ? r.instituicaoOutra.trim() : "",
        ...(r.instituicao === "outra" && r.provincia ? { provincia: r.provincia } : {}),
        curso: r.curso.trim(),
      });
    } else if (passo === "ano") {
      guardar({ ano: r.ano ? Number(r.ano) : null, cadeiraFocoId: r.cadeira ? Number(r.cadeira) : null });
    } else if (passo === "tempo" && r.minutos) {
      guardar({ minutosPorDia: r.minutos });
    }
    seguinte();
  }

  async function terminar(para: string) {
    setATerminar(true);
    try {
      const concluido = await perfilService.actualizar(uid, { concluir: true });
      // Cache actualizada antes de navegar: senão a guarda do painel ainda vê o onboarding por concluir.
      qc.setQueryData(["perfil", uid], concluido);
      navigate(para, { replace: true });
    } catch {
      setAviso("Não conseguimos concluir agora. Tenta outra vez.");
      setATerminar(false);
    }
  }

  const escolherIntencao = (i: NonNullable<Rascunho["intencao"]>) => {
    mudar({ intencao: i });
    guardar({ intent: i });
    seguinte();
  };

  const nomePasso: Record<Passo, string> = {
    intencao: "Passo 1 de 5", onde: "Passo 2 de 5", ano: "Passo 3 de 5", tempo: "Passo 4 de 5", pronto: "Passo 5 de 5",
  };

  const rodape =
    passo === "intencao" ? undefined : passo === "pronto" ? (
      <div className="flex flex-col gap-2">
        <PrimaryButton type="button" loading={aTerminar} loadingText="A abrir o painel…" onClick={() => void terminar(destino)}>
          Ir para o painel
        </PrimaryButton>
      </div>
    ) : (
      <div className="flex flex-col gap-1">
        <PrimaryButton type="button" onClick={continuar}>Continuar</PrimaryButton>
        <button type="button" onClick={seguinte} className="mx-auto flex min-h-11 items-center rounded-md px-3 text-sm font-bold text-neutral-600 underline underline-offset-2 hover:text-kombinu-ink focus-ring">
          Saltar este passo
        </button>
      </div>
    );

  return (
    <FlowLayout
      back={passo === "intencao" ? undefined : { onClick: anterior, label: "Passo anterior" }}
      progress={{ value: PROGRESSO[passo], label: nomePasso[passo] }}
      footer={rodape}
    >
      {FLUXO_MOCKS && (
        <p className="mb-4 rounded-xl bg-kombinu-yellow-soft px-3 py-2 text-sm font-medium text-neutral-700">
          Modo de desenvolvimento: instituições, cadeiras e a primeira trilha são dados de exemplo.
        </p>
      )}
      {aviso && <p role="alert" className="mb-4 rounded-xl bg-kombinu-danger-soft px-3 py-2 text-sm font-medium text-kombinu-danger">{aviso}</p>}
      <div key={passo} className="motion-safe:animate-panel-in">
        {passo === "intencao" && <PassoIntencao onEscolher={escolherIntencao} onDepois={() => void terminar(destino)} />}
        {passo === "onde" && <PassoOnde r={r} mudar={mudar} instituicoes={instituicoes.data ?? []} />}
        {passo === "ano" && <PassoAno r={r} mudar={mudar} />}
        {passo === "tempo" && <PassoTempo r={r} mudar={mudar} />}
        {passo === "pronto" && <Pronto perfil={perfil.data} />}
      </div>
    </FlowLayout>
  );
}
