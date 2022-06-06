import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Icon } from "@rneui/themed";
import styles from "../../styles/App.scss";

export default function buttonBranch(props: any) {
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
