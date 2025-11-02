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
      const response = await fetch(
        `${BACKEND}/api/data?page=${pageToFetch}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: FetchDataResponse = await response.json();

      if (isLoadingMore && data) {
        setData({
          ...result,
          items: [...data.items, ...result.items],
        });
      } else {
        setData(result);
      }

      if (result.success) {
        // Guardar datos en AsyncStorage para uso offline
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
        setIsOffline(false); // Conexión exitosa
      }
    } catch (err: any) {
      const errorMessage = err.message || "Error desconocido";

      if (
        errorMessage.includes("Network request failed") ||
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("fetch")
      ) {
        // Error de red - intentar cargar datos desde AsyncStorage
        setIsOffline(true);
        const cachedData = await loadUserDataFromStorage();

        if (cachedData && cachedData.items && cachedData.items.length > 0) {
          // Hay datos en caché, usar esos datos
          setData(cachedData);
          const cachedUsers = cachedData.items.map((item) => item.data);
          setUsers(cachedUsers);
          setError(null);
          // Asegurar que isLoading se establezca en false cuando hay datos en caché
          setIsLoading(false);
        } else {
          // No hay datos en caché
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
          // Asegurarse de que isLoading se establezca en false
          setIsLoading(false);
        }
      } else {
        // Otro tipo de error
        setError(errorMessage);
        setIsOffline(false);
      }
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
     if (!data?.hasMore || isLoadingMore) return;
     const nextPage = currentPage + 1;
     try {
       await fetchData(nextPage, true);
       setCurrentPage(nextPage);
     } finally {
       setIsLoadingMore(false);
     }
  };

  const refetch = useCallback(() => {
     setCurrentPage(page);
     setData(null);
     setIsLoading(true); // Asegurar que se muestre el loader al refrescar
     setRefreshKey((prev) => prev + 1); 
  }, [page]);

  // Cargar datos desde AsyncStorage al inicio
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedData = await loadUserDataFromStorage();
        if (cachedData) {
          setData(cachedData);
          const cachedUsers = cachedData.items.map((item) => item.data);
          setUsers(cachedUsers);
          // Mostrar datos del caché inmediatamente, pero seguir cargando en segundo plano
          setIsLoading(false);
        } else {
          // No hay datos en caché, mantener isLoading en true hasta obtener del servidor
        }
        // Intentar obtener datos del servidor (actualizar caché)
        await fetchData(page);
      } catch (error) {
        // Si hay error cargando del caché, intentar obtener del servidor
        console.error("Error loading cached data:", error);
        await fetchData(page);
      }
    };

    loadCachedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

   useEffect(() => {
     if (refreshKey > 0) {
       fetchData(page, false);
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
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
