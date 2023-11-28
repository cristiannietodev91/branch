import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Overlay } from "@rneui/themed";

export default function Loading() {
  return (
    <Overlay
      isVisible={true}
      overlayStyle={{ ...style.overlay, backgroundColor: "transparent" }}
    >
      <View style={style.view}>
        <ActivityIndicator size="large" color="#5be5e5" />
      </View>
    </Overlay>
  );
}

const style = StyleSheet.create({
  overlay: {
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#00a680",
    textTransform: "uppercase",
    marginTop: 10,
  },
});
