import React, { useState, useEffect } from "react";
import styles from "../../styles/App.scss";
import auth from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native";
import Loading from "../../components/Loading";
import ListTalleres from "../../components/talleres/ListTalleres";
import { URL_SERVICES } from "@env";

export default function Talleres(props: any) {
  const { navigation } = props;
  const [isLoading, setLoading] = useState(true);
  const [vehiculos, setLisVehiculo] = useState([]);

  console.log("Url services ::>", URL_SERVICES);

  const user = auth().currentUser;

  useEffect(() => {
    fetch(URL_SERVICES + "vehiculo/getByIdUsuario/" + user?.uid)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setLisVehiculo(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Loading isVisible={true} text="Cargando" />
      ) : (
        <ListTalleres vehiculos={vehiculos} navigation={navigation} />
      )}
    </SafeAreaView>
  );
}
