import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CitaScreen from "../screens/Citas/Citas";
import DetailCitaScreen from "../screens/Citas/DetailCita";
import VerPDFScreen from "../screens/pdf/viewPdf";
import AgregarCitaScreen from "../screens/Citas/AgregarCita";

const Stack = createStackNavigator();

const CitasFuturasStacks = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="citas"
        component={CitaScreen}
        initialParams={{ etapas: "futuras" }}
      />
      <Stack.Screen name="detail" component={DetailCitaScreen} />
      <Stack.Screen name="verpdf" component={VerPDFScreen} />
      <Stack.Screen name="addappoinment" component={AgregarCitaScreen} />
    </Stack.Navigator>
  );
};

export default CitasFuturasStacks;
