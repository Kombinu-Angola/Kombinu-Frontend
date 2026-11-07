export type DailyGoal = "5" | "15" | "30";
export type ContentFormat = "text" | "visual" | "quizzes" | "audio";
export type ReminderSlot = "0730" | "1330" | "2000" | "2200";

export type StudentProfile = {
  university: string;
  course: string;
  year: string;
  criticalSubject: string;
  dailyGoal: DailyGoal;
  formats: ContentFormat[];
  reminder: ReminderSlot;
  smsReminder: boolean;
  /** Só dígitos; obrigatório apenas com lembrete por SMS. */
  phone: string;
};

export type Recommendation = {
  title: string;
  excerpt: string;
  subject: string;
  institution: string;
  minutes: number;
  quizzes: number;
  quizXp: number;
  author: string;
  sizeLabel: string;
  href: string;
};
