import { StyleSheet, TextInput, View, useColorScheme } from "react-native";
import React from "react";
import { Colors } from "@/constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.background,
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
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  input: {
    padding: 15,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
