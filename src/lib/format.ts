const kz = new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 0 });
const int = new Intl.NumberFormat("pt-AO");

export const formatKz = (value: number) => `${kz.format(value)} Kz`;
export const formatInt = (value: number) => int.format(value);

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** "Hoje, 14:30" · "Ontem, 09:15" · "12 set., 18:00" */
export function formatActivityTime(iso: string, now = new Date()) {
  const date = new Date(iso);
  const time = date.toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" });
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (days === 0) return `Hoje, ${time}`;
  if (days === 1) return `Ontem, ${time}`;
  return `${date.toLocaleDateString("pt-AO", { day: "numeric", month: "short" })}, ${time}`;
}

/** Pesquisa sem acentos nem maiúsculas: "calculo" encontra "Cálculo". */
export const normalize = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
