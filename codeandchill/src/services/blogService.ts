import api from './api';

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  author: {
    name: string;
  };
  createdAt: string;
  views: number;
  likes: number;
}

export const blogService = {
  getLatestPosts: async (limit: number = 6): Promise<BlogPost[]> => {
    const response = await api.get<BlogPost[]>(`/blog/latest?limit=${limit}`);
    return response;
  },

  getAllPosts: async (page: number = 1, limit: number = 10) => {
    const response = await api.get<any>(`/blog?page=${page}&limit=${limit}`);
    return response;
  },

  getPostBySlug: async (slug: string): Promise<BlogPost> => {
    const response = await api.get<BlogPost>(`/blog/${slug}`);
    return response;
  },
};
