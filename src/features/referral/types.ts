export type InviteStatus = "ativo" | "convidado" | "vazio";

export type InviteSlot = {
  id: string;
  status: InviteStatus;
  name?: string;
  course?: string;
  university?: string;
  invitedAt?: string;
};

/** Contrato esperado de GET /api/me/referrals/ */
export type ReferralProgram = {
  code: string;
  link: string;
  goal: number;
  slots: InviteSlot[];
  rewardGems: number;
  rewardLabel: string;
  /** Um convite só conta depois de o colega resolver o primeiro quiz. */
  validationRule: string;
};
