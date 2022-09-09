import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login/Login";
import RegisterScreen from "../screens/Login/Register";
import MainLogin from "../screens/Login/MainLogin";
import { LoginStackParamsList } from "../../types/types";

const Stack = createStackNavigator<LoginStackParamsList>();

const LoginScreenStacks = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainLogin" component={MainLogin} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default LoginScreenStacks;
