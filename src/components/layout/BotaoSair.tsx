import { useAuth } from "../../contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Icon } from "../ui/Icon";

type BotaoSairProps = {
  className?: string;
  /** Classes do texto (permite esconder o rótulo na barra recolhida). */
  rotuloClassName?: string;
  /** Mostra só o ícone (o rótulo fica só para leitores de ecrã). */
  soIcone?: boolean;
  onAntes?: () => void;
  title?: string;
};

/**
 * Termina a sessão: o `authService.logout()` apaga os tokens, o workspace e a cache de dados;
 * depois recarrega no `/login` para nenhum estado de memória ficar para o próximo utilizador do aparelho.
 */
export function BotaoSair({ className, rotuloClassName, soIcone, onAntes, title }: BotaoSairProps) {
  const { logout } = useAuth();

  const sair = () => {
    onAntes?.();
    logout();
    window.location.assign("/login");
  };

  return (
    <button type="button" onClick={sair} title={title} className={cn("flex items-center gap-3", className)}>
      <Icon name="log-out" size={soIcone ? 20 : 22} className="shrink-0" />
      <span className={cn(soIcone && "sr-only", rotuloClassName)}>Sair</span>
    </button>
  );
}
