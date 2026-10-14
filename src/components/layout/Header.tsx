import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoProfile from "../assets/Kombinu logo. .png";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Ajusta os caminhos às rotas reais do projeto
const NAV_LINKS = [
  { to: "/como-funciona", label: "Como Funciona" },
  { to: "/sebentas", label: "Sebentas & Resumos" },
  { to: "/data-lean", label: "Modo Data-Lean" },
  { to: "/precos", label: "Preços" },
  { to: "/sobre", label: "Sobre Nós" },
];

type HeaderProps = {
  user?: { initials: string; avatarUrl?: string } | null;
};

export function Header({ user = null }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const linkClass = (to: string) =>
    `transition-colors hover:text-primary ${pathname === to ? "text-primary" : "text-muted-foreground"
    }`;

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between gap-4">

        <Link to="/" className="flex items-center shrink-0" aria-label="Kombinu, página inicial">
          <img src={logoProfile} alt="Kombinu" className="h-10 sm:h-14 w-auto object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-poppins font-medium text-sm whitespace-nowrap">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={linkClass(link.to)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <Link to="/login" className="font-poppins text-sm text-muted-foreground hover:text-primary transition-colors">
            Iniciar Sessão
          </Link>
          <Button size="sm" className="font-poppins cursor-pointer" onClick={() => navigate("/registo")}>
            Começar Grátis
          </Button>
          {user && (
            <Avatar className="h-10 w-10 border-2 border-border">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user.initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <Button
          size="icon"
          variant="ghost"
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="lg:hidden hover:text-primary"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-border bg-card px-4 pt-3 pb-6 flex flex-col gap-4 shadow-lg"
        >
          <nav className="flex flex-col font-poppins font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={`py-2 transition-colors hover:text-primary ${pathname === link.to ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pt-2 border-t border-border">
            <Link
              to="/login"
              onClick={closeMenu}
              className="font-poppins text-center py-2 text-foreground hover:text-primary transition-colors"
            >
              Iniciar Sessão
            </Link>
            <Button
              className="w-full rounded-full font-poppins cursor-pointer"
              onClick={() => {
                closeMenu();
                navigate("/registo");
              }}
            >
              Começar Grátis
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}