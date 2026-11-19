/** Formatadores do fluxo "Preparar a minha prova". */

export const kz = (n: number) => `${new Intl.NumberFormat("pt-AO").format(n)} Kz`;

export const toISODate = (d: Date) => {
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};

export const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

export const daysUntil = (iso: string) => {
  const hoje = new Date(new Date().toDateString()).getTime();
  return Math.round((new Date(`${iso}T00:00:00`).getTime() - hoje) / 86_400_000);
};

export const dataLonga = (iso: string) =>
  new Intl.DateTimeFormat("pt-AO", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${iso}T00:00:00`));

export const mensagemDe = (err: unknown, omissao = "Algo correu mal. Tenta novamente.") =>
  err instanceof Error && err.message ? err.message : omissao;
