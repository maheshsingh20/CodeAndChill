import { api } from "@/utils";
import { API_ENDPOINTS } from "@/constants";
import type { LoginCredentials, SignupCredentials, AuthResponse, User } from "@/types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, credentials);
  },

  getProfile: async (): Promise<{ user: User }> => {
    return api.get<{ user: User }>(API_ENDPOINTS.USER.PROFILE);
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    return api.put<User>(API_ENDPOINTS.USER.PROFILE, profileData);
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    return api.post<{ message: string }>(API_ENDPOINTS.USER.CHANGE_PASSWORD, passwordData);
  },
};