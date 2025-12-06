import axios from 'axios';
import { supabase } from '../lib/supabase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false // Set to true only if using cookies
});

// Request interceptor to inject JWT token
api.interceptors.request.use(
    async (config) => {
        try {
            // 1. Get fresh session from Supabase
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('❌ Error getting session:', error);
                return config;
            }

            const token = data?.session?.access_token;

            // 2. Inject token if it exists
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('🔑 Token inyectado en petición:', config.url);
                console.log('🔑 Token (primeros 20 chars):', token.substring(0, 20) + '...');
            } else {
                console.warn('⚠️ Petición sin token:', config.url);
                console.warn('⚠️ Session data:', data);
            }
        } catch (err) {
            console.error('❌ Error in request interceptor:', err);
        }

        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for better error handling
api.interceptors.response.use(
    (response) => {
        console.log('✅ Response received from:', response.config.url);
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            console.error('❌ 401 Unauthorized for:', error.config.url);
            console.error('❌ Response data:', error.response.data);

            // Try to get session again
            const { data } = await supabase.auth.getSession();
            console.log('🔍 Current session after 401:', data.session ? 'EXISTS' : 'NULL');

            if (data.session) {
                console.log('🔍 User ID from session:', data.session.user.id);
                console.log('🔍 Token exists:', !!data.session.access_token);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
