import type { ContentFormat, DailyGoal, ReminderSlot } from "../onboarding/types";

/** Contrato esperado de GET /api/me/settings/ */
export type StudentAccount = {
  name: string;
  university: string;
  faculty: string;
  course: string;
  year: string;
  criticalSubject: string;
  affiliationVerified: boolean;
  dailyGoal: DailyGoal;
  formats: ContentFormat[];
  reminder: ReminderSlot;
  notifications: { streak: boolean; newMaterials: boolean; leagues: boolean };
  phone: string;
  institutionalEmail: string;
  emailVerified: boolean;
  dataSaver: boolean;
};
