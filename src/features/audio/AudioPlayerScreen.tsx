import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { formatSize } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { AudioSummary } from "./types";

const SPEEDS = [1, 1.25, 1.5, 2] as const;
const SKIP = 15;

const clock = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};
const spoken = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  return `${m} ${m === 1 ? "minuto" : "minutos"} e ${s % 60} segundos`;
};

type AudioPlayerScreenProps = { audio: AudioSummary; userName: string; downloaded?: boolean };

/**
 * Leitor de áudio das sebentas. Quando há ficheiro, tudo passa pelo elemento <audio>;
 * sem ficheiro (demonstração), corre um relógio local e o ecrã diz que é pré-visualização.
 */
export default function AudioPlayerScreen({ audio, userName, downloaded = false }: AudioPlayerScreenProps) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [saved, setSaved] = useState(downloaded);
  const toast = useToast();
  const preview = !audio.src;

  // Sem ficheiro, o relógio é local: serve para validar a interface sem inventar áudio.
  useEffect(() => {
    if (!playing) return;
    if (audio.src) {
      void ref.current?.play();
      return () => ref.current?.pause();
    }
    const id = window.setInterval(() => {
      setTime((t) => {
        const next = t + 0.25 * speed;
        if (next >= audio.duration) {
          setPlaying(false);
          return audio.duration;
        }
        return next;
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [playing, speed, audio.src, audio.duration]);

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = speed;
  }, [speed]);

  const seek = (next: number) => {
    const value = Math.min(audio.duration, Math.max(0, next));
    setTime(value);
    if (ref.current) ref.current.currentTime = value;
  };

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (target.matches("input, textarea, select")) return;
      if (event.code === "Space") {
        event.preventDefault();
        setPlaying((p) => !p);
      }
      if (event.key === "ArrowLeft") seek(time - SKIP);
      if (event.key === "ArrowRight") seek(time + SKIP);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const activeCue = useMemo(() => {
    let current = audio.cues[0];
    for (const cue of audio.cues) if (time >= cue.start) current = cue;
    return current;
  }, [audio.cues, time]);

  const streamKb = Math.round((audio.bitrateKbps * audio.duration) / 8);

  return (
    <AppShell active="trilhas" userName={userName} campus={audio.subject}>
      <div className="mx-auto max-w-[760px] px-4 py-6 md:px-6 lg:py-8">
        <a
          href={audio.readingHref}
          className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-caption font-bold text-text-secondary hover:text-primary"
        >
          <Icon name="arrow-left" size={16} />
          Voltar ao texto
        </a>

        {audio.src && <audio ref={ref} src={audio.src} onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} preload="none" />}

        <section
          aria-labelledby="player-title"
          className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 text-center shadow-clay sm:p-8"
        >
          <span
            aria-hidden="true"
            className={cn(
              "mx-auto mb-5 flex size-32 items-center justify-center rounded-full bg-brand-ocean",
              playing && "motion-safe:animate-pulse-ring",
            )}
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-surface-ink">
              <Icon name="headphones" size={30} className="text-white" />
            </span>
          </span>

          <p className="inline-flex items-center gap-1.5 rounded-full bg-surface-soft px-3 py-1 text-caption text-text-secondary tabular-nums">
            <Icon name="clock" size={14} />
            {clock(audio.duration)} de áudio
          </p>

          <h1 id="player-title" className="mt-3 font-montserrat text-headline-h2 text-balance text-on-surface">
            {audio.title}
          </h1>
          <p className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-caption text-text-secondary">
            Voz sintetizada, revista por
            <span className="inline-flex items-center gap-1 font-bold text-on-surface">
              {audio.reviewedBy.name}
              <Icon name="seal" size={14} className="text-brand-sky-ink" />
            </span>
            <span className="text-text-tertiary">({audio.reviewedBy.role})</span>
          </p>

          <div className="mt-7">
            <label htmlFor="audio-progress" className="sr-only">
              Posição da reprodução
            </label>
            <input
              id="audio-progress"
              type="range"
              min={0}
              max={audio.duration}
              step={1}
              value={Math.round(time)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-valuetext={`${spoken(time)} de ${spoken(audio.duration)}`}
              className="h-6 w-full cursor-pointer accent-brand-ocean"
            />
            <p className="flex justify-between text-caption text-text-tertiary tabular-nums">
              <span aria-hidden="true">{clock(time)}</span>
              <span aria-hidden="true">−{clock(audio.duration - time)}</span>
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => seek(time - SKIP)}
              aria-label={`Recuar ${SKIP} segundos`}
              className="flex size-12 items-center justify-center rounded-full border-2 border-border-cloud text-text-secondary transition-[background-color,color] duration-150 hover:bg-surface-soft hover:text-on-surface"
            >
              <span aria-hidden="true" className="text-caption font-bold tabular-nums">
                −{SKIP}s
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pausar" : "Reproduzir"}
              className="flex size-[68px] items-center justify-center rounded-full bg-brand-ocean text-white shadow-3d-primary transition-[translate,box-shadow] duration-150 active:translate-y-1 active:shadow-none"
            >
              <Icon name={playing ? "pause" : "play"} size={32} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              onClick={() => seek(time + SKIP)}
              aria-label={`Avançar ${SKIP} segundos`}
              className="flex size-12 items-center justify-center rounded-full border-2 border-border-cloud text-text-secondary transition-[background-color,color] duration-150 hover:bg-surface-soft hover:text-on-surface"
            >
              <span aria-hidden="true" className="text-caption font-bold tabular-nums">
                +{SKIP}s
              </span>
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
              className="flex min-h-11 items-center gap-1.5 rounded-full border-2 border-border-cloud px-4 text-caption font-bold text-on-surface transition-[border-color,color] duration-150 hover:border-brand-ocean hover:text-primary"
            >
              <Icon name="bolt" size={15} />
              Velocidade {speed.toLocaleString("pt-AO")}×
            </button>

            {saved ? (
              <span className="flex min-h-11 items-center gap-1.5 rounded-full bg-surface-forest px-4 text-caption font-bold text-feedback-success tabular-nums">
                <Icon name="check" size={15} strokeWidth={3} />
                Guardado offline ({formatSize(audio.sizeKb)})
              </span>
            ) : (
              <Button3D
                variant="ghost"
                onClick={() => {
                  setSaved(true);
                  toast.show(`Áudio guardado: ${formatSize(audio.sizeKb)} descarregados uma única vez.`);
                }}
                leadingIcon={<Icon name="download" size={18} />}
              >
                Guardar offline ({formatSize(audio.sizeKb)})
              </Button3D>
            )}
          </div>

          {preview && (
            <p role="status" className="mt-5 rounded-xl border-2 border-dashed border-border-input p-3 text-caption text-text-secondary">
              Pré-visualização da interface: este ecrã ainda não tem ficheiro de áudio associado.
            </p>
          )}
        </section>

        <section aria-labelledby="transcript-title" className="mt-6 rounded-3xl border-2 border-border-cloud bg-surface-soft p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b-2 border-border-cloud pb-3">
            <h2 id="transcript-title" className="flex items-center gap-2 text-headline-h3 text-on-surface">
              <Icon name="file" size={20} className="text-primary" />
              Transcrição
            </h2>
            <p className="text-caption text-text-tertiary">Toca numa frase para saltar para esse ponto.</p>
          </div>

          <ol className="flex flex-col gap-2">
            {audio.cues.map((cue) => {
              const active = cue.id === activeCue.id;
              return (
                <li key={cue.id}>
                  <button
                    type="button"
                    onClick={() => seek(cue.start)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "flex w-full gap-3 rounded-xl p-3 text-left transition-[background-color,color] duration-150",
                      active
                        ? "bg-surface-canvas font-bold text-on-surface shadow-[inset_0_0_0_2px_var(--color-brand-ocean)]"
                        : "text-text-secondary hover:bg-surface-canvas",
                    )}
                  >
                    <span className="shrink-0 text-caption text-text-tertiary tabular-nums">{clock(cue.start)}</span>
                    <span className="text-body-md">{cue.text}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        <section
          aria-labelledby="data-title"
          className="mt-6 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 sm:p-5"
        >
          <h2 id="data-title" className="flex items-center gap-2 text-body-md font-bold text-on-surface">
            <Icon name="signal" size={20} className="text-feedback-success-ink" />
            Quanto custa este áudio em dados
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Ouvir em streaming", value: formatSize(streamKb), note: `${audio.bitrateKbps} kbps, voz mono` },
              { label: "Guardar offline", value: formatSize(audio.sizeKb), note: "Uma única descarga" },
              { label: "Ler o texto", value: "42 KB", note: "A opção mais leve" },
            ].map((row) => (
              <div key={row.label} className="rounded-xl bg-surface-soft p-3">
                <dt className="text-caption text-text-secondary">{row.label}</dt>
                <dd>
                  <span className="block font-montserrat text-headline-h3 font-extrabold text-on-surface tabular-nums">
                    {row.value}
                  </span>
                  <span className="block text-caption text-text-tertiary">{row.note}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-caption text-text-secondary">
            Com o telemóvel bloqueado, a reprodução continua. Guardar offline evita pagar os mesmos dados duas vezes.
          </p>
        </section>

        <footer className="mt-5 flex flex-wrap items-center justify-center gap-2 text-caption text-text-tertiary">
          <Icon name="target" size={15} />
          Atalhos: espaço para reproduzir ou pausar, setas para saltar {SKIP} segundos.
        </footer>
      </div>
    </AppShell>
  );
}
