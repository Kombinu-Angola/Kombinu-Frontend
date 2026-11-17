import { useRef, useState, type FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { Usuario } from "@/types";
import { MENSAGENS_LOGIN } from "../auth/mensagensLogin";
import { Field, FormAlert, PasswordField, PrimaryButton } from "./ui";

/** Login institucional (escola): código da escola, código do aluno e senha. Mesmo contrato de `SchoolLoginForm`. */
export function EscolaForm({ onAuthenticated }: { onAuthenticated: (usuario: Usuario) => void }) {
  const { entrarInstitucional } = useAuth();
  const [escola, setEscola] = useState("");
  const [aluno, setAluno] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string>();
  const [aEntrar, setAEntrar] = useState(false);
  const escolaRef = useRef<HTMLInputElement>(null);

  async function submeter(e: FormEvent) {
    e.preventDefault();
    if (aEntrar) return;
    if (!escola.trim() || !aluno.trim() || !senha) {
      setErro("Preenche o código da escola, o código do aluno e a senha.");
      escolaRef.current?.focus();
      return;
    }
    setErro(undefined);
    setAEntrar(true);
    const resultado = await entrarInstitucional(escola, aluno, senha);
    setAEntrar(false);
    if ("usuario" in resultado) {
      onAuthenticated(resultado.usuario);
    } else {
      setErro(MENSAGENS_LOGIN[resultado.codigo]);
      setSenha("");
    }
  }

  return (
    <form onSubmit={submeter} noValidate className="flex flex-col gap-5">
      {erro && <FormAlert>{erro}</FormAlert>}
      <Field
        ref={escolaRef}
        label="Código da escola"
        hint="Está na carta que a tua escola te entregou."
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        maxLength={20}
        value={escola}
        onChange={(e) => setEscola(e.target.value)}
      />
      <Field
        label="Código do aluno"
        autoComplete="username"
        spellCheck={false}
        maxLength={40}
        value={aluno}
        onChange={(e) => setAluno(e.target.value)}
      />
      <PasswordField label="Senha" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} />
      <PrimaryButton type="submit" loading={aEntrar} loadingText="A entrar…">
        Entrar com a escola
      </PrimaryButton>
    </form>
  );
}
