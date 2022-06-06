import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CitaScreen from "../screens/Citas/Citas";
import DetailCitaScreen from "../screens/Citas/DetailCita";
import VerPDFScreen from "../screens/pdf/viewPdf";
import ChatScreen from "../screens/Citas/Chat";
import AgregarCitaScreen from "../screens/Citas/AgregarCita";

const Stack = createStackNavigator();

const CitasActivasStacks = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="active"
        component={CitaScreen}
        initialParams={{ etapa: "Activas" }}
      />
      <Stack.Screen name="detail" component={DetailCitaScreen} />
      <Stack.Screen
        name="pdfdetail"
        component={VerPDFScreen}
        options={{ title: "Cotizacion" }}
      />
      <Stack.Screen name="chat" component={ChatScreen} />
      <Stack.Screen name="addappoinment" component={AgregarCitaScreen} />
    </Stack.Navigator>
  );
};

export default CitasActivasStacks;
