import React, { useCallback, useEffect, useState } from "react";
import { Icon } from "@rneui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VehiculosScreenStacks from "./VehiculosStacks";
import TalleresStacks from "./TalleresStacks";
import CitasStacks from "./CitasStacks";
import UsuariosStacks from "./UsuariosStacks";
import SplasScreen from "../screens/SplashScreen";
import auth from "@react-native-firebase/auth";
import LoginScreenStacks from "./LoginStacks";

const Tab = createBottomTabNavigator();

const NavigationStacks = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        lazy: true,
        tabBarStyle: {
          backgroundColor: "#0396c8",
          borderRadius: 35,
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 3,
          position: "absolute",
          borderColor: "#5be5e5",
          borderStyle: "solid",
          borderWidth: 1,
        },
        tabBarActiveTintColor: "#041c24",
        tabBarInactiveTintColor: "#5be5e5",
      }}
    >
      <Tab.Screen
        name="Home"
        component={VehiculosScreenStacks}
        options={{
          tabBarLabel: "Motos",
          tabBarIcon: ({ color }) => (
            <Icon
              type="font-awesome"
              name="motorcycle"
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="WorkShop"
        component={TalleresStacks}
        options={{
          tabBarLabel: "Talleres",
          tabBarIcon: ({ color }) => (
            <Icon color={color} type="font-awesome" name="wrench" />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsuariosStacks}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => (
            <Icon type="font-awesome" name="user" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Citas"
        component={CitasStacks}
        options={{
          tabBarLabel: "Citas",
          tabBarIcon: ({ color }) => (
            <Icon type="foundation" name="calendar" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainStacks = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  const onAuthStateChanged = useCallback(
    (user: any) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    },
    [initializing]
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  if (initializing) {
    return <SplasScreen />;
  }

  return (
    <NavigationContainer>
      {!user ? <LoginScreenStacks /> : <NavigationStacks />}
    </NavigationContainer>
  );
};

export default MainStacks;
