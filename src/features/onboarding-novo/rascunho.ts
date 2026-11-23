import type { Intencao, MinutosPorDia } from "../../services/perfilService";

/** Respostas do onboarding enquanto o utilizador navega: voltar atrás nunca as apaga. */
export interface Rascunho {
  intencao: Intencao | null;
  /** `id` da instituição escolhida, `"outra"` ou vazio. */
  instituicao: string;
  instituicaoOutra: string;
  provincia: string;
  curso: string;
  ano: string;
  cadeira: string;
  minutos: MinutosPorDia | null;
}

export const RASCUNHO_VAZIO: Rascunho = {
  intencao: null, instituicao: "", instituicaoOutra: "", provincia: "", curso: "", ano: "", cadeira: "", minutos: null,
};
