import { Icon } from "../../components/ui/Icon";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import type { Usuario } from "@/types";
import { SchoolLoginForm } from "./SchoolLoginForm";

type SchoolLoginScreenProps = {
  onAuthenticated: (usuario: Usuario) => void;
  /** Volta ao ecrã de entrada por telemóvel. */
  onBack: () => void;
};

/** Entrada com a conta da escola (código da escola, código do aluno e senha). */
export default function SchoolLoginScreen({ onAuthenticated, onBack }: SchoolLoginScreenProps) {
  const headingRef = useFocusOnMount();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 py-10">
      <main
        id="conteudo"
        className="flex w-full max-w-[440px] flex-col rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 shadow-clay sm:p-10"
      >
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mb-2 text-center font-montserrat text-headline-h2 text-on-surface outline-none"
        >
          Entrar com a escola
        </h1>
        <p className="mb-7 text-center text-body-md text-text-secondary">
          Usa o código da escola e o teu código de aluno. No primeiro acesso vais definir uma senha nova.
        </p>

        <SchoolLoginForm onAuthenticated={onAuthenticated} />

        <button
          type="button"
          onClick={onBack}
          className="mt-6 inline-flex min-h-11 items-center gap-2 self-center rounded-full px-4 text-button text-text-secondary uppercase hover:text-primary"
        >
          <Icon name="arrow-left" size={18} />
          Outras formas de entrar
        </button>
      </main>
    </div>
  );
}
