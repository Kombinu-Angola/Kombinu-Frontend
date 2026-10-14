import { QuoteUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function ManifestoSection() {
    return (
        <section className="w-full py-16 sm:py-20 lg:py-24 text-zinc-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="p-6 sm:p-10 lg:p-12 rounded-2xl bg-card border border-zinc-800/80 space-y-8">

                    {/* Cabeçalho Editorial */}
                    <div className="space-y-3 pb-6 border-b border-zinc-800/60">
                        <span className="font-montserrat text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                            Manifesto • Luanda
                        </span>
                        <h2 className="font-montserrat text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                            Por que estamos a construir a Kombinu.
                        </h2>
                    </div>

                    {/* Corpo do Texto */}
                    <div className="space-y-4 font-lato text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        <p>
                            Quem estuda no ensino superior em Luanda conhece o peso diário: passar 3 a 4 horas nos engarrafamentos entre o trabalho e a faculdade, disputar uma tomada no anfiteatro e tentar decifrar PDFs ilegíveis de 120 slides no telemóvel enquanto a bateria e o saldo de dados esgotam.
                        </p>

                        {/* Frase de ênfase com linha guia minimalista */}
                        <div className="border-l-2 border-zinc-400 pl-4 py-1">
                            <p className="font-montserrat text-sm sm:text-base font-medium text-zinc-200 leading-snug">
                                A universidade em Angola não devia ser uma maratona de fotocópias desbotadas, grupos de WhatsApp caóticos e recargas móveis queimadas.
                            </p>
                        </div>

                        <p>
                            A <strong className="font-semibold text-zinc-100">Kombinu</strong> foi desenhada para a nossa realidade: leve, funcional com sinal móvel intermitente e económica no consumo de tráfego. Um ecossistema prático para quem precisa de aprovar e para monitores que produzem conteúdo académico de rigor.
                        </p>
                    </div>

                    {/* Assinatura */}
                    <div className="pt-6 border-t border-zinc-800/60 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-200 font-mono font-medium text-xs flex items-center justify-center shrink-0">
                                OF
                            </div>
                            <div>
                                <h4 className="font-montserrat font-semibold text-xs sm:text-sm text-white">
                                    Orlando Fortuna & Equipa
                                </h4>
                                <p className="font-lato text-[11px] text-zinc-500">
                                    Feito em Luanda por e para universitários
                                </p>
                            </div>
                        </div>

                        <div className="text-zinc-700 shrink-0">
                            <HugeiconsIcon icon={QuoteUpIcon} size={24} />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}