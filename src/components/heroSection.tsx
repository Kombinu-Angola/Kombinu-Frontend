import { Button } from "./ui/button";
import { PlayCircle, ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="w-full  text-zinc-100 pt-16 pb-12 sm:pt-24 sm:pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">



                {/* Título com foco e sem destaques coloridos dispersos */}
                <h1 className="font-montserrat font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] max-w-3xl">
                    Domina a tua cadeira mais difícil em 5 minutos por dia.
                </h1>

                {/* Subtítulo em Lato neutro */}
                <p className="font-lato mt-6 max-w-2xl text-xs sm:text-base text-zinc-400 leading-relaxed">
                    A Kombinu sintetiza sebentas extensas e frequências passadas da UAN, UCAN e ISPTEC em módulos diretos e simulados práticos. Conteúdo desenhado para aprender rápido sem esgotar o teu pacote de dados móveis.
                </p>

                {/* Ações em Poppins */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                    <Button className="font-poppins h-11 px-6 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs sm:text-sm cursor-pointer inline-flex items-center justify-center gap-2 transition-colors w-full sm:w-auto">
                        <PlayCircle className="w-4 h-4" />
                        <span>Experimentar quiz grátis</span>
                    </Button>

                    <a
                        href="#demo"
                        className="font-poppins text-xs sm:text-sm font-medium inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors py-2 px-3"
                    >
                        <span>Ver fluxo em 1 minuto</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* Trust bar compacta */}
                <p className="font-lato text-[11px] sm:text-xs text-zinc-500 mt-6">
                    Acesso imediato sem registo bancário • Modo Data-Lean (&lt;5MB/h) • Suporte Multicaixa Express
                </p>

            </div>
        </section>
    );
}