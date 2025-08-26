const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const endpoints = {
  auth: {
    login: `${API_BASE_URL}/auth/token/`,
    refresh: `${API_BASE_URL}/auth/token/refresh/`,
    signup: `${API_BASE_URL}/user/`,
  },
  links: {
    get: `${API_BASE_URL}/link/`,
    create: `${API_BASE_URL}/link/`,
    update: (id: string) => `${API_BASE_URL}/link/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/link/${id}/`,
    lookup: (short_code: string) =>
      `${API_BASE_URL}/link/lookup/${short_code}/`,
  },
  user: {
    me: `${API_BASE_URL}/user/`,
  },
};
