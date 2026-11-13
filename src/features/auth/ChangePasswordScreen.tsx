import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button3D } from "../../components/ui/Button3D";
import { FieldError, TextField } from "../../components/ui/Field";
import { useAuth } from "../../contexts/AuthContext";
import { ErroTrocaSenha } from "../../services/authService";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";

/**
 * Troca de senha. Obrigatória no primeiro acesso das contas institucionais
 * (`mustChangePassword`): enquanto não for feita, o resto da app fica bloqueado.
 */
export default function ChangePasswordScreen() {
  const { usuario, loading, trocarSenha, logout } = useAuth();
  const navigate = useNavigate();
  const headingRef = useFocusOnMount();
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erroAtual, setErroAtual] = useState<string>();
  const [erroNova, setErroNova] = useState<string>();
  const [erroGeral, setErroGeral] = useState<string>();
  const [aGuardar, setAGuardar] = useState(false);

  // Depois de um redireccionamento completo, a sessão ainda está a ser lida do armazenamento local.
  if (loading) return null;
  if (!usuario) return <Navigate to="/login" replace />;

  const obrigatoria = usuario.mustChangePassword === true;

  async function submeter() {
    setErroAtual(undefined);
    setErroNova(undefined);
    setErroGeral(undefined);
    if (!atual || !nova) {
      setErroGeral("Preenche a senha actual e a nova senha.");
      return;
    }
    if (nova !== confirmacao) {
      setErroNova("A confirmação não coincide com a nova senha.");
      return;
    }
    setAGuardar(true);
    try {
      await trocarSenha(atual, nova);
      navigate(usuario?.tipo === "criador" ? "/dashboard/creator" : "/dashboard/learner", { replace: true });
    } catch (err) {
      if (err instanceof ErroTrocaSenha) {
        setErroAtual(err.erros.senhaAtual?.join(" "));
        setErroNova(err.erros.novaSenha?.join(" "));
        if (!err.erros.senhaAtual && !err.erros.novaSenha) setErroGeral("Não foi possível trocar a senha.");
      } else {
        setErroGeral("Não foi possível trocar a senha. Verifica a ligação e tenta de novo.");
      }
    } finally {
      setAGuardar(false);
    }
  }

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
          Troca a tua senha
        </h1>
        <p className="mb-7 text-center text-body-md text-text-secondary">
          {obrigatoria
            ? "Por segurança, tens de definir uma senha nova antes de continuares."
            : "Escolhe uma senha nova para a tua conta."}
        </p>

        <form
          className="flex flex-col gap-5"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!aGuardar) void submeter();
          }}
        >
          <TextField
            id="senha-actual"
            label="Senha actual"
            type="password"
            autoComplete="current-password"
            value={atual}
            error={erroAtual}
            onChange={(e) => setAtual(e.target.value)}
          />
          <TextField
            id="senha-nova"
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            value={nova}
            error={erroNova}
            onChange={(e) => setNova(e.target.value)}
          />
          <TextField
            id="senha-confirmacao"
            label="Confirma a nova senha"
            type="password"
            autoComplete="new-password"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
          />
          <div role="alert" aria-live="polite">
            <FieldError id="troca-senha" error={erroGeral} />
          </div>
          <Button3D type="submit" size="lg" fullWidth aria-disabled={aGuardar || undefined}>
            {aGuardar ? "A guardar…" : "Guardar nova senha"}
          </Button3D>
        </form>

        {obrigatoria && (
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="mt-6 min-h-11 self-center rounded-full px-4 text-button text-text-secondary uppercase hover:text-primary"
          >
            Sair
          </button>
        )}
      </main>
    </div>
  );
}
