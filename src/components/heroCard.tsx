import { Button } from "@/components/ui/button";
import { PlayCircle, Trophy } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export function HeroCard() {
    return (
        <div className="mx-auto max-w-5xl rounded-2xl p-4 sm:p-6 text-zinc-100 ">
            {/* Grid 50/50 com items-stretch para igualar as alturas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                {/* Card 1: Microconteúdo & Resposta */}
                <Card className="h-full bg-card border-zinc-800/80 shadow-none rounded-xl text-zinc-100 flex flex-col justify-between">
                    <div>
                        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-800/60">
                            <span className="font-montserrat text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                                Economia Monetária • UAN
                            </span>
                            <span className="font-lato text-[11px] text-zinc-500">
                                5 min de leitura
                            </span>
                        </CardHeader>

                        <CardContent className="space-y-3 pt-4 font-lato">
                            <h3 className="font-montserrat text-lg font-semibold text-white tracking-tight">
                                Equilíbrio Cambial e Taxa BNA
                            </h3>
                            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                                No modelo angolano, a estabilidade cambial depende criticamente das reservas internacionais líquidas geridas pelo BNA. Em choques no crude, a liquidez em moeda estrangeira retrai bruscamente nos bancos comerciais.
                            </p>
                            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                                Para conter a depreciação do Kwanza sem esgotar o stock de divisas, as operações de mercado aberto e o aumento da taxa de cedência atuam na absorção de liquidez.
                            </p>
                        </CardContent>
                    </div>

                    <CardFooter className="pt-2 pb-4">
                        <div className="w-full bg-card border border-zinc-800 rounded-lg p-3.5 space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="font-montserrat text-xs font-medium text-zinc-200">
                                    Mecanismo de contenção cambial
                                </span>
                                <span className="font-mono text-[11px] text-zinc-400">
                                    +20 XP
                                </span>
                            </div>

                            {/* Resposta validada minimalista */}
                            <div className="flex items-center justify-between bg-zinc-900 border-l-2 border-l-emerald-500 border-y border-r border-zinc-800/80 rounded px-3 py-2 text-xs">
                                <span className="font-lato text-zinc-300">
                                    Elevação da taxa básica de juro (Taxa BNA)
                                </span>
                                <span className="font-poppins text-[10px] text-emerald-400 font-medium shrink-0 ml-2">
                                    Correto
                                </span>
                            </div>

                            <p className="font-lato text-[11px] text-zinc-500">
                                Pontos atribuídos à Faculdade de Economia (UAN).
                            </p>
                        </div>
                    </CardFooter>
                </Card>

                {/* Card 2: Ranking Compacto com Mesmas Dimensões */}
                <Card className="h-full bg-card border-zinc-800/80 shadow-none rounded-xl text-zinc-100 flex flex-col justify-between">
                    <div>
                        <CardHeader className="pb-3 border-b border-zinc-800/60">
                            <div className="flex items-center justify-between">
                                <span className="font-montserrat text-xs font-semibold text-zinc-300 tracking-wide flex items-center gap-1.5">
                                    <Trophy className="w-3.5 h-3.5 text-zinc-400" /> Liga Luanda
                                </span>
                                <span className="font-mono text-[10px] text-zinc-500 uppercase">
                                    Semana 42
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3 pt-4">
                            {/* Tabela de polos */}
                            <div className="divide-y divide-zinc-800/60 font-lato text-xs">
                                <div className="py-2.5 flex items-center justify-between">
                                    <span className="font-mono font-medium text-white w-5">01</span>
                                    <div className="flex-1 px-2">
                                        <span className="font-medium text-white block">UAN</span>
                                        <span className="text-[10px] text-zinc-500">1.420 estudantes</span>
                                    </div>
                                    <span className="font-mono font-semibold text-white">142.850 XP</span>
                                </div>

                                <div className="py-2.5 flex items-center justify-between text-zinc-400">
                                    <span className="font-mono w-5 text-zinc-600">02</span>
                                    <span className="flex-1 px-2">UCAN</span>
                                    <span className="font-mono text-zinc-400">128.400 XP</span>
                                </div>

                                <div className="py-2.5 flex items-center justify-between text-zinc-400">
                                    <span className="font-mono w-5 text-zinc-600">03</span>
                                    <span className="flex-1 px-2">ISAF</span>
                                    <span className="font-mono text-zinc-400">94.200 XP</span>
                                </div>

                                <div className="py-2.5 flex items-center justify-between text-zinc-400">
                                    <span className="font-mono w-5 text-zinc-600">04</span>
                                    <span className="flex-1 px-2">ISPTEC</span>
                                    <span className="font-mono text-zinc-400">82.100 XP</span>
                                </div>

                                <div className="py-2.5 flex items-center justify-between text-zinc-400">
                                    <span className="font-mono w-5 text-zinc-600">05</span>
                                    <span className="flex-1 px-2">UniPiaget</span>
                                    <span className="font-mono text-zinc-400">80.250 XP</span>
                                </div>
                            </div>
                        </CardContent>
                    </div>

                    {/* Rodapé fixado na base alinhado com o Card 1 */}
                    <CardFooter className="flex-col items-stretch pt-2 pb-4">
                        <p className="font-lato text-[11px] text-zinc-500 mb-3 text-left">
                            UCAN a 14.450 XP do 1º lugar.
                        </p>

                        <Button className="font-poppins w-full h-10 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs cursor-pointer flex items-center justify-center gap-2 transition-colors">
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Entrar na Rodada</span>
                        </Button>
                    </CardFooter>
                </Card>

            </div>
        </div>
    );
}