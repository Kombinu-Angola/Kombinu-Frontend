import { Link } from "react-router-dom";

export function NotFound() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4 px-4 text-center bg-background">

            <div className="relative">
                <h1 className="text-[10rem] sm:text-[14rem] lg:text-[18rem] leading-none font-extrabold tracking-tighter text-foreground">
                    404
                </h1>



            </div>

            <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold">
                    Página não encontrada
                </h2>

                <p className="text-muted-foreground">
                    A página que procuras não existe.
                </p>
            </div>

            <Link
                to="/"
                className="mt-4 rounded-xl  px-6 py-3 font-bold text-primary-foreground transition-transform hover:scale-105"
            >
                Voltar para <span className="text-primary">HomePage</span>
            </Link>
        </div>
    );
}