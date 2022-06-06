import React from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { Card, Icon } from "@rneui/themed";
import styles from "../../styles/App.scss";

export default function ListServicios(props: any) {
  const { servicios, navigation, vehiculo } = props;
  return (
    <FlatList
      horizontal={false}
      data={servicios}
      renderItem={(servicio) => (
        <Servicio
          servicio={servicio.item}
          navigation={navigation}
          vehiculo={vehiculo}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3}
    />
  );
}

function Servicio(props: any) {
  const { servicio, navigation, vehiculo } = props;
  return (
    <TouchableOpacity
      style={styles.containerService}
      onPress={() => {
        navigation.navigate("AgregarServicio", {
          servicio,
          vehiculo,
        });
      }}
    >
      <Card containerStyle={styles.cardService}>
        <Icon
          type="material-community"
          name={servicio.icono}
          size={45}
          color={servicio.color}
          containerStyle={{
            height: 50,
            alignContent: "center",
            justifyContent: "center",
          }}
        />
        <Text
          style={{
            textAlign: "center",
          }}
        >
          {servicio.nombre}
        </Text>
      </Card>
    </TouchableOpacity>
  );
}
