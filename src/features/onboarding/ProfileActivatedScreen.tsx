import { Asset3D } from "../../components/ui/Asset3D";
import { LinkButton3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useGamification } from "../../contexts/GamificationContext";
import { useCountUp } from "../../hooks/useCountUp";
import { useFocusOnMount } from "../../hooks/useFocusOnMount";
import { REMINDER_SLOTS } from "./catalog";
import { ConfettiBurst } from "./ConfettiBurst";
import { OnboardingShell } from "./OnboardingShell";
import { ONBOARDING_XP } from "./steps";
import type { Recommendation, StudentProfile } from "./types";

type ProfileActivatedScreenProps = {
  profile: StudentProfile;
  recommendation: Recommendation;
  feedHref: string;
};

/** Onboarding, passo 4 — perfil ativo, recompensas e primeira leitura recomendada. */
export function ProfileActivatedScreen({ profile, recommendation: rec, feedHref }: ProfileActivatedScreenProps) {
  const headingRef = useFocusOnMount();
  const { xp } = useGamification();
  const shownXp = useCountUp(xp, 900);

  const level = Math.floor(xp / ONBOARDING_XP.perLevel) + 1;
  const inLevel = xp % ONBOARDING_XP.perLevel;
  const reminderTime = REMINDER_SLOTS.find((r) => r.value === profile.reminder)?.time ?? "20:00";

  return (
    <OnboardingShell
      stepIndex={3}
      aside={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-feedback-success-soft px-3 py-1 text-overline text-feedback-success-ink uppercase">
          <Icon name="check" size={14} strokeWidth={3} />
          Perfil ativo
        </span>
      }
    >
      <ConfettiBurst />

      <section className="relative mt-6 flex flex-col items-center text-center">
        <Asset3D name="kombi-celebrate" alt="" size={128} priority className="mb-3 motion-safe:animate-pop-in" />
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="max-w-[560px] font-montserrat text-headline-h1-mobile text-balance text-primary outline-none sm:text-headline-h1"
        >
          Tudo pronto. O teu perfil está ativo.
        </h1>
        <p className="mt-3 max-w-[540px] text-body-lg text-pretty text-text-secondary">
          Com base no teu diagnóstico, montámos a tua primeira trilha para dominares{" "}
          <strong className="text-on-surface">{profile.criticalSubject}</strong>.
        </p>
      </section>

      <section aria-labelledby="rewards-title" className="relative mt-8">
        <h2 id="rewards-title" className="sr-only">
          Recompensas desbloqueadas
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <li className="flex flex-col items-center rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 text-center shadow-elevation-1 motion-safe:animate-feedback-in [animation-delay:100ms]">
            <Asset3D name="badge-caloiro" alt="" size={56} className="mb-2" />
            <p className="text-body-md font-bold text-on-surface">Caloiro Kombinu {new Date().getFullYear()}</p>
            <p className="mt-0.5 text-caption text-text-tertiary">O teu primeiro emblema</p>
          </li>

          <li className="flex flex-col items-center rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 text-center shadow-elevation-1 motion-safe:animate-feedback-in [animation-delay:200ms]">
            <Asset3D name="xp-bolt" alt="" size={56} className="mb-2" />
            <p className="text-body-md font-bold text-on-surface tabular-nums">
              <span aria-hidden="true">{shownXp} XP</span>
              <span className="sr-only">{xp} pontos de experiência</span>
            </p>
            <div
              role="progressbar"
              aria-label={`Nível ${level}`}
              aria-valuemin={0}
              aria-valuemax={ONBOARDING_XP.perLevel}
              aria-valuenow={inLevel}
              aria-valuetext={`${inLevel} de ${ONBOARDING_XP.perLevel} XP no nível ${level}`}
              className="my-2 h-2 w-full overflow-hidden rounded-full bg-border-cloud"
            >
              <div
                className="h-full rounded-full bg-brand-ocean transition-[width] duration-700 ease-out-quint"
                style={{ width: `${(inLevel / ONBOARDING_XP.perLevel) * 100}%` }}
              />
            </div>
            <p className="text-caption text-text-tertiary tabular-nums">
              Nível {level} · {inLevel}/{ONBOARDING_XP.perLevel} XP
            </p>
          </li>

          <li className="flex flex-col items-center rounded-2xl border-2 border-border-cloud bg-surface-canvas p-4 text-center shadow-elevation-1 motion-safe:animate-feedback-in [animation-delay:300ms]">
            <Asset3D name="streak-flame" alt="" size={56} className="mb-2" />
            <p className="text-body-md font-bold text-feedback-streak-ink">Sequência: 1.º dia</p>
            <p className="mt-0.5 text-caption text-text-tertiary">Lembramos-te amanhã às {reminderTime}</p>
          </li>
        </ul>
      </section>

      <article
        aria-labelledby="rec-title"
        className="relative mt-6 rounded-2xl border-2 border-brand-ocean bg-surface-canvas p-5 shadow-clay sm:p-6"
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-overline text-primary uppercase">
            Recomendado pelo teu diagnóstico · {rec.subject} — {rec.institution}
          </p>
          <span className="rounded-full bg-surface-forest px-2.5 py-0.5 text-caption text-feedback-success">
            {rec.sizeLabel}
          </span>
        </div>
        <h2 id="rec-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
          {rec.title}
        </h2>
        <p className="mt-2 text-body-md text-text-secondary">{rec.excerpt}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border-cloud pt-3 text-caption text-text-tertiary">
          <li className="flex items-center gap-1.5">
            <Icon name="book" size={16} />
            {rec.minutes} min de leitura
          </li>
          <li className="flex items-center gap-1.5 font-bold text-primary">
            <Icon name="bolt" size={16} />
            {rec.quizzes} quizzes (+{rec.quizXp} XP)
          </li>
          <li className="flex items-center gap-1.5">
            <Icon name="school" size={16} />
            {rec.author}
          </li>
        </ul>
      </article>

      <div className="relative mt-8 flex flex-col gap-3">
        <LinkButton3D
          href={rec.href}
          size="lg"
          fullWidth
          aria-describedby="rec-title"
          trailingIcon={<Icon name="arrow-right" size={20} />}
        >
          Começar a ler
        </LinkButton3D>
        <LinkButton3D href={feedHref} variant="ghost" fullWidth>
          Ver todas as cadeiras
        </LinkButton3D>
      </div>
    </OnboardingShell>
  );
}
