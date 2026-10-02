import { Asset3D } from "../../components/ui/Asset3D";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { Pill } from "../../components/ui/Pill";
import { cn } from "@/lib/utils";
import type { Role, RoleOption } from "./roleOptions";

const TONE = {
  student: {
    pill: "sunbeam",
    stage: "from-secondary-fixed/50 via-surface-soft to-surface-soft",
    tick: "bg-feedback-success-soft text-feedback-success-ink",
    hoverBorder: "hover:border-brand-ocean",
    button: "primary",
  },
  creator: {
    pill: "ocean",
    stage: "from-primary-fixed/60 via-surface-soft to-surface-soft",
    tick: "bg-surface-sky text-brand-sky-ink",
    hoverBorder: "hover:border-brand-sky-ink",
    button: "secondary",
  },
} as const;

type RoleCardProps = {
  option: RoleOption;
  onSelect: (role: Role) => void;
  /** Primeira imagem visível → carregamento imediato. */
  priority?: boolean;
};

export function RoleCard({ option, onSelect, priority }: RoleCardProps) {
  const tone = TONE[option.role];
  const headingId = `role-${option.role}-title`;

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "group flex flex-col justify-between rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 sm:p-8",
        "shadow-clay transition-[translate,box-shadow,border-color] duration-200 ease-out-quint",
        "hover:-translate-y-1 hover:shadow-clay-hover",
        tone.hoverBorder,
      )}
    >
      <div>
        <Pill tone={tone.pill} className="mb-6">
          {option.eyebrow}
        </Pill>

        {/* Palco da ilustração: raio 16px dentro do cartão de 24px com 8px de folga visual */}
        <figure
          className={cn(
            "relative mb-6 flex h-44 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-tr",
            tone.stage,
          )}
        >
          <Asset3D
            name={option.illustration.asset}
            alt={option.illustration.alt}
            size={112}
            priority={priority}
            className="transition-[scale] duration-300 ease-out-quint group-hover:scale-105"
          />
          <figcaption className="rounded-full border border-border-cloud bg-surface-canvas/90 px-3 py-1 text-caption text-text-secondary">
            {option.illustration.caption}
          </figcaption>
        </figure>

        <h2 id={headingId} className="mb-6 font-montserrat text-headline-h2 text-on-surface">
          {option.title}
        </h2>

        <ul className="mb-8 space-y-4">
          {option.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <span
                className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full", tone.tick)}
              >
                <Icon name="check" size={16} strokeWidth={2.5} />
              </span>
              <span className="text-body-md text-text-secondary">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button3D
        variant={tone.button}
        fullWidth
        onClick={() => onSelect(option.role)}
        trailingIcon={<Icon name="arrow-right" size={18} />}
      >
        {option.cta}
      </Button3D>
    </article>
  );
}
