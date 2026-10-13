import logoTipo from "./assets/kombinu-mark-white.svg"

export const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center">

            <div className="animate-pulse">
                <img src={logoTipo} className="w-24 h-24" alt="Kombinu" />
            </div>

            <p className="font-sans-landing text-lg text-white/90">
                Plataforma de Educação Gamificada
            </p>

            <div className="mt-8">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>

        </div>
    );
};