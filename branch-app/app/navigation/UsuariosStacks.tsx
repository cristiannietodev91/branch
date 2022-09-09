import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UsuarioScreen from "../screens/Usuario/Usuario";
import EditarUsuarioScreen from "../screens/Usuario/EditarUsuario";
import { UserStackParamList } from "../../types/types";

const Stack = createStackNavigator<UserStackParamList>();

const UsuariosScreenStacks = () => {
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
      <Stack.Screen
        name="User"
        component={UsuarioScreen}
        options={{ title: "Usuario" }}
      />
      <Stack.Screen
        name="Edit"
        component={EditarUsuarioScreen}
        options={{ title: "Editar usuario" }}
      />
    </Stack.Navigator>
  );
};

export default UsuariosScreenStacks;
