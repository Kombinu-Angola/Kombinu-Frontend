import { ArrowRight01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function CallToActionSection() {
    return (
        <section className="w-full py-16 sm:py-20 lg:py-24  text-zinc-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="rounded-2xl bg-card border  p-8 sm:p-12 text-center">

                    {/* Eyebrow minimalista */}
                    <span className="font-montserrat text-[11px] font-semibold tracking-wider text-zinc-500 uppercase block mb-4">
                        Acesso Imediato • Luanda
                    </span>

                    {/* Título de impacto direto */}
                    <h2 className="font-montserrat text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white max-w-xl mx-auto leading-tight">
                        Eleva o teu rendimento académico sem gastar o teu saldo.
                    </h2>

                    {/* Subtítulo em Lato neutro */}
                    <p className="mt-4 font-lato text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
                        Junta-te a estudantes da UAN, UCAN, ISPTEC e de todo o país. Começa a resolver simulados e a consultar sebentas sem custos iniciais.
                    </p>

                    {/* Botão em Poppins (contraste alto preto/branco) */}
                    <div className="mt-8 flex justify-center">
                        <button
                            type="button"
                            className="font-poppins inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-xs sm:text-sm bg-zinc-100 hover:bg-white text-zinc-950 transition-colors cursor-pointer"
                        >
                            <span>Começar Gratuitamente</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                        </button>
                    </div>

                    {/* Trust points discretos */}
                    <div className="mt-8 pt-6 border-t border-zinc-800/60 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 font-lato text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1.5">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-zinc-400" />
                            Modo Data-Lean ativo
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-zinc-400" />
                            Sem necessidade de dados bancários
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-zinc-400" />
                            Acesso imediato a sebentas
                        </span>
                    </div>

                </div>
            </div>
        </section>
    );
}