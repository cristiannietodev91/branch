import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "@rneui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../../styles/App.scss";

interface FloatingActionButtonProps {
  onPress: () => void;
  iconName?: string;
  iconType?: string;
  iconColor?: string;
  position?: {
    right?: number;
    left?: number;
    bottom?: number;
    offsetBottom?: number;
  };
}

export default function FloatingActionButton({
  onPress,
  iconName = "add",
  iconType = "material",
  iconColor = "#FFFFFF",
  position = { right: 15, offsetBottom: 80 },
}: FloatingActionButtonProps) {
  const insets = useSafeAreaInsets();

  // Calculate bottom position considering safe area insets
  const bottomPosition =
    (position.offsetBottom || 0) - insets.bottom + (position.bottom || 0);

  return (
    <TouchableOpacity
      style={[
        styles.fabButton,
        position.right !== undefined ? { right: position.right } : null,
        position.left !== undefined ? { left: position.left } : null,
        { bottom: bottomPosition },
      ]}
      onPress={onPress}
    >
      <Icon name={iconName} type={iconType} color={iconColor} size={24} />
    </TouchableOpacity>
  );
}
