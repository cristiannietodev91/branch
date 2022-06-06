import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CitasPasadasStacks from "./CitasPasadasStacks";
import CitasActivasStacks from "./CitasActivasStacks";
import CitasFuturasStacks from "./CitasFuturasStacks";

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const citasStacks = () => {
  return (
    <Tab.Navigator
      initialRouteName="past"
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
      <Tab.Screen name="active" component={CitasActivasStacks} />
      <Tab.Screen name="past" component={CitasPasadasStacks} />
      <Tab.Screen name="future" component={CitasFuturasStacks} />
    </Tab.Navigator>
  );
};

const CitasScreenStacks = () => {
  return (
    <Stack.Navigator
      defaultScreenOptions={{
        headerStyle: { backgroundColor: "#041c24" },
        headerTintColor: "#0396c8",
        headerTitleAlign: "center",
        cardStyle: { backgroundColor: "#d7f8f8" },
      }}
    >
      <Stack.Screen component={citasStacks} name="citas" />
    </Stack.Navigator>
  );
};

export default CitasScreenStacks;
