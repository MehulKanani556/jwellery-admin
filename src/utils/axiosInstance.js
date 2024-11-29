import axios from "axios";
import { BASE_URL } from "./BaseUrl";


const createAxiosInstance = () => { 
    const axiosInstance = axios.create({
      baseURL: BASE_URL, 
    });
    const getToken = async () => {
      const token = await sessionStorage.getItem("token");
      return token;
    };
    axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken(); 
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  
    return axiosInstance; 
  };
  
  const axiosInstance = createAxiosInstance();

  export default axiosInstance; 
