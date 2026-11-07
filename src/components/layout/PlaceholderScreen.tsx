import { AppShell, type AppSection } from "./AppShell";

/** Secções da navegação que ainda não têm ecrã (demonstração). */
export default function PlaceholderScreen({ active, title, userName }: { active: AppSection; title: string; userName: string }) {
  return (
    <AppShell active={active} userName={userName} campus="UAN · Economia">
      <div className="mx-auto max-w-[720px] px-4 py-20 text-center">
        <h1 className="font-montserrat text-headline-h1-mobile text-on-surface">{title}</h1>
        <p className="mt-2 text-body-lg text-text-secondary">Este ecrã ainda não foi migrado.</p>
      </div>
    </AppShell>
  );
}
