import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CardUser from "@/components/card-user";

const index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CardUser />
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});
