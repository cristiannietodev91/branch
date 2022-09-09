import React from "react";
import { SafeAreaView, ImageBackground, StyleSheet } from "react-native";

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/bg_sin_logo.jpg")}
        style={styles.image}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    flexDirection: "column",
    justifyContent: "center",
  },
});
