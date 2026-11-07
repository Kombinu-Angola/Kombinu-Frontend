import type { ReferralProgram } from "./types";

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

export const MOCK_REFERRAL: ReferralProgram = {
  code: "joao-uan",
  link: "https://kombinu.ao/convite/joao-uan",
  goal: 3,
  rewardGems: 100,
  rewardLabel: "1 sebenta à escolha, até 2.000 Kz",
  validationRule: "O convite conta quando o colega cria conta e resolve o primeiro quiz.",
  slots: [
    { id: "i1", status: "ativo", name: "Hamilton Kiala", course: "Direito", university: "UCAN", invitedAt: daysAgo(9) },
    { id: "i2", status: "ativo", name: "Jéssica Manuel", course: "Contabilidade", university: "UAN", invitedAt: daysAgo(5) },
    { id: "i3", status: "convidado", name: "Nelson Domingos", course: "Economia", university: "UAN", invitedAt: daysAgo(1) },
  ],
};
