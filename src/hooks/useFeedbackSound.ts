import { useCallback, useEffect, useRef } from "react";

type Kind = "correct" | "wrong";

type AudioCtor = typeof AudioContext;

/**
 * Sons de feedback sintetizados com Web Audio: 0 bytes descarregados.
 * O AudioContext só é criado no primeiro gesto do utilizador (política de autoplay).
 */
export function useFeedbackSound(enabled = true) {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(
    (kind: Kind) => {
      if (!enabled || typeof window === "undefined") return;
      const Ctor: AudioCtor | undefined =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
      if (!Ctor) return;

      const ctx = (ctxRef.current ??= new Ctor());
      if (ctx.state === "suspended") void ctx.resume();

      const notes: Array<[freq: number, delay: number]> =
        kind === "correct" ? [[660, 0], [880, 0.09]] : [[247, 0], [196, 0.11]];

      for (const [freq, delay] of notes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + delay;
        osc.type = kind === "correct" ? "sine" : "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.12, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.18);
      }
    },
    [enabled],
  );

  useEffect(
    () => () => {
      void ctxRef.current?.close();
      ctxRef.current = null; // StrictMode monta/desmonta duas vezes: recria no próximo som
    },
    [],
  );

  return play;
}
