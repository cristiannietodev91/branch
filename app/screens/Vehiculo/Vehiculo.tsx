import React, { useState, useEffect } from "react";
import styles from "../../styles/App.scss";
import auth from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native";
import ListVehiculos from "../../components/Vehiculos/ListVehiculo";
import Loading from "../../components/Loading";
import { URL_SERVICES } from "@env";

import messaging from "@react-native-firebase/messaging";
import Snackbar from "react-native-snackbar";

export default function Vehiculo(props: any) {
  //console.log("Params: route ::>", navigation);
  const { navigation } = props;
  const [isLoading, setLoading] = useState(true);
  const [vehiculos, setListVehiculos] = useState([]);
  const [isReloadData, setReloadData] = useState(false);

  const user = auth().currentUser;

  console.log("Url services :::>", URL_SERVICES);

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

  useEffect(() => {
    fetch(URL_SERVICES + "vehiculo/getByIdUsuario/" + user?.uid, {
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
        setListVehiculos(json);
        setLoading(false);
      })
      .catch((error) => console.error(error));
    setReloadData(false);
  }, [isReloadData, user]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Loading isVisible={true} text="Cargando" />
      ) : (
        <ListVehiculos
          vehiculos={vehiculos}
          navigation={navigation}
          setIsReloadData={setReloadData}
          user={user}
        />
      )}
    </SafeAreaView>
  );
}

// function AddVehiculoButton(props: any) {
//   const { navigation, setIsReloadData } = props;
//   return (
//     <ActionButton
//       buttonTextStyle={styles.actionButton}
//       buttonColor="#0396c8"
//       onPress={() => {
//         navigation.navigate("AgregarVehiculo", {
//           setIsReloadData,
//         });
//       }}
//       offsetY={Platform.OS === 'ios' ? 100 : 70}
//       renderIcon={active => (<Icon name="add" />)}>
//     ></ActionButton>
//   );
// }
