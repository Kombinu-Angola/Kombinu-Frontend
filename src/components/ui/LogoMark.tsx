import kombinuMark from "../assets/kombinu-mark.svg";
import { cn } from "@/lib/utils";

/**
 * Marca (o K) com tamanho reservado: os atributos `width`/`height` evitam o salto de layout enquanto o ficheiro
 * carrega (sem `style` inline), e o SVG está recortado ao desenho, por isso o K mede `size` px em todos os layouts.
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
    />
  );
}
