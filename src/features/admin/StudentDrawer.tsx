import { useState } from "react";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { SlideOver } from "../../components/ui/SlideOver";
import { Switch } from "../../components/ui/Switch";
import { useToast } from "../../components/ui/Toast";
import { maskAOPhone } from "../../components/ui/PhoneInputAO";
import { formatInt, formatKz } from "../../lib/format";
import { levelInfo } from "../../lib/levels";
import type { StudentRow } from "./types";

const dateFormat = new Intl.DateTimeFormat("pt-AO", { day: "2-digit", month: "short", year: "numeric" });

type StudentDrawerProps = {
  student: StudentRow | null;
  onClose: () => void;
  onToggleSuspension: (id: string, suspended: boolean) => void;
};

/** Ficha de inspeção do estudante. A suspensão pede confirmação explícita antes de aplicar. */
export function StudentDrawer({ student, onClose, onToggleSuspension }: StudentDrawerProps) {
  const [confirming, setConfirming] = useState(false);
  const toast = useToast();

  if (!student) return null;
  const lvl = levelInfo(student.xp);
  const phone = maskAOPhone(student.phone);
  const suspended = student.status === "suspenso";

  const stats = [
    { id: "xp", label: "XP total", value: formatInt(student.xp), note: `Nível ${lvl.level} · ${lvl.title}`, tone: "text-feedback-gem-ink" },
    { id: "streak", label: "Sequência ativa", value: `${student.detail.streakDays} dias`, note: `Recorde: ${student.detail.bestStreak} dias`, tone: "text-feedback-streak-ink" },
    { id: "quiz", label: "Quizzes feitos", value: String(student.detail.quizzes), note: `${student.detail.accuracy}% de acerto`, tone: "text-on-surface" },
    { id: "gems", label: "Saldo de gemas", value: formatInt(student.detail.gems), note: "Disponível para resgatar", tone: "text-on-surface" },
  ];

  return (
    <SlideOver
      open
      onClose={onClose}
      eyebrow="Inspeção detalhada"
      title={`Ficha ${student.id.toUpperCase()}`}
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-caption text-text-secondary">
            <span aria-hidden="true" className="size-2 rounded-full bg-feedback-success" />
            Sessão ativa via Multicaixa Express
          </p>
          <Button3D variant="ghost" onClick={onClose}>
            Concluir
          </Button3D>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <section className="flex flex-col items-center gap-2 rounded-2xl bg-surface-soft p-5 text-center">
          <Avatar name={student.name} size="lg" />
          <h3 className="font-montserrat text-headline-h3 font-extrabold text-on-surface">{student.name}</h3>
          <p className="text-caption text-text-tertiary">
            {student.handle} · {student.university} — {student.course}
          </p>
          {student.verified && (
            <p className="inline-flex items-center gap-1.5 rounded-full bg-surface-forest px-3 py-1 text-overline text-feedback-success uppercase">
              <Icon name="seal" size={14} />
              Verificado por Multicaixa Express
            </p>
          )}
          <p className="mt-2 w-full rounded-xl bg-surface-canvas p-3 text-left">
            <span className="block text-overline text-text-tertiary uppercase">Telemóvel Express</span>
            <span className="block font-bold text-on-surface tabular-nums" aria-hidden="true">
              {phone.visual}
            </span>
            <span className="sr-only">{phone.spoken}</span>
          </p>
        </section>

        <section aria-labelledby="metrics-title">
          <div className="mb-2 flex items-center justify-between">
            <h3 id="metrics-title" className="text-overline text-text-tertiary uppercase">
              Métricas académicas
            </h3>
            <span className="text-caption font-bold text-primary">{student.detail.league}</span>
          </div>
          <dl className="grid grid-cols-2 gap-2">
            {stats.map((s) => (
              <div key={s.id} className="rounded-xl bg-surface-soft p-4">
                <dt className="text-caption text-text-secondary">{s.label}</dt>
                <dd>
                  <span className={`block font-montserrat text-headline-h3 font-extrabold tabular-nums ${s.tone}`}>
                    {s.value}
                  </span>
                  <span className="block text-caption text-text-tertiary">{s.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {student.detail.purchases.length > 0 && (
          <section aria-labelledby="purchases-title">
            <h3 id="purchases-title" className="mb-2 text-overline text-text-tertiary uppercase">
              Compras recentes (Multicaixa Express)
            </h3>
            <ul className="flex flex-col gap-2">
              {student.detail.purchases.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface-soft p-3">
                  <span className="min-w-0">
                    <span className="block truncate text-body-md font-bold text-on-surface">{p.title}</span>
                    <span className="block text-caption text-text-tertiary">
                      {dateFormat.format(new Date(p.at))} · ref. {p.id.toUpperCase()}
                    </span>
                  </span>
                  <span className="shrink-0 text-body-md font-bold text-on-surface tabular-nums">{formatKz(p.amountKz)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="actions-title" className="flex flex-col gap-3">
          <h3 id="actions-title" className="text-overline text-text-tertiary uppercase">
            Ações de gestão
          </h3>
          <Button3D
            variant="ghost"
            fullWidth
            leadingIcon={<Icon name="key" size={18} />}
            onClick={() => toast.show(`PIN provisório enviado por SMS para ${phone.visual}.`)}
          >
            Redefinir PIN de acesso
          </Button3D>
          <Button3D
            variant="ghost"
            fullWidth
            leadingIcon={<Icon name="comment" size={18} />}
            onClick={() => toast.show("Canal de SMS aberto com o estudante.")}
          >
            Enviar mensagem (SMS)
          </Button3D>

          <div className="rounded-2xl border-2 border-feedback-error bg-feedback-error-soft p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-body-md font-bold text-feedback-error-ink">Suspender estudante</p>
                <p id="suspend-hint" className="text-caption text-text-secondary">
                  Revoga o acesso Pro e bloqueia a entrada na conta.
                </p>
              </div>
              <Switch
                id="suspend-toggle"
                tone="error"
                checked={suspended || confirming}
                describedBy="suspend-hint"
                label={suspended ? "Conta suspensa" : "Suspender"}
                onChange={(next) => {
                  if (suspended) {
                    onToggleSuspension(student.id, false);
                    toast.show(`Conta de ${student.name} reativada.`);
                    return;
                  }
                  setConfirming(next);
                }}
              />
            </div>

            {confirming && !suspended && (
              <div className="mt-3 flex flex-col gap-2 border-t-2 border-feedback-error/30 pt-3">
                <p className="text-caption font-bold text-feedback-error-ink">
                  Confirmas a suspensão da conta de {student.name}?
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button3D
                    className="bg-feedback-error-ink text-white shadow-none hover:brightness-110"
                    onClick={() => {
                      onToggleSuspension(student.id, true);
                      setConfirming(false);
                      toast.show(`Conta de ${student.name} suspensa.`, "error");
                    }}
                  >
                    Confirmar suspensão
                  </Button3D>
                  <Button3D variant="ghost" onClick={() => setConfirming(false)}>
                    Cancelar
                  </Button3D>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </SlideOver>
  );
}
