import React, { useState, useEffect, useCallback } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import styles from "../../styles/App.scss";
import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import { Button, Icon, Image } from "@rneui/base";
import { URL_SERVICES } from "@env";
import Loading from "../../components/Loading";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { launchImageLibrary } from "react-native-image-picker";
import ButtonBranch from "../../components/branch/button";
import { UserStackScreenProps } from "../../../types/types";
import { useFocusEffect } from "@react-navigation/native";

export default function Usuario(props: UserStackScreenProps<"User">) {
  const { navigation } = props;
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [facebookUser, setFacebookUser] =
    useState<FirebaseAuthTypes.UserInfo>();
  const [urlFoto] = useState();

  let userLogged = auth().currentUser;

  // Handle user state changes
  async function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
  }

  const LoadfacebookUser = useCallback(() => {
    if (userLogged) {
      userLogged.providerData.forEach(async (provider) => {
        if (provider.providerId === "facebook.com") {
          setFacebookUser(provider);
        }
      });
    }
  }, [userLogged]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    LoadfacebookUser();
    return subscriber; // unsubscribe on unmount
  }, [LoadfacebookUser]);

  useFocusEffect(
    useCallback(() => {
      fetch(URL_SERVICES + "/usuario/getByEmail/" + userLogged?.email, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          setUser(json);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }, [userLogged])
  );

  const joinFacebookAccount = async () => {
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

    auth()
      .currentUser?.linkWithCredential(facebookCredential)
      .then((resultado) => {
        console.log("Resltado de asociar cuenta a facebook :::>", resultado);
      })
      .catch((error) => {
        console.log("Error al asociar cuentas :::>", error);
      });
  };

  const uploadImage = async () => {
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

        fetch(URL_SERVICES + "/file/signedURL", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: fileName,
          }),
        })
          .then((response) => {
            response.json().then((url) => {
              fetch(url, {
                method: "PUT",
                headers: {
                  "Content-Type": type || "",
                },
                body: {
                  uri: uri || "",
                  type: type,
                  name: fileName,
                },
              })
                .then(() => {
                  /*let url: string = response.url.substring(
                    0,
                    response.url.indexOf("?")
                  );

                  let key = url.substring(url.lastIndexOf("/") + 1, url.length);
                   setUrlFoto({
                    url: response.url.substring(0, response.url.indexOf("?")),
                    date: new Date().toString(),
                    size: fileSize,
                    type: type,
                    selected: false,
                    validate: false,
                    keynameFile: key,
                    nombreArchivo: fileName,
                  }); */
                })
                .catch((error) => console.error(error));
            });
          })
          .catch((error) => console.error(error));
      }
    });
  };

  /*const getName = async () => {
    console.log("Get firstName ::>", userLogged);
  };*/
  return (
    <ImageBackground
      source={require("../../../assets/bg_sin_logo.jpg")} //LA IDEA ES QUE EL FONDO SEA LA FOTO DE LA MOTO
      style={[styles.bgLogin, styles.bgProfile]}
    >
      {isLoading ? (
        <Loading isVisible={true} text="Cargando" />
      ) : (
        <View style={styles.userCard}>
          <View style={styles.bgUserCard}>
            <Image
              source={require("./../../../assets/drawable-xxxhdpi/bgUserCard.png")}
              style={styles.bgUserCardImage}
            />
            <Text style={[styles.headingUserCard, styles.headingSecondary]}>
              {facebookUser
                ? facebookUser.displayName
                : userLogged?.displayName}
            </Text>
            <View style={styles.userInfoContainer}>
              <View>
                <View style={styles.userInfoItem}>
                  <Icon
                    name="screen-smartphone"
                    type="simple-line-icon"
                    color="#0396c8"
                    size={25}
                  />
                  <Text style={[styles.bodyText, styles.userInfo]}>
                    {userLogged?.phoneNumber}
                  </Text>
                </View>
                <View style={styles.userInfoItem}>
                  <Icon
                    name="email-outline"
                    type="material-community"
                    color="#0396c8"
                    size={25}
                  />
                  <Text style={[styles.bodyText, styles.userInfo]}>
                    {userLogged?.email}
                  </Text>
                </View>
              </View>
              <View>
                <ButtonBranch
                  iconName="pencil-outline"
                  onPress={() => {
                    navigation.navigate("Edit", {
                      usuario: user,
                      usuarioFacebook: facebookUser,
                    });
                  }}
                />
                <ButtonBranch iconName="bell-outline" onPress={() => {}} />
              </View>
            </View>
            <View>
              <Button
                title="Conectar con Facebook"
                onPress={joinFacebookAccount}
                titleStyle={{ marginLeft: 8 }}
                buttonStyle={styles.buttonPrimary}
                disabled={facebookUser ? true : false}
              />
              <Button
                title="Cerrar sesión"
                onPress={() => {
                  auth()
                    .signOut()
                    .then(() => {
                      navigation.navigate("User");
                    });
                }}
                buttonStyle={styles.buttonSecondary}
                titleStyle={styles.buttonText}
              />
            </View>
          </View>
          <View style={[styles.containerAddPhotoUser, styles.regularMargin]}>
            <TouchableOpacity onPress={uploadImage}>
              {!urlFoto ? (
                <View>
                  <Image
                    style={styles.addPhoto}
                    source={require("./../../../assets/drawable-xxxhdpi/addPhotoProfile.png")}
                  />
                  <View style={styles.iconAddPhotoUser}>
                    <Icon
                      name="plus"
                      type="material-community"
                      color="#0396c8"
                      size={25}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <View style={[styles.addPhoto, styles.photo]}>
                    {/* <Image
                      style={styles.addPhoto}
                      source={{ uri: urlFoto.url }}
                    /> */}
                  </View>
                  <View style={styles.iconAddPhotoUser}>
                    <Icon
                      name="pencil-outline"
                      type="material-community"
                      color="#0396c8"
                      size={25}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
            {/* {!facebookUser ? (
              <Icon
                name="arrow-up-bold-circle-outline"
                type="material-community"
                color="#517fa4"
                size={80}
              />
            ) : (
              <Image
                resizeMode="cover"
                style={styles.imageCard}
                source={{
                  uri:
                    "https://graph.facebook.com/" +
                    facebookUser.uid +
                    "/picture?height=500",
                }}
              />
            )}
            <Text style={{ fontSize: 18, color: "#ffffff", fontWeight: "bold" }}>
              {facebookUser ? facebookUser.displayName : user.firstName}
            </Text> */}
          </View>
        </View>
      )}
    </ImageBackground>
  );
}
