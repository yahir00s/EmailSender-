import { StyleSheet, TextInput, View, useColorScheme } from "react-native";
import React from "react";
import { Colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={theme.icon || "#666"} 
          style={styles.icon}
        />
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
            },
          ]}
          placeholder="Buscar por nombre o email..."
          placeholderTextColor={theme.icon}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
  },
});
