import { Add01Icon, HelpCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";


export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-background text-foreground">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* Cabeçalho */}
                <div className="text-center mb-10 sm:mb-12">
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary inline-flex items-center gap-1.5">
                        <HugeiconsIcon icon={HelpCircleIcon} size={15} />
                        Tire as suas Dúvidas
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Perguntas Frequentes
                    </h2>
                </div>

                {/* Lista de Acordeões com rotação de + para × */}
                <div className="space-y-3">
                    {/* Pergunta 1: Modo Data-Lean */}
                    <div className="rounded-2xl bg-card border border-border overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggle(0)}
                            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                        >
                            <span className="font-semibold text-sm sm:text-base text-foreground">
                                Como o Modo Data-Lean gasta menos de 5MB por hora?
                            </span>
                            <span
                                className={`shrink-0 text-muted-foreground transition-transform duration-300 ${openIndex === 0 ? 'rotate-45 text-primary' : ''
                                    }`}
                            >
                                <HugeiconsIcon icon={Add01Icon} size={20} />
                            </span>
                        </button>

                        {openIndex === 0 && (
                            <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                Eliminámos bibliotecas de JavaScript pesadas, convertemos equações e tabelas em texto estruturado puro e armazenamos o conteúdo lido em cache local. Isso significa que após carregar a página inicial, cada leitura consome apenas alguns kilobytes.
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl bg-card border border-border overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggle(1)}
                            className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                        >
                            <span className="font-semibold text-sm sm:text-base text-foreground">
                                Como funciona o pagamento via Multicaixa Express?
                            </span>
                            <span
                                className={`shrink-0 text-muted-foreground transition-transform duration-300 ${openIndex === 1 ? 'rotate-45 text-primary' : ''
                                    }`}
                            >
                                <HugeiconsIcon icon={Add01Icon} size={20} />
                            </span>
                        </button>

                        {openIndex === 1 && (
                            <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                Ao assinar o Kombinu Pro ou comprar uma sebenta avulsa, insere o seu número de telemóvel associado ao Multicaixa Express e recebe a notificação no telemóvel para autorizar com o seu PIN em poucos segundos.
                            </div>
                        )}
                    </div>


                    {/* Pergunta 2: Uso Gratuito */}
                    <div className="rounded-2xl bg-card border border-border overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggle(1)}
                            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                        >
                            <span className="font-semibold text-sm sm:text-base text-foreground">
                                Como posso usar a Kombinu de forma totalmente gratuita?
                            </span>
                            <span
                                className={`shrink-0 text-muted-foreground transition-transform duration-300 ${openIndex === 1 ? 'rotate-45 text-primary' : ''
                                    }`}
                            >
                                <HugeiconsIcon icon={Add01Icon} size={20} />
                            </span>
                        </button>

                        {openIndex === 1 && (
                            <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                O Plano Básico é 0 AOA para sempre. Tem acesso imediato a todas as sebentas e resumos públicos partilhados pela comunidade, quizzes de fixação básicos e até 3 uploads de ficheiros com inteligência artificial por mês, sem necessidade de registar cartão ou conta bancária.
                            </div>
                        )}
                    </div>

                    {/* Pergunta 3: Venda de Sebentas */}
                    <div className="rounded-2xl bg-card border border-border overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggle(2)}
                            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                        >
                            <span className="font-semibold text-sm sm:text-base text-foreground">
                                Como posso vender as minhas próprias sebentas e resumos?
                            </span>
                            <span
                                className={`shrink-0 text-muted-foreground transition-transform duration-300 ${openIndex === 2 ? 'rotate-45 text-primary' : ''
                                    }`}
                            >
                                <HugeiconsIcon icon={Add01Icon} size={20} />
                            </span>
                        </button>

                        {openIndex === 2 && (
                            <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                Basta aceder ao Marketplace, submeter o seu ficheiro ou apontamento e definir o preço em Kwanzas (AOA). Após aprovação de qualidade pela moderação, a sua sebenta fica listada para estudantes de todo o país. Os pagamentos dos colegas são processados via Multicaixa Express e o valor arrecadado é transferido diretamente para a sua conta.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section >
    );
}