import { useState } from "react";
import { motion } from "motion/react";
import { Button3D } from "../ui/Button3D";
import { Icon } from "../ui/Icon";
import { OtpInput } from "../ui/OtpInput";
import { PhoneInputAO } from "../ui/PhoneInputAO";
import kombinuMark from "../assets/kombinu-mark.svg";

const STEPS = [
  { title: "Escolhe a cadeira", desc: "Filtra pela instituição, ano e tópico. Cada simulado mostra as questões e os MB que gasta." },
  { title: "Ativa o passe", desc: "Entras com o número de WhatsApp e pagas como preferires: Express, voucher ou encarregado." },
  { title: "Treina 5 minutos por dia", desc: "Resolves com correção na hora e descarregas tudo para estudar sem rede." },
] as const;

const TRAIL_STATES = ["done", "done", "current"] as const;
const DEMO_CODE = "482913";

/** Trilho geométrico em zig-zag: o mesmo "skill tree" usado no resto do produto, aqui com 3 passos fixos. */
function SkillTrail() {
  const pitch = 96;
  const dx = 20;
  const r = 16;
  const cx0 = 64;
  const points = TRAIL_STATES.map((state, i) => ({ x: cx0 + (i % 2 ? dx : -dx), y: 32 + i * pitch, state }));
  const height = 32 + (points.length - 1) * pitch + 32;

  return (
    <svg viewBox={`0 0 128 ${height}`} width={128} height={height} aria-hidden="true" className="block overflow-visible">
      {points.slice(0, -1).map((a, i) => {
        const b = points[i + 1];
        const d = `M${a.x} ${a.y + r}V${a.y + 24}L${b.x} ${a.y + 24 + 2 * dx}V${b.y - r}`;
        return (
          <path
            key={i}
            d={d}
            fill="none"
            strokeWidth={1.75}
            strokeLinejoin="miter"
            stroke={a.state === "done" ? "var(--color-brand-ocean)" : "var(--color-outline)"}
          />
        );
      })}
      {points.map((n, i) => (
        <g key={i}>
          <circle
            cx={n.x}
            cy={n.y}
            r={r}
            strokeWidth={1.75}
            fill={n.state === "done" ? "var(--color-brand-ocean)" : n.state === "current" ? "var(--color-secondary-container)" : "var(--color-surface-soft)"}
            stroke={n.state === "done" ? "var(--color-brand-ocean)" : n.state === "current" ? "var(--color-brand-sunbeam-ink)" : "var(--color-outline)"}
          />
          {n.state === "done" && (
            <path d={`M${n.x - 6} ${n.y}l4 4 8-8`} fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="square" />
          )}
          {n.state === "current" && <circle cx={n.x} cy={n.y} r={5} fill="var(--color-brand-sunbeam-ink)" />}
        </g>
      ))}
    </svg>
  );
}

/** "Como funciona" (3 passos) + cartão de entrada com telemóvel angolano e código real via WhatsApp (demo). */
export function PasseHowItWorks() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  return (
    <section id="como" aria-labelledby="como-h" className="bg-surface-canvas py-20 sm:py-28 lg:py-32">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="order-2 lg:order-1">
          <h2 id="como-h" className="font-montserrat text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Três passos até à prova.
          </h2>
          <div className="mt-10 grid grid-cols-[48px_1fr] gap-x-2 sm:grid-cols-[128px_1fr]">
            <div aria-hidden="true" className="row-span-3 hidden justify-self-center sm:block">
              <SkillTrail />
            </div>
            <div aria-hidden="true" className="row-span-3 w-0.5 justify-self-center bg-border-cloud sm:hidden" />
            {STEPS.map((step) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="h-24 pt-4"
              >
                <h3 className="font-bold text-xl text-on-surface">{step.title}</h3>
                <p className="mt-1 text-on-surface">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div id="entrar" className="order-1 grid gap-4.5 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-7 lg:order-2">
          <div className="flex items-center gap-3.5">
            <img src={kombinuMark} alt="" className="size-9" />
            <div>
              <h3 className="font-montserrat text-xl font-extrabold tracking-tight">Entrar na Kombinu</h3>
              <p className="mt-0.5 text-text-secondary">Sem palavra-passe para decorar.</p>
            </div>
          </div>

          <PhoneInputAO id="passe-tel" label="Número de telemóvel" hint="Recebes um código de 6 dígitos no WhatsApp." value={phone} onChange={setPhone} />

          <Button3D fullWidth onClick={() => setOtpSent(true)} disabled={otpSent}>
            {otpSent ? "Código enviado" : "Receber código no WhatsApp"}
          </Button3D>

          <motion.div animate={otpSent ? { opacity: 1, scale: 1 } : { opacity: 0.4, scale: 0.98 }} transition={{ duration: 0.4 }}>
            <OtpInput id="passe-otp" value={otpSent ? DEMO_CODE : ""} onChange={() => {}} describedBy="passe-otp-hint" />
          </motion.div>

          {otpSent && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="flex items-start gap-2.5 rounded-xl rounded-bl-sm bg-surface-forest p-3.5 text-sm text-white"
            >
              <Icon name="chat" size={18} className="mt-0.5 shrink-0 text-feedback-success" />
              <span>O teu código Kombinu é 482 913. Não o partilhes com ninguém.</span>
            </motion.p>
          )}

          <p id="passe-otp-hint" className="text-sm text-text-secondary">
            O código chega pelo WhatsApp, que é mais rápido e mais barato do que o SMS internacional. Se falhar,
            enviamos por SMS local.
          </p>
        </div>
      </div>
    </section>
  );
}
