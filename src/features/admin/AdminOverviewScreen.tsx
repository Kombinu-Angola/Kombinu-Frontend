import { useState } from "react";
import { AreaChart } from "../../components/charts/AreaChart";
import { AdminShell } from "../../components/layout/AdminShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { Segmented } from "../../components/ui/Segmented";
import { useToast } from "../../components/ui/Toast";
import { formatInt, formatKz } from "../../lib/format";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { cn } from "@/lib/utils";
import { CAMPUSES, EXECUTIVE_KPIS, TRAFFIC_24H } from "./mockAdmin";
import { KpiCard } from "./KpiCard";

const RANGES = [
  { value: "24h", label: "Últimas 24 h" },
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
] as const;

const STATUS_LABEL = { ativo: "Ativo", crescimento: "Em crescimento", pausado: "Pausado" } as const;

const today = new Intl.DateTimeFormat("pt-AO", { day: "numeric", month: "long", year: "numeric" });

/** ADM-01 — visão executiva: KPIs, telemetria data-lean e distribuição por universidade. */
export default function AdminOverviewScreen() {
  const [range, setRange] = useState<(typeof RANGES)[number]["value"]>("24h");
  const [query, setQuery] = useState("");
  const toast = useToast();

  const rows = CAMPUSES.filter((c) =>
    `${c.short} ${c.name} ${c.campus} ${c.district}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const peak = TRAFFIC_24H.reduce((a, b) => (b.value > a.value ? b : a));

  return (
    <AdminShell
      active="visao"
      eyebrow={`Luanda · WAT (UTC+1) · ${today.format(new Date())}`}
      title="Visão executiva"
      description="Centro de operações, telemetria data-lean e distribuição das universidades parceiras."
      actions={
        <>
          <Button3D variant="ghost" leadingIcon={<Icon name="refresh" size={18} />} onClick={() => toast.show("Telemetria atualizada.")}>
            Atualizar
          </Button3D>
          <Button3D leadingIcon={<Icon name="download" size={18} />} onClick={() => toast.show("Relatório a ser gerado. Enviamos o link por email.")}>
            Exportar relatório
          </Button3D>
        </>
      }
    >
      <section aria-labelledby="kpis-title" className="mb-6">
        <h2 id="kpis-title" className="sr-only">
          Indicadores principais
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {EXECUTIVE_KPIS.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="telemetry-title"
        className="mb-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6"
      >
        <div className="mb-5 flex flex-col justify-between gap-4 border-b-2 border-border-cloud pb-4 lg:flex-row lg:items-center">
          <div>
            <h2 id="telemetry-title" className="font-montserrat text-headline-h2 text-on-surface">
              Tráfego data-lean por sessão
            </h2>
            <p className="mt-1 text-body-md text-text-secondary">
              Consumo médio por estudante ativo. Teto do sistema:{" "}
              <strong className="text-feedback-error-ink">5,0 MB/h</strong>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="flex items-center gap-2 rounded-full bg-surface-forest px-3 py-1.5 text-overline text-feedback-success uppercase tabular-nums">
              <Icon name="signal" size={16} />
              Média 1,42 MB/h · 71% abaixo da cota
            </p>
            <Segmented label="Período do tráfego" options={RANGES} value={range} onChange={(value) => setRange(value)} />
          </div>
        </div>

        <AreaChart
          points={TRAFFIC_24H}
          unit="MB/h"
          threshold={{ value: 5, label: "Teto 5,0 MB/h" }}
          label={`Consumo médio de dados por estudante nas ${range === "24h" ? "últimas 24 horas" : range === "7d" ? "últimas 7 dias" : "últimos 30 dias"}, com pico de ${peak.value} MB/h às ${peak.label}`}
        />

        <dl className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { id: "saved", label: "Total de dados poupados", value: "4,8 TB", note: "Equivale a 12.000.000 Kz em recargas", icon: "wallet" as const },
            { id: "cache", label: "Taxa de acerto da cache local", value: "94,2%", note: "PWA com IndexedDB e service worker", icon: "cloud" as const },
            { id: "latency", label: "Tempo de resposta médio", value: "380 ms", note: "Otimizado para EDGE e 3G em Luanda", icon: "clock" as const },
          ].map((m) => (
            <div key={m.id} className="rounded-2xl border-2 border-border-cloud bg-surface-soft p-4">
              <dt className="flex items-center justify-between gap-3 text-caption text-text-secondary">
                {m.label}
                <Icon name={m.icon} size={24} className="shrink-0 text-brand-sky-ink" />
              </dt>
              <dd>
                <span className="block font-montserrat text-headline-h3 font-extrabold text-on-surface tabular-nums">
                  {m.value}
                </span>
                <span className="block text-caption text-text-tertiary">{m.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="campus-title" className="rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6">
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 id="campus-title" className="font-montserrat text-headline-h2 text-on-surface">
              Distribuição universitária
            </h2>
            <p className="mt-1 text-body-md text-text-secondary">Estudantes, retenção e receita por instituição e polo.</p>
          </div>
          <div className="relative md:w-72">
            <label htmlFor="campus-search" className="sr-only">
              Filtrar por instituição ou polo
            </label>
            <Icon name="search" size={20} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-tertiary" />
            <input
              id="campus-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Instituição ou polo"
              className="min-h-11 w-full rounded-xl border-2 border-border-input bg-surface-canvas pr-3 pl-10 text-body-md text-on-surface"
            />
          </div>
        </div>

        <TableScroll label="Tabela da distribuição universitária">
          <table className={table}>
            <caption className="sr-only">Universidades parceiras monitorizadas em Luanda</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>Instituição</th>
                <th scope="col" className={th}>Polo</th>
                <th scope="col" className={cn(th, "text-right")}>Estudantes</th>
                <th scope="col" className={th}>Cadeiras mais acedidas</th>
                <th scope="col" className={cn(th, "text-right")}>Retenção (30 d)</th>
                <th scope="col" className={cn(th, "text-right")}>GMV gerado</th>
                <th scope="col" className={th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className={tr}>
                  <th scope="row" className={cn(td, "font-bold")}>
                    <span className="block">{c.short}</span>
                    <span className="block text-caption font-medium text-text-secondary">{c.name}</span>
                  </th>
                  <td className={td}>
                    <span className="block">{c.campus}</span>
                    <span className="block text-caption text-text-tertiary">{c.district}</span>
                  </td>
                  <td className={cn(td, "text-right font-bold tabular-nums")}>{formatInt(c.students)}</td>
                  <td className={td}>
                    <span className="flex flex-wrap gap-1">
                      {c.topSubjects.map((s) => (
                        <span key={s} className="rounded-md bg-surface-soft px-2 py-0.5 text-caption text-text-secondary">
                          {s}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className={cn(td, "text-right tabular-nums")}>{c.retention.toLocaleString("pt-AO")}%</td>
                  <td className={cn(td, "text-right font-bold whitespace-nowrap tabular-nums")}>{formatKz(c.gmvKz)}</td>
                  <td className={td}>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-overline uppercase",
                        c.status === "ativo" ? "bg-surface-forest text-feedback-success" : "bg-secondary-fixed text-on-secondary-fixed-variant",
                      )}
                    >
                      {STATUS_LABEL[c.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
        <p role="status" className="mt-3 text-caption text-text-secondary">
          A mostrar {rows.length} de {CAMPUSES.length} polos monitorizados.
        </p>
      </section>
    </AdminShell>
  );
}
