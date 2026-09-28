import logoTipo from "./assets/Kombinu logo. .png"

export const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-accent flex flex-col items-center justify-center  dark:bg-dark-bg-primary">

            <div className="animate-pulse">
                <img src={logoTipo} className="w    -30 h-30" alt="logotipo" />
            </div>

            <p className=" text-lg font-lato text-white dark:text-gray-300">
                Plataforma de Educação Gamificada
            </p>

            <div className="mt-8">
                <div className="w-12 h-12 border-4 border-kombinu-neon-blue border-t-transparent rounded-full animate-spin" />
            </div>

        </div>
    );
};