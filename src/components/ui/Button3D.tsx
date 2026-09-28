import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "success" | "ghost";
type Size = "md" | "lg";

type StyleProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-ocean text-white shadow-3d-primary hover:bg-brand-ocean-hover",
  secondary:
    "bg-surface-canvas text-primary border-2 border-brand-ocean shadow-3d-neutral hover:bg-surface-sky",
  success: "bg-feedback-success text-surface-ink shadow-3d-success hover:brightness-105",
  ghost: "bg-surface-canvas text-text-secondary border-2 border-border-cloud hover:bg-surface-soft hover:text-primary",
};

const SIZES: Record<Size, string> = {
  md: "min-h-12 px-6",
  lg: "min-h-[52px] px-8",
};

/** Classes partilhadas por <Button3D> e <LinkButton3D> (e por <Link> do router, se usar). */
export function button3DClasses({ variant = "primary", size = "md", fullWidth, className }: StyleProps = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-center select-none",
    "font-poppins text-button uppercase",
    "transition-[translate,box-shadow,background-color,color] duration-150 ease-out-quint",
    variant !== "ghost" && "active:translate-y-1 active:shadow-none",
    "disabled:pointer-events-none disabled:border-transparent disabled:bg-border-cloud disabled:text-text-tertiary disabled:shadow-none",
    "aria-disabled:pointer-events-none aria-disabled:opacity-100",
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full",
    className,
  );
}

type Slots = { leadingIcon?: ReactNode; trailingIcon?: ReactNode };

type Button3DProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleProps & Slots;

/**
 * Botão tátil 3D: sombra sólida de 4px que desaparece enquanto o botão desce 4px ao premir.
 * Texto em maiúsculas por CSS (o leitor de ecrã lê a frase normal).
 */
export function Button3D({
  variant,
  size,
  fullWidth,
  leadingIcon,
  trailingIcon,
  className,
  children,
  type = "button",
  ...rest
}: Button3DProps) {
  return (
    <button type={type} className={button3DClasses({ variant, size, fullWidth, className })} {...rest}>
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </button>
  );
}

type LinkButton3DProps = AnchorHTMLAttributes<HTMLAnchorElement> & StyleProps & Slots & { href: string };

/** Mesmo visual, mas é um link: use para navegação (ir para o estúdio, voltar ao início). */
export function LinkButton3D({
  variant,
  size,
  fullWidth,
  leadingIcon,
  trailingIcon,
  className,
  children,
  ...rest
}: LinkButton3DProps) {
  return (
    <a className={button3DClasses({ variant, size, fullWidth, className })} {...rest}>
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </a>
  );
}
