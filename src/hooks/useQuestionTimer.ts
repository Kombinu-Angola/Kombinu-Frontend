import { useEffect, useRef, useState } from "react";

/**
 * Cronómetro regressivo por questão, com pausa. Conta a partir do relógio do sistema,
 * por isso não se atrasa quando o separador fica em segundo plano.
 */
export function useQuestionTimer(seconds: number, options: { paused: boolean; onExpire: () => void; key: string }) {
  const { paused, onExpire, key } = options;
  const [remaining, setRemaining] = useState(seconds);
  const deadline = useRef(Date.now() + seconds * 1000);
  const expired = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Nova questão: reinicia o cronómetro.
  useEffect(() => {
    deadline.current = Date.now() + seconds * 1000;
    expired.current = false;
    setRemaining(seconds);
  }, [key, seconds]);

  useEffect(() => {
    if (paused) {
      deadline.current = Date.now() + remaining * 1000;
      return;
    }
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.round((deadline.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0 && !expired.current) {
        expired.current = true;
        onExpireRef.current();
      }
    }, 250);
    return () => window.clearInterval(id);
    // remaining é lido só quando a pausa muda, por isso não entra nas dependências
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, key]);

  return { remaining, ratio: remaining / seconds };
}
