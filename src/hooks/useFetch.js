import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Custom hook for making API requests
 * @param {string} url - API endpoint
 * @param {Object} options - Request options
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api(url, options);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
};

/**
 * Custom hook for making POST requests
 * @param {string} url - API endpoint
 * @returns {Object} { postData, loading, error, response }
 */
export const usePost = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const postData = async (data) => {
    try {
      setLoading(true);
      const res = await api.post(url, data);
      setResponse(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data || 'An error occurred');
      setResponse(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error, response };
};

/**
 * Custom hook for making DELETE requests
 * @param {string} url - API endpoint
 * @returns {Object} { deleteData, loading, error, response }
 */
export const useDelete = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const deleteData = async () => {
    try {
      setLoading(true);
      const res = await api.delete(url);
      setResponse(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data || 'An error occurred');
      setResponse(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, loading, error, response };
};

export default useFetch;