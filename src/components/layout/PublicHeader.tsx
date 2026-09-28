import logoProfile from "../assets/Kombinu logo. .png"

import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
export function Header() {

  const [isOpen, setIsOpen] = useState(false);





  return (
    <header className="sticky top-0 z-50    bg-background/90 border-0 w-full border-border  backdrop-blur-md" >

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">


        <Link className="flex items-center" to="/">
          <img src={logoProfile} className=" h-25 w-25 sm:w-14 sm:h-14 object-contain" alt="logoTipo" />
        </Link>
        <nav className="hidden md:flex items-center gap-3 lg:gap-6 font-medium text-xs lg:text-sm text-muted-foreground whitespace-nowrap">
          <a href="#how-it-works" className="text-primary md:text">Como Funciona</a>
          <a href="#marktplace" className="hover:text-primary">Sebentas & Resumos</a>
          <a href="#data-learn" className="hover:text-primary">Modo Data-Lean</a>
          <a href="#prices" className="hover:text-primary">Preços</a>
          <a href="#" className="hover:text-primary">Sobre Nós</a>
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link to="/" className="hover:text-primary text-xs lg:text-sm whitespace-nowrap">
            Iniciar Sessão
          </Link>
          <Button size="sm" className="cursor-pointer text-xs lg:text-sm">
            Começar Grátis
          </Button>
          <Avatar className="h-8 w-8 lg:h-10 lg:w-10 border-2 border-border bg-primary">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-white text-xs">CN</AvatarFallback>
          </Avatar>
        </div>
        <Button size="icon" variant="ghost" type="button" onClick={() => setIsOpen(!isOpen)} className="md:hidden  text-slate-700 focus:outline-none p-2 hover:text-primary"
          aria-label="Abrir menu">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="w-6 h-6" />}

        </Button>


      </div>

      {isOpen && (
        <div className="md:hidden border-t  bg-card px-4 pt-3 pb-6 flex flex-col gap-4 animate-in text-muted-foreground hover:text-foreground slide-in-from-top duration-200 shadow-lg">
          <nav className="flex flex-col gap-3 font-medium text-slate-700">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-primary py-1">Como Funciona</Link>
            <Link to="/" onClick={() => setIsOpen(false)} className="">Sebentas & Resumos</Link>
            <Link to="/" onClick={() => setIsOpen(false)} className="">Modo Data-Lean</Link>
            <Link to="/" onClick={() => setIsOpen(false)} className="">Preços</Link>
            <Link to="/" onClick={() => setIsOpen(false)} className="">Sobre Nós</Link>
          </nav>

          <div className="mb-2  flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="text-center font-medium text-foreground hover:bg-muted py-2"
            >
              Iniciar Sessão
            </Link>
            <Button className="w-full rounded-full cursor-pointer">
              Começar Grátis
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
