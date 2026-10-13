import logoProfile from "../assets/kombinu-logo.png";

import { Button3D } from "../ui/Button3D";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar-shadcn";
import { motion, AnimatePresence } from "motion/react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="sticky top-0 z-50 bg-background/90 w-full border-b-2 border-border-cloud backdrop-blur-md"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link className="flex items-center" to="/">
          <motion.img
            whileHover={{
              scale: 1.04,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            src={logoProfile}
            className="h-10 w-10 sm:h-14 sm:w-14 object-contain"
            alt="Kombinu"
          />
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-6 font-medium text-xs lg:text-sm text-text-secondary whitespace-nowrap">

          <motion.a
            href="#how-it-works"
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            className="text-primary"
          >
            Como Funciona
          </motion.a>

          <motion.a
            href="#marketplace"
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            className="hover:text-primary"
          >
            Sebentas & Resumos
          </motion.a>

          <motion.a
            href="#data-lean"
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            className="hover:text-primary"
          >
            Modo Data-Lean
          </motion.a>

          <motion.a
            href="#prices"
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            className="hover:text-primary"
          >
            Preços
          </motion.a>

          <motion.a
            href="#manifesto"
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            className="hover:text-primary"
          >
            Sobre Nós
          </motion.a>

        </nav>

        {/* Ações Desktop */}
        <div className="hidden md:flex items-center gap-3 shrink-0">

          <motion.div
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
          >
            <Link
              to="/login"
              className="hover:text-primary text-xs lg:text-sm whitespace-nowrap"
            >
              Iniciar Sessão
            </Link>
          </motion.div>

          <Button3D className="text-xs lg:text-sm">
            Começar Grátis
          </Button3D>

          <motion.div
            whileHover={{
              scale: 1.06,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
          >
            <Avatar className="h-8 w-8 lg:h-10 lg:w-10 border-2 border-border-cloud bg-primary">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-white text-xs">
                CN
              </AvatarFallback>
            </Avatar>
          </motion.div>

        </div>

        {/* Botão Menu Mobile */}
        <motion.div
          whileTap={{
            scale: 0.9,
          }}
          className="md:hidden"
        >
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex size-11 items-center justify-center rounded-lg border-2 border-border-cloud text-text-secondary transition-colors hover:bg-surface-soft hover:text-primary"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>

      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: -10,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="md:hidden border-t bg-surface-canvas px-4 pt-3 pb-6 flex flex-col gap-4 shadow-lg overflow-hidden"
          >

            <nav className="flex flex-col gap-3 font-medium text-text-secondary">

              <motion.a
                href="#how-it-works"
                onClick={() => setIsOpen(false)}
                whileHover={{ x: 4 }}
                className="text-primary py-1"
              >
                Como Funciona
              </motion.a>

              <motion.a
                href="#marketplace"
                onClick={() => setIsOpen(false)}
                whileHover={{ x: 4 }}
                className="py-1 hover:text-primary"
              >
                Sebentas & Resumos
              </motion.a>

              <motion.a
                href="#data-lean"
                onClick={() => setIsOpen(false)}
                whileHover={{ x: 4 }}
                className="py-1 hover:text-primary"
              >
                Modo Data-Lean
              </motion.a>

              <motion.a
                href="#prices"
                onClick={() => setIsOpen(false)}
                whileHover={{ x: 4 }}
                className="py-1 hover:text-primary"
              >
                Preços
              </motion.a>

              <motion.a
                href="#manifesto"
                onClick={() => setIsOpen(false)}
                whileHover={{ x: 4 }}
                className="py-1 hover:text-primary"
              >
                Sobre Nós
              </motion.a>

            </nav>

            <div className="mb-2 flex flex-col gap-3">

              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center font-medium text-foreground hover:bg-surface-soft py-2 rounded-md"
                >
                  Iniciar Sessão
                </Link>
              </motion.div>

              <Button3D fullWidth>
                Começar Grátis
              </Button3D>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.header>
  );
}