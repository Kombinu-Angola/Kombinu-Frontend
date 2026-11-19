/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API (termina em `/api`). */
  readonly VITE_API_URL?: string;
  /** `true` liga os dados simulados do fluxo novo; só tem efeito em desenvolvimento. */
  readonly VITE_FLUXO_MOCKS?: string;
  /** `true` liga o onboarding novo contra a API real (`/api/me/`, `/api/instituicoes/`, `/api/cadeiras/`). */
  readonly VITE_ONBOARDING_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
