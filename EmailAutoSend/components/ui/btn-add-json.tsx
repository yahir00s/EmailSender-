import { Pressable, StyleSheet, Text, View, Animated, Alert } from "react-native";
import React, { useState, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useDeleteAllData } from "@/hooks/use-delete-al-data";

const ButtonAddJson = () => {
  const [isVisible, setIsVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const { deleteAllData, isLoading } = useDeleteAllData();

  const handleToggle = () => {
    const toValue = isVisible ? 0 : 1;
    setIsVisible(!isVisible);
    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Borrar todo",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAllData();
              Alert.alert("Éxito", "Todos los datos han sido eliminados");
              setIsVisible(false);
            } catch (error: any) {
              Alert.alert("Error", error.message || "No se pudo eliminar los datos");
            }
          },
        },
      ]
    );
  };

  const handleAddEmails = () => {
    router.push("/add");
    setIsVisible(false);
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const opacity = animation;

  return (
    <>
      {isVisible && (
        <Animated.View
          style={[
            styles.menu,
            {
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <Pressable 
            style={styles.option} 
            onPress={handleAddEmails}
            disabled={isLoading}
          >
            <Ionicons 
              name="add-circle-outline" 
              size={18} 
              color={Colors.light.primary} 
              style={styles.icon}
            />
            <Text style={styles.optionText}>Agregar emails</Text>
          </Pressable>

          <Pressable
            style={[styles.option, styles.dangerOption]}
            onPress={handleDeleteAll}
            disabled={isLoading}
          >
            <Ionicons 
              name="trash-outline" 
              size={18} 
              color="#e74c3c"
              style={styles.icon}
            />
            <Text style={[styles.optionText, styles.dangerText]}>
              {isLoading ? "Borrando..." : "Borrar todo"}
            </Text>
          </Pressable>
        </Animated.View>
      )}

      <View style={styles.container}>
        <Pressable style={styles.button} onPress={handleToggle}>
          <MaterialCommunityIcons
            name={isVisible ? "menu-close" : "menu-open"}
            size={35}
            color={"white"}
          />
        </Pressable>
      </View>
    </>
  );
};

export default ButtonAddJson;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    right: 20,
    alignItems: "center",
  },
  menu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 100,
    alignItems: "flex-end",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 3,

  },
  dangerOption: {
  },
  optionText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  dangerText: {
    color: "#e74c3c",
  },
  icon: {
    marginRight: 8,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 50,
    padding: 10,
    elevation: 5,

  },
});