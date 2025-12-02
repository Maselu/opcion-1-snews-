import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export function useFetch<T>(url: string, dependencies: any[] = []) {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const response = await api.get<T>(url);
            setState({ data: response.data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData, ...dependencies]);

    return { ...state, refetch: fetchData };
}
