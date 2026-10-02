export type LibraryStatus = "em-curso" | "concluida";

export type LibraryItem = {
  id: string;
  title: string;
  subject: string;
  university: string;
  year: string;
  author: { name: string; credential: string };
  pages: number;
  checkpoints: number;
  checkpointsDone: number;
  readPercent: number;
  status: LibraryStatus;
  /** Tamanho em KB quando descarregada; null = só com ligação. */
  offlineKb: number | null;
  lastOpenedAt: string;
  grade?: string;
  href: string;
};

export type DownloadPreferences = {
  wifiOnly: boolean;
  lightGraphics: boolean;
  autoPrune: boolean;
};

export type OfflineStorage = {
  /** Quota reservada pelo estudante, em KB. */
  quotaKb: number;
  /** Espaço livre no aparelho, em KB (escala diferente da quota). */
  deviceFreeKb: number;
  breakdown: Array<{ id: string; label: string; kb: number; color: string }>;
};
