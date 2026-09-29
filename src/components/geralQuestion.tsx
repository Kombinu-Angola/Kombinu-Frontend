import { Add01Icon, HelpCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { useState } from "react";

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            id="how-it-works"
            className="w-full py-12 sm:py-16 lg:py-20 bg-background text-foreground"
        >
            <div className="max-w-3xl mx-auto px-4 sm:px-6">

                {/* Cabeçalho */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{
                        duration: 0.6,
                        ease: "easeOut",
                    }}
                    className="text-center mb-10 sm:mb-12"
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
                        <HugeiconsIcon icon={HelpCircleIcon} size={15} />
                        Tire as suas Dúvidas
                    </motion.span>

                    <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Perguntas Frequentes
                    </h2>
                </motion.div>

                {/* Lista de Acordeões */}
                <div className="space-y-3">

                    {/* Pergunta 1: Modo Data-Lean */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1,
                            ease: "easeOut",
                        }}
                        whileHover={{
                            y: -3,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut",
                            },
                        }}
                        className="rounded-2xl bg-card border border-border overflow-hidden"
                    >
                        <button
                            type="button"
                            onClick={() => toggle(0)}
                            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                        >
                            <span className="font-semibold text-sm sm:text-base text-foreground">
                                Como o Modo Data-Lean gasta menos de 5MB por hora?
                            </span>

                            <motion.span
                                animate={{
                                    rotate: openIndex === 0 ? 45 : 0,
                                }}
                                transition={{
                                    duration: 0.25,
                                    ease: "easeOut",
                                }}
                                className={`shrink-0 ${openIndex === 0
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                    }`}
                            >
                                <HugeiconsIcon icon={Add01Icon} size={20} />
                            </motion.span>
                        </button>

                        {openIndex === 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                }}
                                className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                            >
                                Eliminámos bibliotecas de JavaScript pesadas, convertemos equações e tabelas em texto estruturado puro e armazenamos o conteúdo lido em cache local. Isso significa que após carregar a página inicial, cada leitura consome apenas alguns kilobytes.
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Pergunta 2: Pagamento */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.2,
                            ease: "easeOut",
                        }}
                        whileHover={{
                            y: -3,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut",
                            },
                        }}
                        className="rounded-2xl bg-card border border-border overflow-hidden"
                    >
                        <button
                            type="button"
                            onClick={() => toggle(1)}
                            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                        >
                            <span className="font-semibold text-sm sm:text-base text-foreground">
                                Como funciona o pagamento via Multicaixa Express?
                            </span>

                            <motion.span
                                animate={{
                                    rotate: openIndex === 1 ? 45 : 0,
                                }}
                                transition={{
                                    duration: 0.25,
                                    ease: "easeOut",
                                }}
                                className={`shrink-0 ${openIndex === 1
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                    }`}
                            >
                                <HugeiconsIcon icon={Add01Icon} size={20} />
                            </motion.span>
                        </button>

                        {openIndex === 1 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                }}
                                className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                            >
                                Ao assinar o Kombinu Pro ou comprar uma sebenta avulsa, insere o seu número de telemóvel associado ao Multicaixa Express e recebe a notificação no telemóvel para autorizar com o seu PIN em poucos segundos.
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Pergunta 3: Uso Gratuito */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.3,
                            ease: "easeOut",
                        }}
                        whileHover={{
                            y: -3,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut",
                            },
                        }}
                        className="rounded-2xl bg-card border border-border overflow-hidden"
                    >
                        <button
                            type="button"
                            onClick={() => toggle(2)}
                            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                        >
                            <span className="font-semibold text-sm sm:text-base text-foreground">
                                Como posso usar a Kombinu de forma totalmente gratuita?
                            </span>

                            <motion.span
                                animate={{
                                    rotate: openIndex === 2 ? 45 : 0,
                                }}
                                transition={{
                                    duration: 0.25,
                                    ease: "easeOut",
                                }}
                                className={`shrink-0 ${openIndex === 2
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                    }`}
                            >
                                <HugeiconsIcon icon={Add01Icon} size={20} />
                            </motion.span>
                        </button>

                        {openIndex === 2 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                }}
                                className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                            >
                                O Plano Básico é 0 AOA para sempre. Tem acesso imediato a todas as sebentas e resumos públicos partilhados pela comunidade, quizzes de fixação básicos e até 3 uploads de ficheiros com inteligência artificial por mês, sem necessidade de registar cartão ou conta bancária.
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Pergunta 4: Venda de Sebentas */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.4,
                            ease: "easeOut",
                        }}
                        whileHover={{
                            y: -3,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut",
                            },
                        }}
                        className="rounded-2xl bg-card border border-border overflow-hidden"
                    >
                        <button
                            type="button"
                            onClick={() => toggle(3)}
                            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                        >
                            <span className="font-semibold text-sm sm:text-base text-foreground">
                                Como posso vender as minhas próprias sebentas e resumos?
                            </span>

                            <motion.span
                                animate={{
                                    rotate: openIndex === 3 ? 45 : 0,
                                }}
                                transition={{
                                    duration: 0.25,
                                    ease: "easeOut",
                                }}
                                className={`shrink-0 ${openIndex === 3
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                    }`}
                            >
                                <HugeiconsIcon icon={Add01Icon} size={20} />
                            </motion.span>
                        </button>

                        {openIndex === 3 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                }}
                                className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                            >
                                Basta aceder ao Marketplace, submeter o seu ficheiro ou apontamento e definir o preço em Kwanzas (AOA). Após aprovação de qualidade pela moderação, a sua sebenta fica listada para estudantes de todo o país. Os pagamentos dos colegas são processados via Multicaixa Express e o valor arrecadado é transferido diretamente para a sua conta.
                            </motion.div>
                        )}
                    </motion.div>

                </div>
            </div>
        </section>
    );
}