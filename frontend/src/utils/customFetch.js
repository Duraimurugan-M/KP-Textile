import axios from "axios";

const customFetch = axios.create({
  baseURL:"http://localhost:5000/api/",
  withCredentials: true,
});

customFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isAuthEndpoint = error?.config?.url?.includes("/auth/login");

    if (status === 401 && !isAuthEndpoint) {
      const isOnLogin = window.location.pathname === "/login";
      if (!isOnLogin) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default customFetch;
