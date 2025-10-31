import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AlertProvider } from "@/context/AlertContext";
import CustomHeader from "@/components/ui/custom-header";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AlertProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="add"
            options={{
              header: () => <CustomHeader title="Agregar" />,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AlertProvider>
  );
}
