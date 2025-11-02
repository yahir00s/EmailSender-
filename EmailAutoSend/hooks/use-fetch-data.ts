// hooks/useFetchData.ts
import { BACKEND } from "@/app/config";
import { useState, useEffect, useCallback } from "react";
import { useUsers } from "@/context/UsersContext";
import type { User } from "@/context/UsersContext";

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
        // Agregar nuevos items a los existentes
        setData({
          ...result,
          items: [...data.items, ...result.items],
        });
      } else {
        setData(result);
      }

      // Actualizar el estado global de usuarios
      if (result.success) {
        // Si hay items, actualizar usuarios. Si no hay items, limpiar la lista
        if (result.items && result.items.length > 0) {
          const newUsers = result.items.map((item) => item.data);
          if (isLoadingMore) {
            setUsers((prevUsers: User[]) => [...prevUsers, ...newUsers]);
          } else {
            setUsers(newUsers);
          }
        } else {
          // No hay items, limpiar usuarios
          setUsers([]);
        }
      }
    } catch (err: any) {
      // Manejar errores de red y otros errores
      const errorMessage = err.message || "Error desconocido";
      
      // Si el error menciona "Network request failed" o "Failed to fetch"
      // puede ser que el backend no esté disponible o no haya datos
      if (errorMessage.includes("Network request failed") || 
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("fetch")) {
        // Establecer datos vacíos en lugar de mostrar error de red
        // Esto permite que la UI muestre el mensaje apropiado
        setData({
          success: true,
          page: 1,
          limit,
          total: 0,
          hasMore: false,
          items: [],
        });
        setUsers([]);
        setError(null); // No mostrar error, mostrar mensaje de "aún no has agregado usuarios"
      } else {
        // Para otros errores (como 404, 500, etc.), mostrar el error
        setError(errorMessage);
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
    setData(null); // Limpiar datos anteriores
    setRefreshKey((prev) => prev + 1); // Forzar re-fetch
  }, [page]);

  useEffect(() => {
    fetchData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch cuando cambia refreshKey
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
  };
};
