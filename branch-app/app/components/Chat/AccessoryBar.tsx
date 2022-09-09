import { Icon, IconProps } from "@rneui/themed";
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

import {
  getLocationAsync,
  pickImageAsync,
  takePictureAsync,
} from "./mediaUtils";

export default function AccessoryBar(props: any) {
  const { onSend, isTyping } = props;
  return (
    <View style={styles.container}>
      <Button onPress={() => pickImageAsync(onSend)} name="photo" />
      <Button onPress={() => takePictureAsync(onSend)} name="camera" />
      <Button onPress={() => getLocationAsync(onSend)} name="my-location" />
      <Button
        onPress={() => {
          isTyping();
        }}
        name="chat"
      />
    </View>
  );
}

interface ButtonProps extends IconProps {
  onPress: (event: GestureResponderEvent) => void;
  size?: number;
  color?: string;
}

const Button = ({
  onPress,
  size = 30,
  color = "#0396c8",
  ...props
}: ButtonProps) => (
  <TouchableOpacity onPress={onPress}>
    <Icon size={size} color={color} {...props} name="plus" type="material" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#bde1e1",
  },
});
