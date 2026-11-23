import type { LegalDoc } from "./types";

/**
 * Política de Privacidade e Proteção de Dados Pessoais — Versão 1.0 (Novembro de 2026).
 * Só a PARTE I é pública. A Parte II (requerimento e ficha técnica para a APD)
 * é um documento interno de submissão e NÃO deve ser publicada nesta página.
 * Limpeza feita: fórmulas LaTeX do original ($600Kza1.000Kz$, $<5MB/hora$, $70\%$) passadas a texto.
 */
export const PRIVACIDADE: LegalDoc = {
  slug: "privacidade",
  title: "Política de Privacidade e Proteção de Dados Pessoais",
  shortTitle: "Política de Privacidade",
  version: "Versão 1.0 (em conformidade com a Lei n.º 22/11, de 17 de Junho — Lei da Proteção de Dados Pessoais de Angola)",
  updated: "Novembro de 2026",
  framework: ["Lei n.º 22/11 (Proteção de Dados Pessoais)", "Agência de Proteção de Dados (APD)", "NIF 5002488787 · Matrícula GUE n.º 14619-25"],
  intro: [
    "A KOMBINU - PRESTAÇÃO DE SERVIÇOS, LDA. (doravante designada por «Kombinu», «Sociedade» ou «Nós») respeita a privacidade de todos os estudantes, docentes, criadores de conteúdos académicos, gestores corporativos, auditores e colaboradores que utilizam a nossa plataforma web e móvel.",
    "A presente Política de Privacidade e Proteção de Dados Pessoais foi elaborada em estrita conformidade com a Lei n.º 22/11, de 17 de Junho (Lei da Proteção de Dados Pessoais da República de Angola) e com as diretrizes da Agência de Proteção de Dados (APD), explicando de forma transparente como recolhemos, utilizamos, armazenamos, protegemos e partilhamos os seus dados pessoais.",
  ],
  summary: [
    { icon: "lock", title: "Não vendemos os teus dados", text: "A Kombinu não vende, não aluga nem comercializa dados pessoais. Só os partilha com quem é preciso para o serviço funcionar (pagamentos, alojamento).", ref: "sec-7" },
    { icon: "user", title: "Só o necessário", text: "Nome, telemóvel, e-mail, instituição e curso, e o teu desempenho nos quizzes. Nada de dados sensíveis como saúde, religião ou política.", ref: "sec-3" },
    { icon: "spark", title: "A IA não te identifica", text: "Para gerar quizzes, a IA recebe o conteúdo da matéria, não o teu telefone, e-mail ou NIF.", ref: "sec-5" },
    { icon: "mail", title: "Mensagens só com autorização", text: "Lembretes e promoções no WhatsApp, SMS ou e-mail dependem do teu consentimento, que podes retirar quando quiseres.", ref: "sec-4" },
    { icon: "shield", title: "Protegidos e cifrados", text: "Ligações cifradas (TLS 1.3), dados cifrados em repouso e acessos separados por perfil.", ref: "sec-8" },
    { icon: "users", title: "Os teus direitos", text: "Podes pedir acesso, correção, eliminação ou opor-te ao marketing. Escreve para privacidade@kombinu.com: resposta em até 15 dias úteis.", ref: "sec-10" },
  ],
  sections: [
    {
      id: "sec-1", number: "1", title: "Identificação do responsável pelo tratamento de dados",
      blocks: [
        { type: "p", text: "Para os efeitos previstos na alínea d) do Artigo 5.º da Lei n.º 22/11, a entidade responsável pelo tratamento dos dados pessoais recolhidos diretamente na plataforma é:" },
        {
          type: "facts", items: [
            { label: "Denominação Social", value: "KOMBINU - PRESTAÇÃO DE SERVIÇOS, LDA." },
            { label: "Número de Identificação Fiscal (NIF)", value: "5002488787" },
            { label: "Matrícula no Registo Comercial (GUE)", value: "n.º 14619-25" },
            { label: "Sede Social", value: "Bairro Morro Bento, Município da Samba, Luanda, República de Angola" },
            { label: "Canal Oficial de Privacidade e Encarregado de Proteção de Dados (DPO)", value: "privacidade@kombinu.com / suporte@kombinu.com / +244 958 568 364" },
          ],
        },
      ],
    },
    {
      id: "sec-2", number: "2", title: "Âmbito de aplicação e duplo papel jurídico da Kombinu (B2C vs. B2B)",
      blocks: [
        { type: "p", text: "A plataforma Kombinu opera através de duas vertentes distintas, assumindo enquadramentos jurídicos específicos perante a Lei n.º 22/11:" },
        {
          type: "list", ordered: true, items: [
            { title: "Vertente Académica e Marketplace de Conteúdos (B2C — Estudantes e Criadores)", text: "Quando um estudante universitário, aluno do ensino médio, professor ou criador independente cria uma conta pessoal na Kombinu para realizar sprints de exames, adquirir passes por cadeira (Sachet Pricing) ou publicar materiais no Marketplace, a Kombinu atua na qualidade de **Responsável pelo Tratamento** (Data Controller, nos termos do Artigo 5.º, alínea d) da Lei n.º 22/11)." },
            { title: "Vertente Corporativa e Institucional Multi-Tenant (B2B — Empresas e Instituições de Ensino)", text: "Quando uma empresa (banco, seguradora, operadora de telecomunicações, empresa de logística/energia) ou instituição de ensino contrata um espaço isolado na plataforma (Ambiente Multi-Tenant B2B) para treinar e auditar os seus trabalhadores ou alunos em normas internas e regulatórias (BNA, IGT, LGT, HSE), a Instituição/Empresa Cliente é a Responsável pelo Tratamento e a Kombinu atua exclusivamente na qualidade de **Subcontratante** (Data Processor, nos termos da alínea e) do Artigo 5.º e dos Artigos 29.º e 30.º da Lei n.º 22/11), regendo-se adicionalmente pelo Acordo de Subcontratação e Processamento de Dados (/subcontratacao)." },
          ],
        },
      ],
    },
    {
      id: "sec-3", number: "3", title: "Categorias de dados pessoais que recolhemos",
      blocks: [
        { type: "p", text: "Em obediência ao Princípio da Adequação, Pertinência e Não-Excessividade (Artigo 6.º, n.º 1, alínea c) da Lei n.º 22/11), recolhemos apenas os dados estritamente necessários para a prestação dos nossos serviços:" },
        {
          type: "cards", items: [
            { title: "A. Estudantes (B2C)", fields: [
              { label: "Dados pessoais recolhidos", value: "Nome completo, número de telemóvel (associado a autenticação e WhatsApp/Multicaixa Express), endereço de correio eletrónico, instituição de ensino (ex.: UAN, UCAN, UGS, ISAF, ISPTEC), faculdade/curso, ano curricular e disciplinas inscritas." },
              { label: "Origem dos dados", value: "Fornecidos diretamente pelo titular no ato de registo." },
            ] },
            { title: "B. Criadores e Curadores do Marketplace (B2C)", fields: [
              { label: "Dados pessoais recolhidos", value: "Dados de perfil académico, Número de Identificação Fiscal (NIF) ou Bilhete de Identidade (para validação de autoria e emissão de comprovativos de liquidação), coordenadas bancárias (IBAN) ou número associado ao Multicaixa Express para recebimento de comissões (70%)." },
              { label: "Origem dos dados", value: "Fornecidos diretamente pelo criador ao ativar a conta de vendedor no Marketplace." },
            ] },
            { title: "C. Colaboradores, Gestores e Auditores Corporativos (B2B)", fields: [
              { label: "Dados pessoais recolhidos", value: "Nome profissional, endereço de e-mail corporativo, identificador de departamento/equipa, cargo funcional, identificador da organização (Tenant ID) e registos de conclusão e pontuação em campanhas e auditorias de conformidade." },
              { label: "Origem dos dados", value: "Carregados pela entidade empregadora (Cliente B2B) ou inseridos via convite corporativo." },
            ] },
            { title: "D. Dados de Desempenho Pedagógico e Gamificação", fields: [
              { label: "Dados pessoais recolhidos", value: "Respostas a quizzes, pontuações, taxas de acerto por tópico, tempo de resposta, streaks (dias de estudo), pontos de experiência (XP), posição em ligas/rankings inter-faculdades e histórico de sprints concluídos." },
              { label: "Origem dos dados", value: "Gerados automaticamente durante a interação do utilizador com as trilhas de estudo." },
            ] },
            { title: "E. Dados de Transação e Faturação", fields: [
              { label: "Dados pessoais recolhidos", value: "Histórico de passes adquiridos (Passe por Cadeira de 600 Kz a 1.000 Kz, Passe Semestral de 3.000 Kz ou Faturas B2B), referências de pagamento, data/hora da operação e NIF de faturação. Nota: A Kombinu não armazena números completos de cartões bancários nem códigos PIN do Multicaixa Express." },
              { label: "Origem dos dados", value: "Processados através do gateway oficial da EMIS / Multicaixa Express e sistema de faturação." },
            ] },
            { title: "F. Dados Técnicos e Telemetria Data-Lean", fields: [
              { label: "Dados pessoais recolhidos", value: "Endereço IP, tipo de dispositivo móvel/navegador, sistema operativo, registos de erros de execução (crash logs) e estado de sincronização da cache local (para garantir o consumo otimizado < 5 MB/hora)." },
              { label: "Origem dos dados", value: "Recolhidos automaticamente pelos servidores e workers de borda (Edge)." },
            ] },
          ],
        },
        { type: "callout", tone: "success", title: "Declaração expressa sobre dados sensíveis (Artigo 7.º da Lei n.º 22/11)", text: "A Kombinu NÃO recolhe nem trata dados pessoais sensíveis relativos a convicções filosóficas ou políticas, filiação partidária ou sindical, fé religiosa, vida privada, origem racial ou étnica, nem dados relativos à saúde ou vida sexual." },
      ],
    },
    {
      id: "sec-4", number: "4", title: "Finalidades e fundamentos de licitude do tratamento",
      blocks: [
        { type: "p", text: "Nos termos dos Artigos 10.º e 11.º da Lei n.º 22/11, o tratamento dos seus dados pessoais assenta nos seguintes fundamentos de licitude e finalidades determinadas:" },
        {
          type: "sub", title: "Execução de contrato ou diligências pré-contratuais (Artigo 11.º, alínea a)",
          blocks: [{
            type: "list", items: [
              { text: "Criar e gerir a sua conta de utilizador na plataforma Kombinu;" },
              { text: "Disponibilizar o acesso às 3 Trilhas de Aprendizado (Linear, Normal/Marketplace e Mista/Adaptativa) e aos sprints de preparação para frequências e exames;" },
              { text: "Processar o pagamento de passes académicos e licenças corporativas B2B, bem como liquidar os repasses financeiros aos criadores do Marketplace;" },
              { text: "Emitir relatórios e certificados de avaliação e conformidade corporativa nos ambientes B2B." },
            ],
          }],
        },
        {
          type: "sub", title: "Consentimento inequívoco do titular (Artigo 10.º)",
          blocks: [{
            type: "list", items: [
              { text: "Envio de notificações de estudo, lembretes de época de frequências/exames e alertas de ligas académicas via WhatsApp, SMS ou correio eletrónico (podendo o utilizador revogar este consentimento a qualquer momento);" },
              { text: "Participação visível em tabelas de classificação (Leaderboards e competições inter-faculdades)." },
            ],
          }],
        },
        {
          type: "sub", title: "Cumprimento de obrigação legal (Artigo 11.º, alínea b)",
          blocks: [{
            type: "list", items: [
              { text: "Emissão e conservação de faturas e registos contabilísticos e fiscais exigidos pela Administração Geral Tributária (AGT) da República de Angola;" },
              { text: "Geração de trilhas de auditoria (Audit Logs) para comprovação de formação obrigatória dos clientes B2B perante entidades reguladoras angolanas (tais como a Inspeção Geral do Trabalho — IGT, o Banco Nacional de Angola — BNA, a ARSEG e auditorias de Saúde, Segurança e Ambiente — HSE)." },
            ],
          }],
        },
        {
          type: "sub", title: "Prossecução de interesses legítimos do responsável (Artigo 11.º, alínea e)",
          blocks: [{
            type: "list", items: [
              { text: "Garantir a segurança cibernética da plataforma, prevenir fraudes em exames ou manipulações nas ligas gamificadas;" },
              { text: "Otimizar a compressão de pacotes de dados para assegurar um consumo inferior a 5 MB/hora nas redes móveis angolanas." },
            ],
          }],
        },
      ],
    },
    {
      id: "sec-5", number: "5", title: "Processamento por Inteligência Artificial e proteção de documentos",
      blocks: [
        { type: "p", text: "A Kombinu utiliza modelos avançados de Inteligência Artificial (através de APIs empresariais seguras) para converter sebentas académicas, provas passadas e manuais corporativos em quizzes interativos e adaptativos. Relativamente a este processamento, garantimos que:" },
        {
          type: "list", ordered: true, items: [
            { title: "Isolamento Estrito de Conteúdos B2B", text: "Os manuais internos, regulamentos de conformidade e documentos carregados por empresas clientes no ambiente Multi-Tenant são processados de forma estritamente isolada (tenant_id) e jamais são utilizados para treinar modelos públicos de Inteligência Artificial nem partilhados com outras organizações." },
            { title: "Minimização de Dados Pessoais em Prompts de IA", text: "O nosso validador sintático processa apenas o conteúdo pedagógico ou técnico dos documentos submetidos, não enviando dados de identificação pessoal dos estudantes ou colaboradores (como NIF, telefone ou e-mail) para os motores externos de geração de linguagem." },
            { title: "Supervisão Humana (Artigo 25.º da Lei n.º 22/11)", text: "Nenhuma decisão com efeitos jurídicos ou disciplinares sobre trabalhadores ou estudantes é tomada exclusivamente com base num tratamento automatizado sem possibilidade de revisão e validação pelo Gestor, Docente ou Auditor humano responsável." },
          ],
        },
      ],
    },
    {
      id: "sec-6", number: "6", title: "Armazenamento local (Offline-First / Data-Lean) e cookies",
      blocks: [
        { type: "p", text: "Para permitir que os estudantes e trabalhadores em Angola estudem mesmo em zonas com conectividade instável e com baixíssimo consumo de dados móveis (< 5 MB/hora):" },
        {
          type: "list", items: [
            { text: "A aplicação Kombinu utiliza tecnologias de armazenamento local no seu dispositivo (IndexedDB, LocalStorage e Service Workers) para guardar temporariamente os quizzes ativos e sincronizar o seu progresso de forma assíncrona assim que a ligação for restabelecida;" },
            { text: "Utilizamos apenas Cookies Estritamente Necessários (para manter a sua sessão autenticada de forma segura via JSON Web Tokens — JWT) e Cookies Analíticos de Desempenho (para medir a velocidade de carregamento e estabilidade dos ecrãs). Não utilizamos cookies de rastreamento publicitário invasivo de terceiros." },
          ],
        },
      ],
    },
    {
      id: "sec-7", number: "7", title: "Partilha de dados e transferência internacional (Artigos 33.º e 34.º)",
      blocks: [
        { type: "callout", tone: "success", text: "A Kombinu **não vende, não aluga nem comercializa** dados pessoais a terceiros." },
        { type: "p", text: "Os seus dados apenas são partilhados, na medida do estritamente necessário, com as seguintes categorias de destinatários e subcontratantes técnicos:" },
        {
          type: "list", ordered: true, items: [
            { title: "Operadores de Pagamentos Nacionais", text: "EMIS (Empresa Interbancária de Serviços — Multicaixa Express) e instituições bancárias angolanas, exclusivamente para validação e liquidação de pagamentos em Kwanzas (AOA);" },
            { title: "Provedores de Infraestrutura em Nuvem e Segurança de Borda (Cloud & Edge)", text: "Serviços de alojamento de base de dados encriptada, distribuição de conteúdo (Cloudflare Workers / Edge Network) e APIs empresariais de processamento sintático;" },
            { title: "Entidade Empregadora ou Instituição de Ensino (apenas no modo B2B)", text: "Caso aceda à Kombinu através de uma conta corporativa ou escolar fornecida pela sua instituição, os gestores e auditores autorizados do seu Tenant terão acesso aos seus relatórios de progresso, pontuações e prazos de conclusão de campanhas internas." },
          ],
        },
        { type: "p", text: "Sempre que o alojamento em nuvem ou o processamento técnico envolva o fluxo de dados para servidores situados fora do território da República de Angola, a Kombinu assegura o cumprimento dos Artigos 33.º e 34.º da Lei n.º 22/11, selecionando exclusivamente infraestruturas certificadas segundo normas internacionais de segurança (ISO/IEC 27001, SOC 2 Type II) e vinculadas por cláusulas contratuais de confidencialidade, encriptação ponta-a-ponta e proteção equivalente à exigida pela legislação angolana." },
      ],
    },
    {
      id: "sec-8", number: "8", title: "Medidas técnicas e organizativas de segurança (Artigos 30.º e 31.º)",
      blocks: [
        { type: "p", text: "Para proteger os seus dados pessoais contra a destruição acidental ou ilícita, a perda, a alteração, a difusão ou o acesso não autorizado, a Kombinu implementa rigorosas medidas de segurança, incluindo:" },
        {
          type: "list", items: [
            { title: "Isolamento Lógico Multi-Tenant (Row-Level Security)", text: "Segregação rigorosa na base de dados através de chaves tenant_id verificadas em cada requisição autenticada;" },
            { title: "Encriptação em Trânsito e em Repouso", text: "Todas as comunicações entre o seu dispositivo e os nossos servidores são encriptadas via protocolo TLS 1.3 (HTTPS) e as bases de dados e credenciais são encriptadas em repouso (AES-256 e hashing criptográfico de palavras-passe);" },
            { title: "Controlo de Acesso Baseado em Perfis (RBAC)", text: "Segregação estrita entre perfis de Estudante, Criador, Colaborador, Gestor, Auditor e Administrador, garantindo que cada utilizador acede apenas aos ecrãs e dados autorizados para a sua função;" },
            { title: "Acordos de Confidencialidade (NDA)", text: "Todos os engenheiros e colaboradores da Kombinu encontram-se legalmente vinculados por cláusulas de sigilo profissional e proteção de dados nos termos do Artigo 31.º da Lei n.º 22/11." },
          ],
        },
      ],
    },
    {
      id: "sec-9", number: "9", title: "Prazos de conservação dos dados",
      blocks: [
        { type: "p", text: "Os dados pessoais são conservados apenas durante o período necessário para as finalidades que motivaram a sua recolha:" },
        {
          type: "list", items: [
            { title: "Contas de Estudantes e Criadores (B2C)", text: "Enquanto a conta permanecer ativa. Caso a conta fique inativa por um período contínuo superior a 24 (vinte e quatro) meses, os dados pessoais serão anonimizados ou eliminados após notificação prévia ao titular;" },
            { title: "Dados de Clientes Corporativos (B2B)", text: "Durante a vigência do contrato de licenciamento SaaS. Após o termo do contrato, os dados são devolvidos ou exportados para o Cliente B2B e definitivamente eliminados dos servidores ativos num prazo máximo de 60 (sessenta) dias, salvo obrigação legal em contrário;" },
            { title: "Dados Fiscais e de Faturação", text: "Conservados pelo prazo legal obrigatório de 5 (cinco) a 10 (dez) anos exigido pela legislação comercial e tributária angolana (AGT)." },
          ],
        },
      ],
    },
    {
      id: "sec-10", number: "10", title: "Direitos dos titulares dos dados e como exercê-los (Artigos 21.º a 26.º)",
      blocks: [
        { type: "p", text: "Nos termos da Lei da Proteção de Dados Pessoais de Angola, assistem a todos os utilizadores os seguintes direitos:" },
        {
          type: "list", ordered: true, items: [
            { title: "Direito de Informação e Acesso (Artigos 21.º e 22.º)", text: "Obter confirmação sobre se os seus dados pessoais são tratados pela Kombinu e receber cópia das informações registadas;" },
            { title: "Direito de Retificação e Atualização (Artigo 22.º)", text: "Solicitar a correção de dados inexatos, incompletos ou desatualizados (podendo também atualizá-los diretamente nas definições do seu perfil);" },
            { title: "Direito de Apagamento / Eliminação (Artigo 22.º)", text: "Solicitar a eliminação da sua conta e dos seus dados pessoais quando deixem de ser necessários para a finalidade da recolha, sem prejuízo dos prazos legais de retenção fiscal;" },
            { title: "Direito de Oposição (Artigo 24.º)", text: "Opor-se a qualquer momento ao tratamento dos seus dados para fins de comunicações de marketing ou notificações promocionais;" },
            { title: "Direito de Reclamação", text: "Apresentar reclamação diretamente à Kombinu ou junto da autoridade nacional competente, a Agência de Proteção de Dados de Angola (APD)." },
          ],
        },
        {
          type: "sub", title: "Como exercer os seus direitos",
          blocks: [
            { type: "p", text: "Basta enviar um pedido escrito para o correio eletrónico privacidade@kombinu.com com o assunto «Exercício de Direitos — Lei n.º 22/11». A nossa equipa responderá ao seu pedido no prazo máximo de 15 (quinze) dias úteis." },
            { type: "callout", tone: "info", title: "Colaboradores de clientes B2B", text: "Se for colaborador de uma empresa cliente B2B, os pedidos de alteração ou eliminação de registos de formação corporativa deverão ser encaminhados ao Administrador/RH da sua própria organização, na qualidade de Responsável pelo Tratamento." },
          ],
        },
      ],
    },
  ],
};
