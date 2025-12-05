import axios from 'axios';
import { supabase } from '../lib/supabase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    async (config) => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error getting session:', error);
                return config;
            }

            if (session?.access_token) {
                config.headers.Authorization = `Bearer ${session.access_token}`;
                console.log('Token added to request:', config.url);
            } else {
                console.warn('No session token available for request:', config.url);
            }
        } catch (err) {
            console.error('Error in request interceptor:', err);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.error('401 Unauthorized - Token may be invalid or expired');
            // Optionally refresh the session here
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                console.warn('No active session found');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
