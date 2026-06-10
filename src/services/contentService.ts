import { api } from './api';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  rating: number;
  students: number;
  price: number;
  type?: 'video' | 'quiz' | 'text';
  videoUrl?: string;
  textContent?: string;
  quiz?: Question[];
  creatorName?: string;
  creator?: { id: number | string; name: string };
  tags?: string[] | string;
  created_at?: string;
  has_quiz?: boolean;
  quiz_id?: string;
}

const CATEGORIAS_DISPLAY: Record<string, string> = {
  tecnologia: 'Tecnologia',
  negocios: 'Negócios',
  design: 'Design',
};

const THUMBNAIL_FALLBACK =
  'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500';

function mapItem(item: any): Content {
  const creatorObj = item.creator;
  const creatorName =
    typeof creatorObj === 'object' && creatorObj !== null
      ? `${creatorObj.first_name || ''} ${creatorObj.last_name || ''}`.trim() ||
        creatorObj.email?.split('@')[0] ||
        'Kombinu'
      : typeof creatorObj === 'string'
        ? creatorObj
        : 'Kombinu';

  return {
    ...item,
    videoUrl: item.videoUrl || item.video_url || '',
    textContent: item.textContent || item.text_content || '',
    creatorName,
    level: item.level || 'Iniciante',
    rating: item.rating || 0,
    students: item.students || 0,
    price: item.price || 0,
    thumbnail: item.thumbnail || THUMBNAIL_FALLBACK,
  };
}

export const contentService = {
  getAll: async (): Promise<Content[]> => {
    try {
      const response = await api.get('/contents/');
      const results = response.data.results ?? response.data;
      return (Array.isArray(results) ? results : []).map(mapItem);
    } catch (error) {
      console.error('Failed to fetch contents:', error);
      return [];
    }
  },

  getByCreator: async (creatorId: string | number): Promise<Content[]> => {
    try {
      const response = await api.get(`/contents/?creator=${creatorId}`);
      const results = response.data.results ?? response.data;
      return (Array.isArray(results) ? results : []).map(mapItem);
    } catch (error) {
      console.error(`Failed to fetch contents for creator ${creatorId}:`, error);
      return [];
    }
  },

  getById: async (id: string): Promise<Content | undefined> => {
    try {
      const response = await api.get(`/contents/${id}/`);
      return mapItem(response.data);
    } catch (error) {
      console.error(`Failed to fetch content ${id}:`, error);
      return undefined;
    }
  },

  getCategories: async (): Promise<string[]> => {
    return Object.keys(CATEGORIAS_DISPLAY);
  },

  getCategoryLabel: (category: string): string => {
    return CATEGORIAS_DISPLAY[category] ?? category;
  },

  create: async (content: Omit<Content, 'id'>): Promise<Content> => {
    const response = await api.post('/contents/', content);
    return mapItem(response.data);
  },
};
