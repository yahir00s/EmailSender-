import { StyleSheet, Text, View, useColorScheme } from "react-native";
import React from "react";
import { Colors } from "@/constants/theme";

interface AvatarCircleProps {
  name: string;
  size?: number;
}

const AvatarCircle = ({ name, size = 40 }: AvatarCircleProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const initial = name.charAt(0).toUpperCase();

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Text
        style={[
          styles.initial,
          {
            color: theme.background,
            fontSize: size * 0.5,
          },
        ]}
      >
        {initial}
      </Text>
    </View>
  );
};

export default AvatarCircle;

const styles = StyleSheet.create({
  circle: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "black",
  },
  initial: {
    fontWeight: "bold",
  },
});
