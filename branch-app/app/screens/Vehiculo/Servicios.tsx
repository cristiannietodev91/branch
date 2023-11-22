import React, { useEffect } from "react";
import { View, SafeAreaView, Text } from "react-native";
import { Card, Icon } from "@rneui/themed";
import ListServicios from "../../components/servicios/ListServicios";
import Loading from "../../components/Loading";
import { VehiclesStackScreenProps } from "../../../types/types";
import useFetch from "../../hooks/useFetch";

export default function Servicios(props: VehiclesStackScreenProps<"Services">) {
  const { navigation, route } = props;
  const { vehicle } = route.params;
  const { data: servicios, getData: getServices } =
    useFetch("servicios/getAll");
  const { getData: getServicesByVehicle, loading } = useFetch(
    `servicios/getByVehiculo/${vehicle.IdVehiculo}`
  );

  useEffect(() => {
    getServices();
    getServicesByVehicle();
  }, [getServices, getServicesByVehicle, vehicle]);

  const currencyFormat = (num: Number) => {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  return (
    <SafeAreaView>
      {loading ? (
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
                  {currencyFormat(0)}
                </Text>
              </View>
            </View>
          </Card>
          <ListServicios
            vehiculo={vehicle}
            servicios={servicios}
            navigation={navigation}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
