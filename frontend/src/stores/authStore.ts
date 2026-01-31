import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens } from '@/types';
import authService from '@/services/auth';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  login: (email_or_phone: string, password: string, remember?: boolean) => Promise<void>;
  register: (data: {
    first_name: string;
    last_name: string;
    email_or_phone: string;
    password: string;
    password_confirm: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setTokens: (tokens) => {
        if (tokens) {
          localStorage.setItem('access_token', tokens.access);
          localStorage.setItem('refresh_token', tokens.refresh);
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        set({ tokens });
      },

      login: async (email_or_phone, password, remember = false) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ email_or_phone, password, remember });
          const { user, tokens } = response.data;
          
          get().setTokens(tokens);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(data);
          const { user, tokens } = response.data;
          
          get().setTokens(tokens);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            await authService.logout(refreshToken);
          }
        } catch {
          // Ignore logout errors
        } finally {
          get().clearAuth();
          set({ isLoading: false });
        }
      },

      fetchCurrentUser: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
          get().clearAuth();
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authService.getCurrentUser();
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch {
          get().clearAuth();
          set({ isLoading: false });
        }
      },

      clearAuth: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, tokens: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
