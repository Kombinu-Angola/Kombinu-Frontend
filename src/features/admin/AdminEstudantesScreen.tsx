import { useCallback, useEffect, useMemo, useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import {
  memberService,
  type BulkImportMemberRow,
  type SchoolMember,
} from "../../services/memberService";
import { cn } from "@/lib/utils";

type AdminEstudantesScreenProps = {
  adminName?: string;
  schoolName?: string;
  initialMembers?: SchoolMember[];
};

const SAMPLE_CSV = `nome;email;numero_estudante;curso
Ana Paula Sebastião;ana.sebastiao@ugs.ed.ao;20260101;Engenharia Informática
Carlos Alberto Domingos;carlos.domingos@ugs.ed.ao;20260102;Gestão Empresarial`;

export default function AdminEstudantesScreen({
  adminName = "Administração",
  schoolName = "Instituição",
  initialMembers = [],
}: AdminEstudantesScreenProps) {
  const [members, setMembers] = useState<SchoolMember[]>(initialMembers);
  const [loading, setLoading] = useState(initialMembers.length === 0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal de importação em lote
  const [importOpen, setImportOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  // Senha temporária gerada ao repor senha
  const [resetResult, setResetResult] = useState<{
    memberName: string;
    email: string;
    password?: string;
  } | null>(null);

  const toast = useToast();

  const carregarMembros = useCallback(async () => {
    setLoading(true);
    try {
      const lista = await memberService.listarMembros({
        role: "student",
      });
      setMembers(lista);
    } catch {
      toast.show("Não foi possível carregar a lista de estudantes.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    carregarMembros();
  }, [carregarMembros]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.nome.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.numeroEstudante && m.numeroEstudante.toLowerCase().includes(q)) ||
        (m.curso && m.curso.toLowerCase().includes(q))
      );
    });
  }, [members, search, statusFilter]);

  const stats = useMemo(() => {
    const total = members.length;
    const ativos = members.filter((m) => m.status === "active").length;
    return { total, ativos, inativos: total - ativos };
  }, [members]);

  const parsedPreview = useMemo<BulkImportMemberRow[]>(
    () => memberService.parseCsvText(csvText),
    [csvText],
  );

  async function handleToggleStatus(member: SchoolMember) {
    setActionLoadingId(member.id);
    try {
      const updated =
        member.status === "active"
          ? await memberService.desactivarMembro(member.id)
          : await memberService.reactivarMembro(member.id);

      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id
            ? {
                ...m,
                status:
                  updated?.status ||
                  (member.status === "active" ? "inactive" : "active"),
              }
            : m,
        ),
      );

      toast.show(
        member.status === "active"
          ? `Acesso de ${member.nome} desactivado.`
          : `Acesso de ${member.nome} reactivado.`,
      );
    } catch {
      toast.show("Erro ao alterar o estado do estudante.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleResetPassword(member: SchoolMember) {
    setActionLoadingId(member.id);
    try {
      const res = await memberService.reporSenha(member.id);
      setResetResult({
        memberName: member.nome,
        email: member.email,
        password: res.temporaryPassword,
      });
      toast.show(
        res.detail || `Senha reposta com sucesso para ${member.nome}.`,
      );
    } catch {
      toast.show("Não foi possível repor a senha deste estudante.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleFileSelect(file?: File) {
    if (!file) return;
    setCsvFile(file);
    try {
      const text = await file.text();
      setCsvText(text);
    } catch {
      // Caso seja ficheiro binário, será enviado via FormData
    }
  }

  async function handleBulkImport() {
    if (parsedPreview.length === 0 && !csvFile) {
      toast.show(
        "Adiciona pelo menos um estudante válido ou seleciona um CSV.",
      );
      return;
    }

    setImporting(true);
    try {
      const result =
        parsedPreview.length > 0
          ? await memberService.importarEmLote(parsedPreview)
          : await memberService.importarCsvFile(csvFile!);

      toast.show(
        `${result.created} estudante(s) importado(s)${
          result.errors.length > 0 ? ` (${result.errors.length} com erro)` : ""
        }.`,
      );

      setImportOpen(false);
      setCsvText("");
      setCsvFile(null);
      await carregarMembros();
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        "Falha ao importar estudantes em lote. Verifica o formato do CSV.";
      toast.show(detail);
    } finally {
      setImporting(false);
    }
  }

  return (
    <CreatorShellimport { useCallback, useEffect, useMemo, useState } from "react";
import { CreatorShell } from "../../components/layout/CreatorShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import {
  memberService,
  type BulkImportMemberRow,
  type SchoolMember,
} from "../../services/memberService";
import { cn } from "@/lib/utils";

type AdminEstudantesScreenProps = {
  adminName?: string;
  schoolName?: string;
  initialMembers?: SchoolMember[];
};

const SAMPLE_CSV = `nome;email;numero_estudante;curso
Ana Paula Sebastião;ana.sebastiao@ugs.ed.ao;20260101;Engenharia Informática
Carlos Alberto Domingos;carlos.domingos@ugs.ed.ao;20260102;Gestão Empresarial`;

export default function AdminEstudantesScreen({
  adminName = "Administração",
  schoolName = "Instituição",
  initialMembers = [],
}: AdminEstudantesScreenProps) {
  const [members, setMembers] = useState<SchoolMember[]>(initialMembers);
  const [loading, setLoading] = useState(initialMembers.length === 0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal de importação em lote
  const [importOpen, setImportOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  // Senha temporária gerada ao repor senha
  const [resetResult, setResetResult] = useState<{
    memberName: string;
    email: string;
    password?: string;
  } | null>(null);

  const toast = useToast();

  const carregarMembros = useCallback(async () => {
    setLoading(true);
    try {
      const lista = await memberService.listarMembros({
        role: "student",
      });
      setMembers(lista);
    } catch {
      toast.show("Não foi possível carregar a lista de estudantes.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    carregarMembros();
  }, [carregarMembros]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.nome.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.numeroEstudante && m.numeroEstudante.toLowerCase().includes(q)) ||
        (m.curso && m.curso.toLowerCase().includes(q))
      );
    });
  }, [members, search, statusFilter]);

  const stats = useMemo(() => {
    const total = members.length;
    const ativos = members.filter((m) => m.status === "active").length;
    return { total, ativos, inativos: total - ativos };
  }, [members]);

  const parsedPreview = useMemo<BulkImportMemberRow[]>(
    () => memberService.parseCsvText(csvText),
    [csvText],
  );

  async function handleToggleStatus(member: SchoolMember) {
    setActionLoadingId(member.id);
    try {
      const updated =
        member.status === "active"
          ? await memberService.desactivarMembro(member.id)
          : await memberService.reactivarMembro(member.id);

      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id
            ? {
                ...m,
                status:
                  updated?.status ||
                  (member.status === "active" ? "inactive" : "active"),
              }
            : m,
        ),
      );

      toast.show(
        member.status === "active"
          ? `Acesso de ${member.nome} desactivado.`
          : `Acesso de ${member.nome} reactivado.`,
      );
    } catch {
      toast.show("Erro ao alterar o estado do estudante.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleResetPassword(member: SchoolMember) {
    setActionLoadingId(member.id);
    try {
      const res = await memberService.reporSenha(member.id);
      setResetResult({
        memberName: member.nome,
        email: member.email,
        password: res.temporaryPassword,
      });
      toast.show(
        res.detail || `Senha reposta com sucesso para ${member.nome}.`,
      );
    } catch {
      toast.show("Não foi possível repor a senha deste estudante.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleFileSelect(file?: File) {
    if (!file) return;
    setCsvFile(file);
    try {
      const text = await file.text();
      setCsvText(text);
    } catch {
      // Caso seja ficheiro binário, será enviado via FormData
    }
  }

  async function handleBulkImport() {
    if (parsedPreview.length === 0 && !csvFile) {
      toast.show("Adiciona pelo menos um estudante válido ou seleciona um CSV.");
      return;
    }

    setImporting(true);
    try {
      const result =
        parsedPreview.length > 0
          ? await memberService.importarEmLote(parsedPreview)
          : await memberService.importarCsvFile(csvFile!);

      toast.show(
        `${result.created} estudante(s) importado(s)${
          result.errors.length > 0 ? ` (${result.errors.length} com erro)` : ""
        }.`,
      );

      setImportOpen(false);
      setCsvText("");
      setCsvFile(null);
      await carregarMembros();
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        "Falha ao importar estudantes em lote. Verifica o formato do CSV.";
      toast.show(detail);
    } finally {
      setImporting(false);
    }
  }

  return (
    <CreatorShell
      active={"estudantes" as any}
      creatorName={adminName}
      actions={
        <Button3D
          onClick={() => setImportOpen(true)}
          leadingIcon={<Icon name="plus" size={18} />}
        >
          Importar em lote
        </Button3D>
      }
    >
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-overline text-primary uppercase">
              Gestão académica · {schoolName}
            </p>
            <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
              Estudantes da instituição
            </h1>
          </div>

          <dl className="flex flex-wrap gap-3">
            <div className="rounded-2xl border-2 border-border-cloud bg-surface-canvas px-4 py-2.5">
              <dt className="text-caption text-text-secondary">Total</dt>
              <dd className="font-montserrat text-headline-h3 font-extrabold text-on-surface tabular-nums">
                {stats.total}
              </dd>
            </div>
            <div className="rounded-2xl border-2 border-border-cloud bg-surface-canvas px-4 py-2.5">
              <dt className="text-caption text-text-secondary">Activos</dt>
              <dd className="font-montserrat text-headline-h3 font-extrabold text-feedback-success-ink tabular-nums">
                {stats.ativos}
              </dd>
            </div>
            <div className="rounded-2xl border-2 border-border-cloud bg-surface-canvas px-4 py-2.5">
              <dt className="text-caption text-text-secondary">Desactivados</dt>
              <dd className="font-montserrat text-headline-h3 font-extrabold text-text-tertiary tabular-nums">
                {stats.inativos}
              </dd>
            </div>
          </dl>
        </header>

        {resetResult && (
          <section
            role="status"
            className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-brand-ocean bg-surface-sky p-4"
          >
            <div>
              <p className="text-body-md font-bold text-on-surface">
                Senha reposta para {resetResult.memberName} ({resetResult.email})
              </p>
              <p className="mt-0.5 text-caption text-text-secondary">
                {resetResult.password ? (
                  <>
                    Senha temporária gerada:{" "}
                    <code className="rounded bg-surface-canvas px-2 py-0.5 font-mono font-bold text-primary select-all">
                      {resetResult.password}
                    </code>
                  </>
                ) : (
                  "Foi enviado um e-mail com instruções para definição da nova senha."
                )}
              </p>
            </div>
            <Button3D variant="ghost" onClick={() => setResetResult(null)}>
              Fechar
            </Button3D>
          </section>
        )}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome, e-mail, matrícula ou curso..."
              aria-label="Pesquisar estudantes"
              className="min-h-11 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-3.5 text-body-md text-on-surface placeholder:text-text-tertiary focus:border-brand-ocean focus:outline-none"
            />
          </div>

          <div
            role="group"
            aria-label="Filtrar por estado"
            className="flex gap-1.5 rounded-xl border-2 border-border-cloud bg-surface-soft p-1"
          >
            {(
              [
                { value: "all", label: "Todos" },
                { value: "active", label: "Activos" },
                { value: "inactive", label: "Desactivados" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={cn(
                  "min-h-9 rounded-lg px-3 text-caption font-bold transition-colors",
                  statusFilter === opt.value
                    ? "bg-surface-canvas text-primary shadow-xs"
                    : "text-text-secondary hover:text-on-surface",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border-2 border-border-cloud bg-surface-canvas">
          {loading ? (
            <p className="p-10 text-center text-body-md text-text-secondary">
              A carregar estudantes...
            </p>
          ) : filteredMembers.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-body-md font-bold text-on-surface">
                Nenhum estudante encontrado
              </p>
              <p className="mt-1 text-caption text-text-secondary">
                Ajusta os filtros ou importa estudantes em lote via CSV.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-border-cloud bg-surface-soft text-overline text-text-tertiary uppercase">
                    <th className="px-5 py-3.5">Estudante</th>
                    <th className="px-4 py-3.5">Matrícula / Curso</th>
                    <th className="px-4 py-3.5">Estado</th>
                    <th className="px-5 py-3.5 text-right">Acções</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-cloud">
                  {filteredMembers.map((member) => {
                    const isBusy = actionLoadingId === member.id;
                    const isActive = member.status === "active";

                    return (
                      <tr
                        key={member.id}
                        className="transition-colors hover:bg-surface-soft/50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={member.nome} size="sm" />
                            <div className="min-w-0">
                              <p className="truncate text-body-md font-bold text-on-surface">
                                {member.nome}
                              </p>
                              <p className="truncate text-caption text-text-tertiary">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-caption">
                          {member.numeroEstudante && (
                            <span className="block font-bold text-on-surface tabular-nums">
                              #{member.numeroEstudante}
                            </span>
                          )}
                          <span className="text-text-secondary">
                            {member.curso || "Sem curso atribuído"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-bold",
                              isActive
                                ? "bg-feedback-success-soft text-feedback-success-ink"
                                : "bg-surface-soft text-text-tertiary",
                            )}
                          >
                            {isActive ? "Activo" : "Desactivado"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleResetPassword(member)}
                              className="min-h-9 rounded-xl border-2 border-border-cloud px-3 text-caption font-bold text-text-secondary transition-colors hover:border-brand-ocean hover:text-primary disabled:opacity-50"
                            >
                              Repor senha
                            </button>

                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleToggleStatus(member)}
                              className={cn(
                                "min-h-9 rounded-xl border-2 px-3 text-caption font-bold transition-colors disabled:opacity-50",
                                isActive
                                  ? "border-feedback-error/40 text-feedback-error-ink hover:bg-feedback-error-soft"
                                  : "border-feedback-success/40 text-feedback-success-ink hover:bg-feedback-success-soft",
                              )}
                            >
                              {isActive ? "Desactivar" : "Reactivar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {importOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bulk-import-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <div className="w-full max-w-2xl rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 shadow-clay">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2
                  id="bulk-import-title"
                  className="font-montserrat text-headline-h2 text-on-surface"
                >
                  Importar estudantes em lote
                </h2>
                <button
                  type="button"
                  onClick={() => setImportOpen(false)}
                  aria-label="Fechar modal"
                  className="flex size-10 items-center justify-center rounded-xl text-text-secondary hover:bg-surface-soft"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <p className="mb-3 text-body-md text-text-secondary">
                Carrega um ficheiro <strong>.csv</strong> ou cola a lista abaixo
                no formato{" "}
                <code className="text-primary">
                  nome;email;matrícula;curso
                </code>
                .
              </p>

              <div className="mb-4 flex flex-wrap items-center gap-3">
                <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-brand-ocean bg-surface-sky/40 px-4 text-caption font-bold text-primary hover:bg-surface-sky">
                  <Icon name="plus" size={16} />
                  <span>
                    {csvFile ? csvFile.name : "Selecionar ficheiro CSV"}
                  </span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="sr-only"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setCsvText(SAMPLE_CSV)}
                  className="text-caption font-bold text-text-secondary underline hover:text-primary"
                >
                  Preencher exemplo
                </button>
              </div>

              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={SAMPLE_CSV}
                aria-label="Dados CSV dos estudantes"
                className="w-full rounded-2xl border-2 border-border-input bg-surface-canvas p-3 font-mono text-caption text-on-surface focus:border-brand-ocean focus:outline-none"
              />

              <p className="mt-2 text-caption text-text-secondary tabular-nums">
                {parsedPreview.length > 0
                  ? `${parsedPreview.length} registo(s) válido(s) detetado(s) para importação.`
                  : "Nenhum e-mail válido detetado ainda."}
              </p>

              <div className="mt-5 flex justify-end gap-3 border-t-2 border-border-cloud pt-4">
                <Button3D
                  variant="ghost"
                  disabled={importing}
                  onClick={() => setImportOpen(false)}
                >
                  Cancelar
                </Button3D>
                <Button3D
                  disabled={
                    importing || (parsedPreview.length === 0 && !csvFile)
                  }
                  onClick={handleBulkImport}
                >
                  {importing
                    ? "A importar..."
                    : `Importar ${parsedPreview.length > 0 ? `(${parsedPreview.length})` : ""}`}
                </Button3D>
              </div>
            </div>
          </div>
        )}
      </div>
    </CreatorShell>
  );
}
      active={"estudantes" as any}
      creatorName={adminName}
      actions={
        <Button3D
          onClick={() => setImportOpen(true)}
          leadingIcon={<Icon name="plus" size={18} />}
        >
          Importar em lote
        </Button3D>
      }
    >
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-overline text-primary uppercase">
              Gestão académica · {schoolName}
            </p>
            <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
              Estudantes da instituição
            </h1>
          </div>

          <dl className="flex flex-wrap gap-3">
            <div className="rounded-2xl border-2 border-border-cloud bg-surface-canvas px-4 py-2.5">
              <dt className="text-caption text-text-secondary">Total</dt>
              <dd className="font-montserrat text-headline-h3 font-extrabold text-on-surface tabular-nums">
                {stats.total}
              </dd>
            </div>
            <div className="rounded-2xl border-2 border-border-cloud bg-surface-canvas px-4 py-2.5">
              <dt className="text-caption text-text-secondary">Activos</dt>
              <dd className="font-montserrat text-headline-h3 font-extrabold text-feedback-success-ink tabular-nums">
                {stats.ativos}
              </dd>
            </div>
            <div className="rounded-2xl border-2 border-border-cloud bg-surface-canvas px-4 py-2.5">
              <dt className="text-caption text-text-secondary">Desactivados</dt>
              <dd className="font-montserrat text-headline-h3 font-extrabold text-text-tertiary tabular-nums">
                {stats.inativos}
              </dd>
            </div>
          </dl>
        </header>

        {resetResult && (
          <section
            role="status"
            className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-brand-ocean bg-surface-sky p-4"
          >
            <div>
              <p className="text-body-md font-bold text-on-surface">
                Senha reposta para {resetResult.memberName} ({resetResult.email}
                )
              </p>
              <p className="mt-0.5 text-caption text-text-secondary">
                {resetResult.password ? (
                  <>
                    Senha temporária gerada:{" "}
                    <code className="rounded bg-surface-canvas px-2 py-0.5 font-mono font-bold text-primary select-all">
                      {resetResult.password}
                    </code>
                  </>
                ) : (
                  "Foi enviado um e-mail com instruções para definição da nova senha."
                )}
              </p>
            </div>
            <Button3D variant="ghost" onClick={() => setResetResult(null)}>
              Fechar
            </Button3D>
          </section>
        )}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome, e-mail, matrícula ou curso..."
              aria-label="Pesquisar estudantes"
              className="min-h-11 w-full rounded-xl border-2 border-border-input bg-surface-canvas px-3.5 text-body-md text-on-surface placeholder:text-text-tertiary focus:border-brand-ocean focus:outline-none"
            />
          </div>

          <div
            role="group"
            aria-label="Filtrar por estado"
            className="flex gap-1.5 rounded-xl border-2 border-border-cloud bg-surface-soft p-1"
          >
            {(
              [
                { value: "all", label: "Todos" },
                { value: "active", label: "Activos" },
                { value: "inactive", label: "Desactivados" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={cn(
                  "min-h-9 rounded-lg px-3 text-caption font-bold transition-colors",
                  statusFilter === opt.value
                    ? "bg-surface-canvas text-primary shadow-xs"
                    : "text-text-secondary hover:text-on-surface",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border-2 border-border-cloud bg-surface-canvas">
          {loading ? (
            <p className="p-10 text-center text-body-md text-text-secondary">
              A carregar estudantes...
            </p>
          ) : filteredMembers.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-body-md font-bold text-on-surface">
                Nenhum estudante encontrado
              </p>
              <p className="mt-1 text-caption text-text-secondary">
                Ajusta os filtros ou importa estudantes em lote via CSV.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-border-cloud bg-surface-soft text-overline text-text-tertiary uppercase">
                    <th className="px-5 py-3.5">Estudante</th>
                    <th className="px-4 py-3.5">Matrícula / Curso</th>
                    <th className="px-4 py-3.5">Estado</th>
                    <th className="px-5 py-3.5 text-right">Acções</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-cloud">
                  {filteredMembers.map((member) => {
                    const isBusy = actionLoadingId === member.id;
                    const isActive = member.status === "active";

                    return (
                      <tr
                        key={member.id}
                        className="transition-colors hover:bg-surface-soft/50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={member.nome} size="sm" />
                            <div className="min-w-0">
                              <p className="truncate text-body-md font-bold text-on-surface">
                                {member.nome}
                              </p>
                              <p className="truncate text-caption text-text-tertiary">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-caption">
                          {member.numeroEstudante && (
                            <span className="block font-bold text-on-surface tabular-nums">
                              #{member.numeroEstudante}
                            </span>
                          )}
                          <span className="text-text-secondary">
                            {member.curso || "Sem curso atribuído"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-bold",
                              isActive
                                ? "bg-feedback-success-soft text-feedback-success-ink"
                                : "bg-surface-soft text-text-tertiary",
                            )}
                          >
                            {isActive ? "Activo" : "Desactivado"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleResetPassword(member)}
                              className="min-h-9 rounded-xl border-2 border-border-cloud px-3 text-caption font-bold text-text-secondary transition-colors hover:border-brand-ocean hover:text-primary disabled:opacity-50"
                            >
                              Repor senha
                            </button>

                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleToggleStatus(member)}
                              className={cn(
                                "min-h-9 rounded-xl border-2 px-3 text-caption font-bold transition-colors disabled:opacity-50",
                                isActive
                                  ? "border-feedback-error/40 text-feedback-error-ink hover:bg-feedback-error-soft"
                                  : "border-feedback-success/40 text-feedback-success-ink hover:bg-feedback-success-soft",
                              )}
                            >
                              {isActive ? "Desactivar" : "Reactivar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {importOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bulk-import-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <div className="w-full max-w-2xl rounded-3xl border-2 border-border-cloud bg-surface-canvas p-6 shadow-clay">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2
                  id="bulk-import-title"
                  className="font-montserrat text-headline-h2 text-on-surface"
                >
                  Importar estudantes em lote
                </h2>
                <button
                  type="button"
                  onClick={() => setImportOpen(false)}
                  aria-label="Fechar modal"
                  className="flex size-10 items-center justify-center rounded-xl text-text-secondary hover:bg-surface-soft"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <p className="mb-3 text-body-md text-text-secondary">
                Carrega um ficheiro <strong>.csv</strong> ou cola a lista abaixo
                no formato{" "}
                <code className="text-primary">nome;email;matrícula;curso</code>
                .
              </p>

              <div className="mb-4 flex flex-wrap items-center gap-3">
                <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-brand-ocean bg-surface-sky/40 px-4 text-caption font-bold text-primary hover:bg-surface-sky">
                  <Icon name="plus" size={16} />
                  <span>
                    {csvFile ? csvFile.name : "Selecionar ficheiro CSV"}
                  </span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="sr-only"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setCsvText(SAMPLE_CSV)}
                  className="text-caption font-bold text-text-secondary underline hover:text-primary"
                >
                  Preencher exemplo
                </button>
              </div>

              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={SAMPLE_CSV}
                aria-label="Dados CSV dos estudantes"
                className="w-full rounded-2xl border-2 border-border-input bg-surface-canvas p-3 font-mono text-caption text-on-surface focus:border-brand-ocean focus:outline-none"
              />

              <p className="mt-2 text-caption text-text-secondary tabular-nums">
                {parsedPreview.length > 0
                  ? `${parsedPreview.length} registo(s) válido(s) detetado(s) para importação.`
                  : "Nenhum e-mail válido detetado ainda."}
              </p>

              <div className="mt-5 flex justify-end gap-3 border-t-2 border-border-cloud pt-4">
                <Button3D
                  variant="ghost"
                  disabled={importing}
                  onClick={() => setImportOpen(false)}
                >
                  Cancelar
                </Button3D>
                <Button3D
                  disabled={
                    importing || (parsedPreview.length === 0 && !csvFile)
                  }
                  onClick={handleBulkImport}
                >
                  {importing
                    ? "A importar..."
                    : `Importar ${parsedPreview.length > 0 ? `(${parsedPreview.length})` : ""}`}
                </Button3D>
              </div>
            </div>
          </div>
        )}
      </div>
    </CreatorShell>
  );
}
