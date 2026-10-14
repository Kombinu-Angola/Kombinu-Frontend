import { HugeiconsIcon } from "@hugeicons/react";
import { School01Icon } from "@hugeicons/core-free-icons";

const universities = [
    "UAN",
    "UCAN",
    "ISPTEC",
    "ISAF",
    "UGS",
    "UniPiaget",
    "Metropolitana",
    "Gregório Semedo",
];

export function Carrosel() {
    return (
        <section className="w-full py-8  overflow-hidden select-none">
            {/* Título de contexto editorial */}
            <h2 className="font-montserrat text-[11px] font-semibold tracking-wider text-center text-zinc-500 uppercase px-4 mb-5">
                Material calibrado para os currículos de:
            </h2>

            {/* Container com máscara de degradé/fade nas pontas */}
            <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">

                {/* Trilho infinito com duplicação para loop contínuo */}
                <div className="flex w-max animate-marquee gap-3 py-1 hover:[animation-play-state:paused]">

                    {/* Bloco 1 */}
                    <div className="flex items-center gap-3 shrink-0">
                        {universities.map((uni, idx) => (
                            <div
                                key={`uni-1-${idx}`}
                                className="bg-card  rounded-lg px-4 py-2 flex items-center gap-2.5 transition-colors hover:border-zinc-700"
                            >
                                <HugeiconsIcon
                                    icon={School01Icon}
                                    size={16}
                                    className="text-zinc-500 shrink-0"
                                />
                                <span className="font-montserrat font-semibold text-xs tracking-wide text-zinc-300">
                                    {uni}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Bloco 2 (duplicado para garantir transição infinita sem cortes) */}
                    <div className="flex items-center gap-3 shrink-0" aria-hidden="true">
                        {universities.map((uni, idx) => (
                            <div
                                key={`uni-2-${idx}`}
                                className="bg-card  rounded-lg px-4 py-2 flex items-center gap-2.5 transition-colors hover:border-zinc-700"
                            >
                                <HugeiconsIcon
                                    icon={School01Icon}
                                    size={16}
                                    className="text-zinc-500 shrink-0"
                                />
                                <span className="font-montserrat font-semibold text-xs tracking-wide text-zinc-300">
                                    {uni}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}