import { useMemo, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Button3D } from "../../components/ui/Button3D";
import { Icon } from "../../components/ui/Icon";
import { Switch } from "../../components/ui/Switch";
import { table, td, th, tr } from "../../components/ui/table";
import { TableScroll } from "../../components/ui/TableScroll";
import { useToast } from "../../components/ui/Toast";
import { formatActivityTime, formatSize } from "../../lib/format";
import { cn } from "@/lib/utils";
import type { DownloadPreferences, LibraryItem, OfflineStorage } from "./types";

const percent = new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 1 });

const PREFERENCES: ReadonlyArray<{ key: keyof DownloadPreferences; label: string; hint: string }> = [
  {
    key: "wifiOnly",
    label: "Descarregar apenas por Wi-Fi",
    hint: "Evita gastar o teu pacote de dados móveis sem dares por isso.",
  },
  {
    key: "lightGraphics",
    label: "Gráficos ultraleves em vez de imagens",
    hint: "Troca as imagens pesadas por diagramas vetoriais. Cada sebenta fica abaixo de 500 KB.",
  },
  {
    key: "autoPrune",
    label: "Apagar sebentas concluídas ao fim de 30 dias",
    hint: "Liberta espaço sozinho. A sebenta continua tua e pode ser descarregada de novo.",
  },
];

type OfflineDownloadsScreenProps = {
  items: LibraryItem[];
  storage: OfflineStorage;
  preferences: DownloadPreferences;
  userName: string;
  libraryHref: string;
  onPreferencesChange?: (preferences: DownloadPreferences) => void;
};

/** Gestor de descargas: o que ocupa espaço, as regras de poupança e o que se pode apagar. */
export default function OfflineDownloadsScreen({
  items,
  storage,
  preferences: initial,
  userName,
  libraryHref,
  onPreferencesChange,
}: OfflineDownloadsScreenProps) {
  const [preferences, setPreferences] = useState(initial);
  const [downloaded, setDownloaded] = useState(() => items.filter((i) => i.offlineKb !== null));
  const [confirmingPurge, setConfirmingPurge] = useState(false);
  const toast = useToast();

  const usedKb = useMemo(() => downloaded.reduce((sum, i) => sum + (i.offlineKb ?? 0), 0), [downloaded]);
  // As fatias mostram a proporção do que está ocupado, não da quota: assim a barra é legível.
  const usedRatio = Math.min(1, usedKb / storage.quotaKb);

  function update(patch: Partial<DownloadPreferences>) {
    const next = { ...preferences, ...patch };
    setPreferences(next);
    onPreferencesChange?.(next);
  }

  function remove(item: LibraryItem) {
    setDownloaded((prev) => prev.filter((i) => i.id !== item.id));
    toast.show(`${formatSize(item.offlineKb ?? 0)} libertados. A sebenta continua tua.`);
  }

  return (
    <AppShell active="biblioteca" userName={userName} campus="UAN · Economia">
      <div className="mx-auto max-w-[900px] px-4 py-6 md:px-6 lg:py-8">
        <a
          href={libraryHref}
          className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-caption font-bold text-text-secondary hover:text-primary"
        >
          <Icon name="arrow-left" size={16} />
          Voltar às minhas sebentas
        </a>

        <header className="mb-6">
          <p className="text-overline text-primary uppercase">Dados móveis</p>
          <h1 className="mt-1 font-montserrat text-headline-h1-mobile text-on-surface sm:text-headline-h1">
            Gestor de descargas
          </h1>
          <p className="mt-1 text-body-md text-text-secondary">
            Controla o que está guardado no telemóvel e quanto do teu plano de dados a Kombinu pode usar.
          </p>
        </header>

        <section
          aria-labelledby="storage-title"
          className="mb-6 rounded-3xl border-2 border-border-cloud bg-surface-canvas p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="storage-title" className="flex items-center gap-2 text-headline-h3 text-on-surface">
              <Icon name="phone" size={22} className="text-primary" />
              Espaço usado no telemóvel
            </h2>
            <p className="rounded-full bg-surface-sky px-3 py-1 text-caption font-bold text-primary tabular-nums">
              {formatSize(usedKb)} de {formatSize(storage.quotaKb)} reservados
            </p>
          </div>

          <div
            role="progressbar"
            aria-label="Espaço offline utilizado"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(usedRatio * 100)}
            aria-valuetext={`${formatSize(usedKb)} de ${formatSize(storage.quotaKb)} reservados, ${percent.format(usedRatio * 100)} por cento`}
            className="mt-4 flex h-4 w-full gap-0.5 overflow-hidden rounded-full bg-surface-soft"
          >
            {storage.breakdown.map((slice) => (
              <span
                key={slice.id}
                className="h-full first:rounded-l-full"
                style={{ width: `${(slice.kb / storage.quotaKb) * 100}%`, background: slice.color }}
              />
            ))}
          </div>

          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {storage.breakdown.map((slice) => (
              <div key={slice.id} className="flex items-center gap-2 text-caption">
                <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: slice.color }} />
                <dt className="text-text-secondary">{slice.label}</dt>
                <dd className="font-bold text-on-surface tabular-nums">{formatSize(slice.kb)}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 flex items-start gap-2 border-t-2 border-border-cloud pt-4 text-caption text-text-secondary">
            <Icon name="signal" size={16} className="mt-0.5 shrink-0 text-text-tertiary" />O teu aparelho ainda tem{" "}
            <strong className="text-on-surface tabular-nums">{formatSize(storage.deviceFreeKb)}</strong> livres, fora
            desta reserva.
          </p>

          <div className="mt-4">
            {confirmingPurge ? (
              <div className="rounded-2xl border-2 border-feedback-error bg-surface-canvas p-4">
                <p className="text-body-md text-on-surface tabular-nums">
                  Apagar as {downloaded.length} descargas e libertar {formatSize(usedKb)}? As sebentas continuam tuas e
                  podem ser descarregadas outra vez.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button3D variant="ghost" onClick={() => setConfirmingPurge(false)}>
                    Manter as descargas
                  </Button3D>
                  <Button3D
                    className="bg-feedback-error-ink text-white shadow-none hover:brightness-110"
                    onClick={() => {
                      setDownloaded([]);
                      setConfirmingPurge(false);
                      toast.show(`${formatSize(usedKb)} libertados.`, "error");
                    }}
                  >
                    Apagar tudo
                  </Button3D>
                </div>
              </div>
            ) : (
              <Button3D
                variant="ghost"
                disabled={downloaded.length === 0}
                onClick={() => setConfirmingPurge(true)}
                leadingIcon={<Icon name="trash" size={18} />}
                className="border-feedback-error text-feedback-error-ink"
              >
                Libertar todo o espaço ({formatSize(usedKb)})
              </Button3D>
            )}
          </div>
        </section>

        <section aria-labelledby="rules-title" className="mb-6 rounded-3xl border-2 border-border-cloud bg-surface-soft p-5 sm:p-6">
          <h2 id="rules-title" className="flex items-center gap-2 text-headline-h3 text-on-surface">
            <Icon name="bolt" size={20} className="text-feedback-success-ink" />
            Regras de poupança de dados
          </h2>
          <ul className="mt-3 divide-y-2 divide-border-cloud">
            {PREFERENCES.map((pref) => (
              <li key={pref.key} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-body-md font-bold text-on-surface">{pref.label}</p>
                  <p id={`${pref.key}-hint`} className="mt-0.5 text-caption text-text-secondary">
                    {pref.hint}
                  </p>
                </div>
                <Switch
                  id={`pref-${pref.key}`}
                  checked={preferences[pref.key]}
                  label={pref.label}
                  hideLabel
                  describedBy={`${pref.key}-hint`}
                  onChange={(checked) => update({ [pref.key]: checked } as Partial<DownloadPreferences>)}
                />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="files-title">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="files-title" className="font-montserrat text-headline-h2 text-on-surface tabular-nums">
              {downloaded.length} ficheiros no telemóvel
            </h2>
            <p className="text-caption text-text-tertiary tabular-nums">{formatSize(usedKb)} no total</p>
          </div>

          {downloaded.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-border-input p-8 text-center text-body-md text-text-secondary">
              Não tens nada guardado offline. Abre uma sebenta e escolhe descarregar para a leres sem ligação.
            </p>
          ) : (
            <TableScroll label="Tabela dos ficheiros guardados no telemóvel">
              <table className={table}>
                <caption className="sr-only">Materiais descarregados para leitura offline</caption>
                <thead>
                  <tr>
                    <th scope="col" className={th}>Material</th>
                    <th scope="col" className={cn(th, "text-right")}>Tamanho</th>
                    <th scope="col" className={th}>Último acesso</th>
                    <th scope="col" className={cn(th, "text-right")}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {downloaded.map((item) => (
                    <tr key={item.id} className={tr}>
                      <th scope="row" className={cn(td, "font-normal")}>
                        <span className="block font-bold text-on-surface">{item.title}</span>
                        <span className="block text-caption text-text-tertiary">
                          {item.university} · {item.author.name}
                        </span>
                      </th>
                      <td className={cn(td, "text-right font-bold whitespace-nowrap tabular-nums")}>
                        {formatSize(item.offlineKb ?? 0)}
                      </td>
                      <td className={cn(td, "whitespace-nowrap text-text-secondary")}>
                        {formatActivityTime(item.lastOpenedAt)}
                      </td>
                      <td className={cn(td, "text-right")}>
                        <button
                          type="button"
                          onClick={() => remove(item)}
                          aria-label={`Apagar a descarga de ${item.title}`}
                          className="inline-flex size-11 items-center justify-center rounded-lg text-text-secondary transition-[color,background-color] duration-150 hover:bg-feedback-error-soft hover:text-feedback-error-ink"
                        >
                          <Icon name="trash" size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>
          )}
        </section>
      </div>
    </AppShell>
  );
}
