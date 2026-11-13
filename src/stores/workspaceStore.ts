import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Membership } from "@/types";

/** Valor do workspace B2C (marketplace): nunca é enviado no header `X-Workspace`. */
export const WORKSPACE_MARKETPLACE = "marketplace";

type WorkspaceState = {
  /** UUID da organização activa, ou `marketplace`. */
  ativo: string;
  /** Memberships activas do utilizador (vêm do login). */
  memberships: Membership[];
  /** Substitui as memberships; se o workspace guardado já não existir nelas, volta ao marketplace. */
  definirMemberships: (memberships: Membership[]) => void;
  /** Muda o workspace activo; ignora ids que não estão nas memberships. */
  definirAtivo: (id: string) => void;
  /** Logout: limpa workspace e memberships. */
  limpar: () => void;
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      ativo: WORKSPACE_MARKETPLACE,
      memberships: [],
      definirMemberships: (memberships) => {
        const { ativo } = get();
        const aindaValido =
          ativo === WORKSPACE_MARKETPLACE || memberships.some((m) => m.organizacaoId === ativo);
        set({ memberships, ativo: aindaValido ? ativo : WORKSPACE_MARKETPLACE });
      },
      definirAtivo: (id) => {
        const valido =
          id === WORKSPACE_MARKETPLACE || get().memberships.some((m) => m.organizacaoId === id);
        if (valido) set({ ativo: id });
      },
      limpar: () => set({ ativo: WORKSPACE_MARKETPLACE, memberships: [] }),
    }),
    {
      name: "kombinu_workspace",
      partialize: (s) => ({ ativo: s.ativo, memberships: s.memberships }),
    },
  ),
);

/** Valor do header `X-Workspace` para o contexto activo; `null` no marketplace (header omitido). */
export function obterHeaderWorkspace(): string | null {
  const { ativo } = useWorkspaceStore.getState();
  return ativo === WORKSPACE_MARKETPLACE ? null : ativo;
}
