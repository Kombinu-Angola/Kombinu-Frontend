import { QuoteUpIcon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";


export default function TestimonialsSection() {
    return (
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-background text-foreground">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Cabeçalho */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary">
                        Verdade Radical
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                        O que dizem os estudantes que já passaram nos testes
                    </h2>
                </div>

                {/* Grid de Depoimentos sem bordas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {/* Depoimento 1 */}
                    <div className="flex flex-col justify-between p-6 rounded-2xl bg-card shadow-sm">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex text-amber-500 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <HugeiconsIcon key={i} icon={StarIcon} size={14} className="fill-amber-500" />
                                    ))}
                                </div>
                                <HugeiconsIcon icon={QuoteUpIcon} size={20} className="text-primary/30" />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">
                                “Mano, salvei Economia graças aos quizzes da Kombinu. Caiu exatamente a pergunta do BNA no teste da UAN! A melhor parte foi poder rever tudo no candongueiro sem travar a internet.”
                            </p>
                        </div>

                        <div className="mt-6 pt-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                HK
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold text-sm text-foreground truncate">
                                    Hamilton K.
                                </h4>
                                <p className="text-xs text-muted-foreground truncate">
                                    2º Ano Economia • UAN
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Depoimento 2 */}
                    <div className="flex flex-col justify-between p-6 rounded-2xl bg-card shadow-sm">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex text-amber-500 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <HugeiconsIcon key={i} icon={StarIcon} size={14} className="fill-amber-500" />
                                    ))}
                                </div>
                                <HugeiconsIcon icon={QuoteUpIcon} size={20} className="text-primary/30" />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">
                                “Eu gastava 4 mil kwanzas por mês só imprimindo slides cheios de fotos que nem lia. Agora estudo no táxi a caminho do trabalho sem gastar o meu saldo da Unitel. O modo leve funciona mesmo.”
                            </p>
                        </div>

                        <div className="mt-6 pt-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                JM
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold text-sm text-foreground truncate">
                                    Jéssica M.
                                </h4>
                                <p className="text-xs text-muted-foreground truncate">
                                    Estudante de Gestão • UCAN
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Depoimento 3 */}
                    <div className="flex flex-col justify-between p-6 rounded-2xl bg-card shadow-sm">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex text-amber-500 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <HugeiconsIcon key={i} icon={StarIcon} size={14} className="fill-amber-500" />
                                    ))}
                                </div>
                                <HugeiconsIcon icon={QuoteUpIcon} size={20} className="text-primary/30" />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">
                                “Publiquei o meu resumo de Direito Fiscal e fiz 45.000 AOA em uma semana vendendo para colegas de outras turmas. O pagamento cai direto pelo Multicaixa Express sem complicação.”
                            </p>
                        </div>

                        <div className="mt-6 pt-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                MP
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold text-sm text-foreground truncate">
                                    Mauro P.
                                </h4>
                                <p className="text-xs text-muted-foreground truncate">
                                    Explicador Independente • Luanda
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}