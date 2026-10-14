import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowRight01Icon, Clock01Icon, Idea01Icon, Pdf02Icon, TrophyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function QuizSection() {
    return (
        <section className="mt-12 px-4 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                {/* Card 1: Gerador de Quizzes IA */}
                <Card className="h-full bg-card border-zinc-800/80 shadow-none rounded-xl text-zinc-100 flex flex-col justify-between lg:col-span-1">
                    <div>
                        <CardHeader className="pb-3 border-b border-zinc-800/60 flex flex-row items-center justify-between">
                            <span className="font-montserrat text-[11px] font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                                <HugeiconsIcon icon={Idea01Icon} size={15} className="text-zinc-400" />
                                Motor de Estudo
                            </span>
                            <span className="font-mono text-[10px] text-zinc-500 uppercase">
                                &lt; 10s
                            </span>
                        </CardHeader>

                        <CardContent className="space-y-2 pt-4 font-lato">
                            <h3 className="font-montserrat text-lg font-semibold text-white tracking-tight">
                                Gerador de Quizzes IA
                            </h3>
                            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                                Carregue sebentas ou anotações em PDF e converta a matéria em simulados práticos focados nas provas angolanas.
                            </p>
                        </CardContent>
                    </div>

                    <CardFooter className="pt-2 pb-4">
                        <div className="w-full bg-card border border-zinc-800 rounded-lg p-3 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <HugeiconsIcon icon={Pdf02Icon} size={16} className="text-zinc-400 shrink-0" />
                                    <span className="font-lato text-xs text-zinc-300 truncate">
                                        Contabilidade_Geral.pdf
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500 shrink-0">
                                    <HugeiconsIcon icon={Clock01Icon} size={12} />
                                    <span>6s</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                                <span className="font-mono text-xs text-zinc-300">
                                    12 Questões
                                </span>

                                <button
                                    type="button"
                                    className="font-poppins inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-white rounded-md transition-colors cursor-pointer"
                                >
                                    <span>Resolver</span>
                                    <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                                </button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>

                {/* Card 2: Gamificação & Ligas Universitárias */}
                <Card className="h-full bg-card border-zinc-800/80 shadow-none rounded-xl text-zinc-100 flex flex-col justify-between lg:col-span-2">
                    <div>
                        <CardHeader className="pb-3 border-b border-zinc-800/60 flex flex-row items-center justify-between">
                            <span className="font-montserrat text-[11px] font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                                <HugeiconsIcon icon={TrophyIcon} size={15} className="text-zinc-400" />
                                Ligas Académicas
                            </span>
                            <span className="font-mono text-[10px] text-zinc-500 uppercase">
                                Luanda
                            </span>
                        </CardHeader>

                        <CardContent className="space-y-2 pt-4 font-lato">
                            <h3 className="font-montserrat text-lg font-semibold text-white tracking-tight">
                                Honre a sua Faculdade
                            </h3>
                            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                                Cada questão resolvida soma pontos para a sua faculdade na tabela semanal interuniversitária.
                            </p>
                        </CardContent>
                    </div>

                    <CardFooter className="pt-2 pb-4">
                        <div className="w-full bg-card border border-zinc-800 rounded-lg p-3 space-y-1 font-lato">
                            {/* 1º Lugar */}
                            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60 text-xs">
                                <div className="flex items-center gap-2.5">
                                    <span className="font-mono text-xs font-semibold text-white w-4">
                                        01
                                    </span>
                                    <span className="font-medium text-white">Economia UAN</span>
                                </div>
                                <span className="font-mono text-xs font-semibold text-white">38.450 XP</span>
                            </div>

                            {/* 2º Lugar */}
                            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60 text-xs text-zinc-400">
                                <div className="flex items-center gap-2.5">
                                    <span className="font-mono text-xs text-zinc-600 w-4">
                                        02
                                    </span>
                                    <span>Direito UCAN</span>
                                </div>
                                <span className="font-mono text-xs text-zinc-400">35.120 XP</span>
                            </div>

                            {/* 3º Lugar */}
                            <div className="flex items-center justify-between py-2 text-xs text-zinc-400">
                                <div className="flex items-center gap-2.5">
                                    <span className="font-mono text-xs text-zinc-600 w-4">
                                        03
                                    </span>
                                    <span>Engenharia ISPTEC</span>
                                </div>
                                <span className="font-mono text-xs text-zinc-400">31.800 XP</span>
                            </div>
                        </div>
                    </CardFooter>
                </Card>

            </div>
        </section>
    );
}