

import Footer from "@/components/layout/Footer";
import { HeroCard } from "../components/heroCard";
import { HeroSection } from "../components/heroSection";

import AcademicMarketplace from "../components/marketplaceAcademy";

import MethodologySection from "@/components/metodologySection";
import PricingSection from "@/components/pricingSection";
import TestimonialsSection from "@/components/ testimonials";
import { WhyKombinu } from "@/components/whyKombinu";
import { Carrosel } from "@/components/carrossel";
import FinancialComparison from "@/components/financialComparison";
import ManifestoSection from "@/components/manifestoSection";
import CallToActionSection from "@/components/CallToActions";
import FaqSection from "@/components/geralQuestion";
import { QuizSection } from "@/components/quiz";


export function LandingPage() {
  return (
    <main>
      <HeroSection />
      <HeroCard />
      <Carrosel />
      <WhyKombinu />
      <QuizSection />
      <MethodologySection />
      <FinancialComparison />
      <AcademicMarketplace />
      <PricingSection />
      <TestimonialsSection />
      <ManifestoSection />
      <FaqSection />
      <CallToActionSection />
      <Footer />
    </main>
  )
}

