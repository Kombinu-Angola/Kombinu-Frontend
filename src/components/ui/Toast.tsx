import { toast } from "sonner";

type Tone = "success" | "error";

/** Invólucro sobre o sonner (já montado em App.tsx); mantém a API show(message, tone) das telas novas. */
export function useToast() {
  const show = (message: string, tone: Tone = "success") => {
    if (tone === "error") toast.error(message);
    else toast.success(message);
  };
  return { show };
}
