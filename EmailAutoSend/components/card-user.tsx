import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "@/constants/theme";
import ButtonSendIndividual from "./ui/btn-send-individual";

interface User {
  name: string;
  email: string;
}

const CardUser = () => {
  const userDataObj: { [key: string]: string } = {
    Yahir: "yairjesus49@gmail.com",
    Juan: "juan@example.com",
    Ana: "ana@example.com",
  };

  const users: User[] = Object.entries(userDataObj).map(([name, email]) => ({
    name,
    email,
  }));

  const handleSendSuccess = (name: string) => {
    console.log(`Correo enviado correctamente a ${name}`);
  };

  const renderItem = ({ item }: { item: User }) => {
    const data = { [item.name]: item.email }; 

    return (
      <View style={styles.userRow}>
        <View>
          <Text>Nombre: {item.name}</Text>
          <Text>Correo: {item.email}</Text>
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
      keyExtractor={(item) => item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

export default CardUser;

const styles = StyleSheet.create({
  container: {
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
});
