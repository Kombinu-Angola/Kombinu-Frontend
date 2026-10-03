import { useState } from "react";
/** id do campo → mensagem de erro. */
export type FieldErrors = Partial<Record<string, string>>;

/**
 * Erros de um passo. `check` valida, mostra os erros e põe o foco no primeiro
 * campo inválido (pela ordem visual), para o leitor de ecrã ler o erro de imediato.
 */
export function useFieldErrors(order: string[]) {
  const [errors, setErrors] = useState<FieldErrors>({});

  function check(next: FieldErrors): boolean {
    setErrors(next);
    const first = order.find((key) => next[key]);
    if (first) {
      requestAnimationFrame(() => document.getElementById(first)?.focus());
      return false;
    }
    return true;
  }

  function clear(key: string) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  }

  return { errors, check, clear };
}
