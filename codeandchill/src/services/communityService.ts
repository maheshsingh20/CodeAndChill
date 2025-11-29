import api from './api';

export interface CommunityPost {
  _id: string;
  title: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
}

export const communityService = {
  getLatestPosts: async (limit: number = 4): Promise<CommunityPost[]> => {
    const response = await api.get<CommunityPost[]>(`/community/latest?limit=${limit}`);
    return response;
  },

  getAllPosts: async (page: number = 1, limit: number = 10) => {
    const response = await api.get<any>(`/community?page=${page}&limit=${limit}`);
    return response;
  },

  getPostById: async (id: string): Promise<CommunityPost> => {
    const response = await api.get<CommunityPost>(`/community/${id}`);
    return response;
  },
};
