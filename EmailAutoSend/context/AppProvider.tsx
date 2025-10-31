import React from "react";
import { UsersProvider } from "./UsersContext";
import { AlertProvider } from "./AlertContext";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AlertProvider>
      <UsersProvider>{children}</UsersProvider>
    </AlertProvider>
  );
};
