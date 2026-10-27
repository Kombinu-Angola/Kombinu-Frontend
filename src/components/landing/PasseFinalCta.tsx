import { motion } from "motion/react";
import { LinkButton3D } from "../ui/Button3D";

/** Fecho da pagina: o mesmo convite do Hero, directo e sem fricção. */
export function PasseFinalCta() {
  return (
    <section aria-labelledby="final-h" className="relative overflow-hidden bg-[var(--color-wave-deep)] py-20 text-center text-white sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 size-[32vw] -translate-y-1/2 rounded-full opacity-50" style={{ background: "radial-gradient(closest-side, transparent 50%, rgb(12 38 120 / 0.5))" }} />
        <div className="absolute right-0 bottom-0 size-[18vw] translate-x-1/3 translate-y-1/3 rounded-full opacity-60" style={{ background: "radial-gradient(closest-side, transparent 40%, rgb(12 38 120 / 0.45))" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto max-w-[640px] px-4 sm:px-6"
      >
        <h2 id="final-h" className="font-montserrat text-3xl font-extrabold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
          A próxima prova não espera.
        </h2>
        <p className="mt-5 text-lg text-white/90">
          Resolve um simulado grátis agora. Em 5 minutos sabes onde estás e o que te falta.
        </p>
        <div className="mt-7 flex justify-center">
          <LinkButton3D
            href="#simulado"
            size="lg"
            className="bg-secondary-container text-on-secondary-fixed shadow-[0_4px_0_var(--color-brand-sunbeam-ink)] hover:brightness-105"
          >
            Resolver 1 simulado grátis
          </LinkButton3D>
        </div>
        <p className="mt-4 text-sm text-white/80">Sem criar conta e sem cartão. O simulado ocupa 0,3 MB.</p>
      </motion.div>
    </section>
  );
}
