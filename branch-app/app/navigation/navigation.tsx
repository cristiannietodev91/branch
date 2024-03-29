import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useReducer,
} from "react";
import { Icon } from "@rneui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VehiculosScreenStacks from "./VehiculosStacks";
import TalleresStacks from "./TalleresStacks";
import CitasStacks from "./CitasStacks";
import UsuariosStacks from "./UsuariosStacks";
import SplasScreen from "../screens/SplashScreen";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import LoginScreenStacks from "./LoginStacks";
import { HomeBottomTabParamList } from "../../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import { authReducer } from "../reducers/authReducer";

const Tab = createBottomTabNavigator<HomeBottomTabParamList>();

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
          marginBottom: 10,
          position: "absolute",
          borderColor: "#5be5e5",
          borderStyle: "solid",
          borderWidth: 1,
        },
        tabBarActiveTintColor: "#041c24",
        tabBarInactiveTintColor: "#5be5e5",
        headerShown: false,
      }}
      safeAreaInsets={{ bottom: 10 }}
    >
      <Tab.Screen
        name="Motos"
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
  const initialState = {
    isLoading: true,
    isSignOut: false,
    userToken: null,
  };
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Handle user state changes
  const onAuthStateChanged = useCallback(
    async (userFirebase: FirebaseAuthTypes.User | null) => {
      if (userFirebase) {
        try {
          const token = await userFirebase.getIdToken();

          await AsyncStorage.setItem("sessionToken", token);

          dispatch({ type: "SIGN_IN", token });
        } catch (error) {
          dispatch({ type: "SIGN_OUT" });
        }
      }
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

  const authContext = useMemo(
    () => ({
      signIn: async (email: string, password: string) => {
        await auth().signInWithEmailAndPassword(email, password);
      },
      signOut: async () => {
        try {
          await auth().signOut();
        } catch (error) {}

        await AsyncStorage.removeItem("sessionToken");
        dispatch({ type: "SIGN_OUT" });
      },
      refreshToken: async () => {
        try {
          const user = auth().currentUser;
          if (!user) {
            dispatch({ type: "SIGN_OUT" });
          } else {
            const token = await user.getIdToken(true);

            await AsyncStorage.setItem("sessionToken", token);

            dispatch({ type: "RESTORE_TOKEN", token });
          }
        } catch (error) {
          dispatch({ type: "SIGN_OUT" });
        }
      },
    }),
    []
  );

  if (initializing) {
    return <SplasScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken === null ? (
          <LoginScreenStacks />
        ) : (
          <NavigationStacks />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default MainStacks;
