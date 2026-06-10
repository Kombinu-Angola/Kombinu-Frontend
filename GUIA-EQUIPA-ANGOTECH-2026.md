# KOMBINU — Guia da Equipa · AngoTic 2026

---

## Amanhã é o dia. 🚀

Depois de semanas a construir, testar, corrigir e melhorar — a plataforma está pronta para ser apresentada ao país no AngoTic 2026.

Este guia é para **toda a equipa Kombinu** — designers, gestores, devs, e quem vai estar connosco no evento. Não precisas de saber programar para o ler. O objectivo é simples: que todos saibam o que a plataforma faz, como a usar, e como mostrar ao público o melhor que temos.

Vamos lá. 💪

---

## O que é o KOMBINU?

O **KOMBINU** é uma plataforma educacional gamificada angolana que conecta **quem quer aprender** com **quem tem conhecimento para partilhar**.

- Os **Aprendizes** exploram cursos, fazem quizzes e sobem no ranking.
- Os **Criadores** publicam conteúdos, geram quizzes com Inteligência Artificial e acompanham o crescimento da sua audiência.
- Toda a aprendizagem é recompensada com **XP e níveis** — aprender tem de ser divertido.

---

## Como aceder à plataforma

**Link de produção:** [kombinu.vercel.app](https://kombinu.vercel.app)

Abre no browser do telemóvel ou computador — funciona nos dois.

---

## Criar conta

1. Acede ao link acima
2. Clica em **Registar**
3. Preenche o nome, email e password
4. Escolhe o teu papel:
   - **Aprendiz** — quero aprender e ganhar XP
   - **Criador** — quero publicar conteúdos e quizzes
5. Confirma e faz login

> Podes criar contas de teste com emails fictícios (ex: `teste.aprendiz@kombinu.ao`).

---

## Para Aprendizes — o que explorar

### Dashboard
Logo após o login vês o teu painel pessoal:
- **Nível actual** e barra de progresso de XP
- **Cursos em progresso**
- Acesso rápido ao Marketplace e Ranking

### Marketplace
- Lista de todos os cursos disponíveis
- Filtra por categoria: **Tecnologia**, **Negócios** ou **Design**
- Usa a barra de pesquisa para encontrar um conteúdo específico
- Clica num curso para ver os detalhes e iniciar o quiz

### Fazer um Quiz
1. Abre um curso no Marketplace
2. Clica em **Iniciar Quiz**
3. Responde às perguntas dentro do tempo (o cronómetro fica vermelho nos últimos 30 segundos)
4. No fim vês o teu resultado: perguntas correctas, precisão e XP ganhos
5. O XP é adicionado automaticamente ao teu perfil

### Ranking
- Clica em **Ranking** no menu
- Vês o pódio dos 3 melhores e a tabela completa
- O teu nome aparece destacado a azul

---

## Para Criadores — o que explorar

### Dashboard
- Estatísticas dos teus conteúdos: visualizações, quizzes submetidos
- Lista dos conteúdos publicados

### Criar Conteúdo
1. Clica em **Criar Conteúdo** no menu ou no botão do dashboard
2. Preenche:
   - **Título** e **Descrição** do conteúdo
   - **Categoria** (Tecnologia / Negócios / Design)
   - **Tipo**: Texto, Vídeo ou Quiz
   - **Dificuldade** e **Tempo estimado**
3. Se escolheres **Quiz**:
   - Podes criar as perguntas manualmente
   - Ou clicar em **Gerar com Inteligência Artificial** — a plataforma vai buscar perguntas relevantes automaticamente à OpenTDB e cria o quiz por ti
4. Clica **Salvar** — o conteúdo fica disponível no Marketplace

---

## Checklist de testes para o evento

Antes ou durante o AngoTic, confirma que estas funcionalidades estão a funcionar:

### Fluxo Aprendiz
- [ ] Criar conta como Aprendiz
- [ ] Fazer login e ver o Dashboard
- [ ] Explorar o Marketplace e filtrar por categoria
- [ ] Abrir um curso e ver os detalhes
- [ ] Iniciar e completar um quiz
- [ ] Verificar que o XP aumentou no perfil após o quiz
- [ ] Ver o Ranking e encontrar o teu nome

### Fluxo Criador
- [ ] Criar conta como Criador
- [ ] Fazer login e ver o Dashboard de Criador
- [ ] Criar um conteúdo do tipo Texto ou Vídeo
- [ ] Criar um conteúdo do tipo Quiz com perguntas manuais
- [ ] Criar um conteúdo e usar **Gerar com IA** para gerar o quiz automaticamente
- [ ] Confirmar que o conteúdo aparece no Marketplace

### Geral
- [ ] Mudar para **dark mode** (ícone do sol/lua no canto superior direito)
- [ ] Abrir a plataforma no telemóvel e confirmar que o layout está correcto
- [ ] Fazer logout e login novamente

---

## O que ainda não está disponível nesta versão

Para sermos honestos com o que temos:

- **Pagamentos** — o Marketplace é gratuito no MVP; a monetização vem numa fase seguinte
- **Notificações** — ainda não há alertas de novos cursos ou resultados de quiz
- **Perfil editável** — a foto e bio do perfil não são editáveis nesta versão
- **Perguntas em português** — os quizzes gerados com IA usam a base de dados OpenTDB que tem cobertura limitada em português; parte das perguntas aparece em inglês (a ser resolvido numa versão futura com base de dados própria)
- **App móvel** — por agora é web responsiva; app nativa está no roadmap

---

## Credenciais de demonstração (para uso no evento)

Cria as contas antes do evento para não perderes tempo no palco:

| Papel | Email sugerido | Password |
|---|---|---|
| Aprendiz demo | `demo.aprendiz@kombinu.ao` | `Kombinu2026!` |
| Criador demo | `demo.criador@kombinu.ao` | `Kombinu2026!` |

> Cria estas contas antes do evento e confirma que funcionam.

---

## Em caso de problema no evento

| Situação | O que fazer |
|---|---|
| Plataforma não carrega | Verifica a ligação à internet; o backend pode estar a reiniciar (Render tem cold start de ~30s) |
| Login falha | Aguarda 30 segundos e tenta novamente; pode ser cold start do servidor |
| Quiz não carrega | Volta ao Marketplace e abre o curso novamente |
| Erro ao gerar quiz com IA | A OpenTDB tem rate limit; aguarda 10 segundos e tenta novamente |

---

## A equipa que tornou isto possível

Este MVP foi construído pela equipa Kombinu em tempo recorde para o AngoTic 2026. Cada linha de código, cada design e cada decisão de produto teve um propósito: **mostrar que Angola também constrói tecnologia de impacto**.

Estamos prontos.

**— Equipa KOMBINU** 🇦🇴

---

*Documento interno · Versão AngoTic 2026 · Junho 2026*
