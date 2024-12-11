import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { Modal } from "antd";
import { NavigateFunction } from "react-router-dom";

// Funkcija za kreiranje Axios instance
const createAxiosInstance = (baseURL: string, navigate: NavigateFunction) => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
  });

  // Interceptor za dodavanje tokena u header
  instance.interceptors.request.use((config: any) => {
    const token = JSON.parse(localStorage.getItem('ad') || '{}').user?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Interceptor za hendlanje errora
  instance.interceptors.response.use(
    async (response: any) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        const { data, status } = error.response as AxiosResponse;
        switch (status) {
          case 404:
            navigate('/kamera', { state: { error: data } });
            break;
          case 401:
            Modal.error({
              title: 'Unauthorized',
              okText: data.title || 'You are not authorized to access this resource.',
              onOk: () => {}, // možeš dodati bilo koju funkciju ovde, ako je potrebno
            });
            
            break;
          case 500:
            navigate('/server-error', { state: { error: data } });
            break;
          default:
            Modal.error({
              title: 'Error',
              okText: data.title || 'An unknown error occurred.',
            });
            break;
        }
        return Promise.reject(error.response);
      } else {
        Modal.error({
          title: 'Network Error',
          okText: 'Network error or server not responding',
        });
        return Promise.reject(error);
      }
    }
  );

  return instance;
};

// Funkcija za ekstrakciju `data` iz odgovora
const responseBody = (response: AxiosResponse) => response.data;

// Funkcija koja generiše metode za zahteve (GET, POST, PATCH, DELETE)
const requests = (instance: AxiosInstance) => ({
  get: (url: string, params?: URLSearchParams, headers?: {}) =>
    instance.get(url, { params, headers }).then(responseBody),
  post: (url: string, body: {}, headers?: {}) =>
    instance.post(url, body, { headers }).then(responseBody),
  patch: (url: string, body: {}, headers?: {}) =>
    instance.patch(url, body, { headers }).then(responseBody),
  delete: (url: string) => instance.delete(url).then(responseBody),
});

// Grupa svih API instanci i njihovih metoda
const createAgent = (navigate: NavigateFunction) => ({
  api: requests(createAxiosInstance("http://192.168.50.37:8000/api/", navigate)),
  
  // Dodaj ovde nove API-je ako ih bude bilo
});

export default createAgent;