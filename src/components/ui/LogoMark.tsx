import kombinuMark from "../assets/kombinu-mark.svg";
import { cn } from "@/lib/utils";

/**
 * Marca (o K) com tamanho reservado: largura e altura fixas evitam o salto de layout enquanto o ficheiro
 * carrega, e o SVG está recortado ao desenho, por isso `size-10` mostra um K de 40 px em todos os layouts.
 */
export function LogoMark({ size = 40, className, label }: { size?: number; className?: string; label?: string }) {
  return (
    <img
      src={kombinuMark}
      width={size}
      height={size}
      alt={label ?? ""}
      draggable={false}
      className={cn("shrink-0 object-contain select-none", className)}
      style={{ width: size, height: size }}
    />
  );
}
