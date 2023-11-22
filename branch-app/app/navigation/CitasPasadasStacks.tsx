import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CitaScreen from "../screens/Citas/Citas";
import DetailCitaScreen from "../screens/Citas/DetailCita";
import VerPDFScreen from "../screens/pdf/viewPdf";
import AgregarCitaScreen from "../screens/Citas/AgregarCita";
import { InternalAppointmentStackParamList } from "../../types/types";

const Stack = createStackNavigator<InternalAppointmentStackParamList>();

const CitasPasadasStacks = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="NavigateAppointment"
        component={CitaScreen}
        initialParams={{ etapa: "Pasadas" }}
      />
      <Stack.Screen name="Detail" component={DetailCitaScreen} />
      <Stack.Screen name="Pdfdetail" component={VerPDFScreen} />
      <Stack.Screen name="AddAppointment" component={AgregarCitaScreen} />
    </Stack.Navigator>
  );
};

export default CitasPasadasStacks;
