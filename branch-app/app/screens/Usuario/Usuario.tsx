import React, { useState, useEffect, useCallback } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import styles from "../../styles/App.scss";
import { ImageBackground, View, Text } from "react-native";
import { Button, Icon, Image } from "@rneui/base";
import Loading from "../../components/Loading";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import ButtonBranch from "../../components/branch/button";
import { User, UserStackScreenProps } from "../../../types/types";
import useFetch from "../../hooks/useFetch";
import { useFocusEffect } from "@react-navigation/native";
import Snackbar from "react-native-snackbar";

export default function Usuario(props: UserStackScreenProps<"User">) {
  const { navigation } = props;
  const [facebookUser, setFacebookUser] =
    useState<FirebaseAuthTypes.UserInfo>();

  let userLogged = auth().currentUser;

  const {
    data: user,
    getData: getUser,
    loading,
  } = useFetch<User>(`usuario/getByEmail/${userLogged?.email}`);

  const loadFacebookUser = useCallback(() => {
    if (userLogged) {
      userLogged.providerData.forEach(async (provider) => {
        if (provider.providerId === "facebook.com") {
          setFacebookUser(provider);
        }
      });
    }
  }, [userLogged]);

  useEffect(() => {
    loadFacebookUser();
  }, [loadFacebookUser]);

  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [getUser])
  );

  const joinFacebookAccount = async () => {
    if (userLogged) {
      try {
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

            await userLogged.linkWithCredential(facebookCredential);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_LONG,
          });
        }
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/bg_sin_logo.jpg")}
      style={[styles.bgLogin, styles.bgProfile]}
    >
      {loading || !user ? (
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
