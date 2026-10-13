
import { Play, PlayCircle } from "lucide-react";
import { Button3D } from "./ui/Button3D";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { motion } from "motion/react";


export function HeroSection() {
    return (
        <div className="mx-auto lg:px-50 md:px-16 sm-px-8 px-4  bg-background lg:min-h-screen lg:mt-6 mt-8  text-center">
            <section className="">

                <TextGenerateEffect
                    className="font-heading font-extrabold mt-4 text-3xl sm:text-5xl lg:text-6xl text-foreground tracking-tight leading-[1.1]"
                >
                    Domina a tua cadeira mais{" "}
                    <span className="text-primary">difícil</span>{" "}
                    em{" "}
                    <span className="text-primary">5 minutos</span>{" "}
                    por dia sem slides infinitos e sem queimar o teu saldo.
                </TextGenerateEffect>
                <div className=" max-w-2xl mx-auto px-4 text-center space-y-4">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 1.2,
                            duration: 0.9,
                            ease: "easeOut",
                        }}
                        className="max-w-2xl mx-auto px-4 text-center"
                    >
                        <p className="mt-4 font-sans-landing text-xs sm:text-lg font-medium text-text-secondary leading-relaxed">
                            A Kombinu transforma sebentas desorganizadas e provas antigas da UAN, UCAN e ISAF em resumos editoriais rápidos e simulados com gabarito na hora. Se não entenderes o conceito no 1º quiz, não gastaste nem 1 Kwanza nem 1 Megabyte.
                        </p>
                    </motion.div>


                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 1.5,
                        duration: 0.7,
                        ease: "easeOut",
                    }}
                    className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button3D size="lg" leadingIcon={<PlayCircle className="size-5" />}>
                        Experimentar Quiz Grátis
                    </Button3D>

                    <Button3D variant="secondary" size="lg" leadingIcon={<Play className="size-5" />}>
                        Ver Demonstração de 1 Minuto
                    </Button3D>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 1.5,
                        duration: 0.9,
                        ease: "easeOut",
                    }}>
                    <p className="text-text-secondary text-xs mt-2 py-4 lg:mt-4">Sem necessidade de cartão bancário • Pagamento opcional via Multicaixa Express • Funciona em qualquer telemóvel</p>
                </motion.div>
            </section>
            <section>

            </section>
        </div >
    )
}