import React from "react";
import { View, TouchableOpacity } from "react-native";
import { URL_SERVICES } from "@env";
import { launchImageLibrary } from "react-native-image-picker";
import { Icon, Image } from "@rneui/themed";
import styles from "../../styles/App.scss";

type CustomActionsProps = {
  onSend: (list: any[]) => void;
};

export default function CustomActions(props: CustomActionsProps) {
  const { onSend } = props;
  const onActionsPress = () => {
    const options = {
      mediaType: "photo" as const,
      quality: 1 as const,
      maxWidth: 500,
      maxHeight: 500,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.errorMessage) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets) {
        const { uri, fileName, type } = response.assets[0];

        fetch(URL_SERVICES + "file/signedURL", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: fileName,
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((url) => {
            console.log("Url to load :::>", url);
            fetch(url, {
              method: "PUT",
              headers: {
                "Content-Type": type,
              },
              body: {
                uri: uri,
                type: type,
                name: fileName,
              },
            })
              .then((response: any) => {
                console.log("Response :::>", response);
                let url: string = response.url.substring(
                  0,
                  response.url.indexOf("?")
                );

                onSend([{ image: url }]);
              })
              .catch((error: any) => console.error(error));
          })
          .catch((error) => console.error(error));
      }
    });
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
      <View style={styles.iconButton}>
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
