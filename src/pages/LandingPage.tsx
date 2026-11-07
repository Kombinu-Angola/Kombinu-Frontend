import styles from "@/components/landing/passe.module.css";
import { PasseGradientDefs } from "@/components/landing/PasseShared";
import { usePasseLanding } from "@/components/landing/usePasseLanding";
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

export function LandingPage() {
  const p = usePasseLanding();

  return (
    <div className={`${styles["kb-page"]} passe-root ${p.pageClassName}`}>
      <a className={styles.skip} href="#conteudo">
        Saltar para o conteúdo
      </a>
      <PasseGradientDefs />
      <PasseHeader />
      <main id="conteudo" tabIndex={-1}>
        <PasseHero p={p} />
        <PasseCalendar p={p} />
        <PasseHowItWorks p={p} />
        <PasseDataSaving p={p} />
        <PassePricing p={p} />
        <PassePayment p={p} />
        <PasseLeagues p={p} />
        <PasseNotes />
        <PasseFaq p={p} />
        <PasseFinalCta />
      </main>
      <PasseFooter />
    </div>
  );
}
