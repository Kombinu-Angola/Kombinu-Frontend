# Análise do login e do cadastro — protótipo `kombinu-auth.1` vs plataforma (Nov 2026)

> **Fontes:** a pasta `kombinu-auth.1/kombinu-auth` (protótipo: `LoginPage.tsx`, `SignupPage.tsx`, `components.tsx`, `auth.css`) e o código da plataforma (`src/pages/Login.tsx`, `src/pages/Register.tsx`, `src/features/auth-novo/*`, `src/features/credenciamento/*`, `src/features/onboarding-novo/*`, `src/routes/V2Layout.tsx`, `src/lib/destinoPosLogin.ts`). As imagens e os documentos que o Braga referiu **não chegaram** com o pedido; esta análise assenta no protótipo em código. Se as imagens mostrarem outra coisa, ajusta-se.
> **Backend:** só lido (`Kombinu-Backend` `main`, `fd1d273`); nada alterado.

## 1. O fluxo pretendido (resumo do pedido)

1. **Um só login**, claro. Não se escolhe «estudante» ou «instituição».
2. **Um só cadastro**: toda a gente se regista como **utilizador normal**. Não se escolhe «aprendiz» ou «criador».
3. Depois do cadastro, o **aprendiz** tem duas vertentes:
   - **Gerar conteúdo com IA na hora** (onboarding que recolhe PDFs e informação; gera o conteúdo da prova).
   - **Navegar pelo painel** (onboarding curto, depois o painel/marketplace).
4. O **criador** tem um **onboarding próprio** (credenciamento geral e específico) e **espera a aprovação** do admin para ser criador certificado.

## 2. O protótipo (`kombinu-auth.1`) — o que define

| Peça | Protótipo |
|---|---|
| Login | Botão Google + separadores de **método**: **SMS** (telemóvel angolano `9XXXXXXXX` + código de 6 dígitos) e **E-mail** (palavra-passe, «Esqueceste a palavra-passe?») |
| Cadastro | Nome completo + (SMS: telemóvel + código | E-mail: e-mail + palavra-passe com checklist «8+ caracteres / uma letra / um número») + aceitar termos. **Não há escolha de papel** |
| Passo OTP | Ecrã do código de 6 dígitos com reenvio e «voltar» |
| Mensagens | PT-PT, erros por campo, `aria-live`, foco no primeiro erro |
| Layout | Coluna única de 460 px, sem imagem, tabs com setas/Home/End |

O protótipo **não distingue papéis** nem tem login de escola: confirma o pedido de «todo o mundo é utilizador normal».

## 3. O que a plataforma tinha (e porque estava errado)

| # | Achado | Evidência | Gravidade |
|---|---|---|---|
| 1 | O **registo perguntava «Como queres usar a Kombinu? Aprendiz / Criador»** e enviava `user_type=creator` | `Register.tsx` (`TIPOS`) | **Segurança (P0/P1)** — ver 4 |
| 2 | O **login tinha dois separadores «E-mail \| Escola»**, num `tablist` com `aria-label="Tipo de conta"`. Lia-se como «escolher o tipo de conta: estudante ou instituição» | `ui.tsx` (`MethodTabs`), `Login.tsx` | Estrutural (o erro descrito) |
| 3 | O login **por SMS e por Google do protótipo nunca foi portado** (não há backend para eles); ficou só e-mail + escola | `auth-novo/ui.tsx` não tem `GoogleButton`, `PhoneField`, `OtpStep`, `Divider` | Cobertura parcial do protótipo |
| 4 | O registo **não mostra a checklist de palavra-passe do protótipo** (8+ caracteres, letra, número): só uma dica de texto | `Register.tsx` | Menor |
| 5 | O destino depois do registo era `/v2/credenciamento` para «criador» e o painel para «aprendiz» | `Register.tsx` | Consequência do 1 |
| 6 | Em produção o **onboarding do aprendiz está desligado** (`VITE_ONBOARDING_API`); quem se regista cai direto no painel, sem escolher entre «Preparar a minha prova» e «Explorar» | `fluxoFlags.ts`, `V2Layout.tsx` | Fluxo 3 incompleto |
| 7 | A vertente «**gerar conteúdo com IA**» (`/v2/preparar*`) só existe com `VITE_FLUXO_MOCKS=true` e dados simulados; o backend não tem API | `routes/v2.tsx`, inventário C-F4 | Depende do backend |
| 8 | O **credenciamento** existe, é público e funciona até ao fim, mas o **envio está desligado** («Em breve»); não há endpoint nem fila de aprovação no admin | `CredenciamentoFlow.tsx`, `/v2/admin/criadores` «Em breve» | Depende do backend |
| 9 | O login institucional (código da escola + código do aluno + palavra-passe) **é necessário**: os alunos importados por CSV não têm e-mail | `tenancy/members/bulk`, `accounts/institutional/login/` | A manter |

## 4. Falha de segurança confirmada (registo como criador)

O backend aceita `user_type=creator` no registo público **sem qualquer aprovação**. Verificado em local com uma conta nova:

- registo com `user_type=creator` → `201`;
- login → `user_type: creator`;
- `GET /api/dashboard/creator/stats/` → `200`; `POST /api/contents/` → `201`.

Ou seja, qualquer pessoa podia criar-se como criador e **publicar no marketplace sem credenciamento**, a escolher «Criador» no registo (ou a chamar a API). O CLAUDE.md pede parar e reportar: fica **reportado**. O frontend deixa de enviar `creator` (PR do registo); **o backend deve recusar ou ignorar `user_type=creator` no registo público** e só o promover quando o admin aprovar a candidatura (pedido ao Anderson, secção 7).

## 5. O que foi corrigido neste trabalho

| PR / branch | O que muda | Estado |
|---|---|---|
| `fix/b01-sair-e-perfil` | Botão «Sair» em todos os layouts `/v2` e avatar → `/v2/perfil` (B-01 do QA) | Pronto, por rever |
| `feat/auth-registo-sem-papel` | Sai «Aprendiz / Criador». Toda a gente regista como `learner`; **deixa de ser possível criar conta como criador** (o tipo `criador` sai do `RegisterData` e do serviço, que envia sempre `learner`). Sem ligação de candidatura no registo | Pronto, por rever (parte do `feat/c-f5-aviso-menores`) |
| `feat/auth-login-unico` | Sai o `tablist` «E-mail \| Escola». Um formulário «E-mail ou código de aluno» + palavra-passe; o **código da escola** só aparece quando se escreve um código de aluno (não um e-mail). Mesmos endpoints; sem escolha de «tipo de conta» | Pronto, por rever |

**Como o login único decide:** se o primeiro campo tem `@` → login por e-mail; senão → login institucional (código de aluno + código da escola). O papel (estudante, professor, admin, criador) vem sempre da conta, nunca do formulário. Testado com A, B, E, F (e-mail) e C (código de aluno), palavra-passe errada, validações e regresso à página pedida (`from`).

## 6. Fluxo resultante, por pessoa

| Quem | Entra por | Vê depois |
|---|---|---|
| Aluno de escola (sem e-mail) | `/login` → código de aluno + código da escola + palavra-passe | Painel da escola |
| Aluno/professor/admin com e-mail | `/login` → e-mail + palavra-passe | Painel / estúdio / admin conforme o papel |
| Novo utilizador | `/register` (um só formulário) | Painel (e onboarding, quando ligado) |
| Quer ser criador | `/v2/credenciamento` (sem ligação no registo; ponto de entrada a definir, ver secção 7) | Formulário completo; envio «Em breve» |

## 7. O que falta (decisões e backend)

| Item | Quem | Nota |
|---|---|---|
| Recusar `user_type=creator` no registo público e promover só por aprovação | **Backend (Anderson)** | Fecha a falha da secção 4 |
| Endpoint de candidatura de criador + fila de aprovação no admin (`/v2/admin/criadores`) | **Backend + frontend** | Hoje o credenciamento não envia nada |
| Login por **SMS** e por **Google** (protótipo) | **Produto + backend** | Sem backend não se mostram botões que não funcionam (regra de honestidade). O `OtpStep`, `PhoneField` e `GoogleButton` do protótipo ficam prontos a portar |
| «Esqueceste a palavra-passe?» | **Backend** | Não há endpoint de recuperação |
| **Ligar o onboarding em produção** (`VITE_ONBOARDING_API=true`) | **Anderson (decisão de release)** | O backend `main` já tem K1–K4; falta só a variável de ambiente. Sem ela o aprendiz não escolhe entre «Preparar a minha prova» e «Explorar» |
| Botão do onboarding para **«Gerar conteúdo com IA»** (`/v2/preparar`) | **Backend (API de IA) + frontend** | Hoje só com mocks |
| Checklist da palavra-passe do protótipo no registo (8+ / letra / número) | Frontend | Pequeno; o backend já valida (PT) |
| **Ponto de entrada do criador** (onde se chega ao credenciamento: landing, perfil, convite) | **Produto (Orlando)** | Retirei a ligação do registo; hoje só se chega por URL |
| Criador sem aprovação (conta antiga) | **Backend / admin** | Contas já criadas como `creator` mantêm acesso; rever as existentes |

## 8. Divisão do trabalho (um PR por ponto)

1. ✅ **B-01** Sair e perfil.
2. ✅ **Registo sem papel** (`feat/auth-registo-sem-papel`).
3. ✅ **Login único** (`feat/auth-login-unico`).
4. ⏳ **Checklist de palavra-passe** no registo (protótipo) — frontend, pequeno.
5. ⏳ **Onboarding ligado por defeito** — decisão do Anderson (variável de ambiente, sem código).
6. ⏳ **Credenciamento com envio real** — depende do endpoint de candidatura.
7. ⏳ **SMS / Google** — depende de produto e de backend.

## 9. Limites

- Imagens e documentos não recebidos: o desenho do login único (campo «E-mail ou código de aluno» + «Código da escola» condicional) é a minha leitura do pedido e pode mudar quando se vir o material.
- Testado em Chromium (Playwright) a 375 px, com as contas do seed local.
- A falha da secção 4 foi reproduzida com contas de teste na base local; essas contas **não devem subir jamais**.
