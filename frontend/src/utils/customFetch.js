import axios from "axios";

const customFetch = axios.create({
  // baseURL: import.meta.env.VITE_API_URL ||  "/api/v1",
  baseURL:"/api/v1",
  withCredentials: true,
});

export default customFetch;