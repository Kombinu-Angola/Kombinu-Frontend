/**
 * Interruptores do fluxo novo (onboarding e "Preparar a minha prova").
 *
 * - `FLUXO_MOCKS`: dados simulados. Só em desenvolvimento e só com `VITE_FLUXO_MOCKS=true`;
 *   num build de produção é sempre `false`, mesmo que a variável esteja definida.
 * - `ONBOARDING_ACTIVO`: o onboarding novo corre com os mocks (desenvolvimento) ou, quando o
 *   backend publicar `/api/me/`, `/api/instituicoes/` e `/api/cadeiras/`, com `VITE_ONBOARDING_API=true`.
 */
export const FLUXO_MOCKS: boolean = import.meta.env.DEV && import.meta.env.VITE_FLUXO_MOCKS === "true";

export const ONBOARDING_ACTIVO: boolean = FLUXO_MOCKS || import.meta.env.VITE_ONBOARDING_API === "true";
