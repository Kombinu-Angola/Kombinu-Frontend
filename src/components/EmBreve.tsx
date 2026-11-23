import { useAuth } from "../contexts/AuthContext";
import { destinoPorPapel } from "../lib/destinoPosLogin";
import { AppShell } from "./layout/AppShell";
import { AdminShell } from "./layout/AdminShell";
import { CreatorShell, type CreatorSection } from "./layout/CreatorShell";
import { LinkButton3D } from "./ui/Button3D";
import { Icon } from "./ui/Icon";

/** Texto padrão do aviso; o Orlando fecha a redação final. */
const TITULO_PADRAO = "Em breve";
const TEXTO_PADRAO = "Estamos a preparar esta área. Assim que estiver pronta, aparece aqui.";

type EmBreveProps = {
  /** Nome do que vai chegar (ex.: "Financeiro"); entra no título para a pessoa saber onde está. */
  nome?: string;
  texto?: string;
};

/** Aviso único para tudo o que ainda não tem API: nunca mostra números nem dados de exemplo. */
export function EmBreve({ nome, texto = TEXTO_PADRAO }: EmBreveProps) {
  const { usuario } = useAuth();
  const voltar = usuario ? destinoPorPapel(usuario) : "/";
  return (
    <section
      aria-labelledby="em-breve-titulo"
      className="mx-auto flex max-w-[560px] flex-col items-center gap-4 px-4 py-16 text-center"
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-surface-sky text-primary">
        <Icon name="clock" size={32} />
      </span>
      <p className="text-overline text-text-tertiary uppercase">{TITULO_PADRAO}</p>
      <h1 id="em-breve-titulo" className="font-montserrat text-headline-h2 font-extrabold text-on-surface">
        {nome ?? TITULO_PADRAO}
      </h1>
      <p className="text-body-lg text-text-secondary">{texto}</p>
      <LinkButton3D variant="secondary" href={voltar}>
        Voltar ao início
      </LinkButton3D>
    </section>
  );
}

type Area = "aluno" | "criador" | "admin";

/** `EmBreve` dentro da moldura da área, para a navegação continuar à mão. */
export function EmBrevePagina({ area, nome, texto, secao = "materiais" }: { area: Area; nome: string; texto?: string; secao?: CreatorSection }) {
  const { usuario } = useAuth();
  const conteudo = <EmBreve nome={nome} texto={texto} />;
  if (area === "criador") {
    return (
      <CreatorShell active={secao} creatorName={usuario?.nome ?? ""}>
        {conteudo}
      </CreatorShell>
    );
  }
  if (area === "admin") {
    return (
      <AdminShell active="membros" title={nome} description="Disponível em breve.">
        {conteudo}
      </AdminShell>
    );
  }
  return <AppShell active="painel">{conteudo}</AppShell>;
}
