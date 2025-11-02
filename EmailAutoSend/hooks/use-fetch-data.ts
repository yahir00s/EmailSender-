// hooks/useFetchData.ts
import { BACKEND } from "@/app/config";
import { useState, useEffect, useCallback } from "react";
import { useUsers } from "@/context/UsersContext";
import type { User } from "@/context/UsersContext";
import {
  saveUserDataToStorage,
  loadUserDataFromStorage,
} from "@/utils/storage";

interface DataItem {
  id: number;
  createdAt: string;
  data: {
    [key: string]: string;
  };
}

interface FetchDataResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  items: DataItem[];
}

interface UseFetchDataParams {
  page?: number;
  limit?: number;
}

interface UseFetchDataReturn {
  data: FetchDataResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isOffline?: boolean;
}

export const useFetchData = ({
  page = 1,
  limit = 8,
}: UseFetchDataParams = {}): UseFetchDataReturn & {
  hasMore: boolean;
  loadMore: () => Promise<void>;
  isLoadingMore: boolean;
} => {
  const [data, setData] = useState<FetchDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const { setUsers } = useUsers();
  const [currentPage, setCurrentPage] = useState(page);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async (pageToFetch: number, isLoadingMore = false) => {
    if (isLoadingMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

      const response = await fetch(
        `${BACKEND}/api/data?page=${pageToFetch}&limit=${limit}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Si el servidor responde pero sin datos (404, 204, etc.)
        if (response.status === 404 || response.status === 204) {
          // Manejar como respuesta vacía sin lanzar error
          setData({
            success: true,
            page: pageToFetch,
            limit,
            total: 0,
            hasMore: false,
            items: [],
          });
          setUsers([]);
          setIsOffline(false);
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: FetchDataResponse = await response.json();

      // Validar que la respuesta tenga la estructura esperada
      if (!result || typeof result !== 'object') {
        throw new Error('Respuesta inválida del servidor');
      }

      if (isLoadingMore && data) {
        setData({
          ...result,
          items: [...data.items, ...(result.items || [])],
        });
      } else {
        setData(result);
      }

      if (result.success) {
        await saveUserDataToStorage(result);

        if (result.items && result.items.length > 0) {
          const newUsers = result.items.map((item) => item.data);
          if (isLoadingMore) {
            setUsers((prevUsers: User[]) => [...prevUsers, ...newUsers]);
          } else {
            setUsers(newUsers);
          }
        } else {
          setUsers([]);
        }
        setIsOffline(false);
      }
    } catch (err: any) {
      // Suprimir errores en consola de Expo
      const errorMessage = err.message || "Error desconocido";

      // Detectar errores de red
      const isNetworkError =
        err.name === 'AbortError' ||
        errorMessage.includes("Network request failed") ||
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("fetch") ||
        errorMessage.includes("Network Error") ||
        errorMessage.includes("timeout");

      if (isNetworkError) {
        setIsOffline(true);
        
        try {
          const cachedData = await loadUserDataFromStorage();

          if (cachedData && cachedData.items && cachedData.items.length > 0) {
            setData(cachedData);
            const cachedUsers = cachedData.items.map((item) => item.data);
            setUsers(cachedUsers);
            setError(null); 
          } else {
            setData({
              success: true,
              page: 1,
              limit,
              total: 0,
              hasMore: false,
              items: [],
            });
            setUsers([]);
            setError(null); 
          }
        } catch (cacheError) {
          console.warn("No se pudo cargar datos en caché");
          setData({
            success: true,
            page: 1,
            limit,
            total: 0,
            hasMore: false,
            items: [],
          });
          setUsers([]);
          setError(null);
        }
      } else {

        if (__DEV__) {
          console.warn("Error fetching data:", errorMessage);
        }
        setError(null); 
        setIsOffline(false);
        
        try {
          const cachedData = await loadUserDataFromStorage();
          if (cachedData) {
            setData(cachedData);
            const cachedUsers = cachedData.items.map((item) => item.data);
            setUsers(cachedUsers);
          }
        } catch {
        }
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = async () => {
    if (!data?.hasMore || isLoadingMore) return;
    const nextPage = currentPage + 1;
    try {
      await fetchData(nextPage, true);
      setCurrentPage(nextPage);
    } catch (err) {
      if (__DEV__) {
        console.warn("Error loading more:", err);
      }
    }
  };

  const refetch = useCallback(() => {
    setCurrentPage(page);
    setData(null);
    setIsLoading(true);
    setRefreshKey((prev) => prev + 1);
  }, [page]);

  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedData = await loadUserDataFromStorage();
        if (cachedData) {
          setData(cachedData);
          const cachedUsers = cachedData.items.map((item) => item.data);
          setUsers(cachedUsers);
          setIsLoading(false);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn("Error loading cached data:", error);
        }
      } finally {
        await fetchData(page);
      }
    };

    loadCachedData();
  }, []);

  useEffect(() => {
    if (refreshKey > 0) {
      fetchData(page, false);
    }
  }, [refreshKey]);

  return {
    data,
    isLoading,
    error,
    refetch,
    hasMore: data?.hasMore ?? false,
    loadMore,
    isLoadingMore,
    isOffline,
  };
};