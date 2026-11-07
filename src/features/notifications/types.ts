import type { IconName } from "../../components/ui/Icon";

export type NotificationCategory = "gamificacao" | "conteudo" | "conta";

export type NotificationTone = "urgente" | "informativo" | "neutro";

export type AppNotification = {
  id: string;
  category: NotificationCategory;
  tone: NotificationTone;
  icon: IconName;
  title: string;
  body: string;
  at: string;
  read: boolean;
  action?: { label: string; href: string; primary?: boolean };
};
