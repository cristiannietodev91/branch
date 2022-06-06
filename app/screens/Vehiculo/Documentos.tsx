import React from "react";
import Documento from "../../components/Vehiculos/Documento";
import { View, ScrollView } from "react-native";
import styles from "../../styles/App.scss";

export default function Documentos(props: any) {
  const { navigation } = props;
  const { vehiculo, setIsReloadData } = navigation.state.params;

  return (
    <ScrollView>
      <View style={styles.scrollContainer}>
        <Documento
          vehiculo={vehiculo}
          navigation={navigation}
          titleDocumento="SOAT"
          tipoDocumento="soat"
          documento={vehiculo.soat}
          setIsReloadData={setIsReloadData}
        />
        <Documento
          vehiculo={vehiculo}
          navigation={navigation}
          titleDocumento="TECNO MECANICA"
          tipoDocumento="tecnomecanica"
          documento={vehiculo.tecnomecanica}
          setIsReloadData={setIsReloadData}
        />
        <Documento
          vehiculo={vehiculo}
          navigation={navigation}
          titleDocumento="TARJETA PROPIEDAD"
          tipoDocumento="tarjetapropiedad"
          documento={vehiculo.tarjetapropiedad}
          setIsReloadData={setIsReloadData}
        />
      </View>
    </ScrollView>
  );
}
