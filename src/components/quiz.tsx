import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
    ArrowRight01Icon,
    Clock01Icon,
    Idea01Icon,
    Pdf02Icon,
    TrophyIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export function QuizSection() {
    return (
        <section className="mt-12 px-4 max-w-6xl mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Card — Gerador de Quizzes */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{
                        once: false,
                        amount: 0.2,
                    }}
                    transition={{
                        duration: 0.7,
                        ease: "easeOut",
                    }}
                    className="lg:col-span-1"
                >
                    <Card className="bg-card shadow-sm flex flex-col justify-between h-full">

                        <div>

                            <CardContent className="p-4 sm:p-6 pt-4">

                                {/* Ícone */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{
                                        once: false,
                                        amount: 0.2,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.2,
                                    }}
                                    className="flex w-fit p-2 rounded-lg bg-primary/10 text-primary"
                                >
                                    <HugeiconsIcon
                                        icon={Idea01Icon}
                                        size={30}
                                    />
                                </motion.div>

                                {/* Título */}
                                <motion.h3
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{
                                        once: false,
                                        amount: 0.2,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.3,
                                    }}
                                    className="mt-4 text-lg sm:text-xl font-bold text-card-foreground"
                                >
                                    Gerador de Quizzes IA em (&lt; 10s)
                                </motion.h3>

                                {/* Descrição */}
                                <motion.p
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{
                                        once: false,
                                        amount: 0.2,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.4,
                                    }}
                                    className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                                >
                                    Carregue qualquer sebenta ou anotação de caderno
                                    em PDF ou foto e veja o nosso motor de inteligência
                                    artificial criar um simulado pronto a resolver.
                                </motion.p>

                            </CardContent>

                            {/* Área do ficheiro */}
                            <CardFooter className="p-4 sm:p-6 pt-0">

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{
                                        once: false,
                                        amount: 0.2,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.5,
                                        ease: "easeOut",
                                    }}
                                    className="w-full bg-background/80 border border-border p-4 rounded-xl space-y-3"
                                >

                                    {/* Ficheiro + tempo */}
                                    <div className="flex items-center justify-between gap-2">

                                        <div className="flex items-center gap-2 min-w-0">

                                            <HugeiconsIcon
                                                icon={Pdf02Icon}
                                                size={18}
                                                className="text-red-500 shrink-0"
                                            />

                                            <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                                                Apontamentos_Contabilidade_Geral.pdf
                                            </span>

                                        </div>

                                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">

                                            <HugeiconsIcon
                                                icon={Clock01Icon}
                                                size={14}
                                            />

                                            <span>6 seg</span>

                                        </div>

                                    </div>

                                    {/* Resultado */}
                                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50">

                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">

                                            <span>✨</span>

                                            <span>
                                                12 Questões Geradas
                                            </span>

                                        </div>

                                        <motion.button
                                            whileHover={{
                                                scale: 1.03,
                                            }}
                                            whileTap={{
                                                scale: 0.97,
                                            }}
                                            type="button"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <span>
                                                Resolver agora
                                            </span>

                                            <HugeiconsIcon
                                                icon={ArrowRight01Icon}
                                                size={14}
                                            />
                                        </motion.button>

                                    </div>

                                </motion.div>

                            </CardFooter>

                        </div>

                    </Card>
                </motion.div>

                {/* Card — Gamificação */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{
                        once: false,
                        amount: 0.2,
                    }}
                    transition={{
                        duration: 0.7,
                        ease: "easeOut",
                        delay: 0.1,
                    }}
                    className="lg:col-span-2"
                >
                    <Card className="bg-card shadow-sm flex flex-col justify-between h-full">

                        <div>

                            {/* Título */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{
                                    once: false,
                                    amount: 0.2,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2,
                                }}
                            >
                                <CardTitle className="text-sm px-6 py-4 font-bold tracking-wide uppercase text-primary">

                                    <div className="flex rounded-lg text-primary gap-2 items-center">

                                        <HugeiconsIcon
                                            icon={TrophyIcon}
                                            size={30}
                                        />

                                        <span>
                                            Gamificação & Rivalidade Saudável
                                        </span>

                                    </div>

                                </CardTitle>
                            </motion.div>

                            {/* Heading */}
                            <motion.h3
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{
                                    once: false,
                                    amount: 0.2,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.3,
                                }}
                                className="text-lg px-6 sm:text-xl font-bold text-card-foreground"
                            >
                                Ligas Universitárias: Honre a sua Faculdade
                            </motion.h3>

                            {/* Descrição */}
                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{
                                    once: false,
                                    amount: 0.2,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.4,
                                }}
                                className="mt-2 mb-12 px-6 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                            >
                                Cada quiz concluído soma pontos de prestígio para a sua
                                instituição na tabela geral semanal de Luanda.
                            </motion.p>

                            {/* Ranking */}
                            <CardFooter className="p-4 sm:p-6 pt-0">

                                <motion.div
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{
                                        once: false,
                                        amount: 0.2,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.5,
                                        ease: "easeOut",
                                    }}
                                    className="w-full bg-background/80 border border-border p-6 sm:p-10 rounded-xl space-y-2"
                                >

                                    {/* 1º Lugar */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -15 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{
                                            once: false,
                                            amount: 0.2,
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay: 0.6,
                                        }}
                                        className="flex items-center justify-between text-xs pb-1.5 border-b border-border/40"
                                    >
                                        <div className="flex items-center gap-2">

                                            <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-500 font-bold flex items-center justify-center text-[10px] shrink-0">
                                                1º
                                            </span>

                                            <span className="font-semibold text-foreground">
                                                Economia UAN
                                            </span>

                                        </div>

                                        <span className="text-muted-foreground font-medium text-[11px]">
                                            38.450 XP
                                        </span>

                                    </motion.div>

                                    {/* 2º Lugar */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -15 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{
                                            once: false,
                                            amount: 0.2,
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay: 0.7,
                                        }}
                                        className="flex items-center justify-between text-xs pb-1.5 border-b border-border/40"
                                    >
                                        <div className="flex items-center gap-2">

                                            <span className="w-5 h-5 rounded-full bg-slate-400/15 text-slate-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                                                2º
                                            </span>

                                            <span className="font-semibold text-foreground">
                                                Direito UCAN
                                            </span>

                                        </div>

                                        <span className="text-muted-foreground font-medium text-[11px]">
                                            35.120 XP
                                        </span>

                                    </motion.div>

                                    {/* 3º Lugar */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -15 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{
                                            once: false,
                                            amount: 0.2,
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay: 0.8,
                                        }}
                                        className="flex items-center justify-between text-xs"
                                    >
                                        <div className="flex items-center gap-2">

                                            <span className="w-5 h-5 rounded-full bg-amber-700/15 text-amber-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                                                3º
                                            </span>

                                            <span className="font-semibold text-foreground">
                                                Engenharia ISPTEC
                                            </span>

                                        </div>

                                        <span className="text-muted-foreground font-medium text-[11px]">
                                            31.800 XP
                                        </span>

                                    </motion.div>

                                </motion.div>

                            </CardFooter>

                        </div>

                    </Card>
                </motion.div>

            </div>
        </section>
    );
}