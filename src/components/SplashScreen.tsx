import { LogoMark } from "./ui/LogoMark"

export const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center">

            <div className="animate-pulse">
                <LogoMark size={88} label="Kombinu" />
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