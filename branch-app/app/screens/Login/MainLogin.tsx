import React from "react";
import styles from "../../styles/App.scss";
import auth from "@react-native-firebase/auth";
import { LogoBranch } from "./../../../assets/svg/BranchLogo";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { View, ImageBackground } from "react-native";
import { Button, Text } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";

export default function MainLogin() {
  const navigation = useNavigation();

  const onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);

    if (!result.isCancelled) {
      const data = await AccessToken.getCurrentAccessToken();

      if (data) {
        const facebookCredential = auth.FacebookAuthProvider.credential(
          data.accessToken
        );
        await auth().signInWithCredential(facebookCredential);
      }
    }
  };

  return (
    <View style={[styles.container, styles.darkContainer]}>
      <ImageBackground
        source={require("../../../assets/bg_sin_logo.jpg")}
        style={styles.bgSelectLogin}
      >
        <View style={styles.logoLogin}>
          <LogoBranch />
        </View>
        <View style={styles.containerButtonsLogin}>
          <Button
            title="Iniciar sesion con Facebook"
            onPress={() =>
              onFacebookButtonPress().then(() =>
                console.log("Signed in with Facebook!")
              )
            }
            buttonStyle={styles.buttonPrimary}
            titleStyle={styles.buttonText}
          />
          <Button
            title="Iniciar sesion con Email"
            onPress={() => {
              // TODO: Navigation fix issue
              navigation.navigate("Login");
            }}
            buttonStyle={styles.buttonPrimary}
            titleStyle={styles.buttonText}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <Text style={styles.txtWhite}>No tienes una cuenta?</Text>
          <Button
            title="Registrate"
            type="clear"
            onPress={() => {
              // TODO: Navigation fix issue
              navigation.navigate("Register");
            }}
            titleStyle={styles.buttonClear}
          />
        </View>
      </ImageBackground>
    </View>
  );
}
