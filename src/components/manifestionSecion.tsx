import { QuoteUpIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";




export default function ManifestoSection() {
    return (
        <section className="w-full py-16 sm:py-20 lg:py-24 bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-card shadow-sm space-y-8">
                    {/* Cabeçalho */}
                    <div className="space-y-3">
                        <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary inline-flex items-center gap-1.5">
                            <HugeiconsIcon icon={SparklesIcon} size={14} />
                            O Nosso Manifesto
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                            Por que estamos a construir a Kombinu em Luanda.
                        </h2>
                    </div>

                    {/* Corpo do Texto */}
                    <div className="space-y-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                        <p>
                            Quem estuda no ensino superior em Luanda conhece o peso diário: passar 3 a 4 horas nos engarrafamentos entre o trabalho e a faculdade, disputar uma tomada no anfiteatro e tentar ler um PDF ilegível de 120 slides no telemóvel enquanto a bateria e o saldo de dados vão embora.
                        </p>
                        <p className="font-medium text-foreground">
                            Acreditamos que a universidade em Angola não devia ser uma maratona de fotocópias desbotadas, grupos de WhatsApp desorganizados e gastos excessivos com recargas móveis.
                        </p>
                        <p>
                            A <strong className="text-primary font-bold">Kombinu</strong> nasceu dessa indignação. Desenhámos uma tecnologia pensada primeiro para o contexto angolano: leve, que corre com sinal 3G fraco, que valoriza cada kwanza gasto em dados móveis e que empodera tanto os estudantes que querem passar quanto os monitores e explicadores que geram conteúdos de excelência.
                        </p>
                    </div>

                    {/* Assinatura */}
                    <div className="pt-6 border-t border-border/40 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                                OF
                            </div>
                            <div>
                                <h4 className="font-bold text-sm sm:text-base text-foreground">
                                    Orlando Fortuna & Equipa Fundadora
                                </h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Desenvolvido por estudantes e graduados das universidades de Luanda
                                </p>
                            </div>
                        </div>

                        <div className="hidden sm:flex text-primary/20 shrink-0">
                            <HugeiconsIcon icon={QuoteUpIcon} size={36} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}