import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import apiClient from "../services/api/axiosInterceptor";
import { endpoints } from "../services/endpoints";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: Record<string, string>) => Promise<void>;
  signup: (userData: Record<string, string>) => Promise<void>;
  logout: () => void;
  setTokens: (tokens: { accessToken: string; refreshToken?: string }) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      setTokens: ({ accessToken, refreshToken }) => {
        set((state) => ({
          accessToken,
          // Only update the refresh token if a new one is provided
          refreshToken: refreshToken || state.refreshToken,
          isAuthenticated: !!accessToken,
        }));
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post(
            endpoints.auth.login,
            credentials
          );
          const { access, refresh, user } = response.data;
          set({
            accessToken: access,
            refreshToken: refresh,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success(`Welcome back, ${user.username}!`);
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Login failed";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post(endpoints.auth.signup, userData);
          set({ isLoading: false });
          toast.success("Sign up successful! Please log in.");
          // Optionally, automatically log them in after signup
          // await get().login({ email: userData.email, password: userData.password });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Sign up failed";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
        }
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          user: null,
        });
        toast.success("Logged out successfully.");
      },

      // Called on app start to check for persisted session
      initialize: () => {
        const { accessToken, refreshToken, user } = get();
        if (accessToken && refreshToken && user) {
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: "auth-storage", // Key in storage
      storage: createJSONStorage(() => localStorage), // (optional) by default uses localStorage
    }
  )
);

// Initialize auth state on app load
useAuthStore.getState().initialize();
