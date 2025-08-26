import { create } from "zustand";
import apiClient from "../services/api/axiosInterceptor";
import { endpoints } from "../services/endpoints";
import { toast } from "react-hot-toast";

interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
}

interface ShortLinkState {
  links: ShortLink[];
  isLoading: boolean;
  error: string | null;
  fetchLinks: () => Promise<void>;
  createLink: (data: {
    originalUrl: string;
    shortCode?: string;
  }) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
}

export const useShortLinkStore = create<ShortLinkState>((set) => ({
  links: [],
  isLoading: false,
  error: null,

  fetchLinks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<ShortLink[]>(endpoints.links.get);
      set({ links: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch links";
      console.log(errorMessage);
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  createLink: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<ShortLink>(
        endpoints.links.create,
        data
      );
      set((state) => ({
        links: [...state.links, response.data],
        isLoading: false,
      }));
      toast.success("Link created successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create link";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  deleteLink: async (id: string) => {
    try {
      await apiClient.delete(endpoints.links.delete(id));
      set((state) => ({
        links: state.links.filter((link) => link.id !== id),
      }));
      toast.success("Link deleted successfully.");
    } catch (error: any) {
      toast.error("Failed to delete link.");
    }
  },
}));
