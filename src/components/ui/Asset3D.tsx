import { useState } from "react";
import { ASSETS_3D, asset3DSrc, type Asset3DName } from "../../lib/assets3d";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

type Asset3DProps = {
  name: Asset3DName;
  /** Texto alternativo. Use "" quando o texto ao lado já transmite o mesmo significado. */
  alt: string;
  size: number;
  /** true para imagens acima da dobra (carregamento imediato). */
  priority?: boolean;
  className?: string;
  /** Cor do ícone de recurso: "dark" para fundos escuros (surface-forest, surface-ink). */
  surface?: "light" | "dark" | "warm";
};

/**
 * Ilustração 3D com fundo transparente. Dimensões fixas (sem CLS), lazy por omissão,
 * srcset 1x/2x e fallback para o ícone SVG equivalente se o ficheiro não carregar.
 */
export function Asset3D({ name, alt, size, priority = false, className, surface = "light" }: Asset3DProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn(
          "inline-flex items-center justify-center",
          surface === "dark" ? "text-feedback-success" : surface === "warm" ? "text-surface-ink" : "text-brand-ocean",
          className,
        )}
        style={{ width: size, height: size }}
      >
        <Icon name={ASSETS_3D[name].fallback} size={Math.round(size * 0.55)} />
      </span>
    );
  }

  return (
    <img
      src={asset3DSrc(name)}
      srcSet={`${asset3DSrc(name)} 1x, ${asset3DSrc(name, 2)} 2x`}
      alt={alt}
      width={size}
      height={size}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={cn("object-contain select-none", className)}
    />
  );
}
