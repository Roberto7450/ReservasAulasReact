import useSWR from 'swr';
import apiClient from '../utils/api';

const fetcher = async (url) => {
  const response = await apiClient.get(url);
  return response.data;
};

export const useFetch = (url, options = {}) => {
  return useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    ...options,
  });
};
