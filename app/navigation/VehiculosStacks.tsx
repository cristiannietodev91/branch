import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import VehiculosScreen from "../screens/Vehiculo/Vehiculo";
import EditarVehiculoScreen from "../screens/Vehiculo/EditarVehiculo";
import AgregarVehiculoScreen from "../screens/Vehiculo/AgregarVehiculo";
import DocumentosScreen from "../screens/Vehiculo/Documentos";
import ServiciosScreen from "../screens/Vehiculo/Servicios";
import AgregarServicioScreen from "../screens/Vehiculo/AgregarServicio";
import { VehicleStackParamList } from "../../types/types";

const Stack = createStackNavigator<VehicleStackParamList>();

const MotosScreenStacks = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#041c24" },
        headerTintColor: "#0396c8",
        headerTitleAlign: "center",
        cardStyle: { backgroundColor: "#d7f8f8" },
      }}
    >
      <Stack.Screen
        name="Main"
        component={VehiculosScreen}
        options={{ title: "Motos" }}
      />
      <Stack.Screen
        name="Edit"
        component={EditarVehiculoScreen}
        options={{ title: "Editar Vehiculo" }}
      />
      <Stack.Screen
        name="Add"
        component={AgregarVehiculoScreen}
        options={{ title: "Agregar Vehiculo" }}
      />
      <Stack.Screen
        name="Documents"
        component={DocumentosScreen}
        options={{ title: "Documentos de mi moto" }}
      />
      <Stack.Screen
        name="Services"
        component={ServiciosScreen}
        options={{ title: "Servicios" }}
      />
      <Stack.Screen
        name="AddServices"
        component={AgregarServicioScreen}
        options={{ title: "Agregar servicio" }}
      />
    </Stack.Navigator>
  );
};

export default MotosScreenStacks;
