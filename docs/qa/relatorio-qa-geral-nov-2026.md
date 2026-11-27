# Relatório de QA geral da plataforma — Kombinu (Nov 2026)

> **Versão testada:** `main` — backend `fd1d273`, frontend `9d56741`, ambos em local (SQLite isolada, seed demo).  
> **Âmbito:** guião `qa-geral-e-sprint-correccoes-finais-nov-2026` — secções 4, 5 (3 passagens), 5.8 (API, extra) e 4.9. Secção 6 (produção) fora de âmbito local.  
> **Papéis:** A admin de escola · B professor · C estudante de escola · D estudante em duas escolas · E aprendiz só marketplace · F criador só marketplace · G contas novas.  
> **Larguras/temas:** 375 px (principal) e 1280 px; claro e escuro (o escuro não existe — B-04).  
> **Método:** scripts Playwright em Chromium, uma passagem por configuração (sem flags → `VITE_ONBOARDING_API=true` → `VITE_FLUXO_MOCKS=true`) e `npm run build` + `preview` para a regra de produção. Nenhuma palavra-passe nem credencial consta deste relatório.

## 1. Resumo

**153 verificações:** ✅ 133 · ❌ 4 · ⚠️ 16.

A plataforma está **globalmente estável em `main`**: sem erros de consola nem respostas 5xx em nenhum papel, sem scroll horizontal a 375 px em nenhum ecrã visitado, isolamento entre escolas e marketplace correcto (UI e API), XP e ofensiva reais (zero em contas novas), todos os hotfixes da ronda anterior confirmados (landing, registo em PT, «Voltar», contactos `.com`) e o onboarding novo a funcionar de ponta a ponta. Encontrei **7 bugs** (2 de gravidade P1, 5 de P2) e **8 observações**; nenhum P0.

| ID | Sev. | Título | Dono |
|---|:---:|---|---|
| B-01 | **P1** | Não existe «Sair» no layout /v2 | Frontend |
| B-02 | **P2** | /v2/onboarding abre por URL depois de concluído e para contas de escola/criador | Frontend |
| B-03 | **P2** | O logo muda de posição entre o estúdio/admin e o painel do estudante | Frontend |
| B-04 | **P2** | Modo escuro não existe nas rotas /v2 (dívida conhecida) | Frontend / produto |
| B-05 | **P2** | Contraste insuficiente nas iniciais do avatar (≈1,1–1,3:1) | Frontend |
| B-06 | **P2** | /subcontratacao é referida nos Termos/Privacidade mas dá 404 | Frontend / jurídico (Orlando) |
| B-07 | **P1** | Registo de menor (15 anos) não diz nada sobre o consentimento do encarregado | Produto + Frontend (+ Backend se houver campo) |

Severidades: **P0** impede usar/ perda de dados/ falha de segurança; **P1** estraga uma jornada importante ou tem risco legal/segurança; **P2** incómodo, visual, dívida conhecida.

## 2. Bugs

### B-01 — Não existe «Sair» no layout /v2  ·  P1

- **Onde (item do guião):** 5.1 (transversal)
- **Descrição:** Em /v2/perfil, no menu do avatar e em /v2/perfil/sessoes não há botão «Sair»/«Terminar sessão» da conta actual. Num telemóvel ou computador partilhado (sala de informática da escola) a sessão fica aberta; o 5.1.8 do guião («sair e voltar a entrar») só se consegue limpando o armazenamento do browser.
- **Passos para reproduzir:** Entrar como celeste.mavinga → /v2/perfil → procurar «Sair»; abrir o avatar; abrir /v2/perfil/sessoes (só existe «Terminar sessão» por dispositivo).
- **Esperado:** Haver sempre uma acção «Sair» visível (perfil e menu do avatar, estudante, criador e admin).
- **Obtido:** Não há. `AuthContext.logout()` existe (AuthContext.tsx:111), só falta ligá-lo na interface /v2.
- **Repo/dono sugerido:** Frontend

### B-02 — /v2/onboarding abre por URL depois de concluído e para contas de escola/criador  ·  P2

- **Onde (item do guião):** 5.6.10 / 5.6.15
- **Descrição:** O redireccionamento automático após o login está certo (conta concluída → painel; escola/criador nunca vão ao onboarding), mas escrevendo /v2/onboarding à mão o ecrã abre na mesma, para a conta G1 já concluída e para A/B/C/D/F. «Ir para o painel» voltaria a gravar `concluir`.
- **Passos para reproduzir:** Com `VITE_ONBOARDING_API=true`: entrar como celeste.mavinga (ou como a G1 concluída) → ir a /v2/onboarding.
- **Esperado:** Conta concluída (ou que não é aprendiz de marketplace) → redirecção para o painel.
- **Obtido:** /v2/onboarding mostra «O que queres fazer hoje?».
- **Repo/dono sugerido:** Frontend

### B-03 — O logo muda de posição entre o estúdio/admin e o painel do estudante  ·  P2

- **Onde (item do guião):** 5.1.4
- **Descrição:** O tamanho é constante (40×40) mas a posição muda: a 375 px está em x=72,y=10 no estúdio/admin (ao lado do hambúrguer) e em x=16,y=12 no painel/trilhas; a 1280 px, x=68,y=11 vs x=24,y=20. O guião pede que o logo não mude «de tamanho nem de posição» ao trocar de ecrã.
- **Passos para reproduzir:** Entrar como esperanca.kiluange → /v2/estudio/materiais e depois «Voltar ao modo estudante» → comparar a posição do logo.
- **Esperado:** Mesma posição em todos os layouts ou decisão explícita de que o hambúrguer o empurra.
- **Obtido:** Posição diferente (tamanho igual).
- **Repo/dono sugerido:** Frontend

### B-04 — Modo escuro não existe nas rotas /v2 (dívida conhecida)  ·  P2

- **Onde (item do guião):** 5.1.7
- **Descrição:** Com o sistema em modo escuro o `<html>` recebe a classe `dark`, mas todas as rotas /v2 testadas continuam claras (fundo claro, cartões brancos). Não há texto ilegível — a página simplesmente não muda. O CLAUDE.md regista «ainda não têm dark:».
- **Passos para reproduzir:** Chromium com `colorScheme: dark` → /v2/painel (captura `evidencias-geral/dark_C_painel.png`).
- **Esperado:** Tema escuro coerente, ou decisão de produto de não o oferecer (e retirar a classe).
- **Obtido:** Aspecto claro inalterado.
- **Repo/dono sugerido:** Frontend / produto

### B-05 — Contraste insuficiente nas iniciais do avatar (≈1,1–1,3:1)  ·  P2

- **Onde (item do guião):** 5.1.7 / acessibilidade
- **Descrição:** As iniciais («CM», «MC», «AK», «NM») no círculo do avatar têm contraste entre 1,1:1 e 2,1:1 (WCAG AA pede 4,5:1; 3:1 para texto grande). Verificável também em modo claro.
- **Passos para reproduzir:** Entrar como qualquer conta → cabeçalho e cartão de perfil em /v2/painel.
- **Esperado:** Iniciais com contraste ≥ 4,5:1.
- **Obtido:** Texto azul-claro sobre fundo azul-claro.
- **Repo/dono sugerido:** Frontend

### B-06 — /subcontratacao é referida nos Termos/Privacidade mas dá 404  ·  P2

- **Onde (item do guião):** 4.5b
- **Descrição:** O texto legal remete para /subcontratacao, que não existe.
- **Passos para reproduzir:** Abrir /termos e /privacidade e seguir a referência a /subcontratacao.
- **Esperado:** Página existente ou referência retirada.
- **Obtido:** 404
- **Repo/dono sugerido:** Frontend / jurídico (Orlando)

### B-07 — Registo de menor (15 anos) não diz nada sobre o consentimento do encarregado  ·  P1

- **Onde (item do guião):** 4.11 / 5.8.10
- **Descrição:** Conta de menor criada com sucesso e entra no painel; nem o ecrã, nem a API (`/api/me/` sem campo de consentimento) mencionam o encarregado de educação. É o insumo do C-F5; a decisão (bloquear, avisar ou pedir consentimento) é de produto/jurídico.
- **Passos para reproduzir:** /register com ano de nascimento de 15 anos.
- **Esperado:** Mensagem (no mínimo) e, se aplicável, fluxo de consentimento.
- **Obtido:** Entra sem qualquer aviso.
- **Repo/dono sugerido:** Produto + Frontend (+ Backend se houver campo)

> Título sugerido para as issues no GitHub: `[QA final] <título>` (não foram criadas issues — aguardam confirmação).

## 3. Observações (não são bugs, mas merecem decisão)

- **O-01** — A lista de instituições do onboarding é um `<select>` nativo (9 itens + «Outra»), sem pesquisa por nome. O guião fala em pesquisa; com 9 itens é aceitável, mas não escala.
- **O-02** — Recarregar a meio do onboarding recomeça no passo 1 (as respostas já guardadas voltam preenchidas). Aceitável; sinalizado por transparência.
- **O-03** — Importação CSV: a pré-visualização devolveu `rows: 2, errors: []` para 3 linhas (a que não tinha número de aluno foi ignorada sem erro). Falta confirmar com o Anderson se é o desenho pretendido; a confirmação final da importação não foi exercitada.
- **O-04** — «Despublicar» não é verificável pela API testada (sem campo de publicação). O formulário legado tem «Publicar no marketplace»; confirmar o contrato.
- **O-05** — `GET /api/quizzes/` devolve 404 e a trilha filtrada por cadeira devolveu 0: os filtros `?cadeira=` de quizzes e trilhas ficam por provar (o de conteúdos está provado).
- **O-06** — Em /v2/preparar (só com `VITE_FLUXO_MOCKS=true`) o botão do passo 1 chama-se «Gerar com IA». É o fluxo do estudante, atrás da flag, e o guião só proíbe esse texto no estúdio do criador; o bundle de produção contém o chunk B1Preparar mas a rota não está registada (verificado: 404). Sem acção, a menos que se queira retirar o chunk do bundle.
- **O-07** — Enquetes: C e D já tinham respondido à única enquete activa numa corrida anterior; o «+5 XP uma vez» não pôde ser repetido pela interface neste ciclo.
- **O-08** — Rotas `/v2/preparar/calibrar` e `/previa` redireccionam para `/v2/preparar` quando abertas directamente (precisam do estado do passo anterior). Comportamento esperado.

## 4. Resultados por item

### Secção 4 — Entrada pública (landing, login, registo, legais)

| Item | Verificação | Estado | Detalhe |
|---|---|:---:|---|
| 4.1-375 | Landing a 375 px: «Começar grátis» legível, «Entrar» visível, sem scroll horizontal | ✅ | contraste 6.82:1, Entrar=true, overflowX=false |
| 4.1-1280 | Landing a 1280 px: «Começar grátis» legível, «Entrar» visível, sem scroll horizontal | ✅ | contraste 6.82:1, Entrar=true, overflowX=false |
| 4.2 | Simulado da landing termina em «Criar conta» → /register; nada promete entrada por WhatsApp | ✅ | href=/register; promessas=[]; botão WhatsApp=0 |
| 4.3 | Recarregar / e /login sem ecrã de carregamento fixo | ✅ | /: 1357 ms \| /login: 776 ms |
| 4.4 | /termos e /privacidade: «Voltar» regressa à origem; sem histórico leva a um sítio com sentido | ✅ | rodapé: /termos → Voltar → / \| registo (novo separador): /termos → Voltar → / \| directo: /privacidade → Voltar → / |
| 4.5a | Contactos legais: suporte@kombinu.com e +244 958 568 364, nunca .co.ao | ✅ | e-mails: suporte@kombinu.com, juridico@kombinu.com, privacidade@kombinu.com \| telefones: +244 958 568 364, +244 958 568 364 2 \| páginas com «kombinu.co.ao» no código: nenhuma |
| 4.5b | Ligações dos documentos legais sem 404 (/termos, /privacidade, âncoras) | ⚠️ | 404: /subcontratacao (/subcontratacao é referida no texto e não existe) |
| 4.6-375 | /login a 375 px: separadores E-mail / Escola, sem overflow | ✅ | abas=["E-mail","Escola"] overflowX=false |
| 4.6-1280 | /login a 1280 px: separadores E-mail / Escola, sem overflow | ✅ | abas=["E-mail","Escola"] overflowX=false |
| 4.7 | Password errada: erro em português, sem reload | ✅ | alerta=["Credenciais inválidas."] |
| 4.8 | Login Escola (UAN, DEMO-U001) entra como Celeste, na UAN | ✅ | url=/v2/painel espaço=24397bab-47c4-4a96-b354-ed7d5537bf3e |
| 4.10 | Registo de adulto: pede ano e termos; «novidades» opcional e desmarcado; conta criada e entra | ✅ | ano=1 termosMarcadoPorOmissão=false marketingMarcadoPorOmissão=false; url=/v2/painel; enviou {"ano_nascimento":2003,"aceita_termos":true,"marketing_opt_in":false} |
| 4.11 | Registo de menor de 18 anos: conta criada (anotar o que diz sobre o encarregado) | ⚠️ | url=/v2/painel; o ecrã NÃO diz nada sobre o consentimento do encarregado |
| 4.12 | Erros do registo (ano vazio, termos, password curta/comum) e anos absurdos: nenhum cria conta e cada um diz o que corrigir, em PT | ✅ | ano vazio: ok (Indica o ano em que nasceste.) \| termos por aceitar: ok (Precisas de aceitar os Termos e a Política de Privacidade.) \| password de 7 caracteres: ok (A palavra-passe deve ter pelo menos 8 caracteres.) \| password comum: ok (Esta senha é muito comum.) \| API ano futuro: 400 {"ano_nascimento":["O ano de nascimen… |
| 4.13 | Registo com e-mail que já existe: erro no campo do e-mail, em PT | ✅ | url=/register erros=["Este e-mail já está registado."] |
| 4.14 | Sem sessão, /v2 vai para o login, sem escolha de papel | ✅ | url=/login |

### Secção 5.1–5.5 — Por papel (passagem 1, sem flags)

| Item | Verificação | Estado | Detalhe |
|---|---|:---:|---|
| 5.1.1[A] | O splash só aparece enquanto a sessão carrega | ✅ | 619 / 526 / 517 ms até ao cabeçalho |
| 5.1.2[A] | Com sessão, /v2 leva ao ecrã do papel | ✅ | destino=/v2/admin/membros |
| 5.1.3[A] | Ecrãs do menu e rotas do papel a 375 px sem scroll horizontal (4 rotas) | ✅ | /v2/admin /v2/admin/membros /v2/notificacoes /v2/estudio/materiais |
| 5.1.5[A] | Sem números nem dados inventados nas rotas visitadas | ✅ | 4 rotas verificadas |
| 5.1.4a[A] | O logo não muda de tamanho nem de posição ao trocar de ecrã | ❌ | 16,12 40x40 \| 72,10 40x40 (2 ecrãs) → ver B-03 (tamanho constante 40×40; muda a posição entre layouts). |
| 5.1.4b[A] | Rodapé do painel: «Ajuda» abre mailto:suporte@kombinu.com | ✅ | href=mailto:suporte@kombinu.com |
| 5.1.6[A] | Consola sem erros vermelhos e pedidos à API sem 500 | ✅ | erros de consola=0; 5xx=[]; pedidos falhados=0 |
| 5.1.7[A] | Modo escuro: textos legíveis e nenhum bloco branco perdido | ⚠️ | Reclassificado após ver as capturas: com `prefers-color-scheme: dark` o `<html>` recebe a classe `dark`, mas o aspecto das rotas /v2 não muda (fundo claro, cartões brancos). Não há tema escuro implementado (dívida conhecida do CLAUDE.md) — ver B-04. A heurística de «blocos brancos» dispara por isso. |
| 5.2.1 | Admin abre em /v2/admin/membros, na UAN | ✅ | url=/v2/admin/membros espaço=UAN |
| 5.2.2 | Importação em lote pequena funciona (2 válidos, 1 inválido) e os erros vêm em PT | ⚠️ | API 200: {"dry_run":true,"rows":2,"errors":[]}; novos na lista=true. A resposta foi uma pré-visualização (`dry_run: true`, 2 linhas, 0 erros): a linha inválida (sem número de aluno) foi ignorada em silêncio, sem mensagem de erro; a confirmação da importação não foi exercitada de ponta a ponta. A confirmar com o Anderson (O-03). |
| 5.2.3 | Admin consegue abrir o estúdio | ✅ |  |
| 5.1.1[B] | O splash só aparece enquanto a sessão carrega | ✅ | 676 / 536 / 550 ms até ao cabeçalho |
| 5.1.2[B] | Com sessão, /v2 leva ao ecrã do papel | ✅ | destino=/v2/estudio/materiais |
| 5.1.3[B] | Ecrãs do menu e rotas do papel a 375 px sem scroll horizontal (12 rotas) | ✅ | /v2/estudio /v2/estudio/criar /v2/estudio/materiais /v2/estudio/definicoes /v2/trilhas /v2/estudio/enquete /v2/credenciamento /v2/estudio/plano /v2/estudio/homologacao /v2/estudio/renovacao /v2/criador /v2/estudio/financeiro |
| 5.1.5[B] | Sem números nem dados inventados nas rotas visitadas | ✅ | 12 rotas verificadas |
| 5.1.4a[B] | O logo não muda de tamanho nem de posição ao trocar de ecrã | ❌ | 72,10 40x40 \| 16,12 40x40 (5 ecrãs) → ver B-03 (tamanho constante 40×40; muda a posição entre layouts). |
| 5.1.4b[B] | Rodapé do painel: «Ajuda» abre mailto:suporte@kombinu.com | ✅ | href=mailto:suporte@kombinu.com |
| 5.1.6[B] | Consola sem erros vermelhos e pedidos à API sem 500 | ✅ | erros de consola=0; 5xx=[]; pedidos falhados=0 |
| 5.1.7[B] | Modo escuro: textos legíveis e nenhum bloco branco perdido | ⚠️ | Reclassificado após ver as capturas: com `prefers-color-scheme: dark` o `<html>` recebe a classe `dark`, mas o aspecto das rotas /v2 não muda (fundo claro, cartões brancos). Não há tema escuro implementado (dívida conhecida do CLAUDE.md) — ver B-04. A heurística de «blocos brancos» dispara por isso. |
| 5.3.1[B] | Professor de escola abre no estúdio, no espaço certo | ✅ | url=/v2/estudio/materiais espaço=UAN |
| 5.3.9[B] | As estatísticas do estúdio carregam | ✅ | [200] |
| 5.3.2[B] | Menu do estúdio: barra recolhida no desktop e hambúrguer no telemóvel, com descrição por secção | ✅ | Barra recolhida a 72 px e expandida a 300 px ao passar o rato; hambúrguer a 375 px; descrição por secção. (1.ª leitura deu 300→300 px porque o rato estava em 0,0 sobre a barra; repetido com o rato fora: 72→300.) |
| 5.3.3[B] | «Voltar ao modo estudante»: rótulo visível no telemóvel, dica no hover do desktop e leva ao painel de estudante | ✅ | rótulo 375 px=true; hover desktop=true; destino=/v2/trilhas |
| 5.3.4[B] | O perfil público abre dentro do layout do criador (ou «Em breve» lá dentro) | ✅ | layout criador=true; layout aluno=false |
| 5.3.5[B] | Credenciamento no estilo novo, com o envio desligado e «Em breve» | ✅ | passo 1 visível=true; envio desligado/aviso=true; botões de envio no passo 1=0 |
| 5.3.6[B] | Homologação, correcção e renovação mostram «Em breve» sem protocolos de exemplo | ✅ | /v2/estudio/homologacao: Em breve \| /v2/estudio/homologacao/correcao: Em breve \| /v2/estudio/renovacao: Em breve |
| 5.3.8[B] | Não aparece «Gerar com IA» nem «Gerar quiz» | ✅ |  |
| 5.1.1[F] | O splash só aparece enquanto a sessão carrega | ✅ | 571 / 464 / 513 ms até ao cabeçalho |
| 5.1.2[F] | Com sessão, /v2 leva ao ecrã do papel | ✅ | destino=/v2/estudio/materiais |
| 5.1.3[F] | Ecrãs do menu e rotas do papel a 375 px sem scroll horizontal (12 rotas) | ✅ | /v2/estudio /v2/estudio/criar /v2/estudio/materiais /v2/estudio/definicoes /v2/trilhas /v2/estudio/enquete /v2/credenciamento /v2/estudio/plano /v2/estudio/homologacao /v2/estudio/renovacao /v2/criador /v2/estudio/financeiro |
| 5.1.5[F] | Sem números nem dados inventados nas rotas visitadas | ✅ | 12 rotas verificadas |
| 5.1.4a[F] | O logo não muda de tamanho nem de posição ao trocar de ecrã | ❌ | 72,10 40x40 \| 16,12 40x40 (5 ecrãs) → ver B-03 (tamanho constante 40×40; muda a posição entre layouts). |
| 5.1.4b[F] | Rodapé do painel: «Ajuda» abre mailto:suporte@kombinu.com | ✅ | href=mailto:suporte@kombinu.com |
| 5.1.6[F] | Consola sem erros vermelhos e pedidos à API sem 500 | ✅ | erros de consola=0; 5xx=[]; pedidos falhados=0 |
| 5.1.7[F] | Modo escuro: textos legíveis e nenhum bloco branco perdido | ⚠️ | Reclassificado após ver as capturas: com `prefers-color-scheme: dark` o `<html>` recebe a classe `dark`, mas o aspecto das rotas /v2 não muda (fundo claro, cartões brancos). Não há tema escuro implementado (dívida conhecida do CLAUDE.md) — ver B-04. A heurística de «blocos brancos» dispara por isso. |
| 5.3.1[F] | Criador só marketplace abre no estúdio, no espaço certo | ✅ | url=/v2/estudio/materiais espaço=marketplace |
| 5.3.9[F] | As estatísticas do estúdio carregam | ✅ | [200] |
| 5.3.2[F] | Menu do estúdio: barra recolhida no desktop e hambúrguer no telemóvel, com descrição por secção | ✅ | Barra recolhida a 72 px e expandida a 300 px ao passar o rato; hambúrguer a 375 px; descrição por secção. (1.ª leitura deu 300→300 px porque o rato estava em 0,0 sobre a barra; repetido com o rato fora: 72→300.) |
| 5.3.3[F] | «Voltar ao modo estudante»: rótulo visível no telemóvel, dica no hover do desktop e leva ao painel de estudante | ✅ | rótulo 375 px=true; hover desktop=true; destino=/v2/trilhas |
| 5.3.4[F] | O perfil público abre dentro do layout do criador (ou «Em breve» lá dentro) | ✅ | layout criador=true; layout aluno=false |
| 5.3.5[F] | Credenciamento no estilo novo, com o envio desligado e «Em breve» | ✅ | passo 1 visível=true; envio desligado/aviso=true; botões de envio no passo 1=0 |
| 5.3.6[F] | Homologação, correcção e renovação mostram «Em breve» sem protocolos de exemplo | ✅ | /v2/estudio/homologacao: Em breve \| /v2/estudio/homologacao/correcao: Em breve \| /v2/estudio/renovacao: Em breve |
| 5.3.8[F] | Não aparece «Gerar com IA» nem «Gerar quiz» | ✅ |  |
| 5.1.1[C] | O splash só aparece enquanto a sessão carrega | ✅ | 751 / 582 / 590 ms até ao cabeçalho |
| 5.1.2[C] | Com sessão, /v2 leva ao ecrã do papel | ✅ | destino=/v2/painel |
| 5.1.3[C] | Ecrãs do menu e rotas do papel a 375 px sem scroll horizontal (10 rotas) | ✅ | /v2/trilhas /v2/desafio /v2/marketplace /v2/notificacoes /v2/painel /v2/perfil /v2/classificacao /v2/enquetes /v2/ligas /v2/medalhas |
| 5.1.5[C] | Sem números nem dados inventados nas rotas visitadas | ✅ | 10 rotas verificadas |
| 5.1.4a[C] | O logo não muda de tamanho nem de posição ao trocar de ecrã | ✅ | 16,12 40x40 (5 ecrãs) |
| 5.1.4b[C] | Rodapé do painel: «Ajuda» abre mailto:suporte@kombinu.com | ✅ | href=mailto:suporte@kombinu.com |
| 5.1.6[C] | Consola sem erros vermelhos e pedidos à API sem 500 | ✅ | erros de consola=0; 5xx=[]; pedidos falhados=0 |
| 5.1.7[C] | Modo escuro: textos legíveis e nenhum bloco branco perdido | ⚠️ | Reclassificado após ver as capturas: com `prefers-color-scheme: dark` o `<html>` recebe a classe `dark`, mas o aspecto das rotas /v2 não muda (fundo claro, cartões brancos). Não há tema escuro implementado (dívida conhecida do CLAUDE.md) — ver B-04. A heurística de «blocos brancos» dispara por isso. |
| 5.4.1[C] | Abre em /v2/painel, na escola (o D nunca no marketplace) | ✅ | url=/v2/painel espaço=UAN |
| 5.4.3a[C] | «XP total» e «XP neste espaço» visíveis | ✅ | {"XP TOTAL":"360","XP NESTE ESPAÇO":"100","CURSOS CONCLUÍDOS":"3","SIMULADOS FEITOS":"3"} |
| 5.4.4[C] | Chip da ofensiva = valor real da API; sem gemas | ✅ | API streak=1 chip=Ofensiva: 1 dia seguido |
| 5.4.5[C] | Quiz até ao fim: o XP sobe uma vez; repetido, deixa fazer mas não dá XP | ✅ | 1.ª vez +30 XP; repetido +0 XP; painel XP neste espaço=130 |
| 5.4.6[C] | Votar numa enquete dá +5 XP uma vez | ⚠️ | não foi possível votar pela interface (enquetes visíveis: sim) |
| 5.4.7[C] | /v2/estudio/materiais pelo endereço volta ao painel | ✅ | url=/v2/painel |
| 5.1.5b[C] | Ligas, medalhas, biblioteca, descargas, revisão e convidar: fora do menu e «Em breve» por URL | ✅ | no menu=nenhum; sem «Em breve»=nenhum |
| 5.4.8[C] | Ranking: o XP do utilizador bate com o painel; sem overflow a 375 px | ✅ | ranking mostra 130; painel XP neste espaço=130; overflowX=false |
| 5.1.1[D] | O splash só aparece enquanto a sessão carrega | ✅ | 726 / 673 / 767 ms até ao cabeçalho |
| 5.1.2[D] | Com sessão, /v2 leva ao ecrã do papel | ✅ | destino=/v2/painel |
| 5.1.3[D] | Ecrãs do menu e rotas do papel a 375 px sem scroll horizontal (10 rotas) | ✅ | /v2/trilhas /v2/desafio /v2/marketplace /v2/notificacoes /v2/painel /v2/perfil /v2/classificacao /v2/enquetes /v2/ligas /v2/medalhas |
| 5.1.5[D] | Sem números nem dados inventados nas rotas visitadas | ✅ | 10 rotas verificadas |
| 5.1.4a[D] | O logo não muda de tamanho nem de posição ao trocar de ecrã | ✅ | 16,12 40x40 (5 ecrãs) |
| 5.1.4b[D] | Rodapé do painel: «Ajuda» abre mailto:suporte@kombinu.com | ✅ | href=mailto:suporte@kombinu.com |
| 5.1.6[D] | Consola sem erros vermelhos e pedidos à API sem 500 | ✅ | erros de consola=0; 5xx=[]; pedidos falhados=0 |
| 5.1.7[D] | Modo escuro: textos legíveis e nenhum bloco branco perdido | ⚠️ | Reclassificado após ver as capturas: com `prefers-color-scheme: dark` o `<html>` recebe a classe `dark`, mas o aspecto das rotas /v2 não muda (fundo claro, cartões brancos). Não há tema escuro implementado (dívida conhecida do CLAUDE.md) — ver B-04. A heurística de «blocos brancos» dispara por isso. |
| 5.4.1[D] | Abre em /v2/painel, na escola (o D nunca no marketplace) | ✅ | url=/v2/painel espaço=UAN |
| 5.4.3a[D] | «XP total» e «XP neste espaço» visíveis | ✅ | {"XP TOTAL":"365","XP NESTE ESPAÇO":"110","CURSOS CONCLUÍDOS":"4","SIMULADOS FEITOS":"4"} |
| 5.4.4[D] | Chip da ofensiva = valor real da API; sem gemas | ✅ | API streak=1 chip=Ofensiva: 1 dia seguido |
| 5.4.2 | D muda de escola: conteúdos, trilhas e ranking mudam; nada da UAN no Kiala nem o contrário | ✅ | de UAN para Colégio Kiala; trilhas ["Trilhas disponíveis","Fundamentos de Engenharia de Software","Introdução à Economia e Ge → ["Trilhas disponíveis","Informática no ensino médio","Materiais recentes","O teu progresso; títulos em comum=[] |
| 5.4.3b | D: ao mudar de escola só «XP neste espaço» muda | ✅ | UAN: total=365 espaço=110 \| Colégio Kiala: total=365 espaço=85 |
| 5.4.5[D] | Quiz até ao fim: o XP sobe uma vez; repetido, deixa fazer mas não dá XP | ✅ | 1.ª vez +30 XP; repetido +0 XP; painel XP neste espaço=140 |
| 5.4.6[D] | Votar numa enquete dá +5 XP uma vez | ⚠️ | não foi possível votar pela interface (enquetes visíveis: sim) |
| 5.4.7[D] | /v2/estudio/materiais pelo endereço volta ao painel | ✅ | url=/v2/painel |
| 5.1.5b[D] | Ligas, medalhas, biblioteca, descargas, revisão e convidar: fora do menu e «Em breve» por URL | ✅ | no menu=nenhum; sem «Em breve»=nenhum |
| 5.4.8[D] | Ranking: o XP do utilizador bate com o painel; sem overflow a 375 px | ✅ | ranking mostra 140; painel XP neste espaço=140; overflowX=false |
| 5.1.1[E] | O splash só aparece enquanto a sessão carrega | ✅ | 769 / 1182 / 1583 ms até ao cabeçalho |
| 5.1.2[E] | Com sessão, /v2 leva ao ecrã do papel | ✅ | destino=/v2/painel |
| 5.1.3[E] | Ecrãs do menu e rotas do papel a 375 px sem scroll horizontal (8 rotas) | ✅ | /v2/trilhas /v2/desafio /v2/marketplace /v2/notificacoes /v2/painel /v2/perfil /v2/classificacao /v2/enquetes |
| 5.1.5[E] | Sem números nem dados inventados nas rotas visitadas | ✅ | 8 rotas verificadas |
| 5.1.4a[E] | O logo não muda de tamanho nem de posição ao trocar de ecrã | ✅ | 16,12 40x40 (5 ecrãs) |
| 5.1.4b[E] | Rodapé do painel: «Ajuda» abre mailto:suporte@kombinu.com | ✅ | href=mailto:suporte@kombinu.com |
| 5.1.6[E] | Consola sem erros vermelhos e pedidos à API sem 500 | ✅ | erros de consola=0; 5xx=[]; pedidos falhados=0 |
| 5.1.7[E] | Modo escuro: textos legíveis e nenhum bloco branco perdido | ⚠️ | Reclassificado após ver as capturas: com `prefers-color-scheme: dark` o `<html>` recebe a classe `dark`, mas o aspecto das rotas /v2 não muda (fundo claro, cartões brancos). Não há tema escuro implementado (dívida conhecida do CLAUDE.md) — ver B-04. A heurística de «blocos brancos» dispara por isso. |
| 5.5.1 | Abre em /v2/painel, no marketplace | ✅ | url=/v2/painel espaço=marketplace |
| 5.5.2 | Só vê conteúdos do marketplace, nunca os das escolas | ✅ | API devolve 15 conteúdos (0 de escola); ecrã mostra conteúdo de escola=false |
| 5.5.3 | Não abre /v2/estudio/* | ✅ | url=/v2/painel |
| 5.5.4 | Passagem de produção: /v2/onboarding leva ao painel e /v2/preparar não existe | ✅ | /v2/onboarding → /v2/painel; /v2/preparar → «404 /v2/preparar» |
| 5.3.7a | Criar → editar → apagar conteúdo (via API, como o professor); despublicar não verificado | ⚠️ | criar=201 editar=200 aluno vê antes/depois=200/200 apagar=204 GET depois=404. «Despublicar» não foi verificado: o contrato testado não tem campo de publicação (o PATCH `is_published` foi ignorado e o aluno continuou a ver o conteúdo). |
| 5.3.7b | Apagar conteúdo com submissões de quiz devolve 409 com mensagem | ✅ | «Engenharia de Requisitos» → 409 {"error":"Este conteúdo já tem submissões e não pode ser apagado."} |

### Secção 5.6 — Onboarding (passagem 2, `VITE_ONBOARDING_API=true`)

| Item | Verificação | Estado | Detalhe |
|---|---|:---:|---|
| 5.6.1 | Conta nova (adulto) cai no onboarding depois de entrar | ✅ | registo=201; url=/v2/onboarding |
| 5.6.2 | Passo 1 («O que queres fazer hoje?») mostra as duas intenções e «Decidir depois» | ✅ | progresso=false |
| 5.6.3 | Instituições: lista da API (9) mais «Outra»; sem dados de exemplo | ✅ | 9 instituições: Instituto Superior Politécnico de Tecnologias e Ciências (ISPTEC); Instituto Superior de Ciências da Educação de Luanda (ISCED Luanda); Universidade Agostinho Neto (UAN); Universidade Católica de Angola (UCAN); Universidade Gregório Semedo (UGS); Universidade Jean Piaget de Angola (Jean Piaget); Uni |
| 5.6.3b | Pesquisa por nome na lista de instituições (guião 5.6) | ⚠️ | A lista é um <select> nativo (sem campo de pesquisa); só se pode escolher por rolagem/teclado. Com 9 itens é aceitável; avaliar se a pesquisa é requisito do guião. |
| 5.6.4 | Cursos sugeridos e cadeiras vêm das cadeiras criadas no admin | ✅ | cursos sugeridos=["Direito","Engenharia Informática"]; escolhido «Engenharia Informática»; cadeiras=["Bases de Dados","Programação I"]; província visível=true |
| 5.6.5 | Recarregar a meio: não se perde a sessão e o que já foi guardado volta preenchido | ✅ | depois do reload: /v2/onboarding \| ? (o fluxo recomeça no passo 1; as respostas guardadas pré-preenchem) O fluxo reinicia no passo 1 em vez de retomar o passo em que ia; as respostas guardadas voltam preenchidas. |
| 5.6.5b | Após reload as respostas dos passos 2–3 voltam preenchidas | ✅ | {"instituicao":"1","curso":"Engenharia Informática"} |
| 5.6.6 | Passo «Quanto tempo por dia» mostra 5/15/30/60 minutos | ✅ |  |
| 5.6.7 | Ecrã final: XP/ofensiva reais (0), primeiro passo = trilha/simulado da cadeira, sem dados inventados | ✅ | Está tudo pronto O teu perfil está activo. Já podes estudar. Caloiro 2026 0 XP 0 dias de ofensiva O TEU PRIMEIRO PASSO Ainda não há trilha para Bases de Dados. Começa por explorar os simulados. Ir para o painel |
| 5.6.7b | Sem overflow horizontal no onboarding a 375 px | ✅ |  |
| 5.6.8 | «Ir para o painel» termina o onboarding e abre o painel | ✅ | url=/v2/painel |
| 5.6.9 | O perfil guardado na API tem instituição, curso, ano, cadeira, minutos e onboarding concluído | ✅ | {"id":29,"nome":"QA onb1","email":"qa.g.onb1.1795605320904@example.com","intent":"explore","instituicao":{"id":1,"nome":"Universidade Agostinho Neto","sigla":"UAN","provincia":"luanda"},"instituicao_outra":"","curso":"Engenharia Informática","ano":1,"cadeira_foco":{"id":5,"nome":"Bases de Dados"},"minutos_por_dia":15,"provinc… |
| 5.6.10 | Depois de concluir, /v2/onboarding não volta a aparecer (nem após novo login) | ❌ | url=/v2/onboarding (o redireccionamento automático após login funciona — 5.6.10b; só o acesso directo por URL continua aberto) → ver B-02. |
| 5.6.10b | Novo login da conta concluída vai direito ao painel | ✅ | url=/v2/painel |
| 5.6.11 | Consola e API do fluxo sem erros 5xx | ✅ | consola=0 ; 5xx=[] |
| 5.6.12 | Curso sem cadeiras: campo desactivado e mensagem «Ainda não temos as cadeiras deste curso. Podes saltar este passo» | ✅ | desactivado=true |
| 5.6.13 | Sem cadeira escolhida o ecrã final propõe explorar simulados do curso (sem trilha inventada) | ✅ | Está tudo pronto O teu perfil está activo. Já podes estudar. Caloiro 2026 0 XP 0 dias de ofensiva O TEU PRIMEIRO PASSO Ainda não escolheste a cadeira. Começa por explorar os simulados do teu curso. Ir para o painel |
| 5.6.13b | Terminar sem cadeira também abre o painel | ✅ | /v2/painel |
| 5.6.14 | «Decidir depois» conclui e abre o painel | ✅ | /v2/painel |
| 5.6.15[C] | Conta da escola / de criador nunca é enviada para o onboarding | ✅ | depois de entrar: /v2/painel; /v2/onboarding por URL: /v2/onboarding |
| 5.6.15[D] | Conta da escola / de criador nunca é enviada para o onboarding | ✅ | depois de entrar: /v2/painel; /v2/onboarding por URL: /v2/onboarding |
| 5.6.15[F] | Conta da escola / de criador nunca é enviada para o onboarding | ✅ | depois de entrar: /v2/estudio/materiais; /v2/onboarding por URL: /v2/onboarding |
| 5.6.15[B] | Conta da escola / de criador nunca é enviada para o onboarding | ✅ | depois de entrar: /v2/estudio/materiais; /v2/onboarding por URL: /v2/onboarding |
| 5.6.15[A] | Conta da escola / de criador nunca é enviada para o onboarding | ✅ | depois de entrar: /v2/admin/membros; /v2/onboarding por URL: /v2/onboarding |

### Secção 5.7 — Preparar (passagem 3, `VITE_FLUXO_MOCKS=true`) e regra de produção

| Item | Verificação | Estado | Detalhe |
|---|---|:---:|---|
| 5.7.1[C] | Rotas de /v2/preparar abrem com a flag de mocks (sem 404) | ✅ | /v2/preparar→/v2/preparar «Que prova vais fazer?» \| /v2/preparar/calibrar→/v2/preparar «Que prova vais fazer?» \| /v2/preparar/previa→/v2/preparar «Que prova vais fazer?» \| /v2/preparar/materiais→/v2/preparar/materiais «As minhas preparações» \| /v2/preparar/modulo/1→/v2/preparar/modulo/1 \| /v2/preparar/simulado/1→/v2/prep… |
| 5.7.2[C] | Sem scroll horizontal a 375 px em nenhum ecrã do fluxo | ✅ | 6 ecrãs |
| 5.7.3[C] | Regra de persuasão honesta: sem escassez/urgência/números falsos | ✅ | nenhum padrão encontrado |
| 5.7.4[C] | Consola sem erros e sem 5xx | ✅ | consola=0 ; 5xx=[] |
| 5.7.1[E] | Rotas de /v2/preparar abrem com a flag de mocks (sem 404) | ✅ | /v2/preparar→/v2/preparar «Que prova vais fazer?» \| /v2/preparar/calibrar→/v2/preparar «Que prova vais fazer?» \| /v2/preparar/previa→/v2/preparar «Que prova vais fazer?» \| /v2/preparar/materiais→/v2/preparar/materiais «As minhas preparações» \| /v2/preparar/modulo/1→/v2/preparar/modulo/1 \| /v2/preparar/simulado/1→/v2/prep… |
| 5.7.2[E] | Sem scroll horizontal a 375 px em nenhum ecrã do fluxo | ✅ | 6 ecrãs |
| 5.7.3[E] | Regra de persuasão honesta: sem escassez/urgência/números falsos | ✅ | nenhum padrão encontrado |
| 5.7.4[E] | Consola sem erros e sem 5xx | ✅ | consola=0 ; 5xx=[] |
| 5.7.5 | B1: sem sebenta carregada o botão de continuar fica desactivado / há estado vazio claro | ⚠️ | botões: ["Gerar com IA"] — fluxo de upload não exercitado (sem ficheiros de exemplo; só mocks) |
| 5.7.6 | Build de produção (sem flags): /v2/preparar não existe e /v2/onboarding leva ao painel | ✅ | login=/v2/painel; /v2/preparar→/v2/preparar «404» \| /v2/preparar/materiais→/v2/preparar/materiais «404» \| /v2/onboarding→/v2/painel «Olá, Celeste» \| /v2/painel→/v2/painel «Olá, Celeste» |

### Secção 5.8 + 4.9 — API (extra; atribuída ao Anderson) e limite de tentativas

| Item | Verificação | Estado | Detalhe |
|---|---|:---:|---|
| 5.8.1 | Estatísticas do criador: 200 para criadores, 403 para estudante | ✅ | B(UAN)=200 F=200 C(estudante)=403 |
| 5.8.2 | rankings/me: total igual, XP do espaço diferente por X-Workspace; sem cabeçalho não rebenta | ✅ | UAN total=395 ws=140; Kiala total=395 ws=85; sem ws=200 |
| 5.8.3 | Gerar quiz por IA devolve 410 (desligado) | ✅ | status=410 {"error":"A geração automática de quizzes está temporariamente indisponível."} |
| 5.8.4 | /me/: GET 200; PATCH altera curso mas nunca email nem user_type | ✅ | GET=200 PATCH=200 email igual=true user_type igual=true curso=Direito |
| 5.8.5 | /instituicoes/: autenticado devolve 9; anónimo exige login | ✅ | anónimo=401 autenticado=200 n=9 |
| 5.8.6 | /cadeiras/?curso= filtra pelo curso | ✅ | Direito=Direito Civil I,Direito Constitucional,Introdução ao Direito Informática=Bases de Dados,Programação I |
| 5.8.7 | ?cadeira= nos conteúdos/quizzes/trilhas respeita o espaço (marketplace, UAN, Kiala não se misturam) | ⚠️ | contents: marketplace=1 UAN=1 Kiala=0; quizzes UAN=undefined; trilhas UAN=0. Conteúdos: isolamento confirmado (Kiala = 0). Quizzes: `GET /api/quizzes/` devolve 404 (não existe listagem) e trilhas devolveu 0, pelo que estes dois filtros não ficaram provados. |
| 5.8.9 | X-Workspace de escola a que não pertence → 403/404 (sem dados) | ✅ | Celeste→Kiala=403; UUID inexistente=403 |
| 5.8.11 | Estudante não consegue criar conteúdo (403) | ✅ | status=403 |
| 4.9 | Limite de tentativas: 6.ª errada → 429 com Retry-After e mensagem PT | ✅ | 401 401 401 401 401 429(Retry-After 60) 429(Retry-After 60) |
| 5.8.8 | Registo sem ano_nascimento / sem aceitar termos / termos em falta → 400 | ✅ | sem ano=400 {"ano_nascimento":["Indica o ano de nascimento."]}; termos=false→400 {"aceita_termos":["Tens de aceitar os termos de utilização para criar conta."]}; termos em falta→400 |
| 5.8.10 | Registo de menor (15 anos): estado do consentimento do encarregado | ⚠️ | registo=201; /me/ campos relacionados={}. O backend aceita o registo; a mensagem/fluxo de consentimento do encarregado depende do frontend (ver C-F5). |

## 5. O que não foi verificado

- **Secção 6 do guião (produção, kombinu.com)**: não é testável localmente (domínio, e-mails reais, deploy, DNS, variáveis de produção).
- Testes por pessoa real / exploratórios: tudo o que está aqui foi automatizado em Chromium (Playwright). Não houve Safari, Firefox, iOS ou Android reais; 375 px foi emulação.
- 1280 px: verificado na landing, no login e na barra do criador; as restantes rotas foram auditadas a 375 px.
- Fluxo completo de carregar sebenta, gerar e pagar em /v2/preparar (depende de ficheiros, IA e pagamentos reais; só mocks).
- Importação CSV até à confirmação final, e importação grande.
- Edição/criação de conteúdo e quiz pelo formulário do estúdio (UI): foi feita pela API (como o professor); a UI ficou apenas auditada (abre, sem erros, sem «Gerar com IA»).
- Enquete: votar (+5 XP uma vez) pela interface, por já estar respondida (O-07).
- Carga, desempenho, e-mails transaccionais, notificações push.

## 6. Recomendações e ligação ao sprint de correcções

1. **Antes de qualquer release:** decidir B-07 (menores) com o Orlando e o Anderson — é o único ponto com risco legal e alimenta o **C-F5**. Resolver B-01 (sem «Sair»), de custo baixo.
2. **C-F1 (painel «Do meu curso»):** o backend já expõe `/api/me/` (`cadeira_foco`, `curso`) e o filtro `?cadeira=` em conteúdos (isolamento provado). Os filtros de quizzes e trilhas devem ser confirmados antes de ligar o painel (O-05).
3. **C-F2 notificações (F9):** /v2/notificacoes abre sem erros nos papéis testados (o sino mostra um contador), mas o conteúdo das notificações não foi auditado em detalhe nesta ronda.
4. **C-F3/C-F4 (ecrãs órfãos e inventário de rotas):** confirmado que sem flags `/v2/preparar` dá 404 e `/v2/onboarding` redirecciona; com flags tudo abre sem erros. Falta o inventário formal (rotas × dados de exemplo), que este QA não substitui.
5. **P2 em lote:** B-03, B-05, B-06 e B-02 são correcções curtas e cabem num único PR cada. B-04 precisa de decisão de produto (implementar tema escuro ou retirar a classe).
6. Repetir esta bateria em produção (secção 6) e por pessoas reais em telemóvel (iOS/Android) antes de anunciar.

## 7. Ambiente e reprodutibilidade

- Backend `fd1d273` (`runserver --noreload`, SQLite isolada em pasta temporária) com `seed_demo` e 5 cadeiras criadas (Engenharia Informática: Programação I, Bases de Dados; Direito: Direito Civil I, Direito Constitucional, Introdução ao Direito) ligadas a conteúdos e quizzes.
- Frontend `9d56741` (Vite 5 dev, porta 5173; proxy `/api`). `npm run build` sem erros; `preview` usado para a regra 5.7.6.
- Dados de teste (contas `qa.g.*`, conteúdo «QA CRUD artigo» apagado) existem só na base local e **não devem subir jamais**.
- Evidências: pasta `evidencias-geral/` (7 capturas escolhidas). Os scripts ficam fora do repositório.
- O limite de registo por IP (429, ~28 min) foi activado pelos meus próprios registos de teste; reiniciei o servidor local para o limpar e repeti 5.8.8 e 5.8.10. O limite em si está correcto (4.9).
