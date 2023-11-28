import React, { useCallback, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import ListCitas from "../../components/citas/ListCitas";
import Loading from "../../components/Loading";
import { View } from "react-native";
import styles from "./../../styles/App.scss";
import {
  ActiveAppointmentStackScreenProps,
  ListAppointment,
} from "../../../types/types";
import useFetch from "../../hooks/useFetch";

const CitasScreen = ({
  navigation,
  route,
}: ActiveAppointmentStackScreenProps<"NavigateAppointment">) => {
  const { etapa } = route.params;

  const user = auth().currentUser;

  const urlAppointments = useCallback(() => {
    switch (etapa) {
      case "Pasadas":
        return `cita/getPasadasByIdUsuario/${user?.uid}`;
      case "Activas":
        return `cita/getActivasByIdUsuario/${user?.uid}`;
      case "Futuras":
        return `cita/getFuturasByIdUsuario/${user?.uid}`;
      default:
        return `cita/getFuturasByIdUsuario/${user?.uid}`;
    }
  }, [etapa, user]);

  const {
    data: appointments,
    getData: getAppointments,
    loading,
  } = useFetch<ListAppointment>(urlAppointments());

  useEffect(() => {
    getAppointments();
  }, [getAppointments]);

  return (
    <View style={[styles.container, styles.datesContainer]}>
      {loading || !appointments ? (
        <Loading />
      ) : (
        <ListCitas citas={appointments} navigation={navigation} etapa={etapa} />
      )}
    </View>
  );
};

export default CitasScreen;
