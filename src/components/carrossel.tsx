import { HugeiconsIcon } from "@hugeicons/react";
import { School01Icon } from "@hugeicons/core-free-icons";

const universities = ["UAN", "UCAN", "ISPTEC", "ISAF", "UGS", "UniPiaget"];



export function Carrosel() {
    return (
        <section className="mt-10 py-6  w-full overflow-hidden">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-center text-muted-foreground uppercase">
                Material calibrado para os planos curriculares da:
            </h2>

            <div className="mt-4 flex items-center gap-3 px-4 overflow-x-auto no-scrollbar sm:justify-center sm:flex-wrap lg:gap-5">
                {universities.map((uni) => (


                    <div
                        key={uni}
                        className="shrink-0 bg-card border border-border rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-xs hover:border-primary/60 hover:bg-muted/40 transition-all cursor-default"
                    >
                        <HugeiconsIcon icon={School01Icon} size={18} className="text-primary" />
                        <span className="font-heading font-bold text-sm sm:text-base text-foreground">
                            {uni}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}