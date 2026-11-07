import type { Asset3DName } from "../../lib/assets3d";

export type Role = "student" | "creator";

export type RoleOption = {
  role: Role;
  eyebrow: string;
  title: string;
  illustration: { asset: Asset3DName; alt: string; caption: string };
  benefits: string[];
  cta: string;
};

/** Conteúdo dos cartões. Pronto para vir de /api/onboarding/roles/ sem mudar os componentes. */
export const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "student",
    eyebrow: "Aprender e subir de nível",
    title: "Quero estudar e resolver quizzes",
    illustration: {
      asset: "kombi-student",
      alt: "Kombi, a mascote da Kombinu, a ler um livro",
      caption: "A Kombi acompanha-te",
    },
    benefits: [
      "Resumos e sebentas que poupam o teu plano de dados",
      "Quizzes práticos com XP, ligas e sequências diárias",
      "Testes diagnósticos para vencer as cadeiras difíceis",
    ],
    cta: "Entrar como estudante",
  },
  {
    role: "creator",
    eyebrow: "Ensinar e monetizar",
    title: "Quero publicar conteúdos e sebentas",
    illustration: {
      asset: "creator-sebentas",
      alt: "Pilha de sebentas com um selo de verificação",
      caption: "Pagamentos por Multicaixa Express",
    },
    benefits: [
      "Vende materiais e simulados a estudantes de todo o país",
      "Recebe diretamente por Multicaixa Express, com até 100% de margem no plano Pro",
      "Acompanha a retenção dos teus alunos num painel próprio",
    ],
    cta: "Candidatar-me como criador",
  },
];
