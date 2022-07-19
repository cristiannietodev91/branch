import React, { useState, useCallback } from "react";
import auth from "@react-native-firebase/auth";
import ListCitas from "../../components/citas/ListCitas";
import Loading from "../../components/Loading";
import { URL_SERVICES } from "@env";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./../../styles/App.scss";
import { ActiveAppoinmentStackScreenProps } from "../../../types/types";

const CitasScreen = ({
  navigation,
  route,
}: ActiveAppoinmentStackScreenProps<"NavigateAppoinment">) => {
  const { etapa } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [citas, setListCitas] = useState([]);

  console.log("Navigation ", route.params);

  console.log("Url services :::>", URL_SERVICES);

  const user = auth().currentUser;

  const urlws = useCallback(() => {
    switch (etapa) {
      case "Pasadas":
        return URL_SERVICES + "cita/getPasadasByIdUsuario/" + user?.uid;
      case "Activas":
        return URL_SERVICES + "cita/getActivasByIdUsuario/" + user?.uid;
      case "Futuras":
        return URL_SERVICES + "cita/getFuturasByIdUsuario/" + user?.uid;
      default:
        return URL_SERVICES + "cita/getFuturasByIdUsuario/" + user?.uid;
    }
  }, [etapa, user]);

  useFocusEffect(
    useCallback(() => {
      fetch(urlws())
        .then((response) => response.json())
        .then((json) => {
          //console.log("Respuesta motos ::>", json);
          setListCitas(json);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }, [urlws])
  );

  return (
    <SafeAreaView
      style={[styles.container, styles.datesContainer, { paddingTop: 1 }]}
    >
      {isLoading ? (
        <Loading isVisible={true} text="Cargando" />
      ) : (
        <ListCitas citas={citas} navigation={navigation} etapa={etapa} />
      )}
    </SafeAreaView>
  );
};

export default CitasScreen;
