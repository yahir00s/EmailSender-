// Context para manejar el estado global de usuarios
import { BACKEND } from "@/app/config";
import React, { createContext, useContext, useState, useCallback } from "react";

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
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const addUser = useCallback((user: User) => {
    setUsers((prev) => [...prev, user]);
  }, []);

  const removeUser = useCallback((index: number) => {
    setUsers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearUsers = useCallback(() => {
    setUsers([]);
  }, []);

  const refreshUsers = useCallback(async () => {
    try {
      // Usar paginación para ser compatible con el nuevo sistema
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
        refreshTrigger
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
