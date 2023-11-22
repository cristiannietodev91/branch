import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import Snackbar from "react-native-snackbar";
import messaging from "@react-native-firebase/messaging";
import auth from "@react-native-firebase/auth";
import styles from "../../styles/App.scss";

import ListVehiculos from "../../components/Vehiculos/ListVehiculo";
import Loading from "../../components/Loading";

import { ListVehicles } from "../../../types/types";
import useFetch from "../../hooks/useFetch";

export default function Vehiculo() {
  const user = auth().currentUser;

  const {
    data: listVehicles,
    loading,
    error,
    getData: getVehicles,
  } = useFetch<ListVehicles>(`vehiculo/getByIdUsuario/${user?.uid}`);

  useEffect(() => {
    getVehicles();
  }, [getVehicles]);

  if (error) {
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  }

  // TODO: Fix error updating message token
  /*useEffect(() => {
    messaging()
      .getToken()
      .then((token) => {
        let usuario = {
          tokenCM: token,
          celular: user?.phoneNumber,
        };
        fetch(URL_SERVICES + "usuario/update/" + user?.uid, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuario),
        })
          .then((response) => {
            if (response.status === 202) {
              return response.json();
            } else {
              Snackbar.show({
                text: "Ocurrio un error al actualizar el token",
                duration: Snackbar.LENGTH_SHORT,
              });
            }
            setLoading(false);
          })
          .catch((error) => console.error(error));
      });
    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      console.log("Token renovado :::>", token);
    });
  }, [user]);*/

  return (
    <SafeAreaView style={styles.container}>
      {loading || listVehicles === null ? (
        <Loading isVisible={true} text="Loading" />
      ) : (
        <ListVehiculos vehicles={listVehicles} user={user} />
      )}
    </SafeAreaView>
  );
}
