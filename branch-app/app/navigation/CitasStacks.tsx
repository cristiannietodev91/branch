import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CitasPasadasStacks from "./CitasPasadasStacks";
import CitasActivasStacks from "./CitasActivasStacks";
import CitasFuturasStacks from "./CitasFuturasStacks";
import {
  AppoinmentMainStackParamList,
  AppointmentStackParamList,
} from "../../types/types";

const Stack = createStackNavigator<AppoinmentMainStackParamList>();
const Tab = createMaterialTopTabNavigator<AppointmentStackParamList>();

const CitasStacks = () => {
  return (
    <Tab.Navigator
      initialRouteName="Past"
      screenOptions={{
        lazy: true,
        swipeEnabled: false,
        tabBarActiveTintColor: "#041c24",
        tabBarInactiveTintColor: "#5be5e5",
        tabBarStyle: { backgroundColor: "#041c24" },
        tabBarIndicatorStyle: {
          borderColor: "#d7f8f8",
          borderWidth: 24,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        },
      }}
    >
      <Tab.Screen name="Active" component={CitasActivasStacks} />
      <Tab.Screen name="Past" component={CitasPasadasStacks} />
      <Tab.Screen name="Future" component={CitasFuturasStacks} />
    </Tab.Navigator>
  );
};

const CitasScreenStacks = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#041c24" },
        headerTintColor: "#0396c8",
        headerTitleAlign: "center",
        cardStyle: { backgroundColor: "#d7f8f8" },
      }}
    >
      <Stack.Screen component={CitasStacks} name="Citas" />
    </Stack.Navigator>
  );
};

export default CitasScreenStacks;
