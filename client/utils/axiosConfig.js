import axios from 'axios';
import store from '../store';
import { setAccessToken, setUser } from '../store/auth';

export default function axiosSetup() {
  axios.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.accessToken;
      if (token !== null) {
        // Attach access token to every request if possible
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      // No problems with request
      return response;
    },
    async (error) => {
      // Request failed
      const originalRequest = error.config;

      if (error.response.status === 401 && originalRequest.url.includes('auth/refresh')) {
        // If a refresh was attempted and failed, logout
        await axios.post('/auth/logout');
        store.dispatch(setAccessToken(null));
        store.dispatch(setUser(null));
        return Promise.reject(error);
      } else if (error.response.status === 401 && !originalRequest._retry) {
        // Attempt a refresh and then redo original request
        originalRequest._retry = true;
        try {
          const { data } = await axios.post('/auth/refresh');
          store.dispatch(setAccessToken(data.accessToken));
          return axios(originalRequest);
        } catch (err) {
          //Refresh failed
          return Promise.reject(error);
        }
      }
    }
  );
}
