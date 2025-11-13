import { useState, useCallback } from 'react';
import { ApiService, ApiResponse } from '../types';
import { ErrorHandler, NetworkError } from '../utils/errorHandling';

/**
 * API Request State
 */
export interface APIRequestState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * useAPI Hook
 *
 * Custom hook for making API requests through BrainDrive's API service.
 * Provides loading states, error handling, and request methods.
 *
 * @param apiService - The BrainDrive API service from props.services
 * @param errorHandler - Optional error handler for safe operations
 * @returns API request methods and state management
 *
 * @example
 * ```tsx
 * const PluginComponent: React.FC<PluginProps> = ({ services }) => {
 *   const { get, post, data, loading, error } = useAPI(services.api);
 *
 *   useEffect(() => {
 *     get('/api/plugin/data');
 *   }, []);
 *
 *   const handleSave = async () => {
 *     const result = await post('/api/plugin/save', { name: 'test' });
 *     if (result) {
 *       console.log('Saved successfully');
 *     }
 *   };
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   return <div>{JSON.stringify(data)}</div>;
 * };
 * ```
 */
export function useAPI<T = any>(
  apiService?: ApiService,
  errorHandler?: ErrorHandler
) {
  const [state, setState] = useState<APIRequestState<T>>({
    data: null,
    loading: false,
    error: null
  });

  // Helper to update state
  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  };

  const setData = (data: T) => {
    setState({ data, loading: false, error: null });
  };

  const setError = (error: string) => {
    setState((prev) => ({ ...prev, loading: false, error }));
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  // GET request
  const get = useCallback(
    async (url: string, options?: any): Promise<T | null> => {
      if (!apiService) {
        setError('API service not available');
        return null;
      }

      setLoading(true);
      clearError();

      try {
        const response = await apiService.get(url, options);

        if (!response || typeof response !== 'object') {
          throw new NetworkError('Invalid response format', undefined, url);
        }

        const data = response.data as T;
        setData(data);
        return data;
      } catch (err) {
        const errorMsg = `GET ${url} failed: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`;
        console.error('useAPI:', errorMsg, err);
        setError(errorMsg);
        return null;
      }
    },
    [apiService]
  );

  // POST request
  const post = useCallback(
    async (url: string, data: any, options?: any): Promise<T | null> => {
      if (!apiService) {
        setError('API service not available');
        return null;
      }

      setLoading(true);
      clearError();

      try {
        const response = await apiService.post(url, data, options);

        if (!response || typeof response !== 'object') {
          throw new NetworkError('Invalid response format', undefined, url);
        }

        const responseData = response.data as T;
        setData(responseData);
        return responseData;
      } catch (err) {
        const errorMsg = `POST ${url} failed: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`;
        console.error('useAPI:', errorMsg, err);
        setError(errorMsg);
        return null;
      }
    },
    [apiService]
  );

  // PUT request
  const put = useCallback(
    async (url: string, data: any, options?: any): Promise<T | null> => {
      if (!apiService) {
        setError('API service not available');
        return null;
      }

      setLoading(true);
      clearError();

      try {
        const response = await apiService.put(url, data, options);

        if (!response || typeof response !== 'object') {
          throw new NetworkError('Invalid response format', undefined, url);
        }

        const responseData = response.data as T;
        setData(responseData);
        return responseData;
      } catch (err) {
        const errorMsg = `PUT ${url} failed: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`;
        console.error('useAPI:', errorMsg, err);
        setError(errorMsg);
        return null;
      }
    },
    [apiService]
  );

  // DELETE request
  const del = useCallback(
    async (url: string, options?: any): Promise<boolean> => {
      if (!apiService) {
        setError('API service not available');
        return false;
      }

      setLoading(true);
      clearError();

      try {
        await apiService.delete(url, options);
        setState({ data: null, loading: false, error: null });
        return true;
      } catch (err) {
        const errorMsg = `DELETE ${url} failed: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`;
        console.error('useAPI:', errorMsg, err);
        setError(errorMsg);
        return false;
      }
    },
    [apiService]
  );

  // Streaming POST request
  const postStreaming = useCallback(
    async (
      url: string,
      data: any,
      onChunk: (chunk: string) => void,
      options?: any
    ): Promise<T | null> => {
      if (!apiService || !apiService.postStreaming) {
        setError('Streaming API not available');
        return null;
      }

      setLoading(true);
      clearError();

      try {
        const response = await apiService.postStreaming(url, data, onChunk, options);

        const responseData = response.data as T;
        setData(responseData);
        return responseData;
      } catch (err) {
        const errorMsg = `POST (streaming) ${url} failed: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`;
        console.error('useAPI:', errorMsg, err);
        setError(errorMsg);
        return null;
      }
    },
    [apiService]
  );

  return {
    // State
    data: state.data,
    loading: state.loading,
    error: state.error,
    isAvailable: !!apiService,

    // Methods
    get,
    post,
    put,
    delete: del,
    postStreaming,
    clearError,

    // Manual state setters
    setData,
    setError
  };
}

/**
 * useLazyAPI Hook
 *
 * Similar to useAPI but doesn't auto-fetch.
 * Returns a trigger function to manually initiate requests.
 *
 * @example
 * ```tsx
 * const { execute, data, loading } = useLazyAPI(services.api);
 *
 * const handleClick = async () => {
 *   await execute('GET', '/api/data');
 * };
 * ```
 */
export function useLazyAPI<T = any>(
  apiService?: ApiService,
  errorHandler?: ErrorHandler
) {
  const api = useAPI<T>(apiService, errorHandler);

  const execute = useCallback(
    async (
      method: 'GET' | 'POST' | 'PUT' | 'DELETE',
      url: string,
      data?: any,
      options?: any
    ): Promise<T | boolean | null> => {
      switch (method) {
        case 'GET':
          return await api.get(url, options);
        case 'POST':
          return await api.post(url, data, options);
        case 'PUT':
          return await api.put(url, data, options);
        case 'DELETE':
          return await api.delete(url, options);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    },
    [api]
  );

  return {
    ...api,
    execute
  };
}

export default useAPI;
