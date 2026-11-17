import type { Membership } from "@/types";
import { WORKSPACE_MARKETPLACE } from "@/stores/workspaceStore";

/** Ordem de preferência ao abrir a app: quem gere a escola, depois quem ensina, depois quem estuda. */
const PRIORIDADE_PAPEL: Membership["papel"][] = ["admin", "teacher", "student"];

/**
 * Workspace em que o utilizador abre depois de autenticar: a escola de maior papel
 * (admin, professor, estudante) e nunca o marketplace quando há escola. Sem escola, marketplace.
 */
export function escolherWorkspaceInicial(memberships: Membership[]): string {
  for (const papel of PRIORIDADE_PAPEL) {
    const alvo = memberships.find((m) => m.papel === papel);
    if (alvo) return alvo.organizacaoId;
  }
  return WORKSPACE_MARKETPLACE;
}

/** Papel do utilizador no workspace dado; `null` no marketplace ou se a escola não está nas memberships. */
export function papelNoWorkspace(memberships: Membership[] | undefined, ativo: string): Membership["papel"] | null {
  if (ativo === WORKSPACE_MARKETPLACE) return null;
  return memberships?.find((m) => m.organizacaoId === ativo)?.papel ?? null;
}
