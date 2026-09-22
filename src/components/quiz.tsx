import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ArrowRight01Icon, Clock01Icon, Idea01Icon, Pdf02Icon, TrophyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function QuizSection() {
    return (
        <section className="mt-12 px-4 max-w-6xl mx-auto">



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">


                <Card className=" bg-card shadow-sm flex flex-col justify-between lg:col-span-1">
                    <div>

                        <CardContent className=" sm:p-6 pt-0">
                            <h3 className="text-lg sm:text-lg font-bold text-foreground">
                                <div className="flex w-fit p-1.5 rounded-lg bg-primary/10 text-primary gap-8 flex-col">
                                    <HugeiconsIcon icon={Idea01Icon} size={30} />
                                </div>
                                Gerador de Quizzes IA em (&lt; 10s)
                            </h3>
                            <p className="mt-2 text-xs sm:text-sm text-[#424752] leading-relaxed">
                                Carregue qualquer sebenta ou anotação de caderno em PDF ou foto e veja o nosso motor de inteligência artificial criar um simulado pronto a resolver.
                            </p>
                        </CardContent>
                        <CardFooter className="p-4 sm:p-6 pt-0">
                            <div className="w-full bg-background/80 border border-border p-4 rounded-xl space-y-3">
                                {/* Cabeçalho com informações do ficheiro e tempo */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <HugeiconsIcon icon={Pdf02Icon} size={18} className="text-red-500 shrink-0" />
                                        <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                                            Apontamentos_Contabilidade_Geral.pdf
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                        <HugeiconsIcon icon={Clock01Icon} size={14} />
                                        <span>6 seg</span>
                                    </div>
                                </div>

                                {/* Resumo do quiz e botão de ação */}
                                <div className="flex items-center p-6 justify-between gap-3 pt-1 border-t border-border/50">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                                        <span>✨</span>
                                        <span>12 Questões Geradas</span>
                                    </div>

                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <span>Resolver agora</span>
                                        <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                                    </button>
                                </div>
                            </div>
                        </CardFooter>
                    </div>


                </Card>
                {/* Card: Gamificação & Ligas Universitárias */}
                <Card className=" bg-card shadow-sm flex flex-col justify-between lg:col-span-2">
                    <div>

                        <CardTitle className="text-sm px-6 py-4 font-bold tracking-wide uppercase text-primary">
                            <div className="flex  rounded-lg text-primary gap-2 items-center">
                                <HugeiconsIcon icon={TrophyIcon} size={30} />
                                Gamificação & Rivalidade Saudável
                            </div>


                        </CardTitle>


                        <h3 className="text-lg px-6  sm:text-xl font-bold text-foreground">
                            Ligas Universitárias: Honre a sua Faculdade
                        </h3>
                        <p className="mt-2 mb-12 px-6 text-xs sm:text-sm text-[#424752] leading-relaxed">
                            Cada quiz concluído soma pontos de prestígio para a sua instituição na tabela geral semanal de Luanda.
                        </p>


                        <CardFooter className="p-4 sm:p-6 pt-0">
                            <div className="w-full bg-background/80 border border-border p-10 rounded-xl space-y-2">
                                {/* 1º Lugar */}
                                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-border/40">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-500 font-bold flex items-center justify-center text-[10px] shrink-0">
                                            1º
                                        </span>
                                        <span className="font-semibold text-foreground">Economia UAN</span>
                                    </div>
                                    <span className="text-muted-foreground font-medium text-[11px]">38.450 XP</span>
                                </div>

                                {/* 2º Lugar */}
                                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-border/40">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-slate-400/15 text-slate-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                                            2º
                                        </span>
                                        <span className="font-semibold text-foreground">Direito UCAN</span>
                                    </div>
                                    <span className="text-muted-foreground font-medium text-[11px]">35.120 XP</span>
                                </div>

                                {/* 3º Lugar */}
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-amber-700/15 text-amber-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                                            3º
                                        </span>
                                        <span className="font-semibold text-foreground">Engenharia ISPTEC</span>
                                    </div>
                                    <span className="text-muted-foreground font-medium text-[11px]">31.800 XP</span>
                                </div>
                            </div>
                        </CardFooter>
                    </div>
                </Card>
            </div >
        </section >
    )
}