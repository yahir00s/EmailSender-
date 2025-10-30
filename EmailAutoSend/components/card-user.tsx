import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/theme";
import ButtonSendIndividual from "./ui/btn-send-individual";

const CardUser = () => {
  const userData = {
    name: "Yahir",
    email: "yairjesus49@gmail.com",
    timestamp: new Date().toISOString(),
  };

  const handleSendSuccess = () => {
    // Puedes agregar lógica adicional aquí después del envío exitoso
    console.log("Datos enviados correctamente");
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>Nombre: {userData.name}</Text>
        <Text>Correo: {userData.email}</Text>
      </View>
      <ButtonSendIndividual data={userData} onSuccess={handleSendSuccess} />
    </View>
  );
};

export default CardUser;

const styles = StyleSheet.create({
  container: {
    elevation: 10,
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
