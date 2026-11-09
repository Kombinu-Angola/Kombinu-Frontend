import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { notificationService } from "../services/notificationService";
import { useWorkspaceStore } from "../stores/workspaceStore";

/** Intervalo do polling do contador (o backend limita a 60 pedidos/min). */
const INTERVALO_CONTADOR_MS = 60_000;

/** As chaves incluem o workspace: notificações do marketplace nunca se misturam com as da escola. */
const chaves = {
  contador: (workspace: string) => ["notificacoes", workspace, "contador"] as const,
  lista: (workspace: string) => ["notificacoes", workspace, "lista"] as const,
};

/** Contador de não lidas do contexto activo. O polling só corre com o separador visível. */
export function useContadorNaoLidas() {
  const { usuario } = useAuth();
  const workspace = useWorkspaceStore((s) => s.ativo);

  return useQuery({
    queryKey: chaves.contador(workspace),
    queryFn: notificationService.contarNaoLidas,
    enabled: usuario !== null,
    refetchInterval: INTERVALO_CONTADOR_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: INTERVALO_CONTADOR_MS / 2,
  });
}

/** Lista paginada (20 por página) das notificações do contexto activo, da mais recente para a mais antiga. */
export function useListaNotificacoes() {
  const { usuario } = useAuth();
  const workspace = useWorkspaceStore((s) => s.ativo);

  return useInfiniteQuery({
    queryKey: chaves.lista(workspace),
    queryFn: ({ pageParam }) => notificationService.listar(pageParam),
    initialPageParam: 1,
    getNextPageParam: (ultima) => ultima.proxima,
    enabled: usuario !== null,
  });
}

/** Acções de leitura; actualizam o contador e a lista do contexto activo. */
export function useAccoesNotificacoes() {
  const queryClient = useQueryClient();
  const workspace = useWorkspaceStore((s) => s.ativo);

  const refrescar = () => queryClient.invalidateQueries({ queryKey: ["notificacoes", workspace] });

  return {
    marcarLida: async (id: string) => {
      await notificationService.marcarLida(id);
      await refrescar();
    },
    marcarTodasLidas: async () => {
      await notificationService.marcarTodasLidas();
      await refrescar();
    },
  };
}
