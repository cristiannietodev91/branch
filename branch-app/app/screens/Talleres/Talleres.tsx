import React, { useEffect } from "react";
import styles from "../../styles/App.scss";
import auth from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native";
import Loading from "../../components/Loading";
import ListTalleres from "../../components/talleres/ListTalleres";
import { ListVehicles, WorkShopStackScreenProps } from "../../../types/types";
import useFetch from "../../hooks/useFetch";

export default function Talleres(props: WorkShopStackScreenProps<"Main">) {
  const { navigation } = props;

  const user = auth().currentUser;

  const {
    data: vehicles,
    getData: getVehicles,
    loading,
  } = useFetch<ListVehicles>(`vehiculo/getByIdUsuario/${user?.uid}`);

  useEffect(() => {
    getVehicles();
  }, [getVehicles]);

  return (
    <SafeAreaView style={styles.container}>
      {loading || !vehicles ? (
        <Loading isVisible={true} text="Cargando" />
      ) : (
        <ListTalleres vehiculos={vehicles} navigation={navigation} />
      )}
    </SafeAreaView>
  );
}
