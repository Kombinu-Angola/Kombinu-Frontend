import {
  forwardRef, useId, useState,
  type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes,
} from "react";
import { Link } from "react-router-dom";
import { AlertIcon, ArrowRightIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "./icons";

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-kombinu-blue focus-visible:ring-offset-2";
export const linkClass = `rounded-sm font-semibold text-kombinu-blue underline-offset-4 hover:underline ${focusRing}`;

export function Logo() {
  return (
    <span className="font-display text-[2rem] leading-none font-extrabold tracking-tight text-kombinu-blue">
      kombinu<span className="text-kombinu-yellow" aria-hidden="true">.</span>
      <span className="sr-only"> — página inicial</span>
    </span>
  );
}

type AuthLayoutProps = { title: string; subtitle: string; children: ReactNode; footer: ReactNode; legal?: ReactNode };

/** Moldura das páginas de entrada: uma coluna estreita, sem imagem (poupa dados e cabe em 375 px). */
export function AuthLayout({ title, subtitle, children, footer, legal }: AuthLayoutProps) {
  return (
    <main className="min-h-dvh bg-white font-sans-landing text-kombinu-ink antialiased">
      <div className="mx-auto w-full max-w-[460px] px-5 pt-8 sm:pt-12">
        <Link to="/" className={`mx-auto mb-6 block w-fit rounded-md ${focusRing}`}><Logo /></Link>
        <header className="text-center">
          <h1 className="font-display text-[1.75rem] leading-tight font-bold tracking-tight text-balance sm:text-[2rem]">{title}</h1>
          <p className="mx-auto mt-3 max-w-[38ch] text-[0.95rem] leading-relaxed font-medium text-pretty text-neutral-600">{subtitle}</p>
        </header>
        <div className="mt-8 flex flex-col gap-6">{children}</div>
      </div>
      <div className="mx-auto mt-8 w-full max-w-[550px] px-0 sm:px-5">
        <div className="bg-kombinu-surface px-6 py-6 text-center text-[0.95rem] font-medium text-neutral-700 shadow-[0_6px_0_0_var(--color-kombinu-edge)] sm:rounded-b-[28px]">
          {footer}
        </div>
        {legal && <p className="mx-auto mt-6 max-w-[60ch] px-5 pb-10 text-center text-xs leading-relaxed font-medium text-neutral-600">{legal}</p>}
      </div>
    </main>
  );
}

export function LegalNote() {
  return (
    <>
      Ao continuar, aceitas os <Link to="/termos" className={`rounded-sm text-neutral-800 underline underline-offset-2 ${focusRing}`}>Termos de Uso</Link> e a{" "}
      <Link to="/privacidade" className={`rounded-sm text-neutral-800 underline underline-offset-2 ${focusRing}`}>Política de Privacidade</Link> da Kombinu Angola.
    </>
  );
}

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; loadingText?: string };

export function PrimaryButton({ children, loading = false, loadingText = "A processar…", disabled, className = "", ...props }: PrimaryButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`group flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-kombinu-blue px-6 py-3 font-display text-base font-bold text-white transition-transform duration-150 ease-out-strong hover:bg-kombinu-blue-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-75 disabled:active:scale-100 ${focusRing} ${className}`}
    >
      {loading ? (
        <>
          <span aria-hidden="true" className="size-5 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {children}
          <ArrowRightIcon className="size-5 shrink-0 transition-transform duration-150 ease-out-strong group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  aside?: ReactNode;
  error?: string;
  hint?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, aside, error, hint, leading, trailing, id, className = "", ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `f${autoId.replace(/:/g, "")}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="text-[0.8rem] font-bold tracking-[0.06em] uppercase">{label}</label>
        {aside}
      </div>
      <div className={`flex h-14 items-center gap-3 rounded-2xl bg-kombinu-surface px-4 text-neutral-500 ring-inset ${error ? "ring-2 ring-red-600" : "focus-within:ring-2 focus-within:ring-kombinu-blue"}`}>
        {leading}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`h-full min-w-0 flex-1 bg-transparent text-base text-kombinu-ink outline-none placeholder:text-neutral-500 ${className}`}
          {...props}
        />
        {trailing}
      </div>
      {hint && !error && <p id={hintId} className="mt-2 text-sm font-medium text-neutral-600">{hint}</p>}
      {error && (
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-700 motion-safe:animate-fade-in">
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  aside?: ReactNode;
  error?: string;
  hint?: string;
};

/** Lista de escolha com o aspecto do `Field` (mesma altura, fundo, anel de foco e erro). */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, aside, error, hint, id, children, className = "", ...props },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? `s${autoId.replace(/:/g, "")}`;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={selectId} className="text-[0.8rem] font-bold tracking-[0.06em] uppercase">{label}</label>
        {aside}
      </div>
      <div className={`relative flex h-14 items-center rounded-2xl bg-kombinu-surface px-4 ring-inset ${error ? "ring-2 ring-red-600" : "focus-within:ring-2 focus-within:ring-kombinu-blue"}`}>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`h-full min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pr-8 text-base text-kombinu-ink outline-none ${className}`}
          {...props}
        >
          {children}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-4 text-neutral-500">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </span>
      </div>
      {hint && !error && <p id={hintId} className="mt-2 text-sm font-medium text-neutral-600">{hint}</p>}
      {error && (
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-700 motion-safe:animate-fade-in">
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

export const EmailField = forwardRef<HTMLInputElement, Omit<FieldProps, "label"> & { label?: string }>(function EmailField(
  { label = "E-mail", ...props },
  ref,
) {
  return (
    <Field ref={ref} label={label} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false}
      placeholder="teu@email.com" leading={<MailIcon className="size-5 shrink-0" />} {...props} />
  );
});

export const PasswordField = forwardRef<HTMLInputElement, Omit<FieldProps, "type">>(function PasswordField(props, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <Field
      ref={ref}
      type={visible ? "text" : "password"}
      placeholder="••••••••••••"
      leading={<LockIcon className="size-5 shrink-0" />}
      trailing={
        <button type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"} aria-pressed={visible}
          className={`-mr-2 grid size-11 shrink-0 place-items-center rounded-xl text-neutral-500 hover:text-kombinu-ink ${focusRing}`}>
          {visible ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
        </button>
      }
      {...props}
    />
  );
});

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 ring-1 ring-red-200 ring-inset motion-safe:animate-fade-in">
      <AlertIcon className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
