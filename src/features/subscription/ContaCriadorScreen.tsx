import { CreatorShell } from "../../components/layout/CreatorShell";
import { Icon } from "../../components/ui/Icon";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Conta e subscrição do criador. Só mostra o que a API devolve (nome e e-mail); a subscrição ainda não
 * existe no backend, por isso diz "Em breve" em vez de mostrar planos, preços, telefone, bio ou selos.
 */
export default function ContaCriadorScreen() {
  const { usuario } = useAuth();
  return (
    <CreatorShell active="definicoes" creatorName={usuario?.nome ?? ""}>
      <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-4 py-8 md:px-6">
        <h1 className="font-montserrat text-headline-h2 font-extrabold text-on-surface">Conta e subscrição</h1>

        <section aria-labelledby="conta-dados" className="rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
          <h2 id="conta-dados" className="text-overline text-text-tertiary uppercase">A tua conta</h2>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-caption text-text-tertiary">Nome</dt>
              <dd className="text-body-lg font-bold break-words text-on-surface">{usuario?.nome || "—"}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-caption text-text-tertiary">E-mail</dt>
              <dd className="text-body-lg font-bold break-words text-on-surface">{usuario?.email || "—"}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="conta-subscricao" className="flex items-start gap-4 rounded-2xl border-2 border-border-cloud bg-surface-canvas p-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-sky text-primary">
            <Icon name="clock" size={24} />
          </span>
          <div className="min-w-0">
            <p className="text-overline text-text-tertiary uppercase">Em breve</p>
            <h2 id="conta-subscricao" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">Subscrição</h2>
            <p className="mt-1 text-body-md text-text-secondary">
              A subscrição de criador ainda não está disponível. Quando estiver pronta, aparece aqui.
            </p>
          </div>
        </section>
      </div>
    </CreatorShell>
  );
}
