import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Field, AuthLayout, EmailField, FormAlert, PasswordField, PrimaryButton, linkClass } from '../features/auth-novo/ui';
import { UserIcon } from '../features/auth-novo/icons';
import { destinoPorPapel } from '../lib/destinoPosLogin';
import { validarEmail } from '../utils/helpers';

type Tipo = 'criador' | 'aprendiz';
type Erros = Partial<Record<'nome' | 'email' | 'senha' | 'confirmar' | 'termos' | 'form', string>>;

const TIPOS: { id: Tipo; titulo: string; texto: string }[] = [
  { id: 'aprendiz', titulo: 'Aprendiz', texto: 'Quero estudar e fazer simulados' },
  { id: 'criador', titulo: 'Criador', texto: 'Quero criar conteúdos' },
];

export default function Register() {
  const [tipo, setTipo] = useState<Tipo>('aprendiz');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceito, setAceito] = useState(false);
  const [erros, setErros] = useState<Erros>({});
  const [carregando, setCarregando] = useState(false);

  const nomeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);
  const confirmarRef = useRef<HTMLInputElement>(null);
  const termosRef = useRef<HTMLInputElement>(null);

  const { register, clearError, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    const proximos: Erros = {};
    if (nome.trim().split(/\s+/).filter(Boolean).length < 2) proximos.nome = 'Escreve o teu nome e apelido.';
    if (!validarEmail(email.trim())) proximos.email = 'Introduz um e-mail válido (ex.: teu@email.com).';
    if (senha.length < 6) proximos.senha = 'A palavra-passe deve ter pelo menos 6 caracteres.';
    else if (senha !== confirmarSenha) proximos.confirmar = 'As palavras-passe não coincidem.';
    if (!aceito) proximos.termos = 'Precisas de aceitar os Termos e a Política de Privacidade.';
    setErros(proximos);
    if (proximos.nome) return nomeRef.current?.focus();
    if (proximos.email) return emailRef.current?.focus();
    if (proximos.senha) return senhaRef.current?.focus();
    if (proximos.confirmar) return confirmarRef.current?.focus();
    if (proximos.termos) return termosRef.current?.focus();

    setCarregando(true);
    try {
      const sucesso = await register({ nome: nome.trim(), email: email.trim(), senha, tipo });
      if (sucesso) {
        navigate(destinoPorPapel({ tipo }));
      } else {
        setErros({ form: authError?.message ?? 'Este e-mail já está registado ou o servidor não respondeu.' });
      }
    } catch {
      setErros({ form: authError?.message ?? 'Não foi possível criar a conta. Tenta novamente.' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <AuthLayout
      title="Cria a tua conta grátis"
      subtitle="Prepara-te com simulados e acede às sebentas da tua universidade."
      footer={
        <>
          Já tens conta na Kombinu? <Link to="/login" className={`whitespace-nowrap ${linkClass}`}>Iniciar sessão</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {erros.form && <FormAlert>{erros.form}</FormAlert>}

        <fieldset>
          <legend className="mb-2 text-[0.8rem] font-bold tracking-[0.06em] uppercase">Como queres usar a Kombinu?</legend>
          <div className="grid grid-cols-2 gap-3">
            {TIPOS.map((t) => (
              <label
                key={t.id}
                className={`flex cursor-pointer flex-col gap-1 rounded-2xl p-4 ring-2 ring-inset has-[:focus-visible]:ring-kombinu-blue ${
                  tipo === t.id ? 'bg-kombinu-surface ring-kombinu-blue' : 'bg-white ring-neutral-200 hover:ring-neutral-300'
                }`}
              >
                <input type="radio" name="tipo" value={t.id} checked={tipo === t.id} onChange={() => setTipo(t.id)} className="sr-only" />
                <span className="font-display font-bold">{t.titulo}</span>
                <span className="text-sm font-medium text-neutral-600">{t.texto}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          ref={nomeRef}
          label="Nome completo"
          autoComplete="name"
          autoCapitalize="words"
          placeholder="Ex.: Ana Domingos"
          leading={<UserIcon className="size-5 shrink-0" />}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          error={erros.nome}
        />
        <EmailField ref={emailRef} value={email} onChange={(e) => setEmail(e.target.value)} error={erros.email} />
        <PasswordField
          ref={senhaRef}
          label="Palavra-passe"
          autoComplete="new-password"
          hint="Pelo menos 6 caracteres."
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          error={erros.senha}
        />
        <PasswordField
          ref={confirmarRef}
          label="Confirmar palavra-passe"
          autoComplete="new-password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          error={erros.confirmar}
        />

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed font-medium text-neutral-700">
            <input
              ref={termosRef}
              type="checkbox"
              checked={aceito}
              onChange={(e) => setAceito(e.target.checked)}
              aria-invalid={erros.termos ? true : undefined}
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-kombinu-blue"
            />
            <span>
              Li e aceito os <Link to="/termos" className={linkClass}>Termos de Uso</Link> e a{' '}
              <Link to="/privacidade" className={linkClass}>Política de Privacidade</Link> da Kombinu Angola.
            </span>
          </label>
          {erros.termos && <p className="mt-2 text-sm font-medium text-red-700">{erros.termos}</p>}
        </div>

        <PrimaryButton type="submit" loading={carregando} loadingText="A criar a conta…">
          Criar conta
        </PrimaryButton>
      </form>
    </AuthLayout>
  );
}
