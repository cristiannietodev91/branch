import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native";
import Snackbar from "react-native-snackbar";
import messaging from "@react-native-firebase/messaging";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import styles from "../../styles/App.scss";

import ListVehiculos from "../../components/Vehiculos/ListVehiculo";
import Loading from "../../components/Loading";
import { URL_SERVICES } from "@env";

import { VehiclesStackScreenProps } from "../../../types/types";

export default function Vehiculo({
  navigation,
}: VehiclesStackScreenProps<"Main">) {
  const [isLoading, setLoading] = useState(true);
  const [vehiculos, setListVehiculos] = useState([]);

  const user = auth().currentUser;

  useEffect(() => {
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
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetch(URL_SERVICES + "vehiculo/getByIdUsuario/" + user?.uid, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then((err) => Promise.reject(err));
          }
        })
        .then((json) => {
          setListVehiculos(json);
          setLoading(false);
        })
        .catch((error) => {
          if (error.message) {
            Snackbar.show({
              text: error.message,
              duration: Snackbar.LENGTH_SHORT,
            });
          }
        });
    }, [user])
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Loading isVisible={true} text="Cargando" />
      ) : (
        <ListVehiculos
          vehiculos={vehiculos}
          navigation={navigation}
          user={user}
        />
      )}
    </SafeAreaView>
  );
}
