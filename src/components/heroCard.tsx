import { Badge } from "./ui/badge";
import { Button3D } from "./ui/Button3D";

import { PlayCircle, Trophy, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { motion } from "motion/react";




export function HeroCard() {
    return (
        <div className="mx-auto max-w-5xl p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* Card 1: Pergunta & Resumo */}

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{
                        duration: 0.7,
                        ease: "easeOut"
                    }}
                    whileHover={{
                        x: 20,
                        transition: {
                            duration: 0.2,
                            ease: "easeOut",

                        }
                    }}>

                    <Card className="bg-surface-canvas border-2 border-border-cloud shadow-clay flex flex-col justify-between">
                        <div>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-xs font-bold tracking-wider text-primary">
                                    ECONOMIA MONETÁRIA • UAN
                                </CardTitle>
                                <div className="bg-surface-soft px-3 py-1 rounded-full text-xs text-text-secondary">
                                    5 min de leitura
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-0">
                                <h3 className="font-heading text-lg sm:text-xl font-bold text-on-surface">
                                    Equilíbrio Cambial e Taxa BNA
                                </h3>
                                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                                    No modelo angolano, a estabilidade cambial depende criticamente das reservas internacionais líquidas geridas pelo Banco Nacional de Angola (BNA). Quando há um choque nos preços do crude, o canal da liquidez contrai a oferta de moeda estrangeira nos bancos comerciais.
                                </p>
                                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                                    Para mitigar a depreciação abrupta do Kwanza sem esgotar o stock de divisas, as operações de mercado aberto e a elevação da taxa de cedência de liquidez funcionam como o principal mecanismo de absorção de massa monetária.
                                </p>
                            </CardContent>
                        </div>

                        <CardFooter className="pt-2">
                            <div className="w-full bg-surface-soft border-2 border-border-cloud p-4 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="bg-secondary/20 border border-secondary/30 px-2.5 py-0.5 rounded-full">
                                        <span className="text-[11px] font-bold text-secondary">+20 XP GANHOS</span>
                                    </div>
                                    <div className="bg-feedback-success-soft px-2.5 py-0.5 rounded-full">
                                        <span className="text-[11px] font-semibold text-feedback-success-ink">Resposta Confirmada</span>
                                    </div>
                                </div>

                                <p className="text-xs sm:text-sm font-semibold text-on-surface">
                                    Como o BNA contém a pressão inflacionária em cenário de volatilidade cambial?
                                </p>

                                <div className="flex items-center justify-between border border-feedback-success/40 bg-feedback-success-soft rounded-xl px-4 py-2.5">
                                    <p className="text-xs font-medium text-on-surface">Aumento da taxa básica de juro (Taxa BNA)</p>
                                    <span className="text-xs font-bold text-feedback-success-ink shrink-0">Opção Correcta</span>
                                </div>

                                <p className="text-xs text-text-secondary leading-relaxed">
                                    💡 Correto! A tua resposta somou +20 pontos para a Universidade Agostinho Neto na Liga Universitária de Luanda.
                                </p>
                            </div>
                        </CardFooter>
                    </Card>

                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{
                        delay: 0.15,
                        duration: 0.7,
                        ease: "easeOut"
                    }}
                    whileHover={{
                        x: 20,
                        transition: {
                            duration: 0.2,
                            ease: "easeOut",

                        }
                    }}>

                    {/* Card 2: Liga Universitária */}
                    <Card className="bg-surface-canvas border-2 border-border-cloud shadow-clay flex flex-col justify-between text-left">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-feedback-streak-ink bg-feedback-streak/15 border border-feedback-streak/30 px-2.5 py-1 rounded-full tracking-wider inline-flex items-center gap-1.5">
                                    <Trophy className="w-3.5 h-3.5" /> LIGA UNIVERSITÁRIA DE ANGOLA
                                </span>
                            </div>
                            <h2 className="font-heading text-base sm:text-lg font-extrabold text-on-surface tracking-tight mt-2">
                                Ranking Geral de Polos
                            </h2>
                            <p className="text-xs text-text-secondary">
                                Temporada 2026 • Atualizado em tempo real
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-2 pt-0">
                            {/* Top 1 */}
                            <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-secondary/20 border border-secondary/30 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-black text-secondary">01</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-xs text-on-surface">UAN - LUANDA</p>
                                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-bold">Líder</Badge>
                                        </div>
                                        <p className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
                                            <Users className="w-3 h-3" /> 1.420 alunos ativos
                                        </p>
                                    </div>
                                </div>
                                <span className="tabular-nums font-extrabold text-xs text-primary">142.850 XP</span>
                            </div>

                            {/* Top 2 */}
                            <div className="p-2.5 rounded-xl bg-surface-soft border border-border-cloud flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-surface-soft rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-bold text-text-secondary">02</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs text-on-surface">UCAN - PALANCA</p>
                                        <p className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
                                            <Users className="w-3 h-3" /> 980 alunos ativos
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="tabular-nums font-extrabold text-xs text-on-surface block">128.400 XP</span>
                                    <span className="text-feedback-error-ink text-[10px]">-14.450 XP</span>
                                </div>
                            </div>

                            {/* Top 3 */}
                            <div className="p-2.5 rounded-xl bg-surface-soft border border-border-cloud flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-surface-soft rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-bold text-text-secondary">03</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs text-on-surface">ISAF - BENFICA</p>
                                        <p className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
                                            <Users className="w-3 h-3" /> 650 alunos ativos
                                        </p>
                                    </div>
                                </div>
                                <span className="tabular-nums font-extrabold text-xs text-on-surface">94.200 XP</span>
                            </div>

                            {/* Top 4 */}
                            <div className="p-2.5 rounded-xl bg-surface-soft border border-border-cloud flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-surface-soft rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-bold text-text-secondary">04</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs text-on-surface">ISPTEC - LUANDA</p>
                                        <p className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
                                            <Users className="w-3 h-3" /> 510 alunos ativos
                                        </p>
                                    </div>
                                </div>
                                <span className="tabular-nums font-extrabold text-xs text-on-surface">82.100 XP</span>
                            </div>

                            {/* Top 5 */}
                            <div className="p-2.5 rounded-xl bg-surface-soft border border-border-cloud flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-surface-soft rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-bold text-text-secondary">05</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs text-on-surface">UniPiaget - Viana</p>
                                        <p className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
                                            <Users className="w-3 h-3" /> 420 alunos ativos
                                        </p>
                                    </div>
                                </div>
                                <span className="tabular-nums font-extrabold text-xs text-on-surface">80.250 XP</span>
                            </div>

                            <p className="text-xs text-primary font-medium pt-1">
                                A UCAN está a apenas 14.450 XP de alcançar a UAN.
                            </p>

                            {/* CTA */}
                            <Button3D
                                fullWidth
                                className="mt-3 text-xs sm:text-sm"
                                leadingIcon={<PlayCircle className="size-4" />}
                            >
                                Entrar & Pontuar Pela Tua Faculdade
                                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium ml-1">
                                    Grátis
                                </span>
                            </Button3D>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}