import { BACKEND } from "@/app/config";
import { useState } from "react";

interface BulkEmailResult {
  success: boolean;
  message: string;
  results: {
    success: Array<{ name: string; email: string }>;
    failed: Array<{ name: string; email: string; reason: string }>;
  };
}

interface UseBulkEmailReturn {
  sendBulkEmails: (
    data: { [key: string]: string },
    onProgress?: (email: string, success: boolean) => void
  ) => Promise<BulkEmailResult>;
  isLoading: boolean;
  error: string | null;
}

export const useBulkEmail = (): UseBulkEmailReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendBulkEmails = async (
    data: { [key: string]: string },
    onProgress?: (email: string, success: boolean) => void
  ): Promise<BulkEmailResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const results = {
        success: [] as Array<{ name: string; email: string }>,
        failed: [] as Array<{ name: string; email: string; reason: string }>
      };

      // Enviar emails uno por uno para reportar progreso
      for (const [name, email] of Object.entries(data)) {
        try {
          const response = await fetch(`${BACKEND}/api/send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ [name]: email }),
          });

          const result = await response.json();

          if (result.success) {
            results.success.push({ name, email });
            onProgress?.(email, true); 
          } else {
            results.failed.push({ 
              name, 
              email,
              reason: result.error || "Error desconocido" 
            });
            onProgress?.(email, false); 
          }
        } catch (error) {
          results.failed.push({ 
            name,
            email,
            reason: error instanceof Error ? error.message : "Error de red" 
          });
          onProgress?.(email, false);
        }
      }

      return {
        success: true,
        message: "Proceso completado",
        results
      };
    } catch (err: any) {
      const errorMessage = err.message || "Error desconocido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendBulkEmails,
    isLoading,
    error,
  };
};