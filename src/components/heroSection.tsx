import { Button } from "./ui/button";
import { Play, PlayCircle } from "lucide-react";

export function HeroSection() {
    return (
        <div className="mx-auto lg:px-50 md:px-16 sm-px-8 px-4  bg-background lg:min-h-screen lg:mt-6 mt-8  text-center">
            <section className="">

                <h1 className="font-heading font-extrabold mt-4  text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">Domina a tua cadeira mais <span className="text-primary">difícil  </span>em<span className="text-primary"> 5 minutos </span>  por dia  sem slides infinitos e sem queimar o teu saldo.</h1>
                <div className=" max-w-2xl mx-auto px-4 text-center space-y-4">

                    <p className="mt-4 font-sans text-xs  sm:text-lg font-medium text-[#424752] leading-relaxed">
                        A Kombinu transforma sebentas desorganizadas e provas antigas da UAN, UCAN e ISAF em resumos editoriais rápidos e simulados com gabarito na hora. Se não entenderes o conceito no 1º quiz, não gastaste nem 1 Kwanza nem 1 Megabyte.
                    </p>


                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button className="h-14 px-8 shadow-full t  rounded-full  cursor-pointer ">
                        <PlayCircle className="w-5 h-5" />
                        Experimentar Quiz
                        <span className="">Grátis</span>
                    </Button>
                    <Button className="bg-white shadow-full  text-primary rounded-full  font-bold cursor-pointer  h-14 px-8 hover:bg-primary hover:text-white">
                        <Play className="w-5 h-5" />
                        Ver Demostração de 1
                        Minuto
                    </Button>

                </div>
                <p className=" text-[#424752] text-xs mt-2 py-4 lg:mt-4">Sem necessidade de cartão bancário • Pagamento opcional via Multicaixa Express • Funciona em qualquer telemóvel</p>
            </section>
            <section>

            </section>
        </div >
    )
}