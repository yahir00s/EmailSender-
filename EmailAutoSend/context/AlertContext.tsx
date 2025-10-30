import React, { createContext, useState, useContext, ReactNode } from "react";
import AnimatedAlert from "@/components/ui/animatedAlert"; 

type AlertType = "success" | "error";

interface AlertContextProps {
  showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextProps>({
  showAlert: () => {},
});

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AlertType>("success");

  const showAlert = (msg: string, alertType: AlertType = "success") => {
    setMessage(msg);
    setType(alertType);
    setVisible(true);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AnimatedAlert
        visible={visible}
        message={message}
        type={type}
        onHide={() => setVisible(false)}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
