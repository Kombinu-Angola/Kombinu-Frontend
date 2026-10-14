import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

interface FaqItem {
    question: string;
    answer: string;
}

const FAQS: FaqItem[] = [
    {
        question: "Como o Modo Data-Lean consome menos de 5MB por hora?",
        answer: "Eliminámos bibliotecas pesadas de JavaScript, estruturamos conteúdos em texto leve e aplicamos cache agressivo no browser. Após carregar a estrutura inicial, cada módulo ou resumo consome apenas alguns kilobytes de dados móveis."
    },
    {
        question: "Como funciona o pagamento via Multicaixa Express?",
        answer: "Basta indicar o número de telemóvel associado ao Multicaixa Express no checkout. Receberá uma notificação instantânea no telemóvel para validar a compra com o seu PIN em Kwanzas (AOA), sem intermediários internacionais."
    },
    {
        question: "Como utilizar a Kombinu de forma gratuita?",
        answer: "O acesso essencial é 0 AOA. Pode consultar sebentas públicas da comunidade, resolver quizzes de fixação e submeter até 3 documentos por mês para geração assistida sem necessidade de associar dados bancários."
    },
    {
        question: "Como posso disponibilizar e rentabilizar as minhas próprias sebentas?",
        answer: "Submeta o seu material no Marketplace e defina o valor em Kwanzas. Após validação académica da moderação, o material fica disponível para universitários de todo o país, com os ganhos creditados diretamente via transferência."
    }
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full py-16 sm:py-20  text-zinc-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">

                {/* Cabeçalho Minimalista */}
                <div className="mb-10 sm:mb-12 b border-zinc-800/60 pb-6">
                    <span className="font-montserrat text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                        Suporte & Esclarecimentos
                    </span>
                    <h2 className="font-montserrat text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
                        Perguntas Frequentes
                    </h2>
                </div>

                {/* Lista em formato Accordion Monocromático */}
                <div className="divide-y divide-zinc-800/70 border-y border-zinc-800/70">
                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div key={index} className="transition-colors duration-150">
                                <button
                                    type="button"
                                    onClick={() => toggle(index)}
                                    className="w-full py-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                                >
                                    <span className="font-montserrat text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`shrink-0 text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-45 text-white" : "group-hover:text-zinc-300"
                                            }`}
                                    >
                                        <HugeiconsIcon icon={Add01Icon} size={18} />
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="pb-5 font-lato text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}