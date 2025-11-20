import { useState, useEffect } from "react";
import { api } from "@/utils";

interface UseApiOptions {
  immediate?: boolean;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = { immediate: true }
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await api.get<T>(endpoint);
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred";
      setState({ data: null, loading: false, error });
      throw err;
    }
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [endpoint, options.immediate]);

  return {
    ...state,
    execute,
    refetch: execute,
  };
}

export function useApiMutation<TData, TVariables = any>() {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = async (
    endpoint: string,
    variables?: TVariables,
    method: "POST" | "PUT" | "DELETE" = "POST"
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      let data: TData;
      
      switch (method) {
        case "POST":
          data = await api.post<TData>(endpoint, variables);
          break;
        case "PUT":
          data = await api.put<TData>(endpoint, variables);
          break;
        case "DELETE":
          data = await api.delete<TData>(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred";
      setState({ data: null, loading: false, error });
      throw err;
    }
  };

  return {
    ...state,
    mutate,
  };
}