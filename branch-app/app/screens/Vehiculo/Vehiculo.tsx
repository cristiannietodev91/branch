import React, { useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native";
import Snackbar from "react-native-snackbar";
import messaging from "@react-native-firebase/messaging";
import auth from "@react-native-firebase/auth";
import styles from "../../styles/App.scss";

import ListVehiculos from "../../components/Vehiculos/ListVehiculo";
import Loading from "../../components/Loading";

import { ListVehicles } from "../../../types/types";
import useFetch from "../../hooks/useFetch";
import useMutation from "../../hooks/useMutation";
import { useFocusEffect } from "@react-navigation/native";

export default function Vehiculo() {
  const user = auth().currentUser;

  const {
    data: listVehicles,
    loading,
    error: errorGettingVehicles,
    getData: getVehicles,
  } = useFetch<ListVehicles>(`vehiculo/getByIdUsuario/${user?.uid}`);

  const { mutate: updateUser } = useMutation(`usuario/update/${user?.uid}`);

  useFocusEffect(
    useCallback(() => {
      getVehicles();
    }, [getVehicles])
  );

  if (errorGettingVehicles) {
    Snackbar.show({
      text: errorGettingVehicles.message,
      duration: Snackbar.LENGTH_LONG,
    });
  }

  useEffect(() => {
    messaging()
      .getToken()
      .then(async (token) => {
        console.log(token);
        let usuario = {
          tokenCM: token,
          celular: user?.phoneNumber,
        };

        const { error: errorUpdateUser } = await updateUser(usuario);

        if (errorUpdateUser) {
          Snackbar.show({
            text: "Ocurrio un error al actualizar el token",
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          Snackbar.show({
            text: error?.message,
            duration: Snackbar.LENGTH_LONG,
          });
        }
      });
    // Listen to whether the token changes
    return messaging().onTokenRefresh(async (token) => {
      const usuario = {
        tokenCM: token,
        celular: user?.phoneNumber,
      };

      const { error: errorUpdateUser } = await updateUser(usuario);

      if (errorUpdateUser) {
        Snackbar.show({
          text: "Ocurrio un error al actualizar el token",
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    });
  }, [updateUser, user]);

  return (
    <SafeAreaView style={styles.container}>
      {loading || listVehicles === null || user === null ? (
        <Loading />
      ) : (
        <ListVehiculos vehicles={listVehicles} user={user} />
      )}
    </SafeAreaView>
  );
}
