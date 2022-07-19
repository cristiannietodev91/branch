import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text } from "react-native";
import { Card, Icon } from "@rneui/themed";
import { URL_SERVICES } from "@env";
import ListServicios from "../../components/servicios/ListServicios";
import Loading from "../../components/Loading";
import { VehiclesStackScreenProps } from "../../../types/types";

export default function Servicios(props: VehiclesStackScreenProps<"Services">) {
  const { navigation, route } = props;
  const { vehiculo } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [servicios, setListServicios] = useState([]);
  const [, setListServiciosVehiculo] = useState([]);
  const [gastosTotal, setGastosTotal] = useState(0);

  useEffect(() => {
    fetch(URL_SERVICES + "servicios/getAll")
      .then((response) => response.json())
      .then((json) => {
        //console.log("Respuesta motos ::>", json);
        setListServicios(json);
      })
      .catch((error) => console.error(error));

    fetch(URL_SERVICES + "servicios/getByVehiculo/" + vehiculo.IdVehiculo, {
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
        //console.log("Respuesta motos ::>", json);
        if (Array.isArray(json)) {
          let gastos = 0;
          json.map((element) => {
            gastos += element.valor;
          });
          setGastosTotal(gastos);
        }
        setListServiciosVehiculo(json);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [vehiculo]);

  const currencyFormat = (num: Number) => {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  return (
    <SafeAreaView>
      {isLoading ? (
        <Loading isVisible={true} text="Cargando" />
      ) : (
        <View>
          <Card
            containerStyle={{
              backgroundColor: "#8bd2e8",
              height: 150,
              justifyContent: "center",
              elevation: 4,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                type="material-community"
                name="cash-multiple"
                size={50}
                color="#257206"
                containerStyle={{
                  height: 50,
                  alignItems: "flex-start",
                }}
              />
              <View style={{ marginLeft: 50 }}>
                <Text>Has gastado este mes</Text>
                <Text
                  style={{
                    fontSize: 22,
                    textAlign: "right",
                    alignContent: "flex-end",
                  }}
                >
                  {currencyFormat(gastosTotal)}
                </Text>
              </View>
            </View>
          </Card>
          <ListServicios
            vehiculo={vehiculo}
            servicios={servicios}
            navigation={navigation}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
