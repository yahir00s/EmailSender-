// hooks/useDeleteAllData.ts
import { BACKEND } from "@/app/config";
import { useState } from "react";

interface DeleteAllDataReturn {
  deleteAllData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useDeleteAllData = (): DeleteAllDataReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAllData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND}/api/data`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar datos");
      }

      console.log(result.message);
    } catch (err: any) {
      const errorMessage = err.message || "Error desconocido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteAllData,
    isLoading,
    error,
  };
};