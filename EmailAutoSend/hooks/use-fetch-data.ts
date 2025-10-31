// hooks/useFetchData.ts
import { BACKEND } from "@/app/config";
import { useState, useEffect } from "react";
import { useUsers } from "@/context/UsersContext";

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
  limit = 10,
}: UseFetchDataParams = {}): UseFetchDataReturn => {
  const [data, setData] = useState<FetchDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setUsers } = useUsers();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BACKEND}/api/data?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: FetchDataResponse = await response.json();
      setData(result);

      // Actualizar el estado global de usuarios
      if (result.success && result.items) {
        const users = result.items.map((item) => item.data);
        setUsers(users);
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};
