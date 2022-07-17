import { Model, Optional } from "sequelize";

/** ****************
 Marca types
 ********************/
export interface MarcaFilter {
  marca: string;
  referencia: string;
}

export interface MarcaAttributes {
  IdMarca: number;
  marca: string;
  referencia: string;
  categoria?: string;
  tipo?: string;
  descripcion?: string;
  tipoVehiculo?: string;
  urllogo?: string;
}

export interface MarcaCreationAttributes
  extends Optional<MarcaAttributes, "IdMarca"> {}

export interface MarcaInstance
  extends Model<MarcaAttributes, MarcaCreationAttributes>,
    MarcaAttributes {}

/** ****************
 Taller types
 ********************/
export interface TallerAttributes {
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
}

export interface TallerCreationAttributes
  extends Optional<TallerAttributes, "IdTaller"> {}

export interface TallerInstance
  extends Model<TallerAttributes, TallerCreationAttributes>,
    TallerAttributes {}

/** ****************
 User types
 ********************/
export interface UserFilter {
  email?: string;
  uid?: string;
  identificacion?: string;
  IdUsuario?: number | string;
}

export interface UserAttributes {
  IdUsuario: number;
  firstName: string;
  lastName?: string;
  identificacion?: string | null;
  email: string;
  uid?: string;
  celular?: string;
  tipoUsuario: "Cliente" | "AdminTaller";
  estado: "Registrado" | "Pendiente";
  IdTaller?: number;
  tokenCM?: string;
  typeDevice?: string;
  password?: string;
}

export type UserCreationAttributes = Optional<UserAttributes, "IdUsuario">

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

/** ****************
 Cita types
 ********************/
export interface CitaAttributes {
  IdCita: number;
  IdTaller: number;
  IdMecanico: number;
  IdVehiculo: number;
  fechaCita: Date;
  horaCita: number;
  servicio?: string;
  estado: string;
  calificacion?: number;
  calificacionUsuario?: number;
  vehiculo?: VehiculoAttributes;
  taller?: TallerAttributes;
  mecanico?: MecanicoAttributes;
}

export interface CitaCreationAttributes
  extends Optional<CitaAttributes, "IdCita"> {}

export interface CitaRequestAttributes {
  IdTaller: number;
  IdMecanico: number;
  placa: string;
  fechaCita: Date;
  horaCita: number;
  servicio?: string;
  estado: string;
}

export interface CalificaCitaRequest {
  IdCita: string | number; //TODO: change function for one param with type
  calificacion?: number;
  calificacionUsuario?: number;
}

export interface CitaUpdateAttributes {
  IdTaller?: number;
  IdMecanico?: number;
  placa?: string;
  fechaCita: Date;
  horaCita: number;
  servicio?: string;
  estado: string;
  calificacion?: number;
  calificacionUsuario?: number;
}

export interface CitaInstance
  extends Model<CitaAttributes, CitaCreationAttributes>,
    CitaAttributes {}

/** ****************
 Vehiculo types
 ********************/
export interface VehiculoFilter {
  IdTaller?: number | string;
  IdUsuario?: string;
  placa?: string;
  IdVehiculo?: number;
}

export interface VehiculoUpdate {
  IdUsuario?: number;
}

export interface VehiculoAttributes {
  IdVehiculo: number;
  IdMarca: number;
  IdUsuario: number;
  IdTaller: number | string;
  tipoVehiculo: string;
  placa: string;
  kilometraje?: number;
  modelo?: number;
  color?: string;
  fechaCompra?: Date;
  alias?: string;
  fotos?: JSON;
  tarjetapropiedad?: JSON;
  tecnomecanica?: JSON;
  soat?: JSON;
  fvtecnomecanica?: Date;
  fvsoat?: Date;
  estado: string;
  marca?: MarcaAttributes;
  taller?: TallerAttributes;
  usuarios?: UserAttributes;
}

export interface VehiculoPreCreationAttributes {
  alias?: string;
  color?: string;
  fechaCompra?: Date;
  fotos?: JSON;
  kilometraje?: number;
  modelo?: number;
  placa: string;
  tipoVehiculo: string;
  IdTaller: string | number;
}

export type VehiculoCreationAttributes = Optional<VehiculoAttributes, "IdVehiculo">

export interface VehiculoCreationRequest {
  celular: string;
  IdTaller: string | number;
  placa: string;
  usuario: {
    email: string;
  },
  fechaCompra?: Date;
  alias?: string;
  color?: string;
  fotos?: JSON;
  kilometraje?: number;
  modelo?: number;
  tipoVehiculo: string;
}

export interface VehiculoInstance
  extends Model<VehiculoAttributes, VehiculoCreationAttributes>,
    VehiculoAttributes {}

/** ****************
 Mecanico types
 ********************/
export interface MecanicoAttributes {
  IdMecanico: number;
  identificacion: string;
  firstName: string;
  lastName?: string;
  skills?: JSON;
  costos?: JSON;
  estado: string;
  fullName: string;
}

export interface MecanicoCreationAttributes
  extends Optional<MecanicoAttributes, "IdMecanico"> {}

export interface MecanicoInstance
  extends Model<MecanicoAttributes, MecanicoCreationAttributes>,
    MecanicoAttributes {}

/** ****************
 Mecanico types
 ********************/
export interface MecanicoTallerAttributes {
  IdTaller: number;
  IdMecanico: number;
}

interface MecanicoTallerCreationAttributes
  extends Optional<MecanicoTallerAttributes, "IdTaller" | "IdMecanico"> {}

export interface MecanicoTallerInstance
  extends Model<MecanicoTallerAttributes, MecanicoTallerCreationAttributes>,
    MecanicoTallerAttributes {}

/** ****************
 Orden types
 ********************/
export interface OrdenAttributes {
  IdOrdenTrabajo: number;
  IdTaller: number;
  CodigoOrden: string;
  IdEtapa: number;
  IdCita: number;
  IdMecanico: number;
  IdVehiculo: number;
  kilometraje?: number;
  DocumentosDeja?: JSON;
  Observaciones?: string;
  documentos?: JSON;
  estado: string;
}

export interface OrdenCreationAttributes
  extends Optional<OrdenAttributes, "IdOrdenTrabajo"> {}

export interface OrdenInstance
  extends Model<OrdenAttributes, OrdenCreationAttributes>,
    OrdenAttributes {}

/** ****************
 Orden types
 ********************/
export interface EtapaAttributes {
  IdEtapa: number;
  NombreEtapa: string;
  requiereDocumentos: boolean;
  requiereAprobacion: boolean;
}

export interface EtapaCreationAttributes
  extends Optional<EtapaAttributes, "IdEtapa"> {}

export interface EtapaInstance
  extends Model<EtapaAttributes, EtapaCreationAttributes>,
    EtapaAttributes {}

/******************************
 *   Conversation types
 *  **************************/
export interface ConversationAttributes {
  IdConversacion: number;
  uid: string;
  keyconversacion: string;
  IdTaller: number;
}

export interface ConversationCreationAttributes
  extends Optional<ConversationAttributes, "IdConversacion"> {}

export interface ConversationInstance
  extends Model<ConversationAttributes, ConversationCreationAttributes>,
    ConversationAttributes {}

/** ****************
 Message types
 ********************/
export interface MessageAttributes {
  IdMessage: number;
  _id: string;
  IdConversacion: number;
  text?: string;
  image?: string;
  IdCita?: number;
  delivered: boolean;
  read: boolean;
  typeusuario: string;
  user: JSON;
  IdEtapa?: number;
  IdOrdenTrabajo?: number;
}

export interface MessageCreationAttributes
  extends Optional<MessageAttributes, "IdMessage"> {}

export interface MessageInstance
  extends Model<MessageAttributes, MessageCreationAttributes>,
    MessageAttributes {}

/** ****************
 Notification types
 ********************/
interface dataNotification {
  IdCita: string | number;
  calificada: boolean;
  calificacion?: number;
}
export interface NotificationAttributes {
  IdNotificacion: number;
  IdUsuario: string;
  text: string;
  typenotificacion: string;
  read: boolean;
  dataAdicional: dataNotification;
}

export interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, "IdNotificacion"> {}

export interface NotificationInstance
  extends Model<NotificationAttributes, NotificationCreationAttributes>,
    NotificationAttributes {}

/** ****************
 Servicios types
 ********************/

export interface ServicioAttributes {
  IdServicio: number;
  nombre: string;
  icono: string;
  type: string;
  color: string;
}

export interface ServicioCreationAttributes
  extends Optional<ServicioAttributes, "IdServicio"> {}

export interface ServicioInstance
  extends Model<ServicioAttributes, ServicioCreationAttributes>,
    ServicioAttributes {}

export interface CreationServiceAttributes {
  placa: string;
  servicio: string;
  valor: number;
}

/*******************
 * Service vehicle type
 **********************/

export interface ServicioVehiculoAttributes {
  IdServicio: number;
  IdVehiculo: number;
  servicio: string;
  valor: number;
}

export interface ServicioVehiculoCreationAttributes
  extends Optional<ServicioVehiculoAttributes, "IdServicio"> {}

export interface ServicioVehiculoInstance
  extends Model<ServicioVehiculoAttributes, ServicioVehiculoCreationAttributes>,
    ServicioVehiculoAttributes {}

export interface Events {
  id: number;
  startDate: Date;
  title: string;
  classes?: string;
  citaObject: CitaInstance;
  estado: any;
}
