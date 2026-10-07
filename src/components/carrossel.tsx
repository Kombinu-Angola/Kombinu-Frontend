
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const universities = ["UAN", "UCAN", "ISPTEC", "ISAF", "UGS", "UniPiaget"];



export function Carrosel() {
    return (
        <section className="mt-10 py-6  w-full overflow-hidden">
            <h2 className="md:text-xs sm:text-xs lg:text-lg font-semibold tracking-wider text-center  uppercase">
                Material calibrado para os planos curriculares da:
            </h2>

            <div className="mt-4 text-white">
                <InfiniteMovingCards items={universities}
                    direction="left"
                    speed="normal"
                    pauseOnHover>

                </InfiniteMovingCards>
            </div>
        </section>
    );
}