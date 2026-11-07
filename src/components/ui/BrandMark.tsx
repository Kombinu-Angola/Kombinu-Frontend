import { useState } from "react";

/**
 * Monograma oficial "K" (branco) sobre brand-ocean. Nunca redesenhar nem recolorir a marca:
 * se o SVG faltar, mostra um "K" tipográfico neutro até o asset ser adicionado.
 */
export function BrandMark({ size = 40 }: { size?: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className="flex items-center justify-center rounded-xl bg-brand-ocean"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {failed ? (
        <span className="font-montserrat text-lg font-extrabold text-white">K</span>
      ) : (
        <img
          src="/assets/brand/kombinu-k-white.svg"
          alt=""
          width={size * 0.55}
          height={size * 0.55}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
