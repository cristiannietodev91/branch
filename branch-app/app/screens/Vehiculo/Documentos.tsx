import React from "react";
import Documento from "../../components/Vehiculos/Documento";
import { View, ScrollView } from "react-native";
import styles from "../../styles/App.scss";
import { VehiclesStackScreenProps } from "../../../types/types";

export default function Documentos(
  props: VehiclesStackScreenProps<"Documents">
) {
  const { navigation, route } = props;
  const { vehicle } = route.params;

  return (
    <ScrollView>
      <View style={styles.scrollContainer}>
        <Documento
          vehiculo={vehicle}
          navigation={navigation}
          titleDocumento="SOAT"
          tipoDocumento="soat"
          documento={vehicle.soat}
        />
        <Documento
          vehiculo={vehicle}
          navigation={navigation}
          titleDocumento="TECNO MECANICA"
          tipoDocumento="tecnomecanica"
          documento={vehicle.tecnomecanica}
        />
        <Documento
          vehiculo={vehicle}
          navigation={navigation}
          titleDocumento="TARJETA PROPIEDAD"
          tipoDocumento="tarjetapropiedad"
          documento={vehicle.tarjetapropiedad}
        />
      </View>
    </ScrollView>
  );
}
