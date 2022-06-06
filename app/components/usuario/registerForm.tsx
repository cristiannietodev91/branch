import React from "react";
import { StyleSheet, View } from "react-native";
import { Input } from "@rneui/themed";

export default function RegisterForm() {
  return (
    <View style={styles.formContainer}>
      <Input placeholder="Correo electronico" />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
});
