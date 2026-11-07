import { useEffect, useState } from "react";

/**
 * Tempo restante até `endsAt`, atualizado a cada segundo (um só setInterval, sem rede).
 * Com o separador escondido o browser abranda o intervalo; o valor é sempre recalculado a partir do relógio.
 */
export function useCountdown(endsAt: string | Date) {
  const target = new Date(endsAt).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (Date.now() >= target) return;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= target) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const remaining = Math.max(0, target - now);
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  const days = Math.floor(hours / 24);

  return {
    ended: remaining === 0,
    /** Segundos em falta, para barras e anéis de progresso. */
    totalSeconds,
    /** "2d 14h 22m" — para prazos longos. */
    compact: days > 0 ? `${days}d ${hours % 24}h ${minutes}m` : `${hours}h ${minutes}m`,
    /** "14:22:05" */
    clock: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    /** Para leitor de ecrã: "14 horas e 22 minutos" (sem segundos, para não ser ruído). */
    spoken: hours > 0 ? `${hours} horas e ${minutes} minutos` : `${minutes} minutos`,
  };
}
