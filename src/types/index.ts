/**
 * Definições de tipos TypeScript para toda a aplicação
 * Centraliza todas as interfaces e tipos para facilitar manutenção
 */

// Tipos relacionados ao usuário




export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  tipo: 'criador' | 'aprendiz';
}
/** Pertença activa a uma organização (escola); `organizacaoId` é o UUID enviado em `X-Workspace`. */
export interface Membership {
  organizacaoId: string;
  nome: string;
  codigo: string;
  papel: 'student' | 'teacher' | 'admin';
}

export interface Usuario {
  id: string;
  nome: string;
  /** `null` nas contas institucionais sem email real. */
  email: string | null;
  memberships?: Membership[];
  mustChangePassword?: boolean;
  tipo: 'criador' | 'aprendiz' | 'admin';
  pontos: number;
  nivel: number;
  avatar?: string;
  dataCriacao: Date;
}

// Tipos relacionados ao conteúdo
export interface Conteudo {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  criadorId: string;
  criadorNome: string;
  tipo: 'texto' | 'video' | 'quiz';
  conteudo: string;
  quiz?: Pergunta[];
  visualizacoes: number;
  likes: number;
  dataCriacao: Date;
  tempoEstimado: number;
  dificuldade: 'facil' | 'medio' | 'dificil';
  tags: string[];
  publico: boolean;
}

// Tipos relacionados ao quiz
interface Pergunta {
  id: string;
  pergunta: string;
  opcoes: string[];
  respostaCerta: number;
  pontos: number;
  explicacao?: string;
}

// Tipos relacionados ao progresso do usuário
export interface ProgressoUsuario {
  usuarioId: string;
  conteudoId: string;
  progresso: number;
  concluido: boolean;
  pontos: number;
  tempoGasto: number;
  dataInicio: Date;
  dataConclusao?: Date;
}

// Tipos para formulários
export interface FormularioConteudo {
  titulo: string;
  descricao: string;
  categoria: string;
  tipo: 'texto' | 'video' | 'quiz';
  conteudo: string;
  tempoEstimado: number;
  dificuldade: 'facil' | 'medio' | 'dificil';
  tags: string[];
  publico: boolean;
}

// Tipos para autenticação
export interface DadosLogin {
  email: string;
  senha: string;
}

export interface DadosRegistro {
  nome: string;
  email: string;
  senha: string;
  tipo: 'criador' | 'aprendiz';
}

// Ranking global (GET /rankings/global/, paginado)
export interface RankingGlobalUtilizador {
  id: string;
  nome: string;
  pontos: number;
  posicao: number;
}

export interface RankingGlobalPagina {
  utilizadores: RankingGlobalUtilizador[];
  minhaPosicao: { posicao: number; pontos: number } | null;
  total: number;
  pagina: number;
  totalPaginas: number;
  workspace: string | null;
}
