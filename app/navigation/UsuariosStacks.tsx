import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UsuarioScreen from "../screens/Usuario/Usuario";
import EditarUsuarioScreen from "../screens/Usuario/EditarUsuario";

const Stack = createStackNavigator();

const UsuariosScreenStacks = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="user"
        component={UsuarioScreen}
        options={{ title: "Usuario" }}
      />
      <Stack.Screen
        name="edit"
        component={EditarUsuarioScreen}
        options={{ title: "Editar usuario" }}
      />
    </Stack.Navigator>
  );
};

export default UsuariosScreenStacks;
