import axios from "axios";

const customFetch = axios.create({
  // baseURL: import.meta.env.VITE_API_URL ||  "/api/v1",
  baseURL:"http://localhost:5000/api/",
  withCredentials: true,
});

export default customFetch;