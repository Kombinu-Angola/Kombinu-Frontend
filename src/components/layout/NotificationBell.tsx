import { useContadorNaoLidas } from "../../hooks/useNotificacoes";
import { Icon } from "../ui/Icon";

/** Sino do cabeçalho com o número de notificações por ler do workspace activo. */
export function NotificationBell() {
  const { data } = useContadorNaoLidas();
  const naoLidas = data ?? 0;
  const rotulo = naoLidas > 0 ? `Notificações, ${naoLidas} por ler` : "Notificações";

  return (
    <a
      href="/v2/notificacoes"
      aria-label={rotulo}
      className="relative flex size-11 items-center justify-center rounded-full text-text-secondary transition-[background-color,color] duration-150 hover:bg-surface-soft hover:text-on-surface"
    >
      <Icon name="bell" size={20} />
      {naoLidas > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-1 right-0.5 flex min-w-5 items-center justify-center rounded-full bg-feedback-error-ink px-1 text-[11px] leading-5 font-bold text-white tabular-nums"
        >
          {naoLidas > 9 ? "9+" : naoLidas}
        </span>
      )}
    </a>
  );
}
