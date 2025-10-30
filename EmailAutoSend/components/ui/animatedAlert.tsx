import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type AlertType = "success" | "error";

interface Props {
  message: string;
  type?: AlertType;
  visible: boolean;
  onHide?: () => void;
}

const AnimatedAlert = ({ message, type = "success", visible, onHide }: Props) => {
  const slideAnim = useRef(new Animated.Value(-100)).current; 
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => onHide && onHide());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: type === "success" ? "#4CAF50" : "#E53935",
          opacity,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Ionicons
        name={type === "success" ? "checkmark-circle" : "close-circle"}
        size={24}
        color="#fff"
        style={{ marginRight: 6 }}
      />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

export default AnimatedAlert;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
});
