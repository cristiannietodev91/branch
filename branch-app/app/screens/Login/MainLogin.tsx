import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import styles from "../../styles/App.scss";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import Snackbar from "react-native-snackbar";
import { LogoBranch } from "./../../../assets/svg/BranchLogo";
import { URL_SERVICES } from "@env";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { View, ImageBackground, SafeAreaView } from "react-native";
import { Button, Text } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";

export default function MainLogin() {
  const navigation = useNavigation();
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  // Handle user state changes
  async function onAuthStateChanged(user: any) {
    setUser(user);
  }

  if (user) {
    const { email } = user;

    fetch(URL_SERVICES + `usuario/getByEmail/${email}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          Snackbar.show({
            text: "Ocurrio un error al buscar usuario",
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .then((json) => {
        const { IdUsuario } = json;
        if (IdUsuario) {
          // Actualizar info usuario en Base de usuario
          const userToUpdate = {
            firstName: user?.displayName,
            uid: user?.uid,
            typeDevice: Platform.OS,
            email: email,
          };

          fetch(URL_SERVICES + `usuario/updateByIdUsuario/${IdUsuario}`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userToUpdate),
          }).then((response) => {
            if (response.status == 202) {
              return response.json();
            } else {
              Snackbar.show({
                text: "Ocurrio un error al actualizar el token",
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          });
          //TODO: navigation fix issue
          //navigation.navigate("Main");
        }
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);

    if (result.isCancelled) {
      throw "User cancelled the login process";
    }

    // Get the email
    //

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw "Something went wrong obtaining access token";
    }
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken
    );

    //const profile = await getFacebookProfile();

    //const { email, name } = profile;

    console.log("Data auth :::>", email);

    // Sign-in the user with the credential
    auth()
      .signInWithCredential(facebookCredential)
      .then(() => {
        console.log("Autenticacion exitosa con facebook");
      })
      .catch(async (error) => {
        console.log("Error autenticacion con facebook", error);
        /*if (email) {
          const providers = await auth().fetchSignInMethodsForEmail(email);

          providers.forEach((provider) => {
            if (provider == "password") {
              Snackbar.show({
                text: "El usuario esta asociado al metodo de autenticación Usuario y contraseña, Ingrese y asocie la cuenta desde el menu del usuario",
                duration: Snackbar.LENGTH_LONG,
              });
            }
          });
        }*/
      });
  };

  return (
    <SafeAreaView style={[styles.container, styles.darkContainer]}>
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
    </SafeAreaView>
  );
}
