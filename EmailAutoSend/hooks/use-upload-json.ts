// hooks/useUploadJson.ts
import { useState } from "react";
import { File } from "expo-file-system";
import { BACKEND } from "@/app/config";

interface UploadResponse {
  success: boolean;
  entry?: {
    id: number;
    createdAt: string;
    data: any;
  };
  error?: string;
  details?: string;
}

interface UseUploadJsonReturn {
  uploadJson: (fileUri: string) => Promise<UploadResponse>;
  isLoading: boolean;
  error: string | null;
  data: UploadResponse | null;
}

const API_URL = BACKEND; 

export const useUploadJson = (): UseUploadJsonReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UploadResponse | null>(null);

  const uploadJson = async (fileUri: string): Promise<UploadResponse> => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const file = new File(fileUri);
      const fileContent = await file.text();
      
      const jsonData = JSON.parse(fileContent);

      const formData = new FormData();
      
      formData.append("file", {
        uri: fileUri,
        type: "application/json",
        name: "upload.json",
      } as any);

      const response = await fetch(`${API_URL}/api/upload-json`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al subir el archivo");
      }

      setData(result);
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
    uploadJson,
    isLoading,
    error,
    data,
  };
};