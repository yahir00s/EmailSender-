import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import CardUser from "@/components/card-user";
import ButtonSendToAll from "@/components/ui/btn-send-to-all";
import ButtonAddJson from "@/components/ui/btn-add-json";
import SearchBar from "@/components/ui/search-bar";
import { useUsers } from "@/context/UsersContext";

const index = () => {
  const { refreshUsers } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      refreshUsers();
    }, [refreshUsers])
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ButtonSendToAll />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <CardUser searchQuery={searchQuery} />
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
