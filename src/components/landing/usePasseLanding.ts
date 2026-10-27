import { useCallback, useEffect, useRef, useState } from "react";

const CORRECT = "b";
const MSG =
  "Olá, pai. Tenho a 1.ª frequência de Anatomia I daqui a 15 dias. Preciso do Passe de Provas da Kombinu (600 Kz, 21 dias): simulados e resumos da cadeira. Podes pagar aqui pelo Multicaixa Express? kombinu.ao/p/A7K2";

function fmt(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export type PasseInstitution = "UAN" | "UCAN" | "ISPTEC" | "Metodista" | "Lusíada" | "Outra";
export type PasseOptionId = "a" | "b" | "c" | "d";
export type PassePayMethod = "mcx" | "enc" | "turma" | "vou";

export function usePasseLanding() {
  const [inst, setInst] = useState<PasseInstitution>("UAN");
  const [answer, setAnswer] = useState<PasseOptionId | null>(null);
  const [nudge, setNudge] = useState(false);
  const [cadeiras, setCadeiras] = useState(4);
  const [cadBump, setCadBump] = useState(false);
  const [pay, setPay] = useState<PassePayMethod>("enc");
  const [typed, setTyped] = useState(9999);
  const [otpSent, setOtpSent] = useState(false);
  const [offline, setOffline] = useState(true);
  const [faq, setFaq] = useState(0);
  const [anchor, setAnchor] = useState(600);
  const [sims, setSims] = useState(3000);
  const [secs, setSecs] = useState(300);
  const [scrollable, setScrollable] = useState(false);
  const reduced = prefersReducedMotion();

  const heroRef = useRef<HTMLElement | null>(null);
  const quizRef = useRef<HTMLDivElement | null>(null);
  const anchorElRef = useRef<HTMLDivElement | null>(null);
  const simsElRef = useRef<HTMLLIElement | null>(null);
  const typeElRef = useRef<HTMLDivElement | null>(null);

  const rafRef = useRef<Record<string, number>>({});
  const typeTimerRef = useRef<number | undefined>(undefined);
  const timersRef = useRef<number[]>([]);
  const tiltRafRef = useRef<number | undefined>(undefined);

  const type = useCallback(() => {
    window.clearInterval(typeTimerRef.current);
    if (prefersReducedMotion()) {
      setTyped(9999);
      return;
    }
    const total = MSG.length;
    let n = 0;
    setTyped(0);
    typeTimerRef.current = window.setInterval(() => {
      n += 1;
      if (n >= total) {
        window.clearInterval(typeTimerRef.current);
        setTyped(9999);
        return;
      }
      setTyped(n);
    }, 28);
  }, []);

  const tween = useCallback((key: "anchor" | "sims", from: number, to: number, dur: number) => {
    const setter = key === "anchor" ? setAnchor : setSims;
    cancelAnimationFrame(rafRef.current[key]);
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setter(from + (to - from) * e);
      if (p < 1) rafRef.current[key] = requestAnimationFrame(step);
    };
    rafRef.current[key] = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const check = () => {
      const doc = document.documentElement;
      const can = window.innerHeight <= 1600 && doc.scrollHeight > window.innerHeight + 200;
      setScrollable((prev) => (prev === can ? prev : can));
    };
    check();
    window.addEventListener("resize", check);

    if (reduced) {
      return () => window.removeEventListener("resize", check);
    }

    const tick = window.setInterval(() => {
      setSecs((n) => {
        if (n <= 1) {
          window.clearInterval(tick);
          return 0;
        }
        return n - 1;
      });
    }, 1000);

    let fine = false;
    try {
      fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    } catch {
      fine = false;
    }
    const heroEl = heroRef.current;
    const quizEl = quizRef.current;
    let onMove: ((e: PointerEvent) => void) | undefined;
    let onLeave: (() => void) | undefined;
    if (fine && heroEl && quizEl) {
      onMove = (e: PointerEvent) => {
        const r = heroEl.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(tiltRafRef.current!);
        tiltRafRef.current = requestAnimationFrame(() => {
          quizEl.style.setProperty("--ry", (nx * 10).toFixed(2) + "deg");
          quizEl.style.setProperty("--rx", (ny * -8).toFixed(2) + "deg");
          heroEl.style.setProperty("--px", nx.toFixed(3));
          heroEl.style.setProperty("--py", ny.toFixed(3));
        });
      };
      onLeave = () => {
        cancelAnimationFrame(tiltRafRef.current!);
        quizEl.style.setProperty("--ry", "0deg");
        quizEl.style.setProperty("--rx", "0deg");
        heroEl.style.setProperty("--px", "0");
        heroEl.style.setProperty("--py", "0");
      };
      heroEl.addEventListener("pointermove", onMove);
      heroEl.addEventListener("pointerleave", onLeave);
    }

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      const watch: Element[] = [];
      if (anchorElRef.current) {
        setAnchor(15000);
        watch.push(anchorElRef.current);
      }
      if (simsElRef.current) {
        setSims(0);
        watch.push(simsElRef.current);
      }
      if (typeElRef.current) {
        watch.push(typeElRef.current);
      }
      if (watch.length) {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (!en.isIntersecting) return;
              io!.unobserve(en.target);
              if (en.target === anchorElRef.current) tween("anchor", 15000, 600, 1700);
              else if (en.target === simsElRef.current) tween("sims", 0, 3000, 1500);
              else if (en.target === typeElRef.current) type();
            });
          },
          { threshold: 0.35 }
        );
        watch.forEach((el) => io!.observe(el));
      }
    }

    return () => {
      window.removeEventListener("resize", check);
      window.clearInterval(tick);
      if (heroEl && onMove && onLeave) {
        heroEl.removeEventListener("pointermove", onMove);
        heroEl.removeEventListener("pointerleave", onLeave);
      }
      io?.disconnect();
      cancelAnimationFrame(tiltRafRef.current!);
      Object.values(rafRef.current).forEach((id) => cancelAnimationFrame(id));
      window.clearInterval(typeTimerRef.current);
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bump = useCallback((next: number) => {
    setCadeiras(next);
    setCadBump(false);
    const t = window.setTimeout(() => setCadBump(true), 16);
    timersRef.current.push(t);
  }, []);

  const pickPay = useCallback(
    (id: PassePayMethod) => {
      setPay(id);
      if (id === "enc") {
        const t = window.setTimeout(() => type(), 60);
        timersRef.current.push(t);
      }
    },
    [type]
  );

  const goQuiz = useCallback(() => {
    const el = quizRef.current;
    let off = false;
    if (el) {
      const r = el.getBoundingClientRect();
      off = r.top < 0 || r.bottom > (window.innerHeight || 0);
      if (off) {
        try {
          el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
        } catch {
          /* older browsers */
        }
      }
      const first = el.querySelector<HTMLButtonElement>("button");
      if (first) {
        const delay = off && !prefersReducedMotion() ? 520 : 0;
        const t = window.setTimeout(() => {
          try {
            first.focus({ preventScroll: true });
          } catch {
            first.focus();
          }
        }, delay);
        timersRef.current.push(t);
      }
    }
    setNudge(false);
    const t1 = window.setTimeout(() => setNudge(true), 30);
    const t2 = window.setTimeout(() => setNudge(false), 1200);
    timersRef.current.push(t1, t2);
  }, []);

  // ---- derived values ----
  const right = answer === CORRECT;
  const answered = answer !== null;

  const tuXp = 625 + (right ? 40 : 0);
  const base: Array<[string, string, string, number]> = [
    ["ana", "Ana M.", "AM", 840],
    ["del", "Délcio K.", "DK", 790],
    ["yur", "Yuri P.", "YP", 742],
    ["tel", "Telma S.", "TS", 700],
    ["kia", "Kiame J.", "KJ", 660],
    ["nad", "Nádia L.", "NL", 640],
    ["tu", "Tu", "TU", tuXp],
    ["cel", "Celso A.", "CA", 590],
  ];
  const sorted = base.slice().sort((a, b) => b[3] - a[3]);
  const league = base.map((r) => {
    const rank = sorted.findIndex((x) => x[0] === r[0]) + 1;
    return { id: r[0], name: r[1], ini: r[2], xp: fmt(r[3]) + " XP", rank: rank + ".º", rankN: rank, isTu: r[0] === "tu" };
  });
  const leagueSorted = sorted.map((r, i) => ({ rank: i + 1 + ".º", name: r[1], xp: fmt(r[3]) + " XP" }));
  const leagueMsg = right
    ? "Entraste nos 5 primeiros. Mantém o ritmo até domingo."
    : "Estás a 36 XP dos 5 primeiros. Acerta no simulado lá em cima e vê o que muda.";

  const n = cadeiras;
  const passesTotal = n * 600;
  const multi = 2500;
  const expl = n * 15000;
  const recommended: "passe" | "multi" = passesTotal <= multi ? "passe" : "multi";
  let calcMain: string;
  let calcExtra: string;
  if (recommended === "passe") {
    calcMain =
      n === 1
        ? "Para 1 cadeira, um Passe de Provas fica em 600 Kz."
        : `Para ${n} cadeiras, ${n} Passes de Provas ficam em ${fmt(passesTotal)} Kz.`;
    calcExtra =
      multi - passesTotal <= 600
        ? `Por mais ${fmt(multi - passesTotal)} Kz, o Multi-Disciplina cobre o semestre inteiro.`
        : `Com explicador, uma aula por cadeira custaria cerca de ${fmt(expl)} Kz.`;
  } else {
    calcMain = `Com ${n} cadeiras, o Multi-Disciplina poupa-te ${fmt(passesTotal - multi)} Kz face a ${n} passes.`;
    calcExtra = `Com explicador, uma aula por cadeira custaria cerca de ${fmt(expl)} Kz.`;
  }
  const recLabel = `Recomendado para ${n}${n === 1 ? " cadeira" : " cadeiras"}.`;

  const now = new Date();
  const mi = (now.getMonth() - 9 + 12) % 12;
  const q = Math.min(3, Math.floor((now.getDate() - 1) / 7.75));
  const abbr = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const winNow = {
    w1: mi <= 1,
    w2: mi === 3 || mi === 4,
    w3: mi === 8 || mi === 9,
    w4: mi >= 10,
  };
  const todayM = mi + 1;
  const todayLabel = `Hoje, ${now.getDate()} ${abbr[now.getMonth()]}`;

  const motionOff = reduced;
  const mm = Math.floor(secs / 60);
  const ss = secs % 60;
  const secsFmt = motionOff ? "5 min" : `${mm}:${ss < 10 ? "0" : ""}${ss}`;

  const typing = typed < MSG.length;
  const typedText = typing ? MSG.slice(0, typed) : MSG;

  return {
    refs: { heroRef, quizRef, anchorElRef, simsElRef, typeElRef },
    pageClassName: scrollable && !motionOff ? "sd" : "",

    inst,
    setInst,
    insts: (["UAN", "UCAN", "ISPTEC", "Metodista", "Lusíada", "Outra"] as PasseInstitution[]).map((label) => ({
      label,
      on: inst === label,
    })),
    instTag: inst === "Outra" ? "simulado · economia i" : `simulado · economia i · ${inst}`,

    quizNudge: nudge,
    goQuiz,

    sessLabel: secs > 0 ? "Sessão de hoje" : "Sessão concluída",
    secsFmt,
    progress: right ? 32 : 20,
    answered,
    right,
    answer,
    setAnswer: (id: PasseOptionId) => {
      if (answer === null) setAnswer(id);
    },
    resetQuiz: () => setAnswer(null),
    CORRECT,

    winNow,
    todayM,
    todayQ: q,
    todayLabel,

    otpSent,
    sendOtp: () => setOtpSent(true),

    offline,
    toggleOffline: () => setOffline((v) => !v),
    simsFmt: fmt(sims),
    anchorFmt: fmt(anchor),

    cadeiras: n,
    cadBump,
    dec: () => {
      if (cadeiras > 1) bump(cadeiras - 1);
    },
    inc: () => {
      if (cadeiras < 8) bump(cadeiras + 1);
    },
    calcMain,
    calcExtra,
    recLabel,
    recommended,

    pay,
    pickPay,
    msgFull: MSG,
    typedText,
    typing,
    retype: () => type(),

    league,
    leagueSorted,
    leagueMsg,

    faq,
    toggleFaq: (i: number) => setFaq((cur) => (cur === i ? -1 : i)),
  };
}
