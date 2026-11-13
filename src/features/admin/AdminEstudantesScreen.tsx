import { useMemo, useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { Avatar } from "../../components/ui/Avatar";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { useAuth } from "../../contexts/AuthContext";
import { useListaMembros, useRefrescarMembros } from "../../hooks/useMembros";
import {
  ErroImportacao,
  mensagemErroMembros,
  memberService,
  type BulkImportMemberRow,
  type ContaProvisionada,
  type ErroLinhaImportacao,
  type SchoolMember,
} from "../../services/memberService";
import { useWorkspaceStore, WORKSPACE_MARKETPLACE } from "../../stores/workspaceStore";
import { cn } from "@/lib/utils";

const SAMPLE_CSV = `numero_aluno;nome;apelido;curso;faculdade;ano
20260101;Ana Paula;Sebastião;Engenharia Informática;Engenharia;1.º ano
20260102;Carlos Alberto;Domingos;Gestão Empresarial;Economia;2.º ano`;

/** Estudantes da escola activa: lista, importação em lote, (des)activação e reposição de senha. */
export default function AdminEstudantesScreen() {
  const { usuario } = useAuth();
  const workspace = useWorkspaceStore((s) => s.ativo);
  const escola = useWorkspaceStore((s) => s.memberships.find((m) => m.organizacaoId === s.ativo));
  const noMarketplace = workspace === WORKSPACE_MARKETPLACE;

  const { data: membrosApi, isLoading, isError } = useListaMembros();
  const refrescar = useRefrescarMembros();
  const members = useMemo<SchoolMember[]>(() => membrosApi ?? [], [membrosApi]);
  const loading = isLoading;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal de importação em lote
  const [importOpen, setImportOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);
  const [errosImportacao, setErrosImportacao] = useState<ErroLinhaImportacao[]>([]);
  // Contas criadas: as senhas temporárias só existem nesta resposta e ficam apenas em memória.
  const [contasCriadas, setContasCriadas] = useState<ContaProvisionada[]>([]);

  // Senha temporária gerada ao repor senha
  const [resetResult, setResetResult] = useState<{
    memberName: string;
    codigo: string;
    password: string;
    expiraEm: string;
  } | null>(null);

  const toast = useToast();

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.nome.toLowerCase().includes(q) ||
        (m.email ?? "").toLowerCase().includes(q) ||
        m.numeroEstudante.toLowerCase().includes(q) ||
        (m.curso ?? "").toLowerCase().includes(q)
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
      if (member.status === "active") {
        await memberService.desactivarMembro(member.id);
      } else {
        await memberService.reactivarMembro(member.id);
      }
      await refrescar();
      toast.show(
        member.status === "active"
          ? `Acesso de ${member.nome} desactivado.`
          : `Acesso de ${member.nome} reactivado.`,
      );
    } catch (err) {
      toast.show(mensagemErroMembros(err, "Erro ao alterar o estado do estudante."));
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
        codigo: member.numeroEstudante,
        password: res.senhaTemporaria,
        expiraEm: res.expiraEm,
      });
      toast.show(`Senha reposta com sucesso para ${member.nome}.`);
    } catch (err) {
      toast.show(mensagemErroMembros(err, "Não foi possível repor a senha deste estudante."));
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleFileSelect(file?: File) {
    if (!file) return;
    try {
      setCsvText(await file.text());
    } catch {
      toast.show("Não foi possível ler o ficheiro CSV.");
    }
  }

  function fecharImportacao() {
    setImportOpen(false);
    setCsvText("");
    setErrosImportacao([]);
  }

  async function handleBulkImport() {
    if (parsedPreview.length === 0) {
      toast.show("Adiciona pelo menos um estudante válido.");
      return;
    }

    setImporting(true);
    setErrosImportacao([]);
    try {
      // Valida primeiro (dry-run): tudo ou nada, as linhas com erro ficam identificadas.
      const validacao = await memberService.validarLote(parsedPreview);
      if (validacao.erros.length > 0) {
        setErrosImportacao(validacao.erros);
        return;
      }

      const result = await memberService.importarEmLote(parsedPreview);
      setContasCriadas(result.contas);
      toast.show(`${result.criadas} estudante(s) importado(s).`);
      fecharImportacao();
      await refrescar();
    } catch (err) {
      if (err instanceof ErroImportacao) {
        setErrosImportacao(err.erros);
      } else {
        toast.show(mensagemErroMembros(err, "Falha ao importar estudantes em lote. Verifica o formato do CSV."));
      }
    } finally {
      setImporting(false);
    }
  }

  async function copiarContas() {
    const linhas = contasCriadas.map((c) => `${c.numeroEstudante};${c.nome};${c.senhaTemporaria}`).join("\n");
    try {
      await navigator.clipboard.writeText(`numero_aluno;nome;senha_temporaria\n${linhas}`);
      toast.show("Lista copiada. Entrega as senhas aos estudantes e fecha este aviso.");
    } catch {
      toast.show("Não foi possível copiar. Seleciona e copia as senhas manualmente.");
    }
  }

  return (
    <AdminShell
      active="membros"
      title="Estudantes da instituição"
      eyebrow={`Gestão académica · ${escola?.nome ?? "Instituição"}`}
      description={`Conta administrativa: ${usuario?.nome ?? "Administração"}.`}
      actions={
        <Button3D
          disabled={noMarketplace}
          onClick={() => setImportOpen(true)}
          leadingIcon={<Icon name="plus" size={18} />}
        >
          Importar em lote
        </Button3D>
      }
    >
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:py-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
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

        {noMarketplace && (
          <p role="status" className="mb-6 rounded-2xl border-2 border-border-cloud bg-surface-soft p-4 text-body-md text-text-secondary">
            Muda para o espaço da tua escola (seletor no cabeçalho) para gerir os estudantes.
          </p>
        )}

        {isError && !noMarketplace && (
          <p role="alert" className="mb-6 rounded-2xl border-2 border-feedback-error bg-feedback-error-soft p-4 text-body-md text-feedback-error-ink">
            Não foi possível carregar os estudantes. Só o administrador da escola tem acesso a esta lista.
          </p>
        )}

        {resetResult && (
          <section
            role="status"
            className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-brand-ocean bg-surface-sky p-4"
          >
            <div>
              <p className="text-body-md font-bold text-on-surface">
                Senha reposta para {resetResult.memberName} (#{resetResult.codigo})
              </p>
              <p className="mt-0.5 text-caption text-text-secondary">
                Senha temporária (só aparece agora):{" "}
                <code className="rounded bg-surface-canvas px-2 py-0.5 font-mono font-bold text-primary select-all">
                  {resetResult.password}
                </code>
                {resetResult.expiraEm && ` · válida até ${new Date(resetResult.expiraEm).toLocaleDateString("pt-AO")}`}
              </p>
            </div>
            <Button3D variant="ghost" onClick={() => setResetResult(null)}>
              Fechar
            </Button3D>
          </section>
        )}

        {contasCriadas.length > 0 && (
          <section
            role="status"
            className="mb-6 rounded-2xl border-2 border-brand-ocean bg-surface-sky p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-body-md font-bold text-on-surface">
                  {contasCriadas.length} conta(s) criada(s). Estas senhas temporárias só aparecem agora.
                </p>
                <p className="mt-0.5 text-caption text-text-secondary">
                  Cada estudante entra com o código da escola e o número de aluno e tem de trocar a senha no primeiro acesso.
                </p>
              </div>
              <div className="flex gap-2">
                <Button3D variant="ghost" onClick={() => void copiarContas()}>
                  Copiar lista
                </Button3D>
                <Button3D variant="ghost" onClick={() => setContasCriadas([])}>
                  Fechar
                </Button3D>
              </div>
            </div>
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {contasCriadas.map((c) => (
                <li key={c.numeroEstudante} className="flex items-center justify-between gap-3 rounded-xl bg-surface-canvas px-3 py-2 text-caption">
                  <span className="min-w-0 truncate font-bold text-on-surface">
                    #{c.numeroEstudante} · {c.nome}
                  </span>
                  <code className="font-mono font-bold text-primary select-all">{c.senhaTemporaria}</code>
                </li>
              ))}
            </ul>
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
                                {member.email ?? "Entra com o número de aluno"}
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
                  onClick={fecharImportacao}
                  aria-label="Fechar modal"
                  className="flex size-10 items-center justify-center rounded-xl text-text-secondary hover:bg-surface-soft"
                >
                  <Icon name="x" size={20} />
                </button>
              </div>

              <p className="mb-3 text-body-md text-text-secondary">
                Carrega um ficheiro <strong>.csv</strong> ou cola a lista abaixo
                no formato{" "}
                <code className="text-primary">número de aluno;nome;apelido;curso;faculdade;ano</code>
                . O número de aluno é obrigatório; o email é opcional (7.ª coluna).
              </p>

              <div className="mb-4 flex flex-wrap items-center gap-3">
                <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-brand-ocean bg-surface-sky/40 px-4 text-caption font-bold text-primary hover:bg-surface-sky">
                  <Icon name="plus" size={16} />
                  <span>Selecionar ficheiro CSV</span>
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
                  ? `${parsedPreview.length} registo(s) detetado(s) para importação.`
                  : "Nenhum número de aluno detetado ainda."}
              </p>

              {errosImportacao.length > 0 && (
                <div role="alert" className="mt-3 max-h-40 overflow-y-auto rounded-2xl border-2 border-feedback-error bg-feedback-error-soft p-3 text-caption text-feedback-error-ink">
                  <p className="font-bold">Nada foi criado. Corrige estas linhas e tenta de novo:</p>
                  <ul className="mt-1 list-disc pl-5">
                    {errosImportacao.map((e) => (
                      <li key={`${e.linha}-${e.numeroEstudante}`}>
                        Linha {e.linha} (#{e.numeroEstudante || "?"}): {e.mensagens.join("; ") || "dados inválidos"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5 flex justify-end gap-3 border-t-2 border-border-cloud pt-4">
                <Button3D
                  variant="ghost"
                  disabled={importing}
                  onClick={fecharImportacao}
                >
                  Cancelar
                </Button3D>
                <Button3D
                  disabled={importing || parsedPreview.length === 0}
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
    </AdminShell>
  );
}
