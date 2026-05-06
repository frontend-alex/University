import api from "@/services/api";
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchData = async <T>(endpoint: string): Promise<T> => {
  const response = await api.get<T>(endpoint);
  return response.data;
};

const postData = async <T, U>(endpoint: string, data: U): Promise<T> => {
  const response = await api.post<T>(endpoint, data);
  return response.data;
};

const putData = async <T, U>(endpoint: string, data: U): Promise<T> => {
  const response = await api.put<T>(endpoint, data);
  return response.data;
};

const deleteData = async <T>(endpoint: string): Promise<T> => {
  const response = await api.delete<T>(endpoint);
  return response.data;
};


export const useFetchData = <T>(queryKey: unknown[], endpoint: string) => {
  return useQuery<T, AxiosError>({
    queryKey,
    queryFn: () => fetchData<T>(endpoint),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePostData = <T, U = T>(
  endpoint: string,
  options?: {
    invalidateKey?: string[];
    onSuccess?: (data: T) => void;
    onError?: (error: AxiosError) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<T, AxiosError, U>({
    mutationFn: (data: U) => postData<T, U>(endpoint, data),
    onSuccess: (data) => {
      if (options?.invalidateKey) {
        options.invalidateKey.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const usePutData = <T, U = T>(
  getEndpoint: (data: U) => string,
  options?: {
    invalidateKey?: string[];
    onSuccess?: (data: T) => void;
    onError?: (error: AxiosError) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<T, AxiosError, U>({
    mutationFn: (data: U) => putData<T, U>(getEndpoint(data), data),
    onSuccess: (data) => {
      if (options?.invalidateKey) {
        options.invalidateKey.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useDeleteData = <T, U>(
  getEndpoint: (data: U) => string,
  options?: {
    invalidateKey?: string[];
    onSuccess?: (data: T) => void;
    onError?: (error: AxiosError) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<T, AxiosError, U>({
    mutationFn: (data: U) => deleteData<T>(getEndpoint(data)),
    onSuccess: (data) => {
      if (options?.invalidateKey) {
        options.invalidateKey.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
