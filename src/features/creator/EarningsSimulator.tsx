import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { PLANS } from "./constants";

const kz = new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 0 });
const fmt = (value: number) => `${value < 0 ? "−" : ""}${kz.format(Math.abs(value))} Kz`;

const [FREE, PRO] = PLANS;
const net = (plan: typeof FREE, price: number, sales: number) =>
  price * sales * (1 - plan.commission) - plan.monthlyFeeKz;

/**
 * Simulador honesto: mostra quanto recebe em cada plano e a partir de quantas
 * vendas o Criador Pro compensa, em vez de um exemplo fixo escolhido a dedo.
 */
export function EarningsSimulator() {
  const [price, setPrice] = useState(1500);
  const [sales, setSales] = useState(10);
  const priceId = useId();
  const salesId = useId();

  const freeNet = net(FREE, price, sales);
  const proNet = net(PRO, price, sales);
  const commissionPerSale = price * (FREE.commission - PRO.commission);
  const breakEven = Math.floor(PRO.monthlyFeeKz / commissionPerSale) + 1;
  const best = proNet > freeNet ? "pro" : freeNet > proNet ? "free" : "tie";

  const verdict =
    best === "tie"
      ? "Com estes números, os dois planos rendem o mesmo."
      : best === "pro"
        ? `Com estes números, o Criador Pro rende mais ${fmt(proNet - freeNet)} por mês.`
        : `Com estes números, o Plano Grátis rende mais ${fmt(freeNet - proNet)} por mês.`;

  return (
    <section aria-labelledby="simulator-title" className="rounded-2xl bg-surface-soft p-5 sm:p-6">
      <h3 id="simulator-title" className="text-headline-h3 text-on-surface">
        Simule os seus ganhos mensais
      </h3>
      <p className="mt-1 text-body-md text-text-secondary">
        A partir de <strong className="text-on-surface tabular-nums">{breakEven} vendas por mês</strong> a{" "}
        {fmt(price)}, o Criador Pro compensa a mensalidade.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={priceId} className="flex justify-between text-body-md font-bold text-on-surface">
            Preço da sebenta
            <output htmlFor={priceId} className="tabular-nums text-primary">
              {fmt(price)}
            </output>
          </label>
          <input
            id={priceId}
            type="range"
            min={500}
            max={10000}
            step={100}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            aria-valuetext={fmt(price)}
            className="mt-3 h-6 w-full cursor-pointer accent-brand-ocean"
          />
        </div>
        <div>
          <label htmlFor={salesId} className="flex justify-between text-body-md font-bold text-on-surface">
            Vendas por mês
            <output htmlFor={salesId} className="tabular-nums text-primary">
              {sales}
            </output>
          </label>
          <input
            id={salesId}
            type="range"
            min={0}
            max={100}
            step={1}
            value={sales}
            onChange={(e) => setSales(Number(e.target.value))}
            aria-valuetext={`${sales} vendas`}
            className="mt-3 h-6 w-full cursor-pointer accent-brand-ocean"
          />
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        {[
          { id: "free", label: FREE.name, value: freeNet },
          { id: "pro", label: PRO.name, value: proNet },
        ].map((row) => (
          <div
            key={row.id}
            className={cn(
              "rounded-xl border-2 bg-surface-canvas p-3 transition-[border-color] duration-150",
              best === row.id ? "border-brand-ocean" : "border-border-cloud",
            )}
          >
            <dt className="text-caption text-text-tertiary">
              {row.label}
              {best === row.id && <span className="ml-1 font-bold text-primary">· rende mais</span>}
            </dt>
            <dd className="mt-0.5 text-headline-h3 text-on-surface tabular-nums">{fmt(row.value)}</dd>
          </div>
        ))}
      </dl>
      <p aria-live="polite" className="mt-3 text-caption text-text-secondary">
        {verdict} Valores líquidos, antes de impostos.
      </p>
    </section>
  );
}
