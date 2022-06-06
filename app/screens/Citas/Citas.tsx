import React, { useState, useEffect, useCallback } from "react";
import auth from "@react-native-firebase/auth";
import ListCitas from "../../components/citas/ListCitas";
import Loading from "../../components/Loading";
import { URL_SERVICES } from "@env";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import styles from "./../../styles/App.scss";

type RootStackParamList = {
  Cita: {
    etapa: string;
  };
};

type CitaScreenRouteProp = RouteProp<RootStackParamList, "Cita">;

const CitasScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<CitaScreenRouteProp>();
  const isFocused = useIsFocused();
  const { etapa } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [citas, setListCitas] = useState([]);
  const [, setReloadData] = useState(false);

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

  useEffect(() => {
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

    setReloadData(false);
  }, [isFocused, urlws]);

  return (
    <SafeAreaView
      style={[styles.container, styles.datesContainer, { paddingTop: 1 }]}
    >
      {isLoading ? (
        <Loading isVisible={true} text="Cargando" />
      ) : (
        <ListCitas
          style={[styles.container, styles.content]}
          citas={citas}
          navigation={navigation}
          setIsReloadData={setReloadData}
          etapa={etapa}
        />
      )}
    </SafeAreaView>
  );
};

export default CitasScreen;
