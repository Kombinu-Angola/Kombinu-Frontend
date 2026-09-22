import logoProfile from "../assets/Kombinu logo. .png"

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border text-foreground pt-14 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Grid de Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Coluna 1: Plataforma */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
              Kombinu Plataforma
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <a href="#como-funciona" className="hover:text-foreground transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#data-lean" className="hover:text-foreground transition-colors">
                  Modo Data-Lean (&lt;5MB)
                </a>
              </li>
              <li>
                <a href="#gerador-ia" className="hover:text-foreground transition-colors">
                  Gerador de Quizzes IA
                </a>
              </li>
              <li>
                <a href="#ligas" className="hover:text-foreground transition-colors">
                  Ligas Académicas
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 2: Faculdades */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
              Faculdades Cobertas
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <a href="#uan" className="hover:text-foreground transition-colors">
                  Univ. Agostinho Neto (UAN)
                </a>
              </li>
              <li>
                <a href="#ucan" className="hover:text-foreground transition-colors">
                  Univ. Católica de Angola (UCAN)
                </a>
              </li>
              <li>
                <a href="#isptec" className="hover:text-foreground transition-colors">
                  ISPTEC Luanda
                </a>
              </li>
              <li>
                <a href="#isaf" className="hover:text-foreground transition-colors">
                  ISAF & Gregório Semedo
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Criadores */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
              Criadores de Conteúdo
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <a href="#publicar" className="hover:text-foreground transition-colors">
                  Publicar Sebenta
                </a>
              </li>
              <li>
                <a href="#pagamentos" className="hover:text-foreground transition-colors">
                  Pagamentos Multicaixa
                </a>
              </li>
              <li>
                <a href="#qualidade" className="hover:text-foreground transition-colors">
                  Diretrizes de Qualidade
                </a>
              </li>
              <li>
                <a href="#comunidade" className="hover:text-foreground transition-colors">
                  Comunidade de Explicadores
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Legal & Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
              Legal & Segurança
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <a href="#iapi" className="hover:text-foreground transition-colors">
                  Proteção de Direitos (IAPI)
                </a>
              </li>
              <li>
                <a href="#termos" className="hover:text-foreground transition-colors">
                  Termos de Utilização
                </a>
              </li>
              <li>
                <a href="#privacidade" className="hover:text-foreground transition-colors">
                  Privacidade de Dados
                </a>
              </li>
            </ul>


          </div>
        </div>

        {/* Barra Inferior: Logo, Links Rápidos e Copyright */}
        <div className="pt-8  flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          {/* Marca */}
          <img src={logoProfile} className=" h-30 w-30  sm:w-14 sm:h-14 object-contain" alt="logoTipo" />


          <div className="flex  justify-center gap-x-5 gap-y-2">

          </div>

          <p className="text-center md:text-right">
            © 2025 Kombinu Angola. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}