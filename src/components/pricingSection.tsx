import {
    ArrowRight01Icon,
    Cancel01Icon,
    CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { Button3D } from "./ui/Button3D";

export default function PricingSection() {
    return (
        <section
            id="prices"
            className="w-full py-12 sm:py-16 lg:py-20 bg-background text-foreground"
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* Cabeçalho */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{
                        duration: 0.6,
                        ease: "easeOut",
                    }}
                    className="text-center max-w-2xl mx-auto mb-10 sm:mb-16"
                >
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary">
                        Planos Transparentes
                    </span>

                    <h2 className="font-heading mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                        Menos que uma fotocópia por dia. Sem letras pequenas.
                    </h2>

                    <p className="mt-3 text-sm sm:text-base text-text-secondary">
                        Estude gratuitamente com a comunidade ou acelere a sua
                        preparação com o Kombinu Pro.
                    </p>
                </motion.div>

                {/* Comparativo de 2 Planos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                    {/* Plano Básico */}
                    <motion.div
                        initial={{ opacity: 0, x: -35 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.7,
                            ease: "easeOut",
                        }}
                        whileHover={{
                            y: -8,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut",
                            },
                        }}
                        className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl border-2 border-border-cloud bg-surface-canvas shadow-clay"
                    >
                        <div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                                    Acesso Essencial
                                </span>

                                <h3 className="font-heading mt-1 text-2xl font-bold text-on-surface">
                                    Plano Básico
                                </h3>

                                <div className="mt-4 flex items-baseline gap-1">
                                    <motion.span
                                        whileHover={{
                                            scale: 1.05,
                                            transition: {
                                                duration: 0.2,
                                                ease: "easeOut",
                                            },
                                        }}
                                        className="text-3xl sm:text-4xl font-extrabold text-on-surface"
                                    >
                                        0 AOA
                                    </motion.span>

                                    <span className="text-xs sm:text-sm text-text-secondary">
                                        / para sempre
                                    </span>
                                </div>
                            </div>

                            {/* Lista de Recursos */}
                            <ul className="mt-6 space-y-3.5 text-xs sm:text-sm">

                                <motion.li
                                    initial={{ opacity: 0, x: -15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <span className="text-feedback-success-ink shrink-0 mt-0.5">
                                        <HugeiconsIcon
                                            icon={CheckmarkCircle02Icon}
                                            size={18}
                                        />
                                    </span>

                                    <span className="text-on-surface">
                                        Acesso a resumos e sebentas de livre acesso
                                    </span>
                                </motion.li>

                                <motion.li
                                    initial={{ opacity: 0, x: -15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="flex items-start gap-3"
                                >
                                    <span className="text-feedback-success-ink shrink-0 mt-0.5">
                                        <HugeiconsIcon
                                            icon={CheckmarkCircle02Icon}
                                            size={18}
                                        />
                                    </span>

                                    <span className="text-on-surface">
                                        Quizzes básicos de fixação da comunidade
                                    </span>
                                </motion.li>

                                <motion.li
                                    initial={{ opacity: 0, x: -15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="flex items-start gap-3"
                                >
                                    <span className="text-feedback-success-ink shrink-0 mt-0.5">
                                        <HugeiconsIcon
                                            icon={CheckmarkCircle02Icon}
                                            size={18}
                                        />
                                    </span>

                                    <span className="text-on-surface">
                                        Até 3 uploads de ficheiro IA por mês
                                    </span>
                                </motion.li>

                                <motion.li
                                    initial={{ opacity: 0, x: -15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                    className="flex items-start gap-3"
                                >
                                    <span className="text-text-secondary/50 shrink-0 mt-0.5">
                                        <HugeiconsIcon
                                            icon={Cancel01Icon}
                                            size={18}
                                        />
                                    </span>

                                    <span className="text-text-secondary line-through">
                                        Sem modo offline de leitura
                                    </span>
                                </motion.li>

                                <motion.li
                                    initial={{ opacity: 0, x: -15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.4, delay: 0.5 }}
                                    className="flex items-start gap-3"
                                >
                                    <span className="text-text-secondary/50 shrink-0 mt-0.5">
                                        <HugeiconsIcon
                                            icon={Cancel01Icon}
                                            size={18}
                                        />
                                    </span>

                                    <span className="text-text-secondary line-through">
                                        Sem simulados com temporizador de exame
                                    </span>
                                </motion.li>

                            </ul>
                        </div>

                        <div className="mt-8">
                            <Button3D variant="ghost" fullWidth>
                                Começar Grátis Agora
                            </Button3D>
                        </div>
                    </motion.div>

                    {/* Plano Pro */}
                    <motion.div
                        initial={{ opacity: 0, x: 35 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.7,
                            ease: "easeOut",
                            delay: 0.1,
                        }}
                        whileHover={{
                            y: -8,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut",
                            },
                        }}
                        className="relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-surface-canvas border-2 border-primary shadow-xl ring-1 ring-primary/20"
                    >

                        {/* Badge Flutuante */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -8 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.25,
                                ease: "easeOut",
                            }}
                            whileHover={{
                                scale: 1.05,
                                transition: {
                                    duration: 0.2,
                                },
                            }}
                            className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm"
                        >
                            <span>MAIS POPULAR</span>
                        </motion.div>

                        <div>
                            <div className="pb-6 border-b border-border-cloud">
                                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                    Passe Direto sem Recurso
                                </span>

                                <h3 className="font-heading mt-1 text-2xl font-bold text-on-surface">
                                    Kombinu Pro
                                </h3>

                                <div className="mt-4 flex items-baseline gap-1">
                                    <motion.span
                                        whileHover={{
                                            scale: 1.05,
                                            transition: {
                                                duration: 0.2,
                                                ease: "easeOut",
                                            },
                                        }}
                                        className="text-3xl sm:text-4xl font-extrabold text-on-surface"
                                    >
                                        5.000 AOA
                                    </motion.span>

                                    <span className="text-xs sm:text-sm text-text-secondary">
                                        / mês via Multicaixa Express
                                    </span>
                                </div>
                            </div>

                            {/* Lista de Recursos Pro */}
                            <ul className="mt-6 space-y-3.5 text-xs sm:text-sm">

                                <motion.li
                                    initial={{ opacity: 0, x: 15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className="flex items-start gap-3 text-on-surface"
                                >
                                    <span className="text-primary shrink-0 mt-0.5">
                                        <HugeiconsIcon
                                            icon={CheckmarkCircle02Icon}
                                            size={18}
                                        />
                                    </span>

                                    <span className="font-medium">
                                        Uploads de IA ilimitados gerados em &lt; 10s
                                    </span>
                                </motion.li>

                                <motion.li
                                    initial={{ opacity: 0, x: 15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="flex items-start gap-3 text-on-surface"
                                >
                                    <span className="text-primary shrink-0 mt-0.5">
                                        <HugeiconsIcon
                                            icon={CheckmarkCircle02Icon}
                                            size={18}
                                        />
                                    </span>

                                    <span className="font-medium">
                                        Banco completo de frequências e exames dos últimos 5 anos
                                    </span>
                                </motion.li>

                                <motion.li
                                    initial={{ opacity: 0, x: 15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="flex items-start gap-3 text-on-surface"
                                >
                                    <span className="text-primary shrink-0 mt-0.5">
                                        <HugeiconsIcon
                                            icon={CheckmarkCircle02Icon}
                                            size={18}
                                        />
                                    </span>

                                    <span className="font-medium">
                                        Download offline: estude mesmo sem saldo de dados ativo
                                    </span>
                                </motion.li>

                                <motion.li
                                    initial={{ opacity: 0, x: 15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                    className="flex items-start gap-3 text-on-surface"
                                >
                                    <span className="text-primary shrink-0 mt-0.5">
                                        <HugeiconsIcon
                                            icon={CheckmarkCircle02Icon}
                                            size={18}
                                        />
                                    </span>

                                    <span className="font-medium">
                                        Suporte prioritário via WhatsApp
                                    </span>
                                </motion.li>

                                <motion.li
                                    initial={{ opacity: 0, x: 15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.4, delay: 0.5 }}
                                    className="flex items-start gap-3 text-on-surface"
                                >
                                    <span className="text-primary shrink-0 mt-0.5">
                                        <HugeiconsIcon
                                            icon={CheckmarkCircle02Icon}
                                            size={18}
                                        />
                                    </span>

                                    <span className="font-medium">
                                        0% de comissão na venda das suas próprias sebentas
                                    </span>
                                </motion.li>

                            </ul>
                        </div>

                        <div className="mt-8 space-y-3">
                            <Button3D
                                variant="primary"
                                fullWidth
                                trailingIcon={<HugeiconsIcon icon={ArrowRight01Icon} size={16} />}
                            >
                                Assinar Pro com Multicaixa Express
                            </Button3D>

                            <p className="text-center text-[11px] sm:text-xs text-text-secondary">
                                Sem fidelização • Cancele quando o semestre terminar
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}