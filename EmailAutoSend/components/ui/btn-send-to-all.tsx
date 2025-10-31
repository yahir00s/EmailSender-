import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAlert } from "@/context/AlertContext";
import { BACKEND } from "@/app/config";

interface ButtonSendIndividualProps {
  data?: any;
  onSuccess?: () => void;
}
const ButtonSendToAll = ({ data, onSuccess }: ButtonSendIndividualProps) => {
  const { showAlert } = useAlert();
  const [sending, setSending] = useState(false);
  const handleSendMessage = async () => {
    if (sending) return;

    setSending(true);
    try {
      const response = await fetch(`${BACKEND}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(data);

      const result = await response.json();

      if (result.success) {
        showAlert("Datos enviados correctamente", "success");
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
    <View style={styles.container}>
      <Text style={styles.text}>Enviar mensaje a todos los correos</Text>
      <Ionicons name={"send"} size={24} color={"white"} />
    </View>
  );
};

export default ButtonSendToAll;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.light.primary,
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    color: "white",
  },
});
