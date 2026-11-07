import { useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { Icon, type IconName } from "../../components/ui/Icon";
import { SlideOver } from "../../components/ui/SlideOver";
import { Switch } from "../../components/ui/Switch";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatActivityTime, formatKz } from "../../lib/format";
import { cn } from "@/lib/utils";

/** Alinhado com o limite de reembolso da central de suporte. */
const DUAL_AUTH_KZ = 10_000;

type Role = {
  id: string;
  tier: string;
  name: string;
  icon: IconName;
  description: string;
  members: number;
  critical: boolean;
  permissions: string[];
};

const ROLES: Role[] = [
  {
    id: "super",
    tier: "Nível 1",
    name: "Administrador",
    icon: "shield",
    description: "Configura o gateway, gere operadores e aprova levantamentos acima do limite.",
    members: 2,
    critical: true,
    permissions: ["Gerir operadores e permissões", "Autorizar repasses sem limite", "Configurar o gateway Express", "Eliminar contas"],
  },
  {
    id: "financeiro",
    tier: "Nível 2",
    name: "Operador financeiro",
    icon: "wallet",
    description: "Concilia transações e prepara repasses, dentro do limite de dupla autorização.",
    members: 3,
    critical: false,
    permissions: [`Autorizar repasses até ${formatKz(DUAL_AUTH_KZ)}`, "Conciliar transações", "Gerar exportação fiscal", "Consultar subscrições"],
  },
  {
    id: "auditor",
    tier: "Nível 2",
    name: "Auditor pedagógico",
    icon: "seal",
    description: "Homologa criadores e modera conteúdo. Não tem acesso a dados financeiros.",
    members: 4,
    critical: false,
    permissions: ["Homologar criadores", "Aprovar ou devolver materiais", "Consultar insights", "Gerir o catálogo curricular"],
  },
  {
    id: "suporte",
    tier: "Nível 3",
    name: "Agente de suporte",
    icon: "comment",
    description: "Responde a tickets e resolve disputas pequenas; reembolsos maiores são escalados.",
    members: 6,
    critical: false,
    permissions: [`Reembolsar até ${formatKz(DUAL_AUTH_KZ)}`, "Responder a tickets", "Consultar contas de estudantes", "Escalar disputas"],
  },
];

type Operator = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  smsVerified: boolean;
  lastActiveAt: string;
  status: "ativo" | "suspenso" | "convidado";
};

const OPERATORS: Operator[] = [
  { id: "o1", name: "Orlando Fortuna", email: "orlando@kombinu.ao", roleId: "super", smsVerified: true, lastActiveAt: new Date(Date.now() - 600_000).toISOString(), status: "ativo" },
  { id: "o2", name: "Teresa Bento", email: "teresa@kombinu.ao", roleId: "auditor", smsVerified: true, lastActiveAt: new Date(Date.now() - 3 * 3_600_000).toISOString(), status: "ativo" },
  { id: "o3", name: "Hamilton Kiala", email: "hamilton@kombinu.ao", roleId: "suporte", smsVerified: true, lastActiveAt: new Date(Date.now() - 26 * 3_600_000).toISOString(), status: "ativo" },
  { id: "o4", name: "Esperança Manuel", email: "esperanca@kombinu.ao", roleId: "financeiro", smsVerified: false, lastActiveAt: new Date(Date.now() - 72 * 3_600_000).toISOString(), status: "ativo" },
  { id: "o5", name: "Nelson Domingos", email: "nelson@kombinu.ao", roleId: "suporte", smsVerified: false, lastActiveAt: new Date(Date.now() - 400 * 3_600_000).toISOString(), status: "convidado" },
];

const AUDIT = [
  { id: "a1", at: new Date(Date.now() - 900_000).toISOString(), actor: "Esperança Manuel", action: "Autorizou repasse", target: "PO-1201 · 420.000 Kz", critical: true },
  { id: "a2", at: new Date(Date.now() - 4 * 3_600_000).toISOString(), actor: "Teresa Bento", action: "Homologou criador", target: "PROT-CRE-2026-8942", critical: false },
  { id: "a3", at: new Date(Date.now() - 9 * 3_600_000).toISOString(), actor: "Hamilton Kiala", action: "Reembolsou compra", target: "TX-983115 · 4.500 Kz", critical: false },
  { id: "a4", at: new Date(Date.now() - 30 * 3_600_000).toISOString(), actor: "Orlando Fortuna", action: "Alterou permissões", target: "Operador financeiro", critical: true },
];

const STATUS = {
  ativo: { label: "Ativo", className: "bg-surface-forest text-feedback-success" },
  suspenso: { label: "Suspenso", className: "border-2 border-feedback-error bg-surface-canvas text-feedback-error-ink" },
  convidado: { label: "Convite pendente", className: "bg-secondary-fixed text-on-secondary-fixed-variant" },
} as const;

/** Equipa e permissões: quem pode o quê, com dupla autorização no dinheiro e registo de auditoria. */
export default function TeamPermissionsScreen() {
  const [operators, setOperators] = useState(OPERATORS);
  const [dualAuth, setDualAuth] = useState(true);
  const [editing, setEditing] = useState<Role | null>(null);
  const toast = useToast();

  const withoutSms = operators.filter((o) => !o.smsVerified && o.status === "ativo");

  return (
    <AdminShell
      active="equipa"
      eyebrow="Governança e segurança"
      title="Equipa e permissões"
      description="Funções, limites de autorização e registo das ações sensíveis do backoffice."
      actions={
        <Button3D onClick={() => toast.show("Convite enviado por e-mail e SMS.")} leadingIcon={<Icon name="plus" size={18} />}>
          Convidar operador
        </Button3D>
      }
    >
      {withoutSms.length > 0 && (
        <p className="mb-6 flex items-start gap-3 rounded-2xl border-2 border-feedback-streak bg-surface-canvas p-4 text-body-md text-on-surface tabular-nums">
          <Icon name="alert" size={20} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
          {withoutSms.length} operadores ativos ainda não confirmaram o acesso por SMS. Sem essa confirmação, a conta
          entra com credenciais que podem ser partilhadas.
        </p>
      )}

      <section aria-labelledby="roles-title" className="mb-8">
        <h2 id="roles-title" className="mb-4 font-montserrat text-headline-h2 text-on-surface">
          Funções e o que cada uma pode fazer
        </h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ROLES.map((role) => (
            <li key={role.id}>
              <article
                className={cn(
                  "flex h-full flex-col justify-between rounded-3xl border-2 bg-surface-canvas p-5",
                  role.critical ? "border-feedback-error" : "border-border-cloud",
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-xl",
                          role.critical ? "bg-feedback-error-soft text-feedback-error-ink" : "bg-primary-fixed text-primary",
                        )}
                      >
                        <Icon name={role.icon} size={22} />
                      </span>
                      <span>
                        <span className="block text-overline text-text-tertiary uppercase">{role.tier}</span>
                        <span className="block text-headline-h3 text-on-surface">{role.name}</span>
                      </span>
                    </span>
                    <span className="rounded-full bg-surface-soft px-2.5 py-1 text-caption font-bold text-text-secondary tabular-nums">
                      {role.members} ativos
                    </span>
                  </div>

                  <p className="mt-3 text-body-md text-text-secondary">{role.description}</p>

                  <ul className="mt-3 flex flex-col gap-1.5">
                    {role.permissions.map((permission) => (
                      <li key={permission} className="flex items-start gap-2 text-caption text-text-secondary">
                        <Icon name="check" size={14} strokeWidth={3} className="mt-0.5 shrink-0 text-feedback-success-ink" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button3D variant="ghost" className="mt-4 self-start" onClick={() => setEditing(role)}>
                  Editar permissões
                  <span className="sr-only"> de {role.name}</span>
                </Button3D>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="dual-title" className="mb-8 rounded-3xl border-2 border-brand-ocean bg-surface-canvas p-5 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 id="dual-title" className="flex items-center gap-2 font-montserrat text-headline-h3 font-extrabold text-on-surface tabular-nums">
              <Icon name="lock" size={22} className="text-primary" />
              Dupla autorização acima de {formatKz(DUAL_AUTH_KZ)}
            </h2>
            <p id="dual-hint" className="mt-1 max-w-2xl text-body-md text-text-secondary">
              Repasses e reembolsos acima deste valor precisam de confirmação de um segundo operador com função
              diferente. É o mesmo limite usado na central de suporte.
            </p>
          </div>
          <Switch
            id="dual-auth"
            checked={dualAuth}
            label="Exigir dupla autorização"
            hideLabel
            describedBy="dual-hint"
            onChange={(v) => {
              setDualAuth(v);
              toast.show(v ? "Dupla autorização ativa." : "Dupla autorização desligada.", v ? "success" : "error");
            }}
          />
        </div>
        {!dualAuth && (
          <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border-2 border-feedback-error bg-surface-canvas p-3 text-caption font-bold text-feedback-error-ink">
            <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
            Com a regra desligada, um único operador move dinheiro sem segunda confirmação.
          </p>
        )}
      </section>

      <section aria-labelledby="operators-title" className="mb-8">
        <h2 id="operators-title" className="mb-4 font-montserrat text-headline-h2 text-on-surface">
          Operadores
        </h2>
        <TableScroll label="Tabela dos operadores do backoffice">
          <table className={cn(table, "min-w-[900px]")}>
            <caption className="sr-only">Membros da equipa interna e respetivas funções</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>Operador</th>
                <th scope="col" className={th}>Função</th>
                <th scope="col" className={th}>Acesso por SMS</th>
                <th scope="col" className={th}>Última atividade</th>
                <th scope="col" className={th}>Estado</th>
                <th scope="col" className={cn(th, "text-right")}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {operators.map((operator) => {
                const role = ROLES.find((r) => r.id === operator.roleId)!;
                return (
                  <tr key={operator.id} className={tr}>
                    <th scope="row" className={cn(td, "font-normal")}>
                      <span className="flex items-center gap-3">
                        <Avatar name={operator.name} />
                        <span>
                          <span className="block font-bold whitespace-nowrap text-on-surface">{operator.name}</span>
                          <span className="block text-caption text-text-tertiary">{operator.email}</span>
                        </span>
                      </span>
                    </th>
                    <td className={td}>
                      <span
                        className={cn(
                          "rounded-md px-2.5 py-1 text-caption font-bold whitespace-nowrap",
                          role.critical ? "border-2 border-feedback-error bg-surface-canvas text-feedback-error-ink" : "bg-surface-soft text-text-secondary",
                        )}
                      >
                        {role.name}
                      </span>
                    </td>
                    <td className={td}>
                      {operator.smsVerified ? (
                        <span className="flex items-center gap-1.5 text-caption font-bold text-feedback-success-ink">
                          <Icon name="check" size={15} strokeWidth={3} />
                          Confirmado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-caption font-bold text-feedback-streak-ink">
                          <Icon name="alert" size={15} />
                          Por confirmar
                        </span>
                      )}
                    </td>
                    <td className={cn(td, "whitespace-nowrap text-text-secondary")}>
                      {formatActivityTime(operator.lastActiveAt)}
                    </td>
                    <td className={td}>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-overline uppercase whitespace-nowrap", STATUS[operator.status].className)}>
                        {STATUS[operator.status].label}
                      </span>
                    </td>
                    <td className={cn(td, "text-right")}>
                      <span className="flex justify-end gap-1">
                        <Button3D variant="ghost" onClick={() => setEditing(role)}>
                          Função
                          <span className="sr-only"> de {operator.name}</span>
                        </Button3D>
                        <Button3D
                          variant="ghost"
                          className="border-feedback-error text-feedback-error-ink"
                          onClick={() => {
                            setOperators((prev) =>
                              prev.map((o) => (o.id === operator.id ? { ...o, status: o.status === "suspenso" ? "ativo" : "suspenso" } : o)),
                            );
                            toast.show(
                              operator.status === "suspenso" ? `${operator.name} reativado.` : `${operator.name} suspenso.`,
                              operator.status === "suspenso" ? "success" : "error",
                            );
                          }}
                        >
                          {operator.status === "suspenso" ? "Reativar" : "Suspender"}
                          <span className="sr-only"> {operator.name}</span>
                        </Button3D>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableScroll>
      </section>

      <section aria-labelledby="audit-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 id="audit-title" className="font-montserrat text-headline-h3 font-extrabold text-on-surface">
              Registo de auditoria
            </h2>
            <p className="text-caption text-text-secondary">
              Guarda quem fez o quê, quando e sobre que registo. Só de leitura, mesmo para administradores.
            </p>
          </div>
          <Button3D variant="ghost" onClick={() => toast.show("Exportação do registo iniciada.")} leadingIcon={<Icon name="download" size={18} />}>
            Exportar registo
          </Button3D>
        </div>

        <ol className="flex flex-col gap-2">
          {AUDIT.map((entry) => (
            <li
              key={entry.id}
              className={cn(
                "flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 p-3",
                entry.critical ? "border-feedback-error bg-surface-canvas" : "border-border-cloud bg-surface-soft",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon
                  name={entry.critical ? "shield" : "check"}
                  size={18}
                  className={cn("shrink-0", entry.critical ? "text-feedback-error-ink" : "text-text-tertiary")}
                />
                <span>
                  <span className="block text-body-md text-on-surface">
                    <strong>{entry.actor}</strong> · {entry.action}
                  </span>
                  <span className="block text-caption text-text-tertiary tabular-nums">{entry.target}</span>
                </span>
              </span>
              <span className="text-caption text-text-secondary tabular-nums">{formatActivityTime(entry.at)}</span>
            </li>
          ))}
        </ol>
      </section>

      {editing && (
        <SlideOver open onClose={() => setEditing(null)} eyebrow={editing.tier} title={editing.name}>
          <div className="flex flex-col gap-5">
            <p className="rounded-2xl bg-surface-soft p-4 text-body-md text-text-secondary">{editing.description}</p>
            <ul className="flex flex-col gap-3">
              {editing.permissions.map((permission) => (
                <li key={permission} className="flex items-center justify-between gap-4 rounded-xl border-2 border-border-cloud p-3">
                  <span className="text-body-md text-on-surface">{permission}</span>
                  <Switch
                    id={`perm-${permission.slice(0, 12)}`}
                    checked
                    label={permission}
                    hideLabel
                    onChange={() => toast.show("Alteração de permissões carece de segunda confirmação.")}
                  />
                </li>
              ))}
            </ul>
            <p className="flex items-start gap-2 rounded-2xl border-2 border-feedback-streak bg-surface-canvas p-3.5 text-caption text-text-secondary">
              <Icon name="alert" size={16} className="mt-0.5 shrink-0 text-feedback-streak-ink" />
              Alterar permissões de uma função afeta {editing.members} operadores e fica registado na auditoria.
            </p>
          </div>
        </SlideOver>
      )}
    </AdminShell>
  );
}
