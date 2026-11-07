import { BrandMark } from "../../components/ui/BrandMark";
import { Icon } from "../../components/ui/Icon";
import { Pill } from "../../components/ui/Pill";
import { RoleCard } from "./RoleCard";
import { ROLE_OPTIONS, type Role } from "./roleOptions";

type OnboardingRoleScreenProps = {
  onSelectRole: (role: Role) => void;
  onOpenHelp?: () => void;
};

/** ON-01 — Escolha de perfil (estudante ou criador). */
export default function OnboardingRoleScreen({ onSelectRole, onOpenHelp }: OnboardingRoleScreenProps) {
  return (
    <div className="min-h-dvh bg-background px-4 py-6 sm:px-6 lg:py-10">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col">
        <header className="flex items-center justify-between border-b border-border-cloud pb-6 lg:pb-10">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="font-montserrat text-headline-h2 tracking-tight text-primary">Kombinu</span>
          </div>
          <button
            type="button"
            onClick={onOpenHelp}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-border-cloud bg-surface-canvas px-4 text-text-secondary transition-[background-color] duration-150 hover:bg-surface-container-low"
          >
            <Icon name="help" size={18} />
            <span className="text-button">Ajuda</span>
          </button>
        </header>

        <main id="conteudo">
          <section className="mx-auto max-w-[768px] py-10 text-center">
            <Pill tone="sky" className="mb-4" icon={<Icon name="bolt" size={14} />}>
              Onboarding académico · Angola
            </Pill>
            <h1 className="mb-4 font-montserrat text-headline-h1-mobile text-balance text-on-surface sm:text-headline-h1 lg:text-[36px]">
              Como queres transformar o teu percurso académico?
            </h1>
            <p className="text-body-lg text-pretty text-text-secondary">
              Escolhe o teu perfil. Personalizamos a experiência para aprenderes todos os dias sem
              esgotar o teu plano de dados.
            </p>
          </section>

          <div className="grid grid-cols-1 gap-6 pb-10 lg:grid-cols-2">
            {ROLE_OPTIONS.map((option, i) => (
              <RoleCard key={option.role} option={option} onSelect={onSelectRole} priority={i === 0} />
            ))}
          </div>
        </main>

        <footer className="pt-4 text-center">
          <p className="text-caption text-text-tertiary">
            Podes ativar o modo criador mais tarde, nas definições da conta.
          </p>
        </footer>
      </div>
    </div>
  );
}
