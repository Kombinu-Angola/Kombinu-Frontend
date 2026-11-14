import { AppShell } from "../../components/layout/AppShell";
import { MaterialGrid } from "./MaterialGrid";

/** Vitrine do marketplace: materiais reais do contexto activo. */
export default function MarketplaceScreen() {
  return (
    <AppShell active="sebentas">
      <section className="bg-surface-ink px-4 py-12 text-white md:px-6 md:py-16">
        <div className="mx-auto max-w-[1280px]">
          <h1 className="max-w-3xl font-montserrat text-headline-h1-mobile text-balance md:text-display-l">Materiais para estudar</h1>
          <p className="mt-3 max-w-2xl text-body-lg text-white/75">Resumos, sebentas e simulados partilhados por criadores.</p>
        </div>
      </section>
      <MaterialGrid rotuloPesquisa="Pesquisar materiais" dica="Título ou descrição" className="pt-6" />
    </AppShell>
  );
}
