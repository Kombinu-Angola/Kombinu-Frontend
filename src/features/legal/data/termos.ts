import type { LegalDoc } from "./types";

/**
 * Termos e Condições Gerais de Uso — Versão 3.0 (12 de Novembro de 2026).
 * Transcrição fiel do documento aprovado. Só a apresentação foi normalizada
 * (títulos em minúsculas, listas estruturadas). Não alterar o texto sem o jurídico.
 */
export const TERMOS: LegalDoc = {
  slug: "termos",
  title: "Termos e Condições Gerais de Uso da Plataforma e do Marketplace Kombinu",
  shortTitle: "Termos e Condições",
  version: "Versão 3.0 (Pós-Pivot Sachet Pricing, Marketplace de Criadores & SaaS Multi-Tenant)",
  updated: "12 de Novembro de 2026",
  framework: [
    "Lei n.º 23/11 (Comunicações Eletrónicas e Serviços da Sociedade da Informação)",
    "Lei n.º 15/14 (Direitos de Autor e Conexos)",
    "Lei n.º 15/03 (Defesa do Consumidor)",
    "Lei n.º 22/11 (Proteção de Dados Pessoais — APD)",
    "Código Civil da República de Angola",
  ],
  summary: [
    { icon: "user", title: "A conta é só tua", text: "Cada conta e cada passe são individuais. Partilhar o acesso ou o código OTP pode levar ao bloqueio, sem reembolso.", ref: "sec-4" },
    { icon: "users", title: "Menores de 18", text: "Entre os 14 e os 17 anos, as funcionalidades pagas precisam da autorização dos pais ou do encarregado.", ref: "sec-4" },
    { icon: "wallet", title: "Pagamentos em Kwanzas", text: "Pagas por Multicaixa Express, Referência Multicaixa ou transferência. O conteúdo abre logo que a EMIS confirma.", ref: "sec-5" },
    { icon: "refresh", title: "Quando há reembolso", text: "Depois de abrires um material ou começares um quiz, não há reembolso. Há exceções: cobrança duplicada, falha de mais de 24 h na semana da prova, material defeituoso ou cancelamento em 48 h sem qualquer acesso.", ref: "sec-6" },
    { icon: "store", title: "Criadores: 70% para ti", text: "Em cada venda ficas com 70% e a plataforma com 30%. Podes levantar a partir de 5.000 Kz, depois de 7 dias de garantia.", ref: "sec-7" },
    { icon: "shield", title: "Só publicas o que é teu", text: "É proibido publicar livros, slides de professores sem autorização ou provas sob sigilo. Denúncias são tratadas em 24 a 48 h.", ref: "sec-8" },
    { icon: "bolt", title: "Fair play nas ligas", text: "Bots, mexer na cache offline ou usar contas falsas anula o XP e pode banir a conta.", ref: "sec-9" },
    { icon: "spark", title: "A IA ajuda, não garante", text: "O conteúdo gerado por IA pode ter imprecisões. A Kombinu complementa as aulas e não garante aprovação.", ref: "sec-10" },
  ],
  sections: [
    {
      id: "sec-1", number: "1", title: "Identificação da entidade operadora",
      blocks: [
        { type: "p", text: "A plataforma digital KOMBINU (acessível via aplicação web progressiva — PWA, aplicações móveis e subdomínios institucionais) é propriedade exclusiva e operada por:" },
        {
          type: "facts", items: [
            { label: "Denominação Social", value: "KOMBINU - PRESTAÇÃO DE SERVIÇOS, LDA." },
            { label: "Número de Identificação Fiscal (NIF)", value: "5002488787" },
            { label: "Matrícula Comercial (Guiché Único da Empresa — GUE)", value: "n.º 14619-25 (registada em 29 de Abril de 2025)" },
            { label: "Sede Social", value: "Bairro Morro Bento, Distrito Urbano da Samba, Município de Luanda, Província de Luanda, República de Angola" },
            { label: "Registos de Propriedade Intelectual", value: "SENADIAC n.º 4.103/2025 (Marketplace de Conteúdos Gamificados) e n.º 3.973/2025 (Sistema Offline de E-Learning Gramática); Marca Nacional IAPI Processo n.º 92679 (AO/T/2025/092679)" },
            { label: "Canal Oficial de Suporte e Assuntos Jurídicos", value: "suporte@kombinu.com | juridico@kombinu.com | +244 958 568 364" },
          ],
        },
      ],
    },
    {
      id: "sec-2", number: "2", title: "Objeto, âmbito de aplicação e aceitação eletrónica",
      blocks: [
        { type: "sub", number: "2.1", title: "Objeto", blocks: [{ type: "p", text: "Os presentes Termos e Condições Gerais de Uso («Termos») regulam o acesso, registo, navegação, aquisição de passes de estudo, utilização de ferramentas de Inteligência Artificial, participação em ligas gamificadas e comercialização de materiais didáticos no ecossistema tecnológico Kombinu." }] },
        { type: "sub", number: "2.2", title: "Vinculação jurídica", blocks: [{ type: "p", text: "Ao criar uma conta, clicar em «Aceito os Termos e Condições», efetuar um pagamento via Multicaixa Express ou submeter qualquer conteúdo na plataforma, o Utilizador celebra um contrato eletrónico juridicamente vinculativo com a KOMBINU, LDA., nos termos da Lei n.º 23/11, de 20 de Junho, e do Código Civil Angolano." }] },
        {
          type: "sub", number: "2.3", title: "Articulação com outros instrumentos regulatórios",
          blocks: [{
            type: "list", items: [
              { text: "O tratamento de dados pessoais rege-se pela Política de Privacidade e Proteção de Dados (/privacidade), elaborada ao abrigo da Lei n.º 22/11." },
              { text: "Para clientes empresariais, bancos, seguradoras e instituições de ensino que contratem o ambiente corporativo isolado (Kombinu Corporate / B2B), estes Termos aplicam-se de forma subsidiária ao respetivo Contrato de Licenciamento SaaS B2B e ao Acordo de Processamento e Subcontratação de Dados (/subcontratacao)." },
            ],
          }],
        },
      ],
    },
    {
      id: "sec-3", number: "3", title: "Arquitetura da plataforma e perfis de utilizador",
      blocks: [
        {
          type: "sub", number: "3.1", title: "Perfis de utilizador",
          blocks: [{
            type: "list", ordered: true, items: [
              { title: "Estudante / Utilizador B2C", text: "Estudante do ensino superior, ensino médio (II Ciclo) ou candidato a exames de admissão/certificação que utiliza a plataforma para estudo ativo, resolução de quizzes e preparação intensiva para provas (Sprint de Exame)." },
              { title: "Criador de Conteúdo («Aluno Nota 9», Monitor, Docente ou Especialista)", text: "Utilizador verificado que estrutura, publica e comercializa resumos originais, sebentas comentadas, flashcards e bancos de questões no Marketplace da Kombinu." },
              { title: "Utilizador Institucional (B2B)", text: "Colaborador, gestor ou auditor vinculado ao ambiente privado (Tenant) de uma empresa ou instituição de ensino parceira." },
            ],
          }],
        },
        {
          type: "sub", number: "3.2", title: "As três trilhas de aprendizagem da Kombinu",
          blocks: [{
            type: "list", items: [
              { title: "Trilha de Aprendizado Linear", text: "Percursos estruturados por cadeira, módulo ou programa oficial (MESCTI / MED / Certificações Profissionais)." },
              { title: "Trilha Normal (Marketplace de Conteúdos)", text: "Acesso a resumos práticos, guias de estudo e simulados criados por estudantes de excelência e especialistas locais." },
              { title: "Trilha Mista e Adaptativa (Motor de IA)", text: "Geração dinâmica de quizzes interativos, revisão espaçada e diagnóstico de lacunas com base no histórico de erros do estudante." },
            ],
          }],
        },
      ],
    },
    {
      id: "sec-4", number: "4", title: "Elegibilidade, registo e segurança da conta",
      blocks: [
        { type: "sub", number: "4.1", title: "Capacidade etária", blocks: [{ type: "p", text: "O registo autónomo com transações financeiras destina-se a cidadãos com idade igual ou superior a 18 (dezoito) anos. Estudantes com idade compreendida entre os 14 e os 17 anos (Ensino Médio / II Ciclo) apenas podem utilizar funcionalidades pagas mediante autorização expressa dos seus pais ou representantes legais." }] },
        { type: "sub", number: "4.2", title: "Veracidade dos dados", blocks: [{ type: "p", text: "O Utilizador compromete-se a fornecer dados exatos, completos e atualizados (nome completo, número de telemóvel registado em Angola, endereço de correio eletrónico, instituição de ensino e, no caso de Criadores, NIF e coordenadas bancárias IBAN/Multicaixa Express tituladas em seu próprio nome)." }] },
        {
          type: "sub", number: "4.3", title: "Uso pessoal e intransmissível (proibição de partilha de conta)",
          blocks: [
            { type: "p", text: "Cada conta e cada Passe de Estudo são estritamente individuais. É expressamente proibida a partilha de credenciais de acesso (login/password ou código OTP) entre múltiplos estudantes ou a utilização simultânea da mesma conta em dispositivos distintos para contornar o pagamento de licenças individuais." },
            { type: "callout", tone: "warning", text: "A deteção de sessões concorrentes anómalas implicará o bloqueio imediato do acesso sem direito a reembolso." },
          ],
        },
      ],
    },
    {
      id: "sec-5", number: "5", title: "Modalidades comerciais B2C, preços em sachet e pagamentos (Multicaixa Express)",
      blocks: [
        {
          type: "sub", number: "5.1", title: "Planos e modalidades de acesso B2C",
          blocks: [{
            type: "list", ordered: true, items: [
              { title: "Acesso Gratuito (Freemium)", text: "Permite o registo na plataforma, realização de diagnóstico inicial e acesso a uma amostra limitada de questões diárias." },
              { title: "Passe por Cadeira / Sprint de Exame (Sachet Pricing)", text: "Desbloqueio integral de quizzes gerados por IA, simulados de época e modo offline (Data-Lean) para uma disciplina específica durante o ciclo de avaliação (Frequência, Exame Normal ou Recurso), com valores compreendidos entre 600 AOA (seiscentos Kwanzas) e 1.000 AOA (mil Kwanzas) por cadeira, conforme tabela afixada no ecrã de compra." },
              { title: "Passe Semestral Universitário", text: "Acesso alargado às disciplinas do semestre letivo do estudante pelo valor de referência de 3.000 AOA (três mil Kwanzas) por semestre." },
              { title: "Compras Avulsas no Marketplace", text: "Aquisição de resumos específicos, sebentas estruturadas ou pacotes de exames comentados publicados por Criadores, pelo preço individual fixado na vitrine do Marketplace." },
            ],
          }],
        },
        {
          type: "sub", number: "5.2", title: "Processamento de pagamentos em Kwanzas (AOA)",
          blocks: [{
            type: "list", items: [
              { text: "Todos os preços são expressos e liquidados exclusivamente em moeda nacional (Kwanza — AOA), incluindo os impostos legalmente devidos." },
              { text: "Os pagamentos são processados em tempo real através do Gateway de Pagamentos Online (GPO) do Multicaixa Express (EMIS), por Referência Multicaixa ou por transferência bancária verificada para a conta corporativa da KOMBINU, LDA." },
              { text: "A libertação do conteúdo ocorre imediatamente após a confirmação eletrónica de liquidação emitida pela rede EMIS." },
            ],
          }],
        },
      ],
    },
    {
      id: "sec-6", number: "6", title: "Política de reembolso, cancelamento e direito de livre resolução",
      blocks: [
        { type: "sub", number: "6.1", title: "Natureza de consumo imediato dos conteúdos digitais (Sprint de Exame)", blocks: [{ type: "p", text: "Em conformidade com a Lei n.º 15/03, de 22 de Julho (Lei de Defesa do Consumidor), o Utilizador reconhece e aceita expressamente que os Passes por Cadeira (Sachet), Passes Semestrais e materiais do Marketplace constituem conteúdos digitais de acesso e consumo imediato, disponibilizados na totalidade (incluindo sincronização em cache local offline) no exato momento da confirmação do pagamento." }] },
        {
          type: "sub", number: "6.2", title: "Renúncia ao reembolso após desbloqueio ou uso efetivo",
          blocks: [
            { type: "p", text: "Uma vez confirmado o pagamento e verificado qualquer um dos seguintes eventos:" },
            {
              type: "list", ordered: true, marker: "alpha", items: [
                { text: "Abertura, leitura ou descarga para a cache local (offline) de qualquer resumo ou material do Marketplace; ou" },
                { text: "Início ou conclusão de pelo menos 1 (um) quiz / simulado pertencente ao Passe adquirido;" },
              ],
            },
            { type: "p", text: "o serviço considera-se efetivamente prestado e consumido, não havendo lugar a reembolso por desistência, arrependimento posterior à realização da prova académica ou insatisfação subjetiva com a nota obtida na instituição de ensino." },
          ],
        },
        {
          type: "sub", number: "6.3", title: "Situações elegíveis para reembolso integral (100%)",
          blocks: [
            { type: "p", text: "O Estudante terá direito ao reembolso integral do valor pago, ou à conversão em crédito na plataforma com bónus de 20%, exclusivamente nas seguintes hipóteses:" },
            {
              type: "list", ordered: true, items: [
                { title: "Cobrança Duplicada", text: "Débito em duplicado no Multicaixa Express para o mesmo Passe ou conteúdo, por falha de comunicação bancária/EMIS;" },
                { title: "Indisponibilidade Técnica Crítica", text: "Falha técnica comprovada imputável aos servidores da Kombinu que impeça o acesso ao conteúdo adquirido por período contínuo superior a 24 (vinte e quatro) horas durante a semana da prova académica;" },
                { title: "Erro Material ou Defeito Grave do Conteúdo do Marketplace", text: "Quando um material adquirido no Marketplace se apresente tecnicamente ilegível, corrompido ou manifestamente divergente da ementa anunciada pelo Criador;" },
                { title: "Cancelamento Antes do Primeiro Acesso", text: "Pedido de cancelamento efetuado no prazo máximo de 48 (quarenta e oito) horas após a compra, desde que o sistema registe zero acessos, zero descargas em cache e zero quizzes iniciados." },
              ],
            },
          ],
        },
        { type: "sub", number: "6.4", title: "Procedimento e prazo de estorno", blocks: [{ type: "p", text: "As solicitações de reembolso devem ser submetidas através do canal suporte@kombinu.com com o comprovativo de transação do Multicaixa Express. Após validação técnica (em até 72 horas úteis), o estorno financeiro será executado para o IBAN ou conta associada ao Multicaixa Express do Estudante no prazo máximo de 10 (dez) dias úteis." }] },
      ],
    },
    {
      id: "sec-7", number: "7", title: "Regras do Marketplace de Criadores, comissão de 30% e liquidação financeira",
      blocks: [
        { type: "sub", number: "7.1", title: "Estatuto de Criador independente", blocks: [{ type: "p", text: "Os estudantes («Alunos Nota 9»), monitores, docentes e especialistas que publicam materiais no Marketplace atuam como produtores de conteúdo independentes, não existindo qualquer vínculo laboral (Lei n.º 12/23) ou mandato de representação legal entre o Criador e a KOMBINU, LDA." }] },
        {
          type: "sub", number: "7.2", title: "Repartição de receitas (Revenue Share 70% / 30%)",
          blocks: [
            { type: "p", text: "Por cada venda de conteúdo avulso ou pacote didático concretizada e liquidada no Marketplace, aplica-se a seguinte repartição sobre o Valor Bruto de Venda:" },
            {
              type: "list", items: [
                { title: "30% (trinta por cento) — Comissão da Plataforma (Take Rate da Kombinu)", text: "Remunera a infraestrutura tecnológica, armazenamento em nuvem, motor de conversão em quizzes, custos de processamento do gateway Multicaixa Express (EMIS), segurança anti-pirataria e divulgação orgânica na plataforma." },
                { title: "70% (setenta por cento) — Receita Líquida do Criador", text: "Pertence ao Criador autor do material, sendo creditada na sua carteira virtual (Creator Wallet) dentro do painel da plataforma." },
              ],
            },
          ],
        },
        {
          type: "sub", number: "7.3", title: "Período de garantia (Escrow), saque mínimo e liquidação via Multicaixa Express / IBAN",
          blocks: [{
            type: "list", ordered: true, items: [
              { title: "Período de Retenção Preventiva (Escrow)", text: "Os valores das vendas permanecem em saldo cativo durante 7 (sete) dias corridos após a compra, para cobrir eventuais reclamações técnicas de estudantes ou denúncias de violação de direitos de autor." },
              { title: "Limiar Mínimo de Levantamento", text: "O Criador pode solicitar a transferência do seu saldo disponível sempre que este atinja o montante mínimo acumulado de 5.000 AOA (cinco mil Kwanzas)." },
              { title: "Ciclo e Meio de Pagamento", text: "Os pagamentos aos Criadores são processados quinzenalmente (nos dias 5 e 20 de cada mês útil) por transferência bancária (IBAN nacional) ou transferência direta Multicaixa Express para a conta titulada pelo próprio Criador." },
              { title: "Conformidade Fiscal (AGT)", text: "Sempre que exigido pela legislação tributária angolana vigente (Imposto sobre os Rendimentos do Trabalho — Grupo B/C ou regime de retenção na fonte), a Kombinu efetuará a retenção fiscal aplicável e emitirá o respetivo comprovativo declarativo ao Criador." },
            ],
          }],
        },
      ],
    },
    {
      id: "sec-8", number: "8", title: "Direitos de autor sobre resumos, proibição de pirataria editorial e Notice & Takedown (Lei n.º 15/14)",
      blocks: [
        {
          type: "sub", number: "8.1", title: "Titularidade e originalidade dos conteúdos submetidos",
          blocks: [
            { type: "p", text: "Ao submeter qualquer resumo, apontamento estruturado, sebenta ou banco de questões através do ecrã Compositor, o Criador declara e garante, sob compromisso de honra e responsabilidade civil e criminal nos termos da Lei n.º 15/14, de 31 de Julho (Lei dos Direitos de Autor e Direitos Conexos):" },
            {
              type: "list", items: [
                { text: "Que é o autor intelectual original da obra ou detém autorização expressa por escrito para a sua exploração comercial;" },
                { text: "Que o material resulta da sua própria síntese académica, explicação e estruturação pedagógica." },
              ],
            },
          ],
        },
        {
          type: "sub", number: "8.2", title: "Proibição absoluta de pirataria editorial e violação de sigilo académico",
          blocks: [
            { type: "p", text: "É estritamente proibido publicar, carregar (upload) ou comercializar na Kombinu:" },
            {
              type: "list", ordered: true, items: [
                { title: "Livros e Obras Editoriais Protegidas", text: "Cópias integrais ou parciais, digitalizações (scans), fotografias ou ficheiros PDF de livros publicados por editoras nacionais ou internacionais, manuais escolares protegidos ou artigos científicos pagos sem licença aberta;" },
                { title: "Materiais Privados de Docentes e Instituições", text: "Slides, apostilas fechadas ou sebentas de autoria exclusiva de professores universitários ou centros de formação sem o seu consentimento expresso;" },
                { title: "Provas sob Sigilo Oficial", text: "Enunciados de frequências ou exames futuros obtidos de forma ilícita antes da sua realização oficial." },
              ],
            },
            { type: "callout", tone: "info", title: "Nota", text: "É permitida a publicação de resoluções comentadas e explicações passo a passo elaboradas pelo próprio Criador sobre exames de anos anteriores que já sejam de domínio público estudantil." },
          ],
        },
        {
          type: "sub", number: "8.3", title: "Licença de distribuição e transformação concedida à Kombinu",
          blocks: [
            { type: "p", text: "Ao publicar um conteúdo no Marketplace, o Criador conserva os seus direitos morais de paternidade (crédito de autoria visível no material), mas concede à KOMBINU, LDA. uma licença mundial, não exclusiva, comercial e isenta de royalties adicionais (além da repartição 70/30 prevista na Cláusula 7.2) para:" },
            {
              type: "list", items: [
                { text: "Hospedar, comprimir, cifrar para cache offline e distribuir o material aos utilizadores pagantes;" },
                { text: "Processar o texto através do motor de Inteligência Artificial da Kombinu para gerar automaticamente flashcards, quizzes adaptativos e resumos de áudio/micro-aprendizagem associados àquele módulo." },
              ],
            },
          ],
        },
        {
          type: "sub", number: "8.4", title: "Procedimento de denúncia e remoção rápida (Notice & Takedown)",
          blocks: [
            { type: "p", text: "Qualquer titular de direitos de autor, docente, editora ou instituição de ensino que identifique material que infrinja a Lei n.º 15/14 pode notificar o canal juridico@kombinu.com indicando o link do conteúdo e prova de titularidade. A Kombinu compromete-se a:" },
            {
              type: "list", ordered: true, items: [
                { text: "Suspender cautelarmente a exibição do conteúdo denunciado no prazo máximo de 24 (vinte e quatro) a 48 (quarenta e oito) horas;" },
                { text: "Congelar o saldo gerado por esse conteúdo na carteira do Criador;" },
                { text: "Em caso de confirmação de plágio ou pirataria editorial, eliminar definitivamente o ficheiro, estornar os valores e banir permanentemente a conta do Criador infrator, respondendo este integralmente por quaisquer indemnizações reclamadas por terceiros." },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "sec-9", number: "9", title: "Ligas universitárias, gamificação e regras anti-fraude (Fair Play)",
      blocks: [
        { type: "sub", number: "9.1", title: "Mecânica de pontuação e ligas", blocks: [{ type: "p", text: "A Kombinu utiliza elementos de gamificação (Pontos de Experiência — XP, Ofensivas Diárias — Streaks, Medalhas e Ligas Inter-Faculdades/Inter-Turmas) para estimular a consistência de estudo. Eventuais prémios, bolsas de mérito, descontos ou recompensas físicas atribuídos aos vencedores das Ligas constituem prémios de mérito académico e desempenho cognitivo, e não jogos de fortuna ou azar." }] },
        {
          type: "sub", number: "9.2", title: "Condutas de fraude e manipulação algorítmica proibidas",
          blocks: [
            { type: "p", text: "Para garantir a justiça competitiva entre todos os estudantes, é estritamente proibido:" },
            {
              type: "list", ordered: true, items: [
                { title: "Automação e Bots", text: "Utilizar scripts, extensões de navegador, macros ou cliques automatizados (auto-clickers) para responder a quizzes em frações de segundo (speed-clicking);" },
                { title: "Manipulação da Cache Offline", text: "Inspecionar, alterar ou injetar dados falsos no armazenamento local do navegador (IndexedDB / LocalStorage) ou intercetar pacotes de sincronização da API para inflacionar artificialmente o saldo de XP ou o número de acertos;" },
                { title: "XP Farming e Conluio", text: "Repetir sistematicamente o mesmo quiz básico através de múltiplas contas falsas (sybil attack) ou combinar resultados em grupo para manipular o topo das tabelas de classificação (Leaderboards)." },
              ],
            },
          ],
        },
        {
          type: "sub", number: "9.3", title: "Auditoria de telemetria e penalizações",
          blocks: [
            { type: "p", text: "O motor antifraude da Kombinu audita continuamente o tempo médio de leitura por questão, padrões de latência e integridade criptográfica dos pacotes sincronizados a partir do modo offline. A deteção de anomalias resultará, sem aviso prévio:" },
            {
              type: "list", items: [
                { text: "Na anulação imediata do XP fraudulento (XP Reset);" },
                { text: "Na desclassificação automática da Liga vigente e perda do direito a qualquer prémio ou certificado;" },
                { text: "Na suspensão ou banimento definitivo da conta em caso de reincidência." },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "sec-10", number: "10", title: "Engenharia Data-Lean, uso de Inteligência Artificial e limitação de responsabilidade",
      blocks: [
        { type: "sub", number: "10.1", title: "Funcionamento em modo Data-Lean (< 5 MB/hora) e cache local", blocks: [{ type: "p", text: "A plataforma foi engenheirada para consumir menos de 5 MB de dados móveis por hora em modo de estudo interativo e permitir a resolução de quizzes sem ligação ativa à Internet. Os ficheiros guardados em cache no dispositivo do estudante são cifrados, temporários e expiram automaticamente no termo da validade do Passe adquirido, sendo proibida a sua extração, engenharia reversa ou redistribuição externa (em grupos de WhatsApp, Telegram ou impressões comerciais)." }] },
        {
          type: "sub", number: "10.2", title: "Isenção de garantia sobre resultados académicos e conteúdos gerados por IA",
          blocks: [{
            type: "list", items: [
              { text: "A Kombinu utiliza modelos avançados de Inteligência Artificial para estruturar questões, explicações passo a passo e diagnósticos de estudo. Embora submetidos a filtros de validação sintática e curadoria, os conteúdos gerados por IA podem ocasionalmente conter imprecisões teóricas ou divergências de interpretação doutrinária." },
              { text: "A plataforma constitui uma ferramenta complementar de treino e produtividade estudantil, não substituindo as aulas oficiais, a bibliografia obrigatória das faculdades nem as diretrizes oficiais do MESCTI, MED, BNA ou IGT. A KOMBINU, LDA. não garante a aprovação automática em exames, concursos públicos ou avaliações de desempenho." },
            ],
          }],
        },
      ],
    },
    {
      id: "sec-11", number: "11", title: "Disponibilidade do serviço, alterações e foro competente",
      blocks: [
        { type: "sub", number: "11.1", title: "Disponibilidade e força maior", blocks: [{ type: "p", text: "A Kombinu envida todos os esforços técnicos para assegurar uma disponibilidade superior a 99,5%, mas não poderá ser responsabilizada por interrupções decorrentes de falhas gerais nas redes de telecomunicações móveis em Angola, cortes no fornecimento de energia elétrica, indisponibilidade temporária da rede interbancária EMIS ou manutenções preventivas programadas." }] },
        { type: "sub", number: "11.2", title: "Atualizações dos Termos", blocks: [{ type: "p", text: "A Kombinu reserva-se o direito de atualizar estes Termos para refletir melhorias no produto ou alterações legislativas, notificando os utilizadores registados com antecedência mínima de 10 (dez) dias antes da entrada em vigor das novas disposições." }] },
        { type: "sub", number: "11.3", title: "Lei aplicável e foro", blocks: [{ type: "p", text: "Os presentes Termos regem-se integralmente pelas leis da República de Angola. Para a resolução de qualquer litígio emergente da interpretação ou execução deste instrumento, quando não solucionado por via amigável em até 15 (quinze) dias, fica designado o Foro do Tribunal da Comarca de Luanda, com expressa renúncia a qualquer outro." }] },
      ],
    },
  ],
  signoff: ["KOMBINU - PRESTAÇÃO DE SERVIÇOS, LDA.", "A Gerência Executiva — Luanda, República de Angola"],
};
