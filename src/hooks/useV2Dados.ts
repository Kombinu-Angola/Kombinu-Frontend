import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { materialService, type FiltrosMateriais } from "../services/materialService";
import { painelService } from "../services/painelService";
import { quizService } from "../services/quizService";
import { useWorkspaceStore } from "../stores/workspaceStore";

/** Todas as chaves incluem o workspace: dados de um contexto nunca se reutilizam noutro. */
function useContexto() {
  const { usuario } = useAuth();
  const workspace = useWorkspaceStore((s) => s.ativo);
  return { workspace, activo: usuario !== null, utilizadorId: usuario?.id ?? "" };
}

export function useEstatisticasAprendiz() {
  const { workspace, activo, utilizadorId } = useContexto();
  return useQuery({
    queryKey: ["painel", workspace, utilizadorId, "aprendiz"],
    queryFn: painelService.estatisticasAprendiz,
    enabled: activo,
  });
}

export function useCursosAprendiz() {
  const { workspace, activo, utilizadorId } = useContexto();
  return useQuery({
    queryKey: ["painel", workspace, utilizadorId, "cursos"],
    queryFn: painelService.cursosAprendiz,
    enabled: activo,
  });
}

export function useEstatisticasCriador() {
  const { workspace, activo, utilizadorId } = useContexto();
  return useQuery({
    queryKey: ["painel", workspace, utilizadorId, "criador"],
    queryFn: painelService.estatisticasCriador,
    enabled: activo,
  });
}

export function useListaMateriais(filtros: FiltrosMateriais) {
  const { workspace, activo } = useContexto();
  return useInfiniteQuery({
    queryKey: ["materiais", workspace, "lista", filtros],
    queryFn: ({ pageParam }) => materialService.listar(filtros, pageParam),
    initialPageParam: 1,
    getNextPageParam: (ultima) => ultima.proxima,
    enabled: activo,
  });
}

export function useMaterial(id: string | null | undefined) {
  const { workspace, activo } = useContexto();
  return useQuery({
    queryKey: ["materiais", workspace, "detalhe", id ?? ""],
    queryFn: () => materialService.obter(id as string),
    enabled: activo && Boolean(id),
    retry: false,
  });
}

export function useSimulado(id: string | null | undefined) {
  const { workspace, activo } = useContexto();
  return useQuery({
    queryKey: ["simulados", workspace, id ?? ""],
    queryFn: () => quizService.getQuiz(id as string),
    enabled: activo && Boolean(id),
    retry: false,
  });
}
