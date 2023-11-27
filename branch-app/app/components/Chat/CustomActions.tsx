import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Icon, Image } from "@rneui/themed";
import styles from "../../styles/App.scss";
import UploadImageToS3 from "../../utils/UploadImageToS3";
import Snackbar from "react-native-snackbar";

type CustomActionsProps = {
  onSend: (imageUrl: string) => void;
};

export default function CustomActions(props: CustomActionsProps) {
  const { onSend } = props;

  const onActionsPress = async () => {
    try {
      const { data } = await UploadImageToS3();
      if (data) {
        const { url } = data;

        let urlFile = url.substring(0, url.indexOf("?"));
        onSend(urlFile);
      }
    } catch (error) {
      if (error instanceof Error) {
        Snackbar.show({
          text: error.message,
          duration: Snackbar.LENGTH_LONG,
        });
      }
    }
  };

  return (
    <TouchableOpacity
      style={styles.chatUploadContainer}
      onPress={onActionsPress}
    >
      <RenderIcon />
    </TouchableOpacity>
  );
}

function RenderIcon(props: any) {
  const { renderIcon } = props;
  if (renderIcon) {
    return renderIcon;
  } else {
    return (
      <View>
        <Image
          source={require("./../../../assets/drawable-xxxhdpi/button.png")}
          style={styles.iconButtonImage}
        />
        <Icon
          containerStyle={styles.iconButtonIcon}
          name="cloud-upload-outline"
          type="material-community"
          color="#0396c8"
          size={25}
        />
      </View>
    );
  }
}
