import { queryClient } from "@/lib/queryClient";
import { api } from "./api";
import { useWorkspaceStore, WORKSPACE_MARKETPLACE } from "@/stores/workspaceStore";
import type { Membership } from "@/types";

/**
 * Conversão B2B -> B2C (B4): ao passar para o marketplace regista-se a visita
 * (`POST /tenancy/marketplace-visit/`, sem corpo, 204 e idempotente). É só uma métrica:
 * corre depois da troca (sem `X-Workspace`) e qualquer erro é ignorado em silêncio.
 */
async function aoTrocarParaMarketplace(): Promise<void> {
  try {
    await api.post("/tenancy/marketplace-visit/");
  } catch {
    // Métrica não crítica: a falha não pode impedir a troca de workspace.
  }
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

  /** Após o login institucional, abre directamente o workspace da escola em que o aluno entrou. */
  activarEscolaPorCodigo(codigo: string): void {
    const alvo = useWorkspaceStore
      .getState()
      .memberships.find((m) => m.codigo.toLowerCase() === codigo.trim().toLowerCase());
    if (alvo) useWorkspaceStore.getState().definirAtivo(alvo.organizacaoId);
  },

  /** Troca de workspace sem novo login; invalida os dados em cache do contexto anterior. */
  async trocar(id: string): Promise<void> {
    const { ativo } = useWorkspaceStore.getState();
    if (id === ativo) return;
    useWorkspaceStore.getState().definirAtivo(id);
    if (id === WORKSPACE_MARKETPLACE) void aoTrocarParaMarketplace();
    await queryClient.invalidateQueries();
  },

  /** Logout: esquece o workspace e todos os dados em cache. */
  limpar(): void {
    useWorkspaceStore.getState().limpar();
    queryClient.clear();
  },
};
