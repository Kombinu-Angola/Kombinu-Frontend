import {
    CheckmarkBadge01Icon,
    FilterIcon,
    Time02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function MethodologySection() {
    const steps = [
        {
            step: "PASSO 01",
            title: "Escolha a sua Cadeira",
            description:
                "Filtre pela sua faculdade (UAN, UCAN, ISPTEC, etc.), ano letivo e selecione o tópico exato do teste agendado.",
            tag: "Currículos 100% atualizados para 2025",
            icon: FilterIcon,
        },
        {
            step: "PASSO 02",
            title: "Consuma a Micro-Leitura",
            description:
                "Textos sintetizados pelos melhores explicadores e alunos de 18 e 19 valores. Foque apenas no que cai nos exames.",
            tag: "Leituras médias de 4 a 6 minutos",
            icon: Time02Icon,
        },
        {
            step: "PASSO 03",
            title: "Fixe com Quizzes & Avance",
            description:
                "Treine sob pressão de tempo, ganhe XP, mantenha a sua ofensiva diária e chegue ao anfiteatro com confiança total.",
            tag: "Gabarito comentado na hora",
            icon: CheckmarkBadge01Icon,
        },
    ];

    return (
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-background text-foreground">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Cabeçalho */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{
                        once: false,
                        amount: 0.2,
                    }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                    }}
                    whileHover={{
                        y: -20,
                        transition: {
                            duration: 0.2,
                            ease: "easeOut",
                        },
                    }}


                    className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
                >
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary">
                        Metodologia Comprovada
                    </span>

                    <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                        Do desespero da matéria ao domínio em 3 passos.
                    </h2>
                </motion.div>

                {/* Grid de Passos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 hover:">

                    {steps.map((item, index) => (
                        <motion.div
                            key={item.step}
                            initial={{
                                opacity: 0,
                                y: 35,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: false,
                                amount: 0.2,
                            }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.15,
                                ease: "easeOut",
                            }}
                            whileHover={{
                                y: -20,
                                transition: {
                                    duration: 0.2,
                                    ease: "easeOut",
                                },
                            }}
                            className="relative flex flex-col justify-between p-6 rounded-2xl bg-card shadow-sm hover:border-primary/40 transition-colors"
                        >
                            <div>

                                {/* Número do passo */}
                                <motion.span
                                    initial={{
                                        opacity: 0,
                                        x: -10,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    viewport={{
                                        once: false,
                                        amount: 0.2,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.15 + 0.15,
                                    }}
                                    className="text-xs font-bold tracking-wider uppercase text-primary"
                                >
                                    {item.step}
                                </motion.span>

                                {/* Título */}
                                <h3 className="mt-2 text-lg sm:text-xl font-bold text-card-foreground">
                                    {item.title}
                                </h3>

                                {/* Descrição */}
                                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>

                            </div>

                            {/* Tag / Badge inferior */}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 10,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: false,
                                    amount: 0.2,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.15 + 0.3,
                                }}
                                className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2 text-xs font-medium text-muted-foreground"
                            >
                                <div className="text-primary shrink-0">
                                    <HugeiconsIcon
                                        icon={item.icon}
                                        size={16}
                                    />
                                </div>

                                <span>{item.tag}</span>
                            </motion.div>

                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
}