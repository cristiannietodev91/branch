import type { StackScreenProps } from "@react-navigation/stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export type AppoimentStackParamList = {
  NavigateAppoinment: { etapa: string };
  Detail: { cita: any };
  Pdfdetail: undefined;
  Chat: { IdTaller: number };
  Addappoinment: undefined;
};

export type ActiveAppoinmentStackScreenProps<
  T extends keyof AppoimentStackParamList
> = StackScreenProps<AppoimentStackParamList, T>;

export type AppointmentStackParamList = {
  Active: NavigatorScreenParams<AppoimentStackParamList>;
  Past: undefined;
  Future: undefined;
};

export type AppoinmentMainStackParamList = {
  Citas: undefined;
};

export type AppoinmentScreenNavigationProp = CompositeScreenProps<
  StackScreenProps<AppoinmentMainStackParamList, "Citas">,
  CompositeScreenProps<
    BottomTabScreenProps<AppointmentStackParamList>,
    ActiveAppoinmentStackScreenProps<keyof AppoimentStackParamList>
  >
>;

export type VehicleStackParamList = {
  Main: undefined;
  Edit: {
    vehiculo: any;
  };
  Add: undefined;
  Documents: {
    vehiculo: any;
  };
  Services: {
    vehiculo: any;
  };
  AddServices: undefined;
};

export type VehiclesStackScreenProps<T extends keyof VehicleStackParamList> =
  StackScreenProps<VehicleStackParamList, T>;

export type WorkShopStackParamList = {
  Main: undefined;
  Chat: undefined;
};

export type WorkShopStackScreenProps<T extends keyof WorkShopStackParamList> =
  StackScreenProps<WorkShopStackParamList, T>;

export type UserStackParamList = {
  User: undefined;
  Edit: {
    usuario: FirebaseAuthTypes.User | null;
    usuarioFacebook?: FirebaseAuthTypes.UserInfo;
  };
};

export type UserStackScreenProps<T extends keyof UserStackParamList> =
  StackScreenProps<UserStackParamList, T>;

export type HomeBottomTabParamList = {
  Motos: StackScreenProps<VehicleStackParamList>;
  WorkShop: StackScreenProps<WorkShopStackParamList>;
  Users: StackScreenProps<UserStackParamList>;
  Citas: StackScreenProps<AppoinmentMainStackParamList>;
};

export type LoginStackParamsList = {
  MainLogin: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends LoginStackParamsList {}
  }
}
