// hooks/useBulkEmail.ts
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
  sendBulkEmails: (data: { [key: string]: string }) => Promise<BulkEmailResult>;
  isLoading: boolean;
  error: string | null;
}

export const useBulkEmail = (): UseBulkEmailReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendBulkEmails = async (
    data: { [key: string]: string }
  ): Promise<BulkEmailResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND}/api/send-bulk-emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar correos");
      }

      return result;
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