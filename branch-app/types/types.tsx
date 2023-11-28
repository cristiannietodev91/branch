import type {
  StackNavigationProp,
  StackScreenProps,
} from "@react-navigation/stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export interface Taller {
  IdTaller: number;
  nombre: string;
  identificacion: string;
  direccion: string;
  latitude: number;
  longitud: number;
  celular: string;
  telefono: string;
  email: string;
  logo: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  IdUsuario: number;
  firstName: string;
  lastName: string;
  identificacion: string;
  email: string;
  uid: string;
  celular: string;
  tipoUsuario: string;
  estado: string;
  IdTaller: number;
  tokenCM: string;
  typeDevice: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  IdMarca: number;
  marca: string;
  referencia: string;
  categoria: string;
  tipo: string;
  descripcion: string;
  tipoVehiculo: string;
  urllogo: string;
}

export interface VehicleDocument {
  url: string;
  date: string;
  size: number;
  type: string;
  selected: boolean;
  validate: boolean;
  keynameFile: string;
  nombreArchivo: string;
}

export interface Vehicle {
  IdVehiculo: number;
  IdMarca: number;
  IdUsuario: string;
  IdTaller?: number;
  tipoVehiculo: string;
  placa: string;
  kilometraje: number;
  modelo: number;
  color: string;
  fechaCompra: string;
  alias: string;
  fotos: Array<{ url: string }>;
  tarjetapropiedad: VehicleDocument;
  tecnomecanica: VehicleDocument;
  soat: VehicleDocument;
  fvtecnomecanica: any;
  fvsoat: any;
  estado: string;
  createdAt: string;
  updatedAt: string;
  marca: Brand;
  usuario: User;
  taller?: Taller;
}

interface UserMessage {
  _id: string;
  name: string;
}

export interface Message {
  IdMessage: number;
  _id: string;
  IdConversacion: number;
  text: string;
  image: any;
  IdCita: any;
  delivered: boolean;
  read: boolean;
  typeusuario: string;
  user: UserMessage;
  IdEtapa: any;
  IdOrdenTrabajo: any;
  createdAt: string;
  updatedAt: string;
}

export interface Mecanico {
  fullName: string;
  IdMecanico: number;
  identificacion: string;
  firstName: string;
  lastName: string;
  skills: string;
  costos: any;
  estado: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdenTrabajo {
  IdOrdenTrabajo: number;
  IdTaller: number;
  CodigoOrden: string;
  IdEtapa: number;
  IdCita: number;
  IdMecanico: number;
  IdVehiculo: number;
  kilometraje: number;
  DocumentosDeja: string;
  Observaciones: any;
  documentos: any;
  estado: string;
  createdAt: string;
  updatedAt: string;
  mecanico: Mecanico;
}

export interface Appointment {
  fechaCita: string;
  IdCita: number;
  IdTaller: number;
  IdMecanico?: number;
  IdVehiculo: number;
  horaCita: string;
  servicio: string;
  estado: string;
  calificacion: any;
  calificacionUsuario: any;
  createdAt: string;
  updatedAt: string;
  vehiculo: Vehicle;
  taller: Taller;
  mecanico?: Mecanico;
  ordentrabajos: OrdenTrabajo[];
}

export type ListVehicles = Vehicle[];
export type ListBrand = Brand[];
export type ListMessage = Message[];
export type ListAppointment = Appointment[];
export type ListTalleres = Taller[];

/***********************************************
 * React navigation types
 **********************************************/

export type InternalAppointmentStackParamList = {
  NavigateAppointment: { etapa: string };
  Detail: { cita: Appointment };
  Pdfdetail: { pdf: any; orden?: any; cita?: any };
  Chat: { IdTaller: number };
  AddAppointment: undefined;
};

export type ActiveAppointmentStackScreenProps<
  T extends keyof InternalAppointmentStackParamList
> = StackScreenProps<InternalAppointmentStackParamList, T>;

export type AppointmentStackParamList = {
  Active: NavigatorScreenParams<InternalAppointmentStackParamList>;
  Past: undefined;
  Future: undefined;
};

export type AppointmentMainStackParamList = {
  Citas: undefined;
};

export type AppointmentScreenNavigationProp = CompositeScreenProps<
  StackScreenProps<AppointmentMainStackParamList, "Citas">,
  CompositeScreenProps<
    BottomTabScreenProps<AppointmentStackParamList>,
    ActiveAppointmentStackScreenProps<keyof InternalAppointmentStackParamList>
  >
>;

export type VehicleStackParamList = {
  Main: undefined;
  Edit: {
    vehicle: Vehicle;
  };
  Add: undefined;
  Documents: {
    vehicle: Vehicle;
  };
  Services: {
    vehicle: Vehicle;
  };
  AddServices: undefined;
};

export type VehiclesStackScreenProps<T extends keyof VehicleStackParamList> =
  StackScreenProps<VehicleStackParamList, T>;

export type WorkShopStackParamList = {
  Main: undefined;
  Chat: {
    IdTaller: number;
  };
};

export type WorkShopStackScreenProps<T extends keyof WorkShopStackParamList> =
  StackScreenProps<WorkShopStackParamList, T>;

export type UserStackParamList = {
  User: undefined;
  Edit: {
    usuario: User;
    usuarioFacebook?: FirebaseAuthTypes.UserInfo;
  };
};

export type UserStackScreenProps<T extends keyof UserStackParamList> =
  StackScreenProps<UserStackParamList, T>;

export type HomeBottomTabParamList = {
  Motos: StackScreenProps<VehicleStackParamList>;
  WorkShop: StackScreenProps<WorkShopStackParamList>;
  Users: StackScreenProps<UserStackParamList>;
  Citas: StackScreenProps<AppointmentMainStackParamList>;
};

export type VehicleScreenNavigationProp =
  StackNavigationProp<VehicleStackParamList>;

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
