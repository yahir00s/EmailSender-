import { Pressable, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAlert } from "@/context/AlertContext";
import { useUsers } from "@/context/UsersContext";
import { BACKEND } from "@/app/config";

interface ButtonSendIndividualProps {
  data: any;
  email: string; // Agregar el email como prop
  onSuccess?: () => void;
}

const ButtonSendIndividual: React.FC<ButtonSendIndividualProps> = ({
  data,
  email,
  onSuccess,
}) => {
  const { showAlert } = useAlert();
  const { isSendingToAll, sendingIndividualEmails } = useUsers();
  const [sending, setSending] = useState(false);


  const isLoading = sending || isSendingToAll || sendingIndividualEmails.has(email);
  
  // Deshabilitar si está cargando o si se está enviando a todos
  const isDisabled = isLoading || isSendingToAll;

  const handleSendMessage = async () => {
    if (isDisabled) return;

    setSending(true);
    try {
      const response = await fetch(`${BACKEND}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        showAlert("email enviado correctamente", "success");
        onSuccess?.();
      } else {
        throw new Error(result.error || "Error al enviar datos");
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert(
        error instanceof Error ? error.message : "Error al enviar datos",
        "error"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <View>
      <Pressable
        style={[
          styles.container, 
          isLoading && styles.sending,
          isDisabled && styles.disabled
        ]}
        onPress={handleSendMessage}
        disabled={isDisabled}
      >
        <Ionicons
          name={isLoading ? "hourglass" : "send"}
          size={24}
          color={isLoading ? Colors.light.tint : "black"}
        />
      </Pressable>
    </View>
  );
};

export default ButtonSendIndividual;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 8,
  },
  sending: {
    opacity: 0.7,
    backgroundColor: Colors.light.background,
  },
  disabled: {
    opacity: 0.5,
  },
});