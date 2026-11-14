import { AppShell } from "../../components/layout/AppShell";
import { MaterialGrid } from "../marketplace/MaterialGrid";

/** Biblioteca livre: os materiais não têm preço, por isso mostra o mesmo catálogo do contexto activo. */
export default function FreeLibraryScreen() {
  return (
    <AppShell active="biblioteca">
      <div className="mx-auto max-w-[1240px] px-4 pt-6 md:px-6 lg:pt-8">
        <section className="rounded-3xl border-2 border-border-cloud bg-surface-soft p-6 sm:p-8">
          <p className="text-overline text-primary uppercase">Acesso livre</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1">
            Estuda sem gastar nada
          </h1>
          <p className="mt-2 max-w-2xl text-body-lg text-pretty text-text-secondary">
            Resumos e simulados partilhados por criadores, sem compra nem subscrição.
          </p>
        </section>
      </div>
      <MaterialGrid rotuloPesquisa="Pesquisar na biblioteca livre" dica="Título ou tema" className="pt-6" />
    </AppShell>
  );
}
