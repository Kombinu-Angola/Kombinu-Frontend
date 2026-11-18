import { useGamificacaoMe } from "../../hooks/useV2Dados";
import { Icon } from "../ui/Icon";

/**
 * Ofensiva real do utilizador (`GET /rankings/me/`) no cabeçalho. Sem gemas (o backend não as tem).
 * Enquanto carrega, ou se a API falhar, não mostra nada: nunca um número inventado.
 */
export function OfensivaChip() {
  const { data } = useGamificacaoMe();
  if (!data) return null;
  const dias = data.ofensiva;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-surface-soft px-3 py-1.5 text-body-md font-bold text-on-surface"
      title={dias > 0 ? `Ofensiva: ${dias} ${dias === 1 ? "dia seguido" : "dias seguidos"}` : "Ainda sem ofensiva"}
    >
      <Icon name="flame" size={20} className={dias > 0 ? "text-feedback-streak" : "text-text-secondary"} />
      <span className="tabular-nums" aria-label={`Ofensiva de ${dias} ${dias === 1 ? "dia" : "dias"}`}>{dias}</span>
    </span>
  );
}
