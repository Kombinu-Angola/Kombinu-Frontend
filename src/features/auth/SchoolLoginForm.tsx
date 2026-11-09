import { useState } from "react";
import { Button3D } from "../../components/ui/Button3D";
import { FieldError, TextField } from "../../components/ui/Field";
import { useAuth } from "../../contexts/AuthContext";
import type { Usuario } from "@/types";
import { MENSAGENS_LOGIN } from "./mensagensLogin";

type SchoolLoginFormProps = {
  /** Chamado com o utilizador autenticado; o ecrã decide para onde seguir (ex.: troca de senha). */
  onAuthenticated: (usuario: Usuario) => void;
};

/** Entrada com a conta da escola: código da escola, código do aluno e senha. */
export function SchoolLoginForm({ onAuthenticated }: SchoolLoginFormProps) {
  const { entrarInstitucional } = useAuth();
  const [escola, setEscola] = useState("");
  const [aluno, setAluno] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string>();
  const [aEntrar, setAEntrar] = useState(false);

  async function submeter() {
    if (!escola.trim() || !aluno.trim() || !senha) {
      setErro("Preenche o código da escola, o código do aluno e a senha.");
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
    <form
      className="flex w-full flex-col gap-5"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!aEntrar) void submeter();
      }}
    >
      <TextField
        id="escola-codigo"
        label="Código da escola"
        hint="Está na carta que a tua escola te entregou."
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        maxLength={20}
        value={escola}
        onChange={(e) => setEscola(e.target.value)}
      />
      <TextField
        id="escola-aluno"
        label="Código do aluno"
        autoComplete="username"
        spellCheck={false}
        maxLength={40}
        value={aluno}
        onChange={(e) => setAluno(e.target.value)}
      />
      <TextField
        id="escola-senha"
        label="Senha"
        type="password"
        autoComplete="current-password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <div role="alert" aria-live="polite">
        <FieldError id="escola-form" error={erro} />
      </div>
      <Button3D type="submit" size="lg" fullWidth aria-disabled={aEntrar || undefined}>
        {aEntrar ? "A entrar…" : "Entrar com a escola"}
      </Button3D>
    </form>
  );
}
