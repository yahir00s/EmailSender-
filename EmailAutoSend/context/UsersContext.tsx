// Context para manejar el estado global de usuarios
import { BACKEND } from "@/app/config";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  [key: string]: string; // formato { "Nombre": "email" }
}

interface UsersContextType {
  users: User[];
  setUsers: (users: User[] | ((prev: User[]) => User[])) => void;
  addUser: (user: User) => void;
  removeUser: (index: number) => void;
  clearUsers: () => void;
  refreshUsers: () => Promise<void>;
  triggerRefresh: () => void;
  refreshTrigger: number;
  isSendingToAll: boolean;
  sendingIndividualEmails: Set<string>;
  setIsSendingToAll: (value: boolean) => void;
  addSendingEmail: (email: string) => void;
  removeSendingEmail: (email: string) => void;
  sentEmails: Set<string>;
  addSentEmail: (email: string) => void;
  clearSentEmails: () => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

const STORAGE_KEY = "@emailautosend:users";

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSendingToAll, setIsSendingToAll] = useState(false);
  const [sendingIndividualEmails, setSendingIndividualEmails] = useState<
    Set<string>
  >(new Set());
  const [sentEmails, setSentEmails] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadUsersFromStorage = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          setUsers(parsedUsers);
        }
      } catch (error) {
        console.error("Error loading users from storage:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadUsersFromStorage();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const saveUsersToStorage = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        } catch (error) {
          console.error("Error saving users to storage:", error);
        }
      };

      saveUsersToStorage();
    }
  }, [users, isInitialized]);

  const addUser = useCallback((user: User) => {
    setUsers((prev) => [...prev, user]);
  }, []);

  const removeUser = useCallback((index: number) => {
    setUsers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearUsers = useCallback(async () => {
    setUsers([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing users from storage:", error);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND}/api/data?page=1&limit=8`);
      const data = await response.json();
      if (data.success && data.items) {
        const formattedUsers = data.items.map((item: any) => item.data);
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const addSendingEmail = (email: string) => {
    setSendingIndividualEmails((prev) => new Set([...prev, email]));
  };

  const removeSendingEmail = (email: string) => {
    setSendingIndividualEmails((prev) => {
      const newSet = new Set(prev);
      newSet.delete(email);
      return newSet;
    });
  };

  const addSentEmail = useCallback((email: string) => {
    setSentEmails((prev) => new Set([...prev, email]));
  }, []);

  const clearSentEmails = useCallback(() => {
    setSentEmails(new Set());
  }, []);

  return (
    <UsersContext.Provider
      value={{
        users,
        setUsers,
        addUser,
        removeUser,
        clearUsers,
        refreshUsers,
        triggerRefresh,
        refreshTrigger,
        isSendingToAll,
        sendingIndividualEmails,
        setIsSendingToAll,
        addSendingEmail,
        removeSendingEmail,
        sentEmails,
        addSentEmail,
        clearSentEmails,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};
