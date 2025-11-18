export interface Content {
  id: string;
  title: string;
  type: 'article' | 'video' | 'nutrition' | 'tutorial';
  category: string;
  author: string;
  content: string;
  publishDate: string;
  views: number;
  status: 'published' | 'draft' | 'archived';
  language: 'french' | 'bambara' | 'soninke' | 'tamasheq';
  duration?: string;
  targetAudience?: string;
  tags?: string[];
  thumbnailUrl?: string;
  videoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContentStats {
  total: number;
  articles: number;
  videos: number;
  nutrition: number;
  tutorials: number;
  totalViews: number;
}

export interface ContentFilter {
  searchTerm?: string;
  type?: string;
  category?: string;
  status?: string;
  language?: string;
}