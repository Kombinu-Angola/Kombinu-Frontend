import {
    ArrowRight01Icon,
    BookOpen01Icon,
    CheckmarkBadge01Icon,
    StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function AcademicMarketplace() {
    const sebentas = [
        {
            university: "UAN • Economia",
            rating: "4.9",
            reviews: "140",
            title: "Macroeconomia I: Balanço de Pagamentos & Câmbio",
            author: "Dra. Teresa Bento",
            authorBadge: true,
            description:
                "(Mestre e Assistente Universitária Verificada). Inclui 45 exercícios resolvidos.",
            price: "1.500 AOA",
            isFree: false,
            ctaText: "Ver Sebenta",
        },
        {
            university: "UCAN • Direito",
            rating: "5.0",
            reviews: "98",
            title: "Direito Civil III: Teoria Geral das Obrigações",
            author: "Orlando Fortuna",
            authorBadge: false,
            description:
                "(Licenciado com Distinção). Esquemas mnemónicos e síntese de jurisprudência do Tribunal Supremo.",
            price: "GRÁTIS",
            isFree: true,
            ctaText: "Ler Agora",
        },
        {
            university: "ISAF • Gestão & TI",
            rating: "4.8",
            reviews: "85",
            title: "Algoritmos e Estruturas de Dados em C/Python",
            author: "Eng. Carlos Pinto",
            authorBadge: false,
            description:
                "Diagramas conceituais claros, testes de mesa explicados e banco de 30 questões de frequências.",
            price: "1.200 AOA",
            isFree: false,
            ctaText: "Ver Sebenta",
        },
    ];

    return (
        <section
            id="marktplace"
            className="w-full py-12 sm:py-16 bg-background text-foreground"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Cabeçalho */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: false,
                        amount: 0.2,
                    }}
                    transition={{
                        duration: 0.7,
                        ease: "easeOut",
                    }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12"
                >
                    <div>
                        <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary">
                            Marketplace Académico
                        </span>

                        <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Sebentas em Destaque Esta Semana
                        </h2>
                    </div>

                    <a
                        href="#marketplace"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline group shrink-0"
                    >
                        <span>Ver Todo o Marketplace (180+ Sebentas)</span>

                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={16}
                            className="group-hover:translate-x-1 transition-transform duration-200"
                        />
                    </a>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {sebentas.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: false,
                                amount: 0.2,
                            }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.15,
                                ease: "easeOut",
                            }}
                            whileHover={{
                                y: -8,
                                transition: {
                                    duration: 0.2,
                                    ease: "easeOut",
                                },
                            }}
                            className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-card shadow-sm hover:border-primary/40 hover:shadow-md transition-shadow"
                        >
                            <div>

                                {/* Metadados */}
                                <div className="flex items-center justify-between text-xs pb-3 border-b border-border/50">

                                    <span className="font-semibold text-muted-foreground uppercase tracking-wide text-[11px]">
                                        {item.university}
                                    </span>

                                    <div className="flex items-center gap-1 font-bold text-amber-500">

                                        <HugeiconsIcon
                                            icon={StarIcon}
                                            size={14}
                                            className="fill-amber-500"
                                        />

                                        <span>
                                            {item.rating}
                                        </span>

                                        <span className="text-muted-foreground font-normal text-[11px]">
                                            ({item.reviews})
                                        </span>

                                    </div>
                                </div>

                                {/* Título & Autor */}
                                <div className="mt-4">

                                    {/* TÍTULO COM MOVIMENTO */}
                                    <motion.h3
                                        whileHover={{
                                            x: 5,
                                            transition: {
                                                duration: 0.2,
                                                ease: "easeOut",
                                            },
                                        }}
                                        className="font-bold text-base sm:text-lg text-card-foreground leading-snug line-clamp-2 cursor-default"
                                    >
                                        {item.title}
                                    </motion.h3>

                                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                        Por{" "}
                                        <strong className="text-card-foreground font-medium">
                                            {item.author}
                                        </strong>

                                        {item.authorBadge && (
                                            <span className="inline-flex align-middle ml-1 text-primary">
                                                <HugeiconsIcon
                                                    icon={CheckmarkBadge01Icon}
                                                    size={13}
                                                />
                                            </span>
                                        )}{" "}

                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {/* Rodapé */}
                            <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between gap-3">

                                {/* Preço */}
                                <div className="flex flex-col">

                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                                        Preço
                                    </span>

                                    <motion.span
                                        whileHover={{
                                            scale: 1.05,
                                            transition: {
                                                duration: 0.2,
                                            },
                                        }}
                                        className={`text-base sm:text-lg font-extrabold ${item.isFree
                                            ? "text-emerald-500"
                                            : "text-card-foreground"
                                            }`}
                                    >
                                        {item.price}
                                    </motion.span>

                                </div>

                                {/* Botão */}
                                <motion.button
                                    whileHover={{
                                        scale: 1.04,
                                    }}
                                    whileTap={{
                                        scale: 0.97,
                                    }}
                                    transition={{
                                        duration: 0.15,
                                    }}
                                    type="button"
                                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${item.isFree
                                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                        }`}
                                >
                                    <HugeiconsIcon
                                        icon={BookOpen01Icon}
                                        size={15}
                                    />

                                    <span>
                                        {item.ctaText}
                                    </span>
                                </motion.button>

                            </div>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
}