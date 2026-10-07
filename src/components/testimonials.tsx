import { QuoteUpIcon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function TestimonialsSection() {
    return (
        <section className="w-full py-12 sm:py-16 lg:py-20  text-foreground">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Cabeçalho */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{
                        duration: 0.6,
                        ease: "easeOut",
                    }}
                    className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
                >
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary">
                        Verdade Radical
                    </span>

                    <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                        O que dizem os estudantes que já passaram nos testes
                    </h2>
                </motion.div>

                {/* Grid de Depoimentos sem bordas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

                    {/* Depoimento 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.1,
                            ease: "easeOut",
                        }}
                        whileHover={{
                            y: -8,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut",
                            },
                        }}
                        className="flex flex-col justify-between p-6 rounded-2xl bg-card shadow-sm"
                    >
                        <div>

                            {/* Estrelas + Quote */}
                            <div className="flex items-center justify-between mb-4">

                                <motion.div
                                    whileHover={{
                                        scale: 1.05,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeOut",
                                        },
                                    }}
                                    className="flex text-amber-500 gap-0.5"
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.7 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{
                                                once: false,
                                                amount: 0.2,
                                            }}
                                            transition={{
                                                duration: 0.25,
                                                delay: 0.2 + i * 0.05,
                                            }}
                                        >
                                            <HugeiconsIcon
                                                icon={StarIcon}
                                                size={14}
                                                className="fill-amber-500"
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <motion.div
                                    whileHover={{
                                        y: -3,
                                        rotate: -5,
                                        scale: 1.05,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeOut",
                                        },
                                    }}
                                >
                                    <HugeiconsIcon
                                        icon={QuoteUpIcon}
                                        size={20}
                                        className="text-primary/30"
                                    />
                                </motion.div>

                            </div>

                            {/* Texto */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.3,
                                }}
                                className="text-sm text-muted-foreground leading-relaxed italic"
                            >
                                “Mano, salvei Economia graças aos quizzes da Kombinu. Caiu exatamente a pergunta do BNA no teste da UAN! A melhor parte foi poder rever tudo no candongueiro sem travar a internet.”
                            </motion.p>

                        </div>

                        {/* Autor */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.4,
                            }}
                            className="mt-6 pt-4 flex items-center gap-3"
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.08,
                                    y: -2,
                                    transition: {
                                        duration: 0.2,
                                        ease: "easeOut",
                                    },
                                }}
                                className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0"
                            >
                                HK
                            </motion.div>

                            <div className="min-w-0">
                                <h4 className="font-semibold text-sm text-card-foreground truncate">
                                    Hamilton K.
                                </h4>

                                <p className="text-xs text-muted-foreground truncate">
                                    2º Ano Economia • UAN
                                </p>
                            </div>
                        </motion.div>

                    </motion.div>

                    {/* Depoimento 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.2,
                            ease: "easeOut",
                        }}
                        whileHover={{
                            y: -8,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut",
                            },
                        }}
                        className="flex flex-col justify-between p-6 rounded-2xl bg-card shadow-sm"
                    >
                        <div>

                            {/* Estrelas + Quote */}
                            <div className="flex items-center justify-between mb-4">

                                <motion.div
                                    whileHover={{
                                        scale: 1.05,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeOut",
                                        },
                                    }}
                                    className="flex text-amber-500 gap-0.5"
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.7 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{
                                                once: false,
                                                amount: 0.2,
                                            }}
                                            transition={{
                                                duration: 0.25,
                                                delay: 0.3 + i * 0.05,
                                            }}
                                        >
                                            <HugeiconsIcon
                                                icon={StarIcon}
                                                size={14}
                                                className="fill-amber-500"
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <motion.div
                                    whileHover={{
                                        y: -3,
                                        rotate: -5,
                                        scale: 1.05,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeOut",
                                        },
                                    }}
                                >
                                    <HugeiconsIcon
                                        icon={QuoteUpIcon}
                                        size={20}
                                        className="text-primary/30"
                                    />
                                </motion.div>

                            </div>

                            {/* Texto */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.4,
                                }}
                                className="text-sm text-muted-foreground leading-relaxed italic"
                            >
                                “Eu gastava 4 mil kwanzas por mês só imprimindo slides cheios de fotos que nem lia. Agora estudo no táxi a caminho do trabalho sem gastar o meu saldo da Unitel. O modo leve funciona mesmo.”
                            </motion.p>

                        </div>

                        {/* Autor */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.5,
                            }}
                            className="mt-6 pt-4 flex items-center gap-3"
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.08,
                                    y: -2,
                                    transition: {
                                        duration: 0.2,
                                        ease: "easeOut",
                                    },
                                }}
                                className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0"
                            >
                                JM
                            </motion.div>

                            <div className="min-w-0">
                                <h4 className="font-semibold text-sm text-card-foreground truncate">
                                    Jéssica M.
                                </h4>

                                <p className="text-xs text-muted-foreground truncate">
                                    Estudante de Gestão • UCAN
                                </p>
                            </div>
                        </motion.div>

                    </motion.div>

                    {/* Depoimento 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.3,
                            ease: "easeOut",
                        }}
                        whileHover={{
                            y: -8,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut",
                            },
                        }}
                        className="flex flex-col justify-between p-6 rounded-2xl bg-card shadow-sm"
                    >
                        <div>

                            {/* Estrelas + Quote */}
                            <div className="flex items-center justify-between mb-4">

                                <motion.div
                                    whileHover={{
                                        scale: 1.05,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeOut",
                                        },
                                    }}
                                    className="flex text-amber-500 gap-0.5"
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.7 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{
                                                once: false,
                                                amount: 0.2,
                                            }}
                                            transition={{
                                                duration: 0.25,
                                                delay: 0.4 + i * 0.05,
                                            }}
                                        >
                                            <HugeiconsIcon
                                                icon={StarIcon}
                                                size={14}
                                                className="fill-amber-500"
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <motion.div
                                    whileHover={{
                                        y: -3,
                                        rotate: -5,
                                        scale: 1.05,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeOut",
                                        },
                                    }}
                                >
                                    <HugeiconsIcon
                                        icon={QuoteUpIcon}
                                        size={20}
                                        className="text-primary/30"
                                    />
                                </motion.div>

                            </div>

                            {/* Texto */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.5,
                                }}
                                className="text-sm text-muted-foreground leading-relaxed italic"
                            >
                                “Publiquei o meu resumo de Direito Fiscal e fiz 45.000 AOA em uma semana vendendo para colegas de outras turmas. O pagamento cai direto pelo Multicaixa Express sem complicação.”
                            </motion.p>

                        </div>

                        {/* Autor */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.6,
                            }}
                            className="mt-6 pt-4 flex items-center gap-3"
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.08,
                                    y: -2,
                                    transition: {
                                        duration: 0.2,
                                        ease: "easeOut",
                                    },
                                }}
                                className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0"
                            >
                                MP
                            </motion.div>

                            <div className="min-w-0">
                                <h4 className="font-semibold text-sm text-card-foreground truncate">
                                    Mauro P.
                                </h4>

                                <p className="text-xs text-muted-foreground truncate">
                                    Explicador Independente • Luanda
                                </p>
                            </div>
                        </motion.div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
}