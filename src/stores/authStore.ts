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
  fetchSelf: () => Promise<void>;
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

      // --- FETCH USER DATA ---
      fetchSelf: async () => {
        try {
          // The request interceptor will automatically add the auth header
          const response = await apiClient.get<User>(endpoints.user.self);
          set({ user: response.data, error: null });
        } catch (error) {
          console.error("Failed to fetch user data. Session may be invalid.");
          // If we can't fetch the user, something is wrong. Log them out.
          get().logout();
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // step 1: get tokens from the login endpoint
          const response = await apiClient.post(
            endpoints.auth.login,
            credentials
          );
          const { access, refresh } = response.data;

          // set the tokens and authentication status
          set({
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
          });

          // Step 2: Call the new action to fetch user data
          await get().fetchSelf();

          // Toast message now uses the user from the state AFTER it has been fetched
          const username = get().user?.username;
          if (username) {
            toast.success(`Welcome back, ${username}!`);
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Login failed";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
        } finally {
          set({ isLoading: false });
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
        const { accessToken, refreshToken } = get();
        if (accessToken && refreshToken) {
          set({ isAuthenticated: true });
          // If tokens exist, validate the session by fetching the user again.
          // This ensures the user is still valid on the backend.
          get().fetchSelf();
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
