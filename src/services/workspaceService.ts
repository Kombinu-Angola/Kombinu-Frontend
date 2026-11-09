import { queryClient } from "@/lib/queryClient";
import { useWorkspaceStore, WORKSPACE_MARKETPLACE } from "@/stores/workspaceStore";
import type { Membership } from "@/types";

/**
 * Ponto de extensão da conversão B2B -> B2C (backlog B4): executado ao passar de um
 * workspace escolar para o marketplace, antes de a troca ser aplicada. Fica vazio até
 * o backend publicar o endpoint; quando existir, chamá-lo aqui, via `api`.
 */
async function aoTrocarParaMarketplace(): Promise<void> {
  return;
}

export const workspaceService = {
  /** Memberships e workspace activo, sem logout. */
  obterEstado() {
    const { ativo, memberships } = useWorkspaceStore.getState();
    return { ativo, memberships };
  },

  sincronizarMemberships(memberships: Membership[]): void {
    useWorkspaceStore.getState().definirMemberships(memberships);
  },

  /** Troca de workspace sem novo login; invalida os dados em cache do contexto anterior. */
  async trocar(id: string): Promise<void> {
    const { ativo } = useWorkspaceStore.getState();
    if (id === ativo) return;
    if (id === WORKSPACE_MARKETPLACE) await aoTrocarParaMarketplace();
    useWorkspaceStore.getState().definirAtivo(id);
    await queryClient.invalidateQueries();
  },

  /** Logout: esquece o workspace e todos os dados em cache. */
  limpar(): void {
    useWorkspaceStore.getState().limpar();
    queryClient.clear();
  },
};
