import { Logo } from "./ui/Logo";

export const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-dark-bg-primary">

            <div className="animate-pulse">
                <Logo size="xl" />
            </div>

            <p className="mt-4 text-lg font-lato text-gray-600 dark:text-gray-300">
                Plataforma de Educação Gamificada
            </p>

            <div className="mt-8">
                <div className="w-12 h-12 border-4 border-kombinu-neon-blue border-t-transparent rounded-full animate-spin" />
            </div>

        </div>
    );
};