import { Pressable, StyleSheet, Text, View, Animated } from "react-native";
import React, { useState, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ButtonAddJson = () => {
  const [isVisible, setIsVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const handleToggle = () => {
    const toValue = isVisible ? 0 : 1;
    setIsVisible(!isVisible);
    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const opacity = animation;

  return (
    <>
      {/* Menú en el fondo */}
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
          <Pressable style={styles.option} onPress={() => router.push("/add")}>
            <Text style={styles.optionText}>Agregar emails</Text>
          </Pressable>

          <Pressable style={styles.option} onPress={() => console.log("Borrar todo")}>
            <Text style={styles.optionText}>Borrar todo</Text>
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
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  button:{
    backgroundColor: Colors.light.primary,
    borderRadius: 50,
    padding:10
  }
});