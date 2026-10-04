import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Quiz01Icon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";

export function WhyKombinu() {
    return (
        <section id="data-learn" className="mt-12 px-4 max-w-6xl mx-auto">


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                    duration: 0.7,
                    ease: "easeOut",
                }}
                className="text-center max-w-2xl mx-auto mb-8"
            >
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Porquê a Kombinu?
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight mt-2">
                    Feito para a realidade do estudante angolano
                </h2>

                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Substituímos a desorganização de fotocópias ilegíveis e grupos de
                    WhatsApp caóticos por um sistema de estudo direto ao ponto.
                </p>
            </motion.div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Card 1 — Data-Lean */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{
                        duration: 0.7,
                        ease: "easeOut",
                    }}
                    className="lg:col-span-2"
                >
                    <Card className="bg-card shadow-sm flex flex-col justify-between h-full">

                        <div>
                            <CardHeader className="p-4 sm:p-6 pb-2">
                                <CardTitle className="text-xs font-bold tracking-wide uppercase text-primary">
                                    ECONOMIA DE SALDO UNITEL & AFRICELL
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-4 sm:p-6 pt-0">
                                <h3 className="text-lg sm:text-xl font-bold text-card-foreground">
                                    Modo Ultra-Leve Data-Lean (&lt; 5MB/h)
                                </h3>

                                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Sem animações pesadas nem scripts inúteis. Estudamos
                                    o protocolo HTTP para que você possa rever 10 sebentas
                                    no engarrafamento da Deolinda Rodrigues sem ver o seu
                                    saldo de dados desaparecer.
                                </p>
                            </CardContent>
                        </div>

                        <CardFooter className="p-4 sm:p-6 pt-0">
                            <div className="w-full bg-background/80 border border-border p-4 rounded-xl space-y-3">

                                {/* Item 1 */}
                                <div>
                                    <div className="flex w-full items-center justify-between text-xs mb-1.5">
                                        <span className="font-medium text-foreground truncate pr-2">
                                            Vídeo-aulas no YouTube / TikTok
                                        </span>

                                        <span className="text-red-400 font-semibold shrink-0">
                                            180 MB / hora
                                        </span>
                                    </div>

                                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "100%" }}
                                            viewport={{ once: false }}
                                            transition={{
                                                duration: 1,
                                                delay: 0.2,
                                                ease: "easeOut",
                                            }}
                                            className="bg-red-500 h-full rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Item 2 */}
                                <div>
                                    <div className="flex w-full items-center justify-between text-xs mb-1.5">
                                        <span className="font-medium text-foreground truncate pr-2">
                                            PDFs digitalizados em grupos
                                        </span>

                                        <span className="text-amber-400 font-semibold shrink-0">
                                            64 MB / doc
                                        </span>
                                    </div>

                                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "35%" }}
                                            viewport={{ once: false }}
                                            transition={{
                                                duration: 1,
                                                delay: 0.4,
                                                ease: "easeOut",
                                            }}
                                            className="bg-amber-500 h-full rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Item 3 */}
                                <div>
                                    <div className="flex w-full items-center justify-between text-xs mb-1.5">
                                        <span className="font-bold text-primary truncate pr-2">
                                            Kombinu Micro-Leituras + Quizzes
                                        </span>

                                        <span className="text-emerald-400 font-bold shrink-0">
                                            4.8 MB / hora
                                        </span>
                                    </div>

                                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "10%" }}
                                            viewport={{ once: false }}
                                            transition={{
                                                duration: 1,
                                                delay: 0.6,
                                                ease: "easeOut",
                                            }}
                                            className="bg-emerald-500 h-full rounded-full"
                                        />
                                    </div>
                                </div>

                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>

                {/* Card 2 — Quizzes */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{
                        duration: 0.7,
                        ease: "easeOut",
                        delay: 0.1,
                    }}
                    className="lg:col-span-1"
                >
                    <Card className="bg-card shadow-sm flex flex-col justify-between h-full">

                        <div>
                            <CardHeader className="p-4 sm:p-6 pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-xs font-bold tracking-wide uppercase text-primary">
                                    Fixação Ativa
                                </CardTitle>

                                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                                    <HugeiconsIcon
                                        icon={Quiz01Icon}
                                        size={18}
                                    />
                                </div>
                            </CardHeader>

                            <h3 className="text-lg px-4 sm:px-6 font-bold text-card-foreground">
                                Quizzes com Feedback Imediato
                            </h3>

                            <p className="mt-2 px-4 sm:px-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                Não espere a folha de exame para descobrir lacunas.
                                Responda perguntas reais de testes anteriores e receba
                                a justificativa teórica em duas linhas.
                            </p>

                            <CardContent className="p-4 sm:p-6" />
                        </div>

                        <CardFooter className="p-4 sm:p-6 pt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.5,
                                    ease: "easeOut",
                                }}
                                className="w-full bg-background/80 border border-border p-4 rounded-xl space-y-2"
                            >
                                <span className="text-emerald-400 text-[11px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    Resposta Confirmada
                                </span>

                                <p className="font-semibold text-xs text-foreground mt-1">
                                    Artigo 483º do Código Civil Angolano:
                                </p>

                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Exige ilicitude, culpa e nexo de causalidade para
                                    imputação civil subjectiva.
                                </p>
                            </motion.div>
                        </CardFooter>

                    </Card>
                </motion.div>

            </div>
        </section>
    );
}