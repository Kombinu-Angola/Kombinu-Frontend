import { QuoteUpIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function ManifestoSection() {
    return (
        <section className="w-full py-16 sm:py-20 lg:py-24 bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{
                        duration: 0.7,
                        ease: "easeOut",
                    }}
                    whileHover={{
                        y: -6,
                        transition: {
                            duration: 0.2,
                            ease: "easeOut",
                        },
                    }}
                    className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-card shadow-sm space-y-8"
                >

                    {/* Cabeçalho */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1,
                            ease: "easeOut",
                        }}
                        className="space-y-3"
                    >
                        <motion.span
                            whileHover={{
                                x: 4,
                                transition: {
                                    duration: 0.2,
                                    ease: "easeOut",
                                },
                            }}
                            className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary inline-flex items-center gap-1.5"
                        >
                            <HugeiconsIcon
                                icon={SparklesIcon}
                                size={14}
                            />

                            O Nosso Manifesto
                        </motion.span>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                            Por que estamos a construir a Kombinu em Luanda.
                        </h2>
                    </motion.div>

                    {/* Corpo do Texto */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.2,
                            ease: "easeOut",
                        }}
                        className="space-y-5 text-sm sm:text-base text-muted-foreground leading-relaxed"
                    >
                        <p>
                            Quem estuda no ensino superior em Luanda conhece o peso diário: passar 3 a 4 horas nos engarrafamentos entre o trabalho e a faculdade, disputar uma tomada no anfiteatro e tentar ler um PDF ilegível de 120 slides no telemóvel enquanto a bateria e o saldo de dados vão embora.
                        </p>

                        <p className="font-medium text-foreground">
                            Acreditamos que a universidade em Angola não devia ser uma maratona de fotocópias desbotadas, grupos de WhatsApp desorganizados e gastos excessivos com recargas móveis.
                        </p>

                        <p>
                            A{" "}
                            <strong className="text-primary font-bold">
                                Kombinu
                            </strong>{" "}
                            nasceu dessa indignação. Desenhámos uma tecnologia pensada primeiro para o contexto angolano: leve, que corre com sinal 3G fraco, que valoriza cada kwanza gasto em dados móveis e que empodera tanto os estudantes que querem passar quanto os monitores e explicadores que geram conteúdos de excelência.
                        </p>
                    </motion.div>

                    {/* Assinatura */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.3,
                            ease: "easeOut",
                        }}
                        className="pt-6 border-t border-border/40 flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-3.5">

                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    y: -2,
                                    transition: {
                                        duration: 0.2,
                                        ease: "easeOut",
                                    },
                                }}
                                className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0"
                            >
                                OF
                            </motion.div>

                            <div>
                                <h4 className="font-bold text-sm sm:text-base text-foreground">
                                    Orlando Fortuna & Equipa Fundadora
                                </h4>

                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Desenvolvido por estudantes e graduados das universidades de Luanda
                                </p>
                            </div>
                        </div>

                        <motion.div
                            whileHover={{
                                x: 4,
                                rotate: -4,
                                transition: {
                                    duration: 0.2,
                                    ease: "easeOut",
                                },
                            }}
                            className="hidden sm:flex text-primary/20 shrink-0"
                        >
                            <HugeiconsIcon
                                icon={QuoteUpIcon}
                                size={36}
                            />
                        </motion.div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
}