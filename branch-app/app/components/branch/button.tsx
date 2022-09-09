import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  GestureResponderEvent,
} from "react-native";
import { Icon } from "@rneui/themed";
import styles from "../../styles/App.scss";

type ButtonBranch = {
  iconName: string;
  onPress: (event: GestureResponderEvent) => void;
};

export default function buttonBranch(props: ButtonBranch) {
  const { iconName, onPress } = props;
  return (
    <View style={styles.iconButton}>
      <Image
        source={require("./../../../assets/drawable-xxxhdpi/button.png")}
        style={styles.iconButtonImage}
      />
      <TouchableOpacity onPress={onPress} style={styles.iconButtonIcon}>
        <Icon name={iconName} type="material-community" color="#0396c8" />
      </TouchableOpacity>
    </View>
  );
}
