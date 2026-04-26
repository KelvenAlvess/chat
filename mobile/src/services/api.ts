import axios from 'axios';
import * as SecureStore from 'expo-secure-store'

const API_URL = 'http://192.168.0.7:8082';

const api = axios.create({
    baseURL: API_URL,
    timeout: 5000,
});

api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('jwt_token');

            if (token && token !== 'undefined' && token !== 'null') {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Erro ao recuperar o token:', error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;