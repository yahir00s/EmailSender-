import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/theme";
import ButtonSendIndividual from "./ui/btn-send-individual";
import { useFetchData } from "@/hooks/use-fetch-data";
import ButtonSendToAll from "./ui/btn-send-to-all";
import { useUsers } from "@/context/UsersContext";

interface User {
  name: string;
  email: string;
}

const CardUser = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useFetchData({
    page,
    limit: 10,
  });
  const { users: globalUsers } = useUsers();

  // Transformar los datos del contexto a un array de usuarios
  const users: User[] = React.useMemo(() => {
    if (!globalUsers || globalUsers.length === 0) return [];

    const allUsers: User[] = [];
    globalUsers.forEach((userData) => {
      Object.entries(userData).forEach(([name, email]) => {
        allUsers.push({
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalizar
          email,
        });
      });
    });

    return allUsers;
  }, [globalUsers]);

  const handleSendSuccess = (name: string) => {
    console.log(`Correo enviado correctamente a ${name}`);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No hay usuarios disponibles</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: User }) => {
    const data = { [item.name]: item.email };

    return (
      <View style={styles.userRow}>
        <View style={styles.userInfo}>
          <Text style={styles.nameText}>Nombre: {item.name}</Text>
          <Text style={styles.emailText}>Correo: {item.email}</Text>
        </View>
        <ButtonSendIndividual
          data={data}
          onSuccess={() => handleSendSuccess(item.name)}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={users}
      keyExtractor={(item, index) => `${item.email}-${index}`}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CardUser;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100, // Espacio para el botón flotante
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 5,
  },
  userInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: "#666",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
