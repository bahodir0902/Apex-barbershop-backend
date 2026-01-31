import apiClient from '@/lib/api';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User, 
  ApiResponse 
} from '@/types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login/', data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register/', data);
    return response.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/auth/logout/', { refresh: refreshToken });
  },

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    const response = await apiClient.post('/auth/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>('/users/me/');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiClient.patch<ApiResponse<User>>('/users/update_me/', data);
    return response.data;
  },

  async changePassword(data: {
    current_password: string;
    new_password: string;
    confirm_new_password: string;
  }): Promise<ApiResponse<null>> {
    const response = await apiClient.post('/auth/password/change/', data);
    return response.data;
  },

  async resetPasswordRequest(email: string): Promise<ApiResponse<null>> {
    const response = await apiClient.post('/auth/password/reset/', { email });
    return response.data;
  },
};

export default authService;
