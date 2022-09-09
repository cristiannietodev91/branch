import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TalleresScreen from "../screens/Talleres/Talleres";
import ChatScreen from "../screens/Talleres/Chat";

const Stack = createStackNavigator();

const TalleresStacks = () => {
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
        name="Main"
        component={TalleresScreen}
        options={{ title: " Talleres" }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: "Chat" }}
      />
    </Stack.Navigator>
  );
};

export default TalleresStacks;
