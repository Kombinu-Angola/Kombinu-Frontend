import { CheckIcon } from "@/components/fluxo/icons";
import type { SebentaBlock } from "../../services/fluxoService";

/** Um bloco da sebenta modular: secções com texto e pontos-chave. */
export function BlocoDaSebenta({ bloco }: { bloco: SebentaBlock }) {
  return (
    <article className="rounded-[28px] bg-white p-5 ring-1 ring-neutral-200 ring-inset sm:p-7">
      <h2 className="font-display text-xl font-bold text-kombinu-blue">{bloco.title}</h2>
      <div className="mt-5 flex flex-col gap-6">
        {bloco.sections.map((s) => (
          <section key={s.heading}>
            <h3 className="font-display font-bold">{s.heading}</h3>
            <p className="mt-2 max-w-[65ch] leading-relaxed text-pretty text-neutral-700">{s.body}</p>
            {s.keyPoints && (
              <ul className="mt-3 flex flex-col gap-2">
                {s.keyPoints.map((k) => (
                  <li key={k} className="flex items-start gap-2.5 rounded-xl bg-kombinu-yellow-soft px-3.5 py-2.5 text-[0.95rem]">
                    <CheckIcon className="mt-1 size-4 shrink-0 text-kombinu-blue" strokeWidth={3} />
                    {k}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
