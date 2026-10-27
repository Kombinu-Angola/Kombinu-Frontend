import { useState } from "react";
import { PasseHeader } from "@/components/landing/PasseHeader";
import { PasseHero } from "@/components/landing/PasseHero";
import { PasseCalendar } from "@/components/landing/PasseCalendar";
import { PasseHowItWorks } from "@/components/landing/PasseHowItWorks";
import { PasseDataSaving } from "@/components/landing/PasseDataSaving";
import { PassePricing } from "@/components/landing/PassePricing";
import { PassePayment } from "@/components/landing/PassePayment";
import { PasseLeagues } from "@/components/landing/PasseLeagues";
import { PasseNotes } from "@/components/landing/PasseNotes";
import { PasseFaq } from "@/components/landing/PasseFaq";
import { PasseFinalCta } from "@/components/landing/PasseFinalCta";
import { PasseFooter } from "@/components/landing/PasseFooter";

const QUIZ_XP = 40;

/** Landing "Passe de Provas": o simulado do Hero alimenta a posicao na Liga mais abaixo. */
export function LandingPage() {
  const [xpBonus, setXpBonus] = useState(0);

  return (
    <main>
      <PasseHeader />
      <PasseHero onQuizAnswered={(correct) => setXpBonus(correct ? QUIZ_XP : 0)} />
      <PasseCalendar />
      <PasseHowItWorks />
      <PasseDataSaving />
      <PassePricing />
      <PassePayment />
      <PasseLeagues xpBonus={xpBonus} />
      <PasseNotes />
      <PasseFaq />
      <PasseFinalCta />
      <PasseFooter />
    </main>
  );
}
