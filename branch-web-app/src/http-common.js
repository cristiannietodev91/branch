import axios from "axios";
import { apiBranchUrl } from "./constants/config";

const axiosInstance = axios.create({
  baseURL: apiBranchUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag) {
    const csrfToken = metaTag.getAttribute('content');
    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error);
    if (error.response && error.response.status === 403 && error.response.data.error === 'invalid csrf token') {
      // Handle the CSRF token expiration error by renewing the token
      try {
        const token = await fetchCSRFToken();

        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag) {
          metaTag.setAttribute('content', token);
        }
        
        // Retry the original request with the new CSRF token
        error.config.headers['X-CSRF-TOKEN'] = token;
        return axiosInstance.request(error.config);
      } catch(error) {
        return Promise.reject(error);
      }
    }
    if (error.response && error.response.status === 401) {
      // Handle the CSRF token expiration error by renewing the token
      window.location = "/user/login";
      localStorage.clear("user");
    }
    return Promise.reject(error);
  }
);

export function fetchCSRFToken() {
  return axiosInstance.get('/csrf-token')
    .then((response) => response.data.csrfToken)
    .catch((error) => {
      console.error('Failed to fetch CSRF token', error);
      return null;
    });
}


export default axiosInstance;
