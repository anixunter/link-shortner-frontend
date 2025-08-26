import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { endpoints } from "@/services/endpoints";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// response interceptor: adds the auth token to every request if available
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor: handles token refresh and global error logging
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    // if the error is 401 and it's not a retry request
    if (
      error.response?.status == 401 &&
      authStore.refreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // call the refresh token endpoint
        const { data } = await axios.post(endpoints.auth.refresh, {
          refresh: authStore.refreshToken,
        });

        const newAccessToken = data.access;
        const newRefreshToken = data.refresh;

        if (!newAccessToken) {
          console.error(
            "CRITICAL: New access token was NOT in the refresh response. Logging out."
          );
          authStore.logout();
          return Promise.reject(
            new Error("Refresh failed: No new access token received.")
          );
        }

        // Use the new action to update BOTH tokens
        authStore.setTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        // Also update the default headers for all subsequent requests
        // apiClient.defaults.headers.common[
        //   "Authorization"
        // ] = `Bearer ${newAccessToken}`;

        // Update the header for the retried request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError: any) {
        // refresh token failed, log the user out
        authStore.logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
