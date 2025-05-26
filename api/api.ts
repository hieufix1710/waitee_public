import tenantSettings from "../libs/tenant"; // Adjust path as needed for server
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const axiosSetting: AxiosRequestConfig = {
  baseURL: 'http://localhost:3001/api', // Use env or absolute URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

export const api = axios.create({
  ...axiosSetting,
});

const localeInterceptor = (request: InternalAxiosRequestConfig) => {
  request.headers.Tenant = tenantSettings.getTenant(); // Ensure this works server-side
  return request;
};

api.interceptors.request.use(localeInterceptor);
