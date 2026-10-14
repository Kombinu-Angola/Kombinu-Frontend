import { ArrowRight01Icon, Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";


export default function PricingSection() {
    return (
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-background text-foreground">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* Cabeçalho */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary">
                        Planos Transparentes
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                        Transparência total. Sem surpresas.
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                        Estude gratuitamente com a comunidade ou acelere a sua preparação com o Kombinu Pro.
                    </p>
                </div>

                {/* Comparativo de 2 Planos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Plano Básico */}
                    <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-card  shadow-sm">
                        <div>
                            <div className="">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Acesso Essencial
                                </span>
                                <h3 className="mt-1 text-2xl font-bold text-foreground">
                                    Plano Básico
                                </h3>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
                                        0 AOA
                                    </span>
                                    <span className="text-xs sm:text-sm text-muted-foreground">
                                        / para sempre
                                    </span>
                                </div>
                            </div>

                            {/* Lista de Recursos Direta */}
                            <ul className="mt-6 space-y-3.5 text-xs sm:text-sm">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 shrink-0 mt-0.5">
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                                    </span>
                                    <span className="text-foreground">
                                        Acesso a resumos e sebentas de livre acesso
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 shrink-0 mt-0.5">
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                                    </span>
                                    <span className="text-foreground">
                                        Quizzes básicos de fixação da comunidade
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 shrink-0 mt-0.5">
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                                    </span>
                                    <span className="text-foreground">
                                        Até 3 uploads de ficheiro IA por mês
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-muted-foreground/50 shrink-0 mt-0.5">
                                        <HugeiconsIcon icon={Cancel01Icon} size={18} />
                                    </span>
                                    <span className="text-muted-foreground line-through">
                                        Sem modo offline de leitura
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-muted-foreground/50 shrink-0 mt-0.5">
                                        <HugeiconsIcon icon={Cancel01Icon} size={18} />
                                    </span>
                                    <span className="text-muted-foreground line-through">
                                        Sem simulados com temporizador de exame
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="">
                            <button
                                type="button"
                                className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
                            >
                                Começar Grátis Agora
                            </button>
                        </div>
                    </div>

                    {/* Plano Pro */}
                    <div className="relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-card border-2 border-primary shadow-xl ring-1 ring-primary/20">
                        {/* Badge Flutuante */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm">

                            <span>MAIS POPULAR</span>

                        </div>

                        <div>
                            <div className="pb-6 border-b border-border/60">
                                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                    Passe Direto sem Recurso
                                </span>
                                <h3 className="mt-1 text-2xl font-bold text-foreground">
                                    Kombinu Pro
                                </h3>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
                                        5.000 AOA
                                    </span>
                                    <span className="text-xs sm:text-sm text-muted-foreground">
                                        / mês via Multicaixa Express
                                    </span>
                                </div>
                            </div>

                            {/* Lista de Recursos Pro Direta */}
                            <ul className="mt-6 space-y-3.5 text-xs sm:text-sm">
                                <li className="flex items-start gap-3 text-foreground">
                                    <span className="text-primary shrink-0 mt-0.5">
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                                    </span>
                                    <span className="font-medium">
                                        Uploads de IA ilimitados gerados em &lt; 10s
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-foreground">
                                    <span className="text-primary shrink-0 mt-0.5">
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                                    </span>
                                    <span className="font-medium">
                                        Banco completo de frequências e exames dos últimos 5 anos
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-foreground">
                                    <span className="text-primary shrink-0 mt-0.5">
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                                    </span>
                                    <span className="font-medium">
                                        Download offline: estude mesmo sem saldo de dados ativo
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-foreground">
                                    <span className="text-primary shrink-0 mt-0.5">
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                                    </span>
                                    <span className="font-medium">
                                        Suporte prioritário via WhatsApp
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-foreground">
                                    <span className="text-primary shrink-0 mt-0.5">
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                                    </span>
                                    <span className="font-medium">
                                        0% de comissão na venda das suas próprias sebentas
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8  space-y-3">
                            <button
                                type="button"
                                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>Assinar Pro com Multicaixa Express</span>
                                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                            </button>
                            <p className="text-center text-[11px] sm:text-xs text-muted-foreground">
                                Sem fidelização • Cancele quando o semestre terminar
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}