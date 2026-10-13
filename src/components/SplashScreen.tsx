import logoTipo from "./assets/kombinu-mark.svg"

export const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center">

            <div className="animate-pulse">
                <img src={logoTipo} className="w-40 h-40" alt="Kombinu" />
            </div>

            <p className="font-sans-landing text-lg text-text-secondary">
                Plataforma de Educação Gamificada
            </p>

            <div className="mt-8">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>

        </div>
    );
};