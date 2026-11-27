import { useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout, Field, FormAlert, LegalNote, PasswordField, PrimaryButton, linkClass } from '../features/auth-novo/ui';
import { mensagemDeLogin } from '../features/auth/mensagensLogin';
import { destinoPosLogin } from '../lib/destinoPosLogin';
import { validarEmail } from '../utils/helpers';
import type { Usuario } from '../types';

type Erros = Partial<Record<'identificador' | 'escola' | 'senha' | 'form', string>>;

/**
 * Login único. Não se escolhe «tipo de conta»: quem escreve um e-mail entra com e-mail e palavra-passe;
 * quem escreve outra coisa (o código de aluno que a escola lhe deu) vê o campo «Código da escola» e entra
 * pelo login institucional. O papel (estudante, professor, admin, criador) vem sempre da conta, nunca do formulário.
 */
export default function Login() {
  const [identificador, setIdentificador] = useState('');
  const [escola, setEscola] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [carregando, setCarregando] = useState(false);
  const identificadorRef = useRef<HTMLInputElement>(null);
  const escolaRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  const { entrar, entrarInstitucional } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const valor = identificador.trim();
  const eEmail = valor.includes('@');
  const comCodigoDeAluno = valor !== '' && !eEmail;

  /** Destino após autenticar: troca de senha obrigatória, depois o `from` do ProtectedRoute, senão o ecrã do papel. */
  const seguirParaDestino = (usuarioLogado: Usuario) => {
    const from = (location.state as { from?: unknown } | null)?.from;
    navigate(destinoPosLogin(usuarioLogado, from), { replace: true });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (carregando) return;
    const proximos: Erros = {};
    if (!valor) proximos.identificador = 'Introduz o teu e-mail ou o código de aluno.';
    else if (eEmail && !validarEmail(valor)) proximos.identificador = 'Introduz um e-mail válido (ex.: teu@email.com).';
    if (comCodigoDeAluno && !escola.trim()) proximos.escola = 'Introduz o código da escola.';
    if (!senha) proximos.senha = 'Introduz a tua palavra-passe.';
    setErros(proximos);
    if (proximos.identificador) return identificadorRef.current?.focus();
    if (proximos.escola) return escolaRef.current?.focus();
    if (proximos.senha) return senhaRef.current?.focus();

    setCarregando(true);
    const resultado = eEmail ? await entrar(valor, senha) : await entrarInstitucional(escola, valor, senha);
    setCarregando(false);
    if ('usuario' in resultado) {
      seguirParaDestino(resultado.usuario);
    } else {
      setErros({ form: mensagemDeLogin(resultado) });
      if (!eEmail) setSenha('');
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
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {erros.form && <FormAlert>{erros.form}</FormAlert>}
        <Field
          ref={identificadorRef}
          label="E-mail ou código de aluno"
          hint="Se a tua escola te deu um código de aluno, escreve-o aqui."
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          value={identificador}
          onChange={(e) => {
            setIdentificador(e.target.value);
            setErros((x) => ({ ...x, identificador: undefined, form: undefined }));
          }}
          error={erros.identificador}
        />
        {comCodigoDeAluno && (
          <div className="motion-safe:animate-panel-in">
            <Field
              ref={escolaRef}
              label="Código da escola"
              hint="Está na carta que a tua escola te entregou."
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={20}
              value={escola}
              onChange={(e) => {
                setEscola(e.target.value);
                setErros((x) => ({ ...x, escola: undefined, form: undefined }));
              }}
              error={erros.escola}
            />
          </div>
        )}
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
    </AuthLayout>
  );
}
