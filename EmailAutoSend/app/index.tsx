import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CardUser from "@/components/card-user";
import ButtonSendToAll from "@/components/ui/btn-send-to-all";
import ButtonAddJson from "@/components/ui/btn-add-json";

const index = () => {
  return (
    <>
    <SafeAreaView style={styles.container}>
      <ButtonSendToAll/>
      <CardUser />
    </SafeAreaView>
    <ButtonAddJson/>
    </>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});
