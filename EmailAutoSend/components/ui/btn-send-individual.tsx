import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import AnimatedAlert from "./animatedAlert";
import { useAlert } from "@/context/AlertContext";
import { BACKEND } from "@/app/config";

interface ButtonSendIndividualProps {
  data: any;
  onSuccess?: () => void;
}

const ButtonSendIndividual: React.FC<ButtonSendIndividualProps> = ({
  data,
  onSuccess,
}) => {
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
      console.log(data)

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
        style={[styles.container, sending && styles.sending]}
        onPress={handleSendMessage}
        disabled={sending}
      >
        <Ionicons
          name={sending ? "hourglass" : "send"}
          size={24}
          color={sending ? Colors.light.tint : "black"}
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
});
