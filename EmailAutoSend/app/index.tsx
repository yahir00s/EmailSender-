import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import CardUser from "@/components/card-user";
import ButtonSendToAll from "@/components/ui/btn-send-to-all";
import ButtonAddJson from "@/components/ui/btn-add-json";
import { useUsers } from "@/context/UsersContext";

const index = () => {
  const { refreshUsers } = useUsers();

  useFocusEffect(
    React.useCallback(() => {
      refreshUsers();
    }, [refreshUsers])
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ButtonSendToAll />
        <CardUser />
      </SafeAreaView>
      <ButtonAddJson />
    </>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});
