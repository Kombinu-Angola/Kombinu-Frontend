import {
    ArrowRight01Icon,
    CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { Button3D } from "./ui/Button3D";

export default function CallToActionSection() {
    return (
        <section className="w-full py-16 sm:py-20 lg:py-24">
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
                        y: -4,
                        transition: {
                            duration: 0.2,
                            ease: "easeOut",
                        },
                    }}
                    className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16 text-center bg-primary"
                >

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1,
                            ease: "easeOut",
                        }}
                        whileHover={{
                            scale: 1.04,
                            transition: {
                                duration: 0.2,
                            },
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold tracking-wider uppercase mb-6"
                    >
                        <span>Estude Sem Limites</span>
                    </motion.div>

                    {/* Título */}
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.2,
                            ease: "easeOut",
                        }}
                        className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto"
                    >
                        Pronto para estudar menos tempo e tirar notas melhores?
                    </motion.h2>

                    {/* Descrição */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.3,
                            ease: "easeOut",
                        }}
                        className="mt-4 text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed"
                    >
                        Junte-se a milhares de estudantes universitários em Angola hoje mesmo. Comece sem pagar nada.
                    </motion.p>

                    {/* Botão */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.4,
                            ease: "easeOut",
                        }}
                        className="mt-8 flex justify-center"
                    >
                        <Button3D
                            variant="secondary"
                            size="lg"
                            trailingIcon={<HugeiconsIcon icon={ArrowRight01Icon} size={18} />}
                        >
                            Criar Conta Gratuita em 30 Segundos
                        </Button3D>
                    </motion.div>

                    {/* Benefícios */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.5,
                            ease: "easeOut",
                        }}
                        className="mt-8 pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-white/80"
                    >
                        <span className="inline-flex items-center gap-1.5">
                            <HugeiconsIcon
                                icon={CheckmarkCircle02Icon}
                                size={14}
                                className="text-white"
                            />
                            Acesso instantâneo
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                            <HugeiconsIcon
                                icon={CheckmarkCircle02Icon}
                                size={14}
                                className="text-white"
                            />
                            Não pede cartão
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                            <HugeiconsIcon
                                icon={CheckmarkCircle02Icon}
                                size={14}
                                className="text-white"
                            />
                            Cancelamento a qualquer momento
                        </span>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
}