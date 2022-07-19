import React from "react";
import Documento from "../../components/Vehiculos/Documento";
import { View, ScrollView } from "react-native";
import styles from "../../styles/App.scss";
import { VehiclesStackScreenProps } from "../../../types/types";

export default function Documentos(
  props: VehiclesStackScreenProps<"Documents">
) {
  const { navigation, route } = props;
  const { vehiculo } = route.params;

  return (
    <ScrollView>
      <View style={styles.scrollContainer}>
        <Documento
          vehiculo={vehiculo}
          navigation={navigation}
          titleDocumento="SOAT"
          tipoDocumento="soat"
          documento={vehiculo.soat}
        />
        <Documento
          vehiculo={vehiculo}
          navigation={navigation}
          titleDocumento="TECNO MECANICA"
          tipoDocumento="tecnomecanica"
          documento={vehiculo.tecnomecanica}
        />
        <Documento
          vehiculo={vehiculo}
          navigation={navigation}
          titleDocumento="TARJETA PROPIEDAD"
          tipoDocumento="tarjetapropiedad"
          documento={vehiculo.tarjetapropiedad}
        />
      </View>
    </ScrollView>
  );
}
