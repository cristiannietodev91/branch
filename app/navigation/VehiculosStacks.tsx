import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import VehiculosScreen from "../screens/Vehiculo/Vehiculo";
import EditarVehiculoScreen from "../screens/Vehiculo/EditarVehiculo";
import AgregarVehiculoScreen from "../screens/Vehiculo/AgregarVehiculo";
import DocumentosScreen from "../screens/Vehiculo/Documentos";
import ServiciosScreen from "../screens/Vehiculo/Servicios";
import AgregarServicioScreen from "../screens/Vehiculo/AgregarServicio";

const Stack = createStackNavigator();

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
        name="main"
        component={VehiculosScreen}
        options={{ title: "Motos" }}
      />
      <Stack.Screen
        name="edit"
        component={EditarVehiculoScreen}
        options={{ title: "Editar Vehiculo" }}
      />
      <Stack.Screen
        name="add"
        component={AgregarVehiculoScreen}
        options={{ title: "Agregar Vehiculo" }}
      />
      <Stack.Screen
        name="documents"
        component={DocumentosScreen}
        options={{ title: "Documentos de mi moto" }}
      />
      <Stack.Screen
        name="services"
        component={ServiciosScreen}
        options={{ title: "Servicios" }}
      />
      <Stack.Screen
        name="addservices"
        component={AgregarServicioScreen}
        options={{ title: "Agregar servicio" }}
      />
    </Stack.Navigator>
  );
};

export default MotosScreenStacks;
