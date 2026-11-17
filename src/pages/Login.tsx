import { useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EscolaForm } from '../features/auth-novo/EscolaForm';
import {
  AuthLayout, EmailField, FormAlert, LegalNote, MethodTabs, PasswordField, PrimaryButton, linkClass,
  type Method,
} from '../features/auth-novo/ui';
import { panelId, tabId } from '../features/auth-novo/ids';
import { MENSAGENS_LOGIN } from '../features/auth/mensagensLogin';
import { destinoPosLogin } from '../lib/destinoPosLogin';
import { validarEmail } from '../utils/helpers';
import type { Usuario } from '../types';

type Erros = Partial<Record<'email' | 'senha' | 'form', string>>;

export default function Login() {
  const [modo, setModo] = useState<Method>('email');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [carregando, setCarregando] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  const { entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /** Destino após autenticar: troca de senha obrigatória, depois o `from` do ProtectedRoute, senão o ecrã do papel. */
  const seguirParaDestino = (usuarioLogado: Usuario) => {
    const from = (location.state as { from?: unknown } | null)?.from;
    navigate(destinoPosLogin(usuarioLogado, from), { replace: true });
  };

  const mudarModo = (m: Method) => {
    setModo(m);
    setErros({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const proximos: Erros = {};
    if (!validarEmail(email.trim())) proximos.email = 'Introduz um e-mail válido (ex.: teu@email.com).';
    if (!senha) proximos.senha = 'Introduz a tua palavra-passe.';
    setErros(proximos);
    if (proximos.email) return emailRef.current?.focus();
    if (proximos.senha) return senhaRef.current?.focus();

    setCarregando(true);
    const resultado = await entrar(email.trim(), senha);
    setCarregando(false);
    if ('usuario' in resultado) {
      seguirParaDestino(resultado.usuario);
    } else {
      setErros({ form: MENSAGENS_LOGIN[resultado.codigo] });
    }
  };

  return (
    <AuthLayout
      title="Inicia sessão na tua conta"
      subtitle="Retoma os teus simulados e acede às tuas sebentas."
      footer={
        <>
          Ainda não tens conta na Kombinu?{' '}
          <Link to="/register" className={`whitespace-nowrap ${linkClass}`}>Criar conta grátis</Link>
        </>
      }
      legal={<LegalNote />}
    >
      <MethodTabs idPrefix="login" value={modo} onChange={mudarModo} />

      <div
        role="tabpanel"
        id={panelId('login', 'email')}
        aria-labelledby={tabId('login', 'email')}
        hidden={modo !== 'email'}
        className="motion-safe:animate-panel-in"
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {erros.form && <FormAlert>{erros.form}</FormAlert>}
          <EmailField ref={emailRef} value={email} onChange={(e) => setEmail(e.target.value)} error={erros.email} />
          <PasswordField
            ref={senhaRef}
            label="Palavra-passe"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            error={erros.senha}
          />
          <PrimaryButton type="submit" loading={carregando} loadingText="A entrar…">
            Iniciar sessão
          </PrimaryButton>
        </form>
      </div>

      <div
        role="tabpanel"
        id={panelId('login', 'escola')}
        aria-labelledby={tabId('login', 'escola')}
        hidden={modo !== 'escola'}
        className="motion-safe:animate-panel-in"
      >
        <EscolaForm onAuthenticated={seguirParaDestino} />
      </div>
    </AuthLayout>
  );
}
