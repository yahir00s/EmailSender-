import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CardUser from "@/components/card-user";
import ButtonAddJson from "@/components/ui/btn-add-json";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <SafeAreaView style={styles.container}>
        <CardUser searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </SafeAreaView>
      <ButtonAddJson />
    </>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
  },
});
