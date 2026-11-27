import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { FLUXO_MOCKS } from "../lib/fluxoFlags";
import { materialService, type Material } from "../services/materialService";
import { perfilService } from "../services/perfilService";
import { trilhaService, type Trilha } from "../services/trilhaService";
import { useWorkspaceStore } from "../stores/workspaceStore";

export interface DoMeuCurso {
  cadeira: { id: number; nome: string };
  curso: string;
  trilhas: Trilha[];
  simulados: Material[];
}

/**
 * Painel «Do meu curso»: trilhas e simulados da cadeira em foco do estudante (`cadeira_foco` do `/api/me/`),
 * filtrados por `?cadeira=` dentro do workspace activo. Sem cadeira em foco devolve `null` (o painel não mostra a secção).
 * Em modo simulado (`VITE_FLUXO_MOCKS`) fica desligado: os ids das cadeiras de exemplo não existem na API.
 */
export function useDoMeuCurso() {
  const { usuario } = useAuth();
  const uid = usuario?.id ?? "";
  const workspace = useWorkspaceStore((s) => s.ativo);
  // Mesma chave do V2Layout: o perfil já vem da cache e é partilhado com o onboarding.
  const perfil = useQuery({ queryKey: ["perfil", uid], queryFn: () => perfilService.obter(uid), retry: false, enabled: usuario !== null && !FLUXO_MOCKS });
  const cadeira = perfil.data?.cadeiraFoco ?? null;

  return useQuery({
    queryKey: ["painel", workspace, uid, "do-meu-curso", cadeira?.id ?? null],
    enabled: cadeira !== null,
    queryFn: async (): Promise<DoMeuCurso> => {
      const foco = cadeira as NonNullable<typeof cadeira>;
      const [trilhas, simulados] = await Promise.all([
        trilhaService.listarTrilhas(foco.id),
        materialService.listar({ cadeira: foco.id, comQuiz: true }, 1),
      ]);
      return { cadeira: foco, curso: perfil.data?.curso ?? "", trilhas, simulados: simulados.itens };
    },
  });
}
