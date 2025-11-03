import {
  Pressable,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBulkEmail } from "@/hooks/use-bulk-email";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useAlert } from "@/context/AlertContext";
import { useUsers } from "@/context/UsersContext";

const ButtonSendToAll = () => {
  const { sendBulkEmails, isLoading } = useBulkEmail();
  const { data } = useFetchData({ page: 1, limit: 100 });
  const { showAlert } = useAlert();
  const {
    setIsSendingToAll,
    addSendingEmail,
    removeSendingEmail,
    addSentEmail,
    clearSentEmails,
  } = useUsers();

  const handleSendToAll = async () => {
    if (!data?.items || data.items.length === 0) {
      Alert.alert("Error", "No hay usuarios para enviar correos");
      return;
    }

    const allEmails: { [key: string]: string } = {};

    data.items.forEach((item) => {
      Object.entries(item.data).forEach(([name, email]) => {
        allEmails[name] = email;
      });
    });

    const totalEmails = Object.keys(allEmails).length;

    Alert.alert(
      "Confirmar envío masivo",
      `¿Estás seguro de que quieres enviar correos a ${totalEmails} destinatarios?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Enviar",
          onPress: async () => {
            setIsSendingToAll(true);
            clearSentEmails();
            
            Object.values(allEmails).forEach(email => {
              addSendingEmail(email);
            });
        
            try {
              const result = await sendBulkEmails(allEmails, (email, success) => {
                removeSendingEmail(email);
                if (success) {
                  addSentEmail(email);
                }
              });
              
              Alert.alert(
                "Envío completado",
                `✅ Exitosos: ${result.results.success.length}\n❌ Fallidos: ${result.results.failed.length}`,
                [
                  { text: "OK" },
                ]
              );
            } catch (error: any) {
              showAlert("Envio fallido", "error");
            } finally {
              setIsSendingToAll(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Pressable
      style={[styles.button, isLoading && styles.buttonDisabled]}
      onPress={handleSendToAll}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Ionicons name="mail" size={20} color="#fff" style={styles.icon} />
      )}
      <Text style={styles.buttonText}>
        {isLoading ? "Enviando..." : "Enviar mensaje a todos los correos"}
      </Text>
    </Pressable>
  );
};

export default ButtonSendToAll;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
});
