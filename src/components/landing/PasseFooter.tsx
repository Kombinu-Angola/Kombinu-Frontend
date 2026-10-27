import kombinuMark from "../assets/kombinu-mark.svg";

const SITE_LINKS = [
  { href: "#epocas", label: "Épocas de provas" },
  { href: "#como", label: "Como funciona" },
  { href: "#precos", label: "Preços" },
  { href: "#pagamento", label: "Pagamento" },
  { href: "#ligas", label: "Ligas" },
  { href: "#resumos", label: "Publicar um resumo" },
  { href: "#perguntas", label: "Perguntas" },
] as const;

const LEGAL_LINKS = [
  { href: "#termos", label: "Termos de utilização" },
  { href: "#privacidade", label: "Privacidade e dados (Lei n.º 22/11)" },
  { href: "#direitos", label: "Direitos de autor e remoção" },
] as const;

/** Rodapé da landing "Passe de Provas". */
export function PasseFooter() {
  return (
    <footer className="bg-surface-ink py-14 text-white">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.1fr_0.9fr] sm:gap-16">
          <div>
            <img src={kombinuMark} alt="Kombinu" className="size-10" />
            <p className="mt-4 max-w-[28em] text-white/80">
              Simulados e resumos de estudantes para passar nas frequências e exames em Angola.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <ul className="grid gap-2.5">
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-white/85 hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="grid gap-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-white/85 hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-sm text-white/70 sm:flex-row">
          <p>© 2026 Kombinu Angola</p>
          <p>Elevando o aprendizado, superando barreiras.</p>
        </div>
      </div>
    </footer>
  );
}
