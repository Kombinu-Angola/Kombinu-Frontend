# Relatório de QA do sprint de correcções (16 a 19 Nov 2026)

**Candidato a release:** frontend `develop` em `747d8f8` (PRs #75 a #86) + backend `develop` em `108d82b`
**Data de execução:** sábado, 21 Nov 2026
**Guião seguido:** `qa-sprint-16-19-nov-2026.md` (secções 3, 4 e 6)
**Estado:** concluído, à espera de triagem pelo Anderson

---

## 1. Resumo executivo

**Veredicto: o candidato a release NÃO cumpre a definição de pronto.** Há **3 defeitos P0** em aberto. Dois são do tipo «valor inventado visível» e um é a landing a prometer um método de entrada que não existe, com um botão sem efeito. Os três têm correcção pequena.

| Resultado | Verificações |
|---|---:|
| ✅ Passou | 86 |
| ⚠️ Passou com aviso | 2 |
| ❌ Falhou | 13 |
| **Total** | **101** |

As 13 falhas correspondem a **6 defeitos do produto** (BUG-01 a BUG-06, alguns repetidos em vários papéis) e a **1 erro do guião** (3.8b, ver BUG-10).

**Definição de pronto do guião:**

| Critério | Estado |
|---|---|
| Nenhum valor inventado visível | ❌ BUG-01 e BUG-02 |
| Quem é de escola entra na escola | ✅ Admin, professor, estudante e estudante em duas escolas abrem sempre na UAN ou na escola certa |
| 0 rotas com overflow a 375 px | ❌ BUG-04 (`/v2/classificacao`, quando os nomes do top 3 são longos) |
| A landing não tem becos sem saída | ❌ BUG-03 (botão «Receber código no WhatsApp» sem efeito) |
| CHANGELOG e testes em dia | ➖ Não coberto por este QA |

**O que está bem (e convém não mexer):**
- Os destinos pós-login estão certos para os 6 papéis.
- As guardas de papel funcionam: o estudante e o aprendiz não abrem o estúdio, e o professor, o criador e o admin abrem-no.
- O isolamento entre espaços está correcto: o «XP total» é igual e o «XP neste espaço» muda ao trocar de escola. A API confirma os mesmos valores.
- As permissões da API estão certas: o estudante recebe 403 nas estatísticas de criador, e o professor e o criador recebem 200.
- A geração de quiz pela OpenTDB responde 410 com mensagem em português.
- O limite de tentativas de login bloqueia à 6.ª tentativa, com `Retry-After`, e o login volta a funcionar depois de esperar.
- O XP sobe ao fazer um quiz com respostas certas.
- A 1280 px, nenhum dos 6 papéis tem overflow nem erros de consola.
- O logótipo mede 40×40 px em todos os ecrãs, e o splash demora menos de 1 s (medições 570 a 891 ms).
- O menu do criador diz «Estúdio de criação», «Os meus materiais» e «Conta e subscrição».
- As páginas legais (Termos v3.0 e Privacidade) abrem sem 404.
- «Financeiro» e «Perfil público» não aparecem no menu e, por URL, mostram «Em breve» e nenhum saldo.

**Recomendação:** não cortar a branch de release até corrigir os 3 P0. O BUG-01 já tem correcção pronta no PR #89 (F2), mas esse PR não faz parte do candidato (ver secção 6). Os BUG-04 a BUG-06 são P1 e podem sair no mesmo ciclo.

---

## 2. Âmbito, ambiente e método

**Ambiente (todo em local, como manda o guião):**

| Parte | Versão |
|---|---|
| Backend | commit `108d82b` do `develop`, base de dados SQLite nova e isolada, `seed_demo --limpar` e depois `seed_demo` com a password demo definida por variável de ambiente (24 contas) |
| Frontend | `develop` em `747d8f8`, servidor de desenvolvimento do Vite, a falar com o backend local |
| Browser | Chromium (Playwright), a **375 × 800** e a **1280 × 800**, uma sessão isolada por conta |
| Contas | As 6 do guião: A `admin.uan`, B `esperanca.kiluange`, C `celeste.mavinga`, D `marcio.chipenda`, E `ana.kiame`, F `nadia.mbala` |

**Os commits de 20 a 22 Nov (K1 a K4) ficaram de fora do backend**, como manda o guião. Os 11 PRs abertos do sprint 20 a 22 também não estão incluídos.

**Quem executou:** o Claude (assistente de IA), a pedido do Braga, com scripts de Playwright e chamadas directas à API. Cobriu **os 6 papéis**, e não só os do Braga (C e D).

**Método:**
- Cada item do guião foi automatizado (comportamento, texto, medidas e chamadas à API) e as telas relevantes foram capturadas.
- Os resultados duvidosos foram **revistos** com uma segunda medição. A revisão corrigiu 4 falsos alarmes da primeira leitura (splash, XP de um quiz, XP por espaço e espaço activo), que estão assinalados nas tabelas.
- A palavra-passe demo e os tokens não constam deste relatório nem das evidências.

---

## 3. Resultados

### 3.1 Sem sessão: landing, páginas legais, login e registo (guião, secção 3)

| # | Verificação | Resultado | Detalhe |
|---|---|:---:|---|
| 3.1 | Landing a 375 px: CTA legível, Entrar visível, sem scroll horizontal | ✅ | contraste do CTA 6.82:1 (mín. 4,5), Entrar visível=true, overflowX=false |
| 3.2a | Simulado da landing termina em «Criar conta» → /register | ✅ | href do botão: /register |
| 3.2b | Nenhuma frase promete entrada por WhatsApp | ❌ | 7 frases prometem entrada/código por WhatsApp (ex.: «Entras com o número de WhatsApp e pagas como preferires: Express, voucher ou encarregado.»). Botão «Receber código no WhatsApp»: o botão não faz nada visível (sem navegação) |
| 3.3a | Rodapé: Termos e Privacidade abrem (v3.0) sem 404 | ✅ | /termos: «Termos e Condições Gerais de Uso da Plataforma e d» \| /privacidade: «Política de Privacidade e Proteção de Dados Pessoa» \| /termos v3.0=true |
| 3.3b | Ligações internas dentro dos documentos legais | ✅ | 2 ligações internas verificadas |
| 3.3c | Referências a páginas que não existem (a anotar) | ⚠️ | /termos refere /privacidade; /termos refere /subcontratacao; /privacidade refere /subcontratacao |
| 3.4 | Recarregar / e /login sem splash de 2,5 s | ✅ | /: 864 ms \| /login: 596 ms até o conteúdo ficar visível |
| 3.5-1280 | Login a 1280 px: coluna única, separadores E-mail | Escola, sem imagem lateral, sem overflow | ✅ | abas=["E-mail","Escola"] imagensGrandes=0 colunaUnica=true overflowX=false |
| 3.5-375 | Login a 375 px: coluna única, separadores E-mail | Escola, sem imagem lateral, sem overflow | ✅ | abas=["E-mail","Escola"] imagensGrandes=0 colunaUnica=true overflowX=false |
| 3.6 | Password errada: erro em português, sem reload | ✅ | alerta=["Credenciais inválidas."] semReload=true |
| 3.7 | Login Escola (UAN demo, DEMO-U001) entra como Celeste, no painel da UAN | ✅ | url=/v2/painel mostraUAN=true |
| 3.8a | Registo: cartões Aprendiz|Criador, validação por campo, termos obrigatórios | ✅ | cartões=2 erros=4 (Escreve o teu nome e apelido. / Introduz um e-mail válido (ex.: teu@email.com). / A palavra-passe deve ter pelo menos 6 caracteres. / Precisas de aceitar os Termos e a Política de Privacidade.) overflowX=false |
| 3.8b | Criar conta de Aprendiz com qa1@demo.kombinu.com (exemplo do guião) | ❌ | o backend recusa o domínio @demo.kombinu.com (["Este e-mail já está registado ou o servidor não respondeu."]). O guião está desactualizado, não é um bug do produto: usar um e-mail de outro domínio |
| 3.8c | Criar conta de Aprendiz com e-mail válido leva ao painel | ✅ | url=/v2/painel alertas=[] |
| 3.8d-7 | Registo com palavra-passe de 7 caracteres: o erro explica o problema | ❌ | url=/register mensagem mostrada: «Este e-mail já está registado ou o servidor não respondeu.» |
| 3.8d-8 | Registo com palavra-passe de 8 caracteres comum: o erro explica o problema | ❌ | url=/register mensagem mostrada: «Este e-mail já está registado ou o servidor não respondeu.» |
| 3.9a | 6 tentativas erradas seguidas: mensagem «Demasiadas tentativas. Tenta novamente dentro de N segundos.» (PT correcto) | ❌ | bloqueou na tentativa 6; mensagem: «Demasiadas tentativas. Aguarda um momento e tenta de novo.» |
| 3.9b | Depois de esperar, entra normalmente | ✅ | a API devolve 429 com «Demasiadas tentativas. Tenta novamente dentro de 25 segundos.» e Retry-After=25; passados 28 s o login pela interface entra (/v2/painel) |

### 3.2 Com sessão, comum a todos os papéis (guião, 4.1)

| # | Verificação | Resultado | Detalhe |
|---|---|:---:|---|
| 4.1.1[A] | Recarregar com sessão: splash curto | ✅ | 852 ms até ao cabeçalho |
| 4.1.2[A] | /v2 com sessão redirecciona para o ecrã do papel, sem Onboarding | ✅ | destino=/v2/admin/membros |
| 4.1.3[A] | Consola sem erros vermelhos ao abrir os ecrãs do menu | ✅ | sem erros |
| 4.1.4[A] | Todos os ecrãs do menu a 375 px sem scroll horizontal (3 rotas) | ✅ | /v2/admin /v2/admin/membros /v2/notificacoes |
| 4.1.5[A] | Logótipo sempre com 40 px | ✅ | /v2/admin/membros: — \| /v2/estudio/materiais: 40x40 |
| 4.1.6[A] | Nenhum valor inventado (12 dias, 450 gemas, 650 XP, 142 500 Kz, 1,2 MB, Macroeconomia I) | ❌ | /v2/notificacoes: «1,2 MB usados hoje» |
| 4.1.1v[B] | Recarregar com sessão (3 medições) | ✅ | 721 / 599 / 570 ms |
| 4.1.2[B] | /v2 com sessão redirecciona para o ecrã do papel, sem Onboarding | ✅ | destino=/v2/estudio/materiais |
| 4.1.3[B] | Consola sem erros vermelhos ao abrir os ecrãs do menu | ✅ | sem erros |
| 4.1.4[B] | Todos os ecrãs do menu a 375 px sem scroll horizontal (6 rotas) | ✅ | /v2/estudio /v2/estudio/criar /v2/estudio/materiais /v2/estudio/definicoes /v2/trilhas /v2/estudio/enquete |
| 4.1.5[B] | Logótipo sempre com 40 px | ✅ | /v2/estudio/materiais: 40x40 \| /v2/estudio/criar: 40x40 \| /v2/estudio/definicoes: 40x40 |
| 4.1.6[B] | Nenhum valor inventado (12 dias, 450 gemas, 650 XP, 142 500 Kz, 1,2 MB, Macroeconomia I) | ❌ | /v2/estudio/criar: «Macroeconomia I» e outros dados fixos \| /v2/trilhas: «1,2 MB usados hoje» \| /v2/estudio/enquete: «Macroeconomia I» e outros dados fixos |
| 4.1.1v[C] | Recarregar com sessão (3 medições) | ✅ | 840 / 576 / 597 ms |
| 4.1.2[C] | /v2 com sessão redirecciona para o ecrã do papel, sem Onboarding | ✅ | destino=/v2/painel |
| 4.1.3[C] | Consola sem erros vermelhos ao abrir os ecrãs do menu | ✅ | sem erros |
| 4.1.4[C] | Todos os ecrãs do menu a 375 px sem scroll horizontal (7 rotas) | ✅ | /v2/trilhas /v2/desafio /v2/marketplace /v2/notificacoes /v2/painel /v2/perfil /v2/classificacao |
| 4.1.5[C] | Logótipo sempre com 40 px | ✅ | /v2/painel: 40x40 \| /v2/trilhas: 40x40 \| /v2/marketplace: 40x40 |
| 4.1.6[C] | Nenhum valor inventado (12 dias, 450 gemas, 650 XP, 142 500 Kz, 1,2 MB, Macroeconomia I) | ❌ | /v2/trilhas: «1,2 MB usados hoje» \| /v2/desafio: «1,2 MB usados hoje» \| /v2/marketplace: «1,2 MB usados hoje» \| /v2/notificacoes: «1,2 MB usados hoje» \| /v2/painel: «1,2 MB usados hoje» \| /v2/perfil: «1,2 MB usados hoje» \| /v2/classificacao: «1,2 MB usados hoje» |
| 4.1.1[D] | Recarregar com sessão: splash curto | ✅ | 589 ms até ao cabeçalho |
| 4.1.2[D] | /v2 com sessão redirecciona para o ecrã do papel, sem Onboarding | ✅ | destino=/v2/painel |
| 4.1.3[D] | Consola sem erros vermelhos ao abrir os ecrãs do menu | ✅ | sem erros |
| 4.1.4[D] | Todos os ecrãs do menu a 375 px sem scroll horizontal (7 rotas) | ❌ | scrollWidth=386 (ecrã 375). Elementos fora do ecrã: DIV.flex-1.max-w-[160px].flex right=386 «M Márcio Chipenda (Você) 110 XP 🥉» \| P.text-sm.font-bold.text-gray-900 right=386 «Márcio Chipenda (Você)» \| DIV.w-full.h-24.bg-white right=386 «🥉» |
| 4.1.5[D] | Logótipo sempre com 40 px | ✅ | /v2/painel: 40x40 \| /v2/trilhas: 40x40 \| /v2/marketplace: 40x40 |
| 4.1.6[D] | Nenhum valor inventado (12 dias, 450 gemas, 650 XP, 142 500 Kz, 1,2 MB, Macroeconomia I) | ❌ | /v2/trilhas: «1,2 MB usados hoje» \| /v2/desafio: «1,2 MB usados hoje» \| /v2/marketplace: «1,2 MB usados hoje» \| /v2/notificacoes: «1,2 MB usados hoje» \| /v2/painel: «1,2 MB usados hoje» \| /v2/perfil: «1,2 MB usados hoje» \| /v2/classificacao: «1,2 MB usados hoje» |
| 4.1.1[E] | Recarregar com sessão: splash curto | ✅ | 637 ms até ao cabeçalho |
| 4.1.2[E] | /v2 com sessão redirecciona para o ecrã do papel, sem Onboarding | ✅ | destino=/v2/painel |
| 4.1.3[E] | Consola sem erros vermelhos ao abrir os ecrãs do menu | ✅ | sem erros |
| 4.1.4[E] | Todos os ecrãs do menu a 375 px sem scroll horizontal (7 rotas) | ❌ | scrollWidth=383 (ecrã 375). Elementos fora do ecrã: DIV.flex-1.max-w-[160px].flex right=383 «C Celeste Mavinga 260 XP 🥉» \| P.text-sm.font-bold.text-gray-900 right=383 «Celeste Mavinga» \| DIV.w-full.h-24.bg-white right=383 «🥉» |
| 4.1.5[E] | Logótipo sempre com 40 px | ✅ | /v2/painel: 40x40 \| /v2/trilhas: 40x40 \| /v2/marketplace: 40x40 |
| 4.1.6[E] | Nenhum valor inventado (12 dias, 450 gemas, 650 XP, 142 500 Kz, 1,2 MB, Macroeconomia I) | ❌ | /v2/trilhas: «1,2 MB usados hoje» \| /v2/desafio: «1,2 MB usados hoje» \| /v2/marketplace: «1,2 MB usados hoje» \| /v2/notificacoes: «1,2 MB usados hoje» \| /v2/painel: «1,2 MB usados hoje» \| /v2/perfil: «1,2 MB usados hoje» \| /v2/classificacao: «1,2 MB usados hoje» |
| 4.1.1[F] | Recarregar com sessão: splash curto | ✅ | 773 ms até ao cabeçalho |
| 4.1.2[F] | /v2 com sessão redirecciona para o ecrã do papel, sem Onboarding | ✅ | destino=/v2/estudio/materiais |
| 4.1.3[F] | Consola sem erros vermelhos ao abrir os ecrãs do menu | ✅ | sem erros |
| 4.1.4[F] | Todos os ecrãs do menu a 375 px sem scroll horizontal (7 rotas) | ✅ | /v2/estudio /v2/estudio/criar /v2/estudio/materiais /v2/estudio/definicoes /v2/trilhas /v2/estudio/enquete /v2/credenciamento |
| 4.1.5[F] | Logótipo sempre com 40 px | ✅ | /v2/estudio/materiais: 40x40 \| /v2/estudio/criar: 40x40 \| /v2/estudio/definicoes: 40x40 |
| 4.1.6[F] | Nenhum valor inventado (12 dias, 450 gemas, 650 XP, 142 500 Kz, 1,2 MB, Macroeconomia I) | ❌ | /v2/estudio/criar: «Macroeconomia I» e outros dados fixos \| /v2/trilhas: «1,2 MB usados hoje» \| /v2/estudio/enquete: «Macroeconomia I» e outros dados fixos |

### 3.3 Admin de escola (A, guião 4.2)

| # | Verificação | Resultado | Detalhe |
|---|---|:---:|---|
| 4.2.1 | Admin: abre em /v2/admin/membros, já na UAN | ✅ | url=/v2/admin/membros cabeçalho=«Espaço activo Marketplace Universidade Agostinho Neto (Demo) 3» \| confirmado pelo valor do seletor de espaço: UAN |
| 4.2.2 | Menu do admin só mostra o que tem API (sem «Em breve» no menu) | ✅ | itens do menu: Membros da escola |
| 4.2.2b | Logótipo do admin (leva a /v2/admin) | ⚠️ | clicar no logótipo leva a «Em breve» (Visão executiva): beco sem saída pequeno |
| 4.2.3 | Admin consegue abrir o estúdio | ✅ | url=/v2/estudio/materiais |

### 3.4 Professor de escola (B, guião 4.3)

| # | Verificação | Resultado | Detalhe |
|---|---|:---:|---|
| 4.3.1 | Professor: abre em /v2/estudio/materiais, na UAN | ✅ | url=/v2/estudio/materiais cabeçalho=«NOVO MATERIAL Espaço activo Marketplace Universidade Agostinho Neto (Demo) EK» \| confirmado pelo valor do seletor de espaço: UAN |
| 4.3.2 | Menu do criador: «Estúdio de criação», «Os meus materiais», «Conta e subscrição»; sem Financeiro nem Perfil Público | ✅ | ["Estúdio de criação Criar artigo, simulado ou trilha","Os meus materiais Os teus conteúdos e simulados","Conta e subscrição Perfil, notificações e plano"] |
| 4.3.3 | «Criar conteúdo» sem «Gerar com Inteligência Artificial» | ✅ | sem menção a IA |
| 4.3.4 | /v2/estudio/enquete a 375 px: sem overflow e botões do cabeçalho dentro do ecrã | ✅ | overflowX=false botõesForaDoEcrã=0 |
| 4.3.5 | Estatísticas do estúdio carregam (API 200 para o professor) | ✅ | respostas de /dashboard/creator/stats/: [200,200] |

### 3.5 Estudante de escola (C) e estudante em duas escolas (D) (guião 4.4)

| # | Verificação | Resultado | Detalhe |
|---|---|:---:|---|
| 4.4C.1 | C Estudante de escola: abre em /v2/painel no espaço certo | ✅ | url=/v2/painel espaçoActivo=UAN |
| 4.4C.3 | C Estudante de escola: o painel mostra «XP total» e «XP neste espaço» | ✅ | {"XP TOTAL":"360","XP NESTE ESPAÇO":"100","CURSOS CONCLUÍDOS":"3","SIMULADOS FEITOS":"3"} |
| 4.4C.3b | C Estudante de escola: o perfil mostra «XP total» e «XP neste espaço» | ✅ | {"XP TOTAL":"360","XP NESTE ESPAÇO":"100","CURSOS CONCLUÍDOS":"3","SIMULADOS FEITOS":"3"} |
| 4.4C.4 | C Estudante de escola: chip da ofensiva = valor real da API, sem gemas | ✅ | API streak=1 chip=Ofensiva: 1 dia seguido |
| 4.4C.5 | C Estudante de escola: /v2/estudio/materiais volta ao painel | ✅ | url=/v2/painel |
| 4.4C.6 | C Estudante de escola: Ligas, medalhas, biblioteca, descargas, revisão e convidar fora do menu; por URL mostram «Em breve» | ✅ | no menu: nenhum; sem «Em breve»: nenhum |
| 4.4.7v | Quiz até ao fim com respostas certas: o XP sobe e «XP neste espaço» actualiza | ✅ | 7c8ad2da: respostas=3 (certas conhecidas 3) XP espaço 100→100, total 360→360 \|\| 480cb9ea: respostas=3 (certas conhecidas 3) XP espaço 100→130, total 360→390; painel agora: {"XP TOTAL":"390","XP NESTE ESPAÇO":"130","CURSOS CONCLUÍDOS":"5","SIMULADOS FEITOS":"6"} |
| 4.4D.1 | D Estudante em duas escolas: abre em /v2/painel no espaço certo | ✅ | url=/v2/painel espaçoActivo=UAN |
| 4.4D.3 | D Estudante em duas escolas: o painel mostra «XP total» e «XP neste espaço» | ✅ | {"XP TOTAL":"365","XP NESTE ESPAÇO":"110","CURSOS CONCLUÍDOS":"4","SIMULADOS FEITOS":"4"} |
| 4.4D.3b | D Estudante em duas escolas: o perfil mostra «XP total» e «XP neste espaço» | ✅ | {"XP TOTAL":"365","XP NESTE ESPAÇO":"110","CURSOS CONCLUÍDOS":"4","SIMULADOS FEITOS":"4"} |
| 4.4D.4 | D Estudante em duas escolas: chip da ofensiva = valor real da API, sem gemas | ✅ | API streak=1 chip=Ofensiva: 1 dia seguido |
| 4.4D.5 | D Estudante em duas escolas: /v2/estudio/materiais volta ao painel | ✅ | url=/v2/painel |
| 4.4D.6 | D Estudante em duas escolas: Ligas, medalhas, biblioteca, descargas, revisão e convidar fora do menu; por URL mostram «Em breve» | ✅ | no menu: nenhum; sem «Em breve»: nenhum |
| 4.4.2 | D muda de escola no seletor: os conteúdos mudam conforme a escola | ✅ | de UAN para Colégio Kiala; conteúdos ["Trilhas disponíveis","Fundamentos de Engenharia de Software","Introdução à Economia e Gestão","Materiais rec → ["Trilhas disponíveis","Informática no ensino médio","Materiais recentes","O teu progresso"] |
| 4.4.3v | D: ao mudar de escola o «XP neste espaço» muda e o «XP total» fica igual | ✅ | UAN: total=365 espaço=110 \| Colégio Kiala: total=365 espaço=85 \| API: {"UAN":{"total":365,"espaco":110},"Colégio Kiala":{"total":365,"espaco":85}} |

### 3.6 Aprendiz só marketplace (E, guião 4.5)

| # | Verificação | Resultado | Detalhe |
|---|---|:---:|---|
| 4.5E.1 | E Aprendiz só marketplace: abre em /v2/painel no espaço certo | ✅ | url=/v2/painel espaçoActivo=marketplace |
| 4.5E.3 | E Aprendiz só marketplace: o painel mostra «XP total» e «XP neste espaço» | ✅ | {"XP TOTAL":"310","XP NESTE ESPAÇO":"310","CURSOS CONCLUÍDOS":"11","SIMULADOS FEITOS":"11"} |
| 4.5E.3b | E Aprendiz só marketplace: o perfil mostra «XP total» e «XP neste espaço» | ✅ | {"XP TOTAL":"310","XP NESTE ESPAÇO":"310","CURSOS CONCLUÍDOS":"11","SIMULADOS FEITOS":"11"} |
| 4.5E.4 | E Aprendiz só marketplace: chip da ofensiva = valor real da API, sem gemas | ✅ | API streak=1 chip=Ofensiva: 1 dia seguido |
| 4.5E.5 | E Aprendiz só marketplace: /v2/estudio/materiais volta ao painel | ✅ | url=/v2/painel |
| 4.5E.6 | E Aprendiz só marketplace: Ligas, medalhas, biblioteca, descargas, revisão e convidar fora do menu; por URL mostram «Em breve» | ✅ | no menu: nenhum; sem «Em breve»: nenhum |
| 4.5.2 | E: não abre /v2/estudio/* | ✅ | url=/v2/painel |

### 3.7 Criador só marketplace (F, guião 4.6)

| # | Verificação | Resultado | Detalhe |
|---|---|:---:|---|
| 4.6.1 | F: abre no estúdio, no marketplace | ✅ | url=/v2/estudio/materiais espaçoActivo=marketplace |
| 4.6.2a | «Credenciamento de criador» mostra «Em breve» em vez de 404 | ✅ | url=/v2/credenciamento |
| 4.6.2b | Não aparece «Gerar quiz» | ✅ |  |
| 4.6.3a | «Financeiro» e «Perfil público» não estão no menu | ✅ | ["","Estúdio de criação Criar artigo, simulado ou trilha","Os meus materiais Os teus conteúdos e simulados","Conta e subscrição Perfil, notificações e plano"] |
| 4.6.3b | Por URL, «Financeiro» e «Perfil público» mostram «Em breve» e nenhum saldo | ✅ | [{"r":"/v2/estudio/financeiro","emBreve":true,"saldo":false},{"r":"/v2/criador","emBreve":true,"saldo":false}] |
| 4.6.4 | Estatísticas de criador carregam (API 200) | ✅ | respostas=[200] |

### 3.8 Permissões da API (guião 4.7)

| # | Verificação | Resultado | Detalhe |
|---|---|:---:|---|
| 4.7.1 | GET /dashboard/creator/stats/ com a Celeste (estudante) → 403 | ✅ | status=403 {"detail":"Só criadores, professores ou admins podem ver estas estatísticas."} |
| 4.7.2 | O mesmo com a Esperança (professora) e a Nádia (criadora) → 200 | ✅ | professora=200 criadora=200 |
| 4.7.3 | GET /rankings/me/ da Celeste: xp_total igual com e sem X-Workspace; xp_workspace muda com o contexto | ✅ | sem cabeçalho: total=390 espaço=260 \| UAN: total=390 espaço=130 \| marketplace: total=390 espaço=260 \| streak=1 |
| 4.7.4 | POST ao endpoint de gerar quiz (OpenTDB) → 410 com mensagem em PT | ✅ | status=410 {"error":"A geração automática de quizzes está temporariamente indisponível."} |

### 3.9 Varrimento a 1280 px (todos os papéis)

| # | Verificação | Resultado | Detalhe |
|---|---|:---:|---|
| 1280[A] | A Admin de escola: ecrãs a 1280 px sem overflow nem erros de consola (3 rotas) | ✅ | /v2/admin/membros /v2/estudio/materiais /v2/notificacoes |
| 1280[B] | B Professor: ecrãs a 1280 px sem overflow nem erros de consola (5 rotas) | ✅ | /v2/estudio/materiais /v2/estudio/criar /v2/estudio/enquete /v2/estudio/definicoes /v2/notificacoes |
| 1280[C] | C Estudante de escola: ecrãs a 1280 px sem overflow nem erros de consola (7 rotas) | ✅ | /v2/painel /v2/perfil /v2/trilhas /v2/desafio /v2/marketplace /v2/classificacao /v2/notificacoes |
| 1280[D] | D Estudante em duas escolas: ecrãs a 1280 px sem overflow nem erros de consola (7 rotas) | ✅ | /v2/painel /v2/perfil /v2/trilhas /v2/desafio /v2/marketplace /v2/classificacao /v2/notificacoes |
| 1280[E] | E Aprendiz só marketplace: ecrãs a 1280 px sem overflow nem erros de consola (7 rotas) | ✅ | /v2/painel /v2/perfil /v2/trilhas /v2/desafio /v2/marketplace /v2/classificacao /v2/notificacoes |
| 1280[F] | F Criador só marketplace: ecrãs a 1280 px sem overflow nem erros de consola (5 rotas) | ✅ | /v2/estudio/materiais /v2/estudio/criar /v2/estudio/enquete /v2/estudio/definicoes /v2/credenciamento |

---

## 4. Defeitos encontrados

Severidades como no guião: **P0** bloqueia o release, **P1** corrige-se antes se for rápido, **P2** vai para o backlog.

### BUG-01 [P0] «1,2 MB usados hoje» no rodapé de todos os ecrãs do aluno
- **Papel:** C, D e E (também A e B, nos ecrãs do aluno a que chegam pelo cabeçalho)
- **Rotas:** todas as `/v2` com a moldura do aluno (`/v2/painel`, `/v2/perfil`, `/v2/trilhas`, `/v2/desafio`, `/v2/marketplace`, `/v2/classificacao`, `/v2/notificacoes`)
- **Largura:** 375 px e 1280 px
- **Passos:** 1. entrar com qualquer conta de estudante. 2. abrir `/v2/trilhas`. 3. ir ao fim da página.
- **Esperado:** nenhum valor inventado (guião 4.1.6).
- **Aconteceu:** o rodapé mostra um selo verde «1,2 MB usados hoje». O número é fixo no código e não vem de nenhuma API.
- **Item do sprint:** F1
- **Evidência:** `evidencias/ev_rodape_1_2MB.png`
- **Correcção:** o PR #89 (F2) já retira o selo, mas **não está no candidato**. Num hotfix directo basta retirar o `DataSaverBadge` do rodapé de `AppShell.tsx` (uma linha).

### BUG-02 [P0] Dados de exemplo fixos no estúdio do criador
- **Papel:** A, B e F (qualquer um que abra o estúdio)
- **Rotas:** `/v2/estudio/criar`, `/v2/estudio/enquete`
- **Largura:** 375 px e 1280 px
- **Passos:** 1. entrar como professor ou criador. 2. abrir «Criar conteúdo» e a «Enquete».
- **Esperado:** nenhum valor inventado; sem API, deve mostrar «Em breve» (guião 4.1.6 lista «Macroeconomia I»).
- **Aconteceu:**
  - «Para que cadeira» lista «Macroeconomia I — UAN, Economia, 2.º ano», «Macroeconomia II»… e a enquete lista cadeiras e faculdades fixas;
  - o cartão mostra «6 questões no banco» e «2 rascunhos por terminar», também fixos.
  Nenhum vem da API. Confirmado também com a criadora do marketplace (F), que vê as cadeiras da UAN e os mesmos contadores.
- **Item do sprint:** F1
- **Evidência:** `evidencias/ev_macroeconomia.png`
- **Correcção:** nenhum PR aberto cobre isto (o #94 só trata a homologação). Passar essas listas e contadores a «Em breve», ou ligá-los à API.

### BUG-03 [P0] A landing promete entrada por WhatsApp e tem um botão sem efeito
- **Papel:** sem sessão
- **Rota:** `/` (secções «Como funciona», «Pagamento» e «Perguntas»)
- **Largura:** 375 px
- **Passos:** 1. abrir `/`. 2. ler «Como funciona» e as perguntas frequentes. 3. carregar em «Receber código no WhatsApp».
- **Esperado:** nenhuma frase promete entrada por WhatsApp (guião 3.2); a landing não tem becos sem saída.
- **Aconteceu:** 7 frases prometem entrada ou código por WhatsApp (por exemplo «Entras com o número de WhatsApp…», «Recebes um código de 6 dígitos no WhatsApp», «Com o teu número de telemóvel… não precisas de palavra-passe»). O botão «Receber código no WhatsApp» **não faz nada**. A entrada real é por e-mail e palavra-passe, ou pelo código da escola.
- **Item do sprint:** F6
- **Evidência:** `evidencias/ev_landing_whatsapp.png`
- **Correcção:** decisão de texto do Orlando: reescrever a entrada («Como entro na minha conta?») e retirar ou desactivar o botão até o OTP existir. Nenhum PR aberto cobre isto.

### BUG-04 [P1] `/v2/classificacao` com overflow a 375 px quando os nomes do top 3 são longos
- **Papel:** D (scroll de 386 px, no ranking da UAN) e E (383 px, no ranking global); C não é afectado
- **Rota:** `/v2/classificacao`
- **Largura:** 375 px
- **Passos:** entrar como Márcio (D) ou Ana (E) e abrir a classificação.
- **Esperado:** sem scroll horizontal (definição de pronto: 0 rotas com overflow).
- **Aconteceu:** o pódio tem 3 cartões que, juntos, são mais largos que o ecrã quando os nomes são longos («Neusa Kalandula», «Márcio Chipenda (Você)»). O cartão da esquerda fica cortado, o da direita sai 8 a 11 px e os cabeçalhos «Posição» e «Utilizador» da tabela ficam colados. Depende dos dados: com os nomes do top 3 da Celeste não se vê.
- **Item do sprint:** F8
- **Evidência:** `evidencias/4.1.4_classificacao_D.png`
- **Correcção:** `min-w-0` e `truncate` nos cartões do pódio e largura flexível em vez de fixa.

### BUG-05 [P1] Registo: erro enganador e regra de palavra-passe incoerente
- **Papel:** sem sessão
- **Rota:** `/register`
- **Largura:** 375 px
- **Passos:** criar conta com palavra-passe de 7 caracteres, ou com «12345678», ou com um e-mail `@demo.kombinu.com`.
- **Esperado:** um erro que diz o que corrigir.
- **Aconteceu:** o formulário aceita 6 caracteres, mas o backend exige 8 e recusa as comuns. Nos três casos o ecrã diz «Este e-mail já está registado ou o servidor não respondeu.» O backend responde com os motivos certos (um deles em inglês: «Enter a valid email address.»).
- **Item do sprint:** F7
- **Evidência:** `evidencias/3.8d_7.png`
- **Correcção:** mostrar os erros por campo vindos da API, em português, e alinhar o mínimo do formulário a 8 caracteres.

### BUG-06 [P1] Limite de tentativas: a mensagem não diz o tempo de espera
- **Papel:** sem sessão
- **Rota:** `/login`
- **Largura:** 375 px
- **Passos:** errar a palavra-passe 6 vezes seguidas.
- **Esperado (guião 3.9):** «Demasiadas tentativas. Tenta novamente dentro de N segundos.»
- **Aconteceu:** o ecrã mostra «Demasiadas tentativas. Aguarda um momento e tenta de novo.» A API responde 429 com a mensagem certa e `Retry-After`; o frontend descarta-a (`mensagensLogin.ts`).
- **Item do sprint:** K2 e F7
- **Evidência:** `evidencias/3.9_limite.png`
- **Correcção:** usar o `detail` da resposta ou o `Retry-After`.

### BUG-07 [P2] O logótipo (K) parece minúsculo
O logótipo mede 40 px, como pede o guião, mas o desenho ocupa só cerca de 26% da caixa (o SVG tem margem). O K lê-se pequeno em todas as molduras. A 375 px, o cabeçalho do admin não mostra logótipo, só o botão do menu. **Corrigido no PR #89** (que também não está no candidato).

### BUG-08 [P2] O logótipo do admin leva a «Em breve»
Clicar no logótipo do `AdminShell` abre `/v2/admin` («Visão executiva»), que mostra «Em breve». É um beco sem saída pequeno.

### BUG-09 [P2] Referência a `/subcontratacao`
Os Termos e a Privacidade referem uma página `/subcontratacao` que não existe (como texto, não como ligação). Já é conhecido, e o Orlando está a resolver.

### BUG-10 [P2] O guião está desactualizado em 3 pontos
- **3.8:** `qa1@demo.kombinu.com` é recusado pelo backend; usar um e-mail de outro domínio.
- **3.7:** o código da escola é gerado em cada `seed_demo`. O guião devia dizer onde o ver (neste seed, a UAN tem `ACZV2Z`; a consulta é `Organizacao.code`).
- **4.4.4:** diz que o chip da ofensiva «não aparece se for 0». A implementação mostra «0» com a chama apagada. Com o seed, todas as contas têm ofensiva 1, por isso este ponto não pôde ser verificado.

---

## 5. Observações para o Orlando e o Anderson

1. **Números de demonstração na landing.** O simulado do topo mostra «Ofensiva de 3 dias», «2 congelamentos guardados» e um cronómetro «4:58», além dos preços da secção «Preços». É a maqueta do programa (excepção do `CLAUDE.md`), mas **o Orlando deve confirmar que são ilustrativos**, porque o critério é «nenhum valor inventado».
2. **O 1.º simulado repetido não dá XP** (o XP só sobe da 1.ª vez). Está certo, mas o ecrã não o explica ao estudante.
3. **A landing está pronta no resto:** o CTA «Começar grátis» tem contraste 6,82:1, o «Entrar» está visível a 375 px, não há overflow, e o simulado termina em «Criar conta» → `/register`.

---

## 6. O que não foi verificado

| Item | Porquê |
|---|---|
| K1 (login em menos de 1 s no Argon2id), K5, K7 e as migrations do Django 5.2 | Só se verificam em produção ou numa cópia do Postgres (guião, secção 5) |
| Safari, Firefox e dispositivos reais | Só Chromium emulado |
| Acessibilidade (leitor de ecrã, teclado, WCAG) e desempenho em 3G | Fora do guião |
| Exploração livre por uma pessoa | Os scripts cobrem o guião, não substituem o teste exploratório |
| Chip da ofensiva a 0 | O seed não tem contas com ofensiva 0 |
| 11 PRs do sprint 20 a 22 | Não fazem parte do candidato (versão e merge só do `develop` em `747d8f8`) |
| Notificações, estúdio (criar conteúdo real) e pagamentos | Fora do guião |

Os dados criados pelo QA (contas `qa.*@gmail.com`, um quiz de cada conta) ficaram na base de dados local descartável. Nada foi enviado para os repositórios nem para produção.

---

## 7. Recomendações

1. **Antes de cortar a branch de release:** corrigir o BUG-01, o BUG-02 e o BUG-03. São pequenos e podem ir num único PR, directo à branch de release ou à `develop` em `747d8f8`.
2. **BUG-01 é a prioridade:** o PR #89 já o resolve. Se a decisão for não levar o #89 para o release, fazer um hotfix de uma linha.
3. **Mesmo ciclo:** BUG-04, BUG-05 e BUG-06 (P1).
4. **Backlog:** BUG-07 a BUG-10.
5. **Repetir** o guião (secções 3 e 4) sobre a branch de release depois das correcções, e fazer a secção 5 em produção depois do deploy.
6. **Corrigir o guião** (BUG-10) antes do próximo ciclo de QA.

---

## 8. Anexo: evidências

As capturas estão em `evidencias/` (375 px, salvo indicação):

| Ficheiro | Mostra |
|---|---|
| `ev_rodape_1_2MB.png` | BUG-01, selo «1,2 MB usados hoje» |
| `ev_macroeconomia.png` | BUG-02, «Macroeconomia I», «6 questões no banco» |
| `ev_landing_whatsapp.png` | BUG-03, secção «Como funciona» da landing |
| `4.1.4_classificacao_D.png` | BUG-04, overflow no pódio |
| `3.8d_7.png` | BUG-05, erro enganador no registo |
| `3.9_limite.png` | BUG-06, mensagem do limite de tentativas |
| `3.1_landing375.png`, `3.5_login375.png`, `3.5_login1280.png`, `3.7_escola_painel.png` | Itens que passaram |
| `4.3_menu_criador.png`, `4.3_enquete375.png` | Menu do criador e enquete a 375 px |
| `4.4.7_resultado.png`, `4.4D_painel.png` | Resultado do quiz e painel do estudante D |
