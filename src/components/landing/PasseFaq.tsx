import { useState } from "react";
import { Icon } from "../ui/Icon";

const FAQS = [
  {
    q: "Tenho de pagar todos os meses?",
    a: "Não. Pagas uma vez por passe. Quando os dias do passe acabam, o acesso termina e não há nenhuma cobrança automática.",
  },
  {
    q: "Não tenho conta no banco. Consigo pagar?",
    a: "Sim. Podes comprar um voucher numa reprografia ou associação de estudantes, pedir ao teu encarregado que pague pelo link que lhe envias no WhatsApp, ou entrar no Passe de Turma do teu delegado.",
  },
  {
    q: "Quantos dados gasta?",
    a: "Cada simulado ocupa cerca de 0,3 MB e a app abre pela primeira vez com menos de 1 MB. Depois de descarregares a cadeira, estudas sem rede.",
  },
  {
    q: "Como entro na minha conta?",
    a: "Com o teu número de telemóvel. Recebes um código de 6 dígitos no WhatsApp e não precisas de palavra-passe.",
  },
  {
    q: "Os resumos são legais?",
    a: "Só publicamos resumos, mapas mentais e resoluções escritos por estudantes, pelas próprias palavras. Slides e sebentas de professores não entram. Retiramos qualquer conteúdo denunciado em menos de 24 horas e não fazemos trabalhos por encomenda.",
  },
  {
    q: "Quem vê as minhas notas?",
    a: "Só tu. As notas e o desempenho são privados por defeito; na liga aparece apenas a XP da semana. Mensagens de marketing só chegam com a tua autorização e, se tens menos de 18 anos, pedimos o consentimento do teu encarregado.",
  },
] as const;

/** Acordeão de pergunta única aberta por vez; a copy e idêntica ao FAQPage schema no <head>. */
export function PasseFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="perguntas" aria-labelledby="faq-h" className="bg-surface-canvas py-20 sm:py-28 lg:py-32">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <h2 id="faq-h" className="font-montserrat text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Perguntas antes de comprar.
          </h2>
          <p className="mt-4 text-lg text-on-surface">
            Não encontras a tua dúvida? Escreve-nos pelo WhatsApp depois de entrares.
          </p>
        </div>

        <div className="grid gap-2">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b-2 border-border-cloud">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left font-bold text-lg text-on-surface"
                  >
                    {item.q}
                    <Icon name="plus" size={20} className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} />
                  </button>
                </h3>
                <div
                  id={`faq-a${i}`}
                  className="overflow-hidden transition-[grid-template-rows] duration-300"
                  style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 text-on-surface">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
