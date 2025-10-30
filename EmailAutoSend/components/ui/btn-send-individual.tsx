import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import AnimatedAlert from "./animatedAlert";
import { useAlert } from "@/context/AlertContext";

const ButtonSendIndividual = () => {
  const { showAlert } = useAlert();


  const handleSendMessaje = () => {
    try {
      showAlert("Mensaje enviado correctamente ", "success")
    } catch (error) {}
  };
  return (
    <View>
      <Pressable style={styles.container} onPress={handleSendMessaje}>
        <Ionicons name="send" size={24} color="black" />
      </Pressable>


    </View>
  );
};

export default ButtonSendIndividual;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
