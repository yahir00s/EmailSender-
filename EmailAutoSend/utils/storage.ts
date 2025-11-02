// Utilidades para AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER_DATA: "@emailautosend:userData",
  LAST_SYNC: "@emailautosend:lastSync",
};

interface FetchDataResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  items: Array<{
    id: number;
    createdAt: string;
    data: {
      [key: string]: string;
    };
  }>;
}

export const saveUserDataToStorage = async (data: FetchDataResponse): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (error) {
    console.error("Error saving data to storage:", error);
  }
};

export const loadUserDataFromStorage = async (): Promise<FetchDataResponse | null> => {
  try {
    const dataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (dataString) {
      return JSON.parse(dataString) as FetchDataResponse;
    }
    return null;
  } catch (error) {
    console.error("Error loading data from storage:", error);
    return null;
  }
};

export const getLastSync = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  } catch (error) {
    console.error("Error getting last sync:", error);
    return null;
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.LAST_SYNC,
    ]);
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

