# KOMBINU — FAQ Técnico para Expositores · AngoTic 2026

> **Para quem é este documento?**
> Para os membros da equipa que vão estar no stand nos dias 11, 12 e 13 de Junho. O CTO não estará presente — este documento foi preparado para que qualquer expositor consiga responder com confiança a qualquer pergunta técnica do público, juízes ou investidores.
>
> Lê com atenção antes do evento. Se surgir uma dúvida que não está aqui, **não inventes — diz "vou confirmar com a equipa técnica e entro em contacto"**.

---

## Índice

1. [O Produto](#1-o-produto)
2. [A Tecnologia](#2-a-tecnologia)
3. [A Inteligência Artificial](#3-a-inteligência-artificial)
4. [Segurança e Dados](#4-segurança-e-dados)
5. [Gamificação e Sistema de Pontos](#5-gamificação-e-sistema-de-pontos)
6. [Arquitectura e Infraestrutura](#6-arquitectura-e-infraestrutura)
7. [Escalabilidade](#7-escalabilidade)
8. [Negócio e Mercado](#8-negócio-e-mercado)
9. [Roadmap](#9-roadmap)
10. [A Equipa](#10-a-equipa)
11. [Situações Práticas no Stand](#11-situações-práticas-no-stand)

---

## 1. O Produto

**O que é o KOMBINU?**
O KOMBINU é uma plataforma educacional gamificada angolana que conecta criadores de conhecimento e aprendizes. Quem sabe, ensina — e quem aprende, é recompensado com pontos, níveis e posições no ranking. O objectivo é tornar a aprendizagem mais envolvente e acessível em Angola.

---

**Qual é o problema que o KOMBINU resolve?**
Em Angola, o acesso a formação de qualidade é limitado — ou é caro, ou está em inglês, ou não está adaptado à realidade local. O KOMBINU cria um espaço onde qualquer pessoa pode partilhar o que sabe e qualquer pessoa pode aprender, com a motivação extra da gamificação.

---

**Quem usa o KOMBINU?**
Existem dois tipos de utilizadores:
- **Aprendizes** — estudantes, profissionais, qualquer pessoa que queira aprender. Exploram cursos, fazem quizzes e sobem no ranking.
- **Criadores** — professores, profissionais, especialistas. Publicam conteúdos em texto ou vídeo, criam quizzes e acompanham a sua audiência.

---

**Em que língua está a plataforma?**
100% em Português de Angola. Toda a interface, mensagens de erro e navegação estão em português. É uma decisão intencional — construímos para o nosso mercado.

---

**O KOMBINU é tipo o Udemy ou o Coursera?**
Há semelhanças, mas a diferença principal é a **gamificação**. No Udemy e no Coursera aprendes passivamente — assistes a vídeos. No KOMBINU aprendes activamente — fazes quizzes, ganhas XP, subes de nível e competes no ranking com outros utilizadores. Além disso, é uma plataforma angolana, feita para a realidade local.

---

**O que posso aprender no KOMBINU?**
Nesta versão existem três categorias: **Tecnologia**, **Negócios** e **Design**. O catálogo vai crescer à medida que mais criadores publicam conteúdos.

---

## 2. A Tecnologia

**Que tecnologias usaram para construir o KOMBINU?**

A plataforma é composta por duas partes:

| Parte | Tecnologia |
|---|---|
| **Frontend** (o que o utilizador vê) | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** (o servidor e base de dados) | Python com Django REST Framework |
| **Autenticação** | JWT — JSON Web Tokens |
| **Deploy frontend** | Vercel |
| **Deploy backend** | Render |
| **Quizzes por IA** | Open Trivia Database (OpenTDB) |

---

**Porquê React e não outra framework?**
React é a framework de interface mais usada no mundo, com enorme comunidade e ecossistema. Permite construir interfaces rápidas e reactivas — quando o utilizador responde a uma pergunta do quiz, o ecrã actualiza instantaneamente sem recarregar a página.

---

**Porquê Python/Django no backend?**
Django é um dos frameworks web mais maduros e seguros que existem. Tem protecções contra os ataques mais comuns (SQL Injection, CSRF, XSS) activadas por omissão. Python permite iterar rapidamente, ideal para um MVP.

---

**A plataforma funciona no telemóvel?**
Sim. O design é **responsivo** — adapta-se automaticamente a qualquer tamanho de ecrã, desde telemóvel a monitor. Não é uma app nativa (não está na Play Store nem App Store), mas funciona muito bem no browser do telemóvel.

---

**O KOMBINU funciona sem internet?**
Não — é uma aplicação web e precisa de ligação à internet para comunicar com o servidor. Uma versão offline é possível no futuro com tecnologias como Service Workers, mas não está no MVP.

---

## 3. A Inteligência Artificial

**Disseram que têm IA. O que faz exactamente?**
A funcionalidade de IA gera quizzes automaticamente. Quando um criador publica um conteúdo e clica em "Gerar com Inteligência Artificial", a plataforma vai buscar perguntas relevantes à **Open Trivia Database (OpenTDB)** — uma base de dados pública com milhares de perguntas validadas por categoria e dificuldade — e cria o quiz automaticamente, sem o criador ter de escrever uma única pergunta.

---

**Mas isso é IA ou é uma base de dados?**
É uma combinação dos dois. A OpenTDB é uma base de dados de perguntas. A "inteligência" está em seleccionar automaticamente as perguntas certas com base na categoria do conteúdo e na dificuldade definida pelo criador, e em montar o quiz sem intervenção humana. É uma abordagem pragmática para o MVP — permite entregar valor real hoje, enquanto uma integração com modelos de linguagem (GPT, etc.) está no roadmap.

---

**Porquê não usaram o ChatGPT ou outra IA generativa?**
Duas razões: **custo** e **fiabilidade**. APIs de modelos de linguagem generativa têm custo por utilização que, em escala, se tornam significativos. A OpenTDB é gratuita, tem perguntas verificadas por humanos e já tem categorias que se alinham com o nosso catálogo. Para o MVP, é a escolha certa.

---

**As perguntas do quiz aparecem em inglês — isso é um bug?**
É uma limitação conhecida. A OpenTDB tem cobertura limitada em português — especialmente em categorias técnicas como Tecnologia. O sistema tenta buscar perguntas em português primeiro; quando não existem, usa inglês como fallback. A solução definitiva — uma base de dados própria de perguntas em português angolano — está no roadmap.

---

**O criador pode editar as perguntas geradas pela IA?**
Nesta versão não. As perguntas são geradas e publicadas directamente. A edição de quizzes gerados por IA é uma funcionalidade prevista para a próxima versão.

---

**E se a IA falhar ou demorar muito?**
A plataforma trata esse caso. Se a OpenTDB estiver sobrecarregada (rate limit), o sistema volta a tentar automaticamente e, se persistir, mostra uma mensagem explicativa ao criador pedindo para tentar novamente em alguns segundos.

---

## 4. Segurança e Dados

**Como protegem as passwords dos utilizadores?**
As passwords **nunca são guardadas em texto simples**. O Django usa hashing com algoritmo PBKDF2 com SHA-256 por omissão — o mesmo padrão recomendado pelo NIST. Nem a equipa técnica tem acesso às passwords dos utilizadores.

---

**Como funciona o login? É seguro?**
Usamos **JWT — JSON Web Tokens**. Quando fazes login, o servidor gera dois tokens:
- **Access Token** — válido por pouco tempo (minutos/horas), usado em cada pedido à API
- **Refresh Token** — válido por mais tempo, usado para obter um novo Access Token sem ter de fazer login novamente

Se alguém interceptar o Access Token, a janela de exposição é muito curta. Quando o Refresh Token é usado, um novo é emitido e o anterior é invalidado (rotação de tokens).

---

**Os dados dos utilizadores são guardados em Angola?**
Nesta fase do MVP, o servidor está na cloud da Render (infraestrutura na Europa/EUA). Migrar para servidores físicos em Angola ou para uma cloud com presença no continente africano (como a AWS África - Cape Town) é parte do plano de escala. A Lei de Protecção de Dados angolana será cumprida na íntegra à medida que a plataforma cresce.

---

**Que dados recolhem dos utilizadores?**
Apenas o essencial para o funcionamento: nome, email, password (em hash), tipo de conta, pontos acumulados e nível. Não há dados de localização, não há tracking de comportamento para publicidade, não há venda de dados.

---

**A plataforma usa HTTPS?**
Sim. Tanto o frontend (Vercel) como o backend (Render) servem exclusivamente via HTTPS. Toda a comunicação entre o browser do utilizador e os servidores é encriptada.

---

**Quem tem acesso à base de dados?**
Apenas os membros da equipa técnica com credenciais explícitas. A base de dados não é acessível publicamente.

---

## 5. Gamificação e Sistema de Pontos

**Como funcionam os pontos (XP)?**
Cada resposta correcta num quiz vale **10 XP**. Se responderes correctamente a 7 de 10 perguntas, ganhas 70 XP. Os pontos acumulam-se ao longo do tempo e nunca diminuem.

---

**Como se calculam os níveis?**
A fórmula é simples e transparente:

```
Nível = (Total de XP ÷ 100) + 1
```

| XP Total | Nível |
|---|---|
| 0–99 | Nível 1 |
| 100–199 | Nível 2 |
| 200–299 | Nível 3 |
| 1000+ | Nível 11 |

---

**O ranking é em tempo real?**
Sim. O ranking é calculado directamente a partir dos pontos reais na base de dados. Cada vez que abres a página de Ranking, está a ver os dados actuais.

---

**Posso fazer o mesmo quiz duas vezes para ganhar mais XP?**
Não. O sistema regista que já submeteste um quiz e bloqueia uma segunda submissão. Cada quiz só conta uma vez por utilizador.

---

**Os criadores também ganham pontos?**
Nesta versão, os pontos são exclusivos dos aprendizes. Um sistema de recompensas para criadores (baseado em visualizações, avaliações e engagement) está previsto para versões futuras.

---

## 6. Arquitectura e Infraestrutura

**Como está estruturada a plataforma tecnicamente?**
É uma arquitectura **cliente-servidor separada**:

```
Browser do utilizador
        ↓ HTTPS
Frontend (Vercel — kombinu.vercel.app)
        ↓ API REST (JSON)
Backend (Render — servidor Django)
        ↓ SQL
Base de dados PostgreSQL
        ↓ HTTP
OpenTDB (geração de quizzes)
```

O frontend e o backend são independentes — podem ser escalados separadamente.

---

**O que é uma API REST?**
É a forma como o frontend (o que o utilizador vê) comunica com o backend (o servidor). Quando abres o Marketplace, o browser envia um pedido ao servidor a dizer "dá-me a lista de cursos" e o servidor responde com os dados em formato JSON. É o mesmo padrão usado por plataformas como Twitter, Instagram e Spotify.

---

**Onde está alojado o frontend?**
Na **Vercel** — uma plataforma de cloud especializada em aplicações web. Cada vez que fazemos uma alteração ao código, a Vercel recompila e publica automaticamente em segundos.

---

**Onde está alojado o backend?**
Na **Render** — uma plataforma de cloud para servidores. Na versão gratuita (que usamos no MVP), o servidor pode adormecer quando não há tráfego e demorar ~30 segundos a arrancar na primeira visita do dia. Isso é normal e expectável no MVP.

---

**O que acontece se o servidor backend adormecer?**
O utilizador pode notar que o login ou o carregamento inicial demora até 30 segundos na primeira utilização do dia. Após esse arranque, tudo funciona com velocidade normal. Para o evento, recomenda-se fazer login antes de apresentar ao público para garantir que o servidor já está activo.

---

## 7. Escalabilidade

**A plataforma aguenta muitos utilizadores ao mesmo tempo?**
Na configuração actual do MVP, está optimizada para um volume de utilizadores adequado à fase de validação. A arquitectura foi desenhada para escalar:
- O frontend na Vercel escala automaticamente e serve milhões de pedidos sem configuração adicional
- O backend pode ser escalado horizontalmente (mais instâncias do servidor) quando necessário
- A base de dados PostgreSQL suporta crescimento significativo

---

**E se houver um pico de tráfego durante o AngoTic?**
O frontend (Vercel) não tem limites práticos de tráfego para uma demonstração. O backend pode sentir alguma pressão se houver muitos utilizadores simultâneos, mas para o volume de um evento presencial é mais do que suficiente.

---

**O código está pronto para produção real ou é só uma demo?**
É um MVP funcional — não é só uma demo. As funcionalidades核心 (autenticação, criação de conteúdo, geração de quiz, ranking) estão implementadas com código real, base de dados real e segurança real. O que ainda está em desenvolvimento são funcionalidades complementares (pagamentos, notificações, app móvel).

---

## 8. Negócio e Mercado

**Qual é o modelo de negócio?**
Nesta versão o acesso é gratuito para validar o mercado. O modelo de monetização planeado é:
- **Comissão sobre cursos pagos** — criadores definem o preço, KOMBINU retém uma percentagem
- **Plano premium para criadores** — ferramentas avançadas de análise e maior visibilidade
- **Parcerias com empresas** — formação corporativa e certificações

---

**Quem são os vossos concorrentes?**
Globalmente: Udemy, Coursera, Khan Academy. Em Angola e África: há poucos concorrentes directos com gamificação — essa é a nossa vantagem competitiva. Somos locais, falamos a língua, entendemos o mercado.

---

**Já têm utilizadores reais?**
Estamos em fase de validação. O AngoTic é o momento de lançamento público e de recolha de feedback real do mercado.

---

**É open source?**
O código não é público neste momento. A decisão de open source é estratégica e será avaliada no futuro.

---

**Têm financiamento?**
O MVP foi construído com recursos próprios da equipa. Estamos abertos a parcerias e investimento para acelerar o desenvolvimento.

---

## 9. Roadmap

**O que vem a seguir depois do AngoTic?**

**Curto prazo (próximos 3 meses):**
- Pagamentos e monetização de cursos
- Perguntas de quiz em português (base de dados própria)
- Notificações (novos cursos, resultados)
- Perfil de utilizador editável

**Médio prazo (6–12 meses):**
- App móvel nativa (Android primeiro, dado o mercado angolano)
- Sistema de certificados digitais
- Integração com modelos de linguagem (GPT) para geração de quizzes mais contextual
- Painel de analytics avançado para criadores

**Longo prazo:**
- Servidores em África (reduzir latência)
- Parcerias com instituições de ensino angolanas
- Expansão para outros países lusófonos de África

---

**Vão adicionar mais categorias de conteúdo?**
Sim. As três categorias actuais (Tecnologia, Negócios, Design) são o ponto de partida. Novas categorias serão adicionadas com base na procura dos utilizadores.

---

## 10. A Equipa

**Quem construiu o KOMBINU?**
O KOMBINU foi construído por uma equipa angolana:
- **Anderson Cafurica** — CTO / Tech Lead, arquitectura e decisões técnicas
- **Augusto Manuel** — Developer Senior, desenvolvimento das funcionalidades principais
- **Carlos Avelino** — Developer, desenvolvimento e integração de funcionalidades
- **Orlando Fortuna** — CEO, visão de produto e design

---

**Em quanto tempo construíram isto?**
O MVP foi construído num sprint intensivo de 3 semanas para o AngoTic 2026, sobre uma base anterior já existente. É um exemplo do que uma equipa angolana motivada consegue entregar.

---

**Têm experiência técnica para levar isto a escala?**
Sim. A equipa tem experiência com as mesmas tecnologias usadas por empresas como Instagram (React), Spotify (Django/Python) e Netflix (Vercel/cloud). A stack escolhida não é experimental — é provada em produção à escala mundial.

---

## 11. Situações Práticas no Stand

### O servidor demora a responder no primeiro login

**O que é:** O backend na Render (versão gratuita) adormece após 15 minutos de inactividade e demora ~30 segundos a arrancar.

**O que dizer:** *"O servidor está a iniciar — é normal na fase de MVP. Em produção completa teremos servidores sempre activos."*

**Como evitar:** Fazer login na plataforma antes de começar a receber visitantes, para garantir que o servidor já está activo.

---

### As perguntas do quiz aparecem em inglês

**O que é:** A OpenTDB tem cobertura limitada em português para categorias técnicas. O sistema usa inglês como fallback.

**O que dizer:** *"As perguntas em inglês são uma limitação conhecida desta versão — estamos a construir a nossa própria base de dados de perguntas em português angolano para a próxima versão."*

---

### Alguém pergunta se a IA é "real"

**O que dizer:** *"A nossa IA de geração de quizzes usa a Open Trivia Database, uma base de dados global de perguntas validadas por especialistas. Seleccionamos e montamos os quizzes automaticamente com base na categoria e dificuldade — sem o criador ter de escrever uma única pergunta. A integração com modelos de linguagem generativa (como o GPT) está no nosso roadmap."*

**Não digas** que é "ChatGPT" ou "machine learning" — não é verdade e pode ser desmontado.

---

### Alguém quer testar e o registo falha

1. Verifica a ligação à internet do dispositivo
2. Tenta com um email diferente (pode já existir uma conta com esse email)
3. Se o problema persistir, usa as contas de demo pré-criadas

---

### Alguém pergunta algo que não sabes responder

**Diz sempre:** *"Essa é uma boa pergunta — não quero dar uma resposta incorrecta. Posso recolher o teu contacto e a nossa equipa técnica entra em contacto em 24 horas?"*

Nunca inventes. A credibilidade da equipa vale mais do que uma resposta incompleta.

---

### Contacto de emergência durante o evento

Para questões técnicas urgentes durante o evento, entrar em contacto com a equipa técnica pelo canal interno da equipa.

---

*Documento interno · Preparado pelo CTO · AngoTic 2026 · Junho 2026*
*Confidencial — uso exclusivo da equipa Kombinu*
