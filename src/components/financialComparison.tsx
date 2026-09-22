import { Cancel01Icon, CheckmarkCircle02Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";


export default function FinancialComparison() {
    return (
        <section className="w-full py-12 sm:py-16 bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Cabeçalho */}
                <div className="text-center max-w-xl mx-auto mb-10">
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary">
                        A Quebra da Objeção Financeira
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                        A matemática simples da sua poupança mensal
                    </h2>
                </div>

                {/* Grid com apenas 2 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Card 1: Método Tradicional */}
                    <div className="flex flex-col justify-between p-6 rounded-2xl  bg-card/60 shadow-sm">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-border/60">
                                <h3 className="font-bold text-base sm:text-lg text-muted-foreground">
                                    Método Tradicional
                                </h3>
                                <span className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                                    <HugeiconsIcon icon={Cancel01Icon} size={18} />
                                </span>
                            </div>

                            <ul className="mt-5 space-y-4 text-xs sm:text-sm">
                                <li className="flex justify-between items-start gap-2">
                                    <span className="text-muted-foreground">Fotocópias em centros de reprografia:</span>
                                    <span className="font-medium text-foreground shrink-0">~4.500 AOA</span>
                                </li>
                                <li className="flex justify-between items-start gap-2">
                                    <span className="text-muted-foreground">Pacotes de dados descarregando PDFs:</span>
                                    <span className="font-medium text-foreground shrink-0">~3.000 AOA</span>
                                </li>
                                <li className="flex justify-between items-start gap-2">
                                    <span className="text-muted-foreground">Aulas de explicação avulsas:</span>
                                    <span className="font-medium text-foreground shrink-0">~5.000 AOA</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Custo Médio Mensal
                            </span>
                            <span className="text-lg sm:text-xl font-bold text-red-500">
                                ~12.500 AOA
                            </span>
                        </div>
                    </div>

                    {/* Card 2: Plataforma / Kombinu */}
                    <div className="relative flex flex-col justify-between p-6 rounded-2xl border-2 border-primary bg-primary/5 shadow-md">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-primary/20">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-base sm:text-lg text-foreground">
                                        Com a Plataforma
                                    </h3>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">
                                        <HugeiconsIcon icon={SparklesIcon} size={10} />
                                        Económico
                                    </span>
                                </div>
                                <span className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                                </span>
                            </div>

                            <ul className="mt-5 space-y-4 text-xs sm:text-sm">
                                <li className="flex justify-between items-start gap-2">
                                    <span className="text-muted-foreground">Acesso ilimitado a sebentas & IA:</span>
                                    <span className="font-medium text-foreground shrink-0">5.000 AOA</span>
                                </li>
                                <li className="flex justify-between items-start gap-2">
                                    <span className="text-muted-foreground">Saldo de dados (Modo Data-Lean &lt; 5MB/h):</span>
                                    <span className="font-medium text-foreground shrink-0">&lt; 500 AOA</span>
                                </li>
                                <li className="flex justify-between items-start gap-2">
                                    <span className="text-muted-foreground">Dúvidas com gabarito 24/7:</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase text-xs shrink-0">
                                        Grátis
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-6 pt-4 border-t border-primary/20 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Investimento Mensal Total
                            </span>
                            <span className="text-lg sm:text-xl font-extrabold text-primary">
                                5.500 AOA
                            </span>
                        </div>
                    </div>
                </div>

                {/* Banner de Poupança Líquida */}
                <div className="mt-6 p-4 rounded-xl bg-text-[#424752]  text-center text-xs sm:text-sm text-foreground font-medium">
                    🎯 <strong className="text-[#424752]  dark:text-emerald-400">Poupança líquida de mais de 55%</strong> no seu orçamento de estudante, com mais organização e notas mais altas.
                </div>
            </div>
        </section>
    );
}