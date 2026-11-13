import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWorkspaceStore, WORKSPACE_MARKETPLACE } from "@/stores/workspaceStore";
import { workspaceService } from "@/services/workspaceService";
import { Icon } from "../ui/Icon";

type WorkspaceSwitcherProps = {
  className?: string;
};

/**
 * Seletor escola <-> marketplace, sem logout. Só aparece quando o utilizador tem pelo
 * menos uma membership activa; quem só usa o marketplace não vê nada.
 */
export function WorkspaceSwitcher({ className }: WorkspaceSwitcherProps) {
  const ativo = useWorkspaceStore((s) => s.ativo);
  const memberships = useWorkspaceStore((s) => s.memberships);
  const [aTrocar, setATrocar] = useState(false);

  if (memberships.length === 0) return null;

  async function aoMudar(id: string) {
    setATrocar(true);
    try {
      await workspaceService.trocar(id);
    } catch {
      toast.error("Não foi possível mudar de espaço. Tenta novamente.", { id: "erro-workspace" });
    } finally {
      setATrocar(false);
    }
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <label htmlFor="workspace-switcher" className="sr-only">
        Espaço activo
      </label>
      <Icon
        name="school"
        size={16}
        className="pointer-events-none absolute left-3 text-primary"
      />
      <select
        id="workspace-switcher"
        value={ativo}
        disabled={aTrocar}
        onChange={(e) => void aoMudar(e.target.value)}
        className="min-h-11 max-w-[6.5rem] appearance-none truncate rounded-full border-2 border-border-cloud bg-surface-sky py-1 pr-4 pl-9 font-lato text-caption font-bold text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 dark:bg-surface-soft sm:max-w-[16rem]"
      >
        <option value={WORKSPACE_MARKETPLACE}>Marketplace</option>
        {memberships.map((m) => (
          <option key={m.organizacaoId} value={m.organizacaoId}>
            {m.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
