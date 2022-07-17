// import fs from 'fs';
// import path from 'path';
import cls from "cls-hooked";
import { Sequelize, Options, DataTypes } from "sequelize";

// const basename = path.basename(__filename);
const namespace = cls.createNamespace("my-very-own-namespace");
const env: string = process.env.NODE_ENV || "development";
import dbConfig from "../config/config";
import {
  UserInstance,
  MarcaInstance,
  TallerInstance,
  CitaInstance,
  VehiculoInstance,
  MecanicoInstance,
  MecanicoTallerInstance,
  OrdenInstance,
  EtapaInstance,
  ConversationInstance,
  MessageInstance,
  NotificationInstance,
  ServicioInstance,
  ServicioVehiculoInstance,
} from "../../types";
// import { String } from "aws-sdk/clients/batch";
import Debug from "debug";
const debug = Debug("branch:server");

const myConfig: Options = (dbConfig as any)[env];

Sequelize.useCLS(namespace);

debug("Connecting to dialect ::> ", myConfig.dialect);
const sequelize = new Sequelize(myConfig);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testConnection();

const MarcaModel = sequelize.define<MarcaInstance>(
  "marca",
  {
    IdMarca: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referencia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(5),
    },
    tipo: {
      type: DataTypes.STRING,
    },
    descripcion: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    tipoVehiculo: {
      type: DataTypes.ENUM("Moto", "Carro"),
      // allowNull defaults to true
    },
    urllogo: {
      type: DataTypes.ENUM("Moto", "Carro"),
      // allowNull defaults to true
    },
  },
  {
    timestamps: false,
  }
);

const TallerModel = sequelize.define<TallerInstance>("taller", {
  IdTaller: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  identificacion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -90, max: 90 },
  },
  longitud: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -180, max: 180 },
  },
  celular: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  logo: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.ENUM("Registrado", "Pendiente"),
    allowNull: false,
  },
});

const VehiculoModel = sequelize.define<VehiculoInstance>("vehiculo", {
  IdVehiculo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  IdMarca: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  IdUsuario: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  IdTaller: {
    type: DataTypes.INTEGER,
  },
  tipoVehiculo: {
    type: DataTypes.ENUM("Moto", "Carro"),
    allowNull: false,
  },
  placa: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  kilometraje: {
    type: DataTypes.INTEGER,
  },
  modelo: {
    type: DataTypes.INTEGER,
  },
  color: {
    type: DataTypes.STRING,
  },
  fechaCompra: {
    type: DataTypes.DATEONLY,
  },
  alias: {
    type: DataTypes.STRING,
  },
  fotos: {
    type: DataTypes.JSON,
  },
  tarjetapropiedad: {
    type: DataTypes.JSON,
  },
  tecnomecanica: {
    type: DataTypes.JSON,
  },
  soat: {
    type: DataTypes.JSON,
  },
  fvtecnomecanica: {
    type: DataTypes.DATEONLY,
  },
  fvsoat: {
    type: DataTypes.DATEONLY,
  },
  estado: {
    type: DataTypes.ENUM("Registrado", "Pendiente"),
    allowNull: false,
  },
});

const CitaModel = sequelize.define<CitaInstance>("cita", {
  IdCita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  IdTaller: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  IdMecanico: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  IdVehiculo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fechaCita: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  horaCita: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  servicio: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.ENUM(
      "Solicitada",
      "Confirmada",
      "Cancelada",
      "Incumplida",
      "Cumplida",
      "Finalizada"
    ),
    allowNull: false,
  },
  calificacion: {
    type: DataTypes.INTEGER,
  },
  calificacionUsuario: {
    type: DataTypes.INTEGER,
  },
});

const UserModel = sequelize.define<UserInstance>("usuarios", {
  IdUsuario: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    // allowNull defaults to true
  },
  identificacion: {
    type: DataTypes.STRING,
    unique: true,
    // allowNull defaults to true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  uid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  celular: {
    type: DataTypes.STRING,
  },
  tipoUsuario: {
    type: DataTypes.ENUM("Cliente", "AdminTaller"),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM("Registrado", "Pendiente"),
    allowNull: false,
  },
  IdTaller: {
    type: DataTypes.INTEGER,
  },
  tokenCM: {
    type: DataTypes.STRING,
  },
  typeDevice: {
    type: DataTypes.STRING,
  },
});

const MecanicoModel = sequelize.define<MecanicoInstance>("mecanico", {
  IdMecanico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  identificacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    // allowNull defaults to true
  },
  skills: {
    type: DataTypes.JSON,
  },
  costos: {
    type: DataTypes.JSON,
  },
  estado: {
    type: DataTypes.ENUM("Activo", "Eliminado"),
    allowNull: false,
  },
  fullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    set() {
      throw new Error("Do not try to set the `fullName` value!");
    },
  },
});

const MecanicoTallerModel = sequelize.define<MecanicoTallerInstance>(
  "mecanicotaller",
  {
    IdTaller: {
      type: DataTypes.INTEGER,
      references: {
        model: "taller",
      },
    },
    IdMecanico: {
      type: DataTypes.INTEGER,
      references: {
        model: "mecanico",
      },
    },
  },
  { timestamps: false }
);

const OrdenModel = sequelize.define<OrdenInstance>("ordentrabajo", {
  IdOrdenTrabajo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  IdTaller: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CodigoOrden: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  IdEtapa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  IdCita: {
    type: DataTypes.INTEGER,
  },
  IdMecanico: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  IdVehiculo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  kilometraje: {
    type: DataTypes.INTEGER,
  },
  DocumentosDeja: {
    type: DataTypes.JSON,
  },
  Observaciones: {
    type: DataTypes.STRING,
  },
  documentos: {
    type: DataTypes.JSON,
  },
  estado: {
    type: DataTypes.ENUM("Aceptado", "Pendiente", "Rechazado", "Inactivo"),
    allowNull: false,
  },
});

const EtapaModel = sequelize.define<EtapaInstance>(
  "etapa",
  {
    IdEtapa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    NombreEtapa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requiereDocumentos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    requiereAprobacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const ConversacionModel = sequelize.define<ConversationInstance>(
  "conversacion",
  {
    IdConversacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keyconversacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    IdTaller: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }
);

const MessageModel = sequelize.define<MessageInstance>("message", {
  IdMessage: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  IdConversacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  IdCita: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  delivered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  typeusuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  IdEtapa: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  IdOrdenTrabajo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

const NotificacionModel = sequelize.define<NotificationInstance>(
  "notificacion",
  {
    IdNotificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    IdUsuario: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    typenotificacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    dataAdicional: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }
);

const ServicioModel = sequelize.define<ServicioInstance>(
  "servicios",
  {
    IdServicio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icono: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

const ServicioVehiculoModel = sequelize.define<ServicioVehiculoInstance>(
  "serviciovehiculo",
  {
    IdServicio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    IdVehiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    servicio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor: {
      type: DataTypes.REAL,
      allowNull: false,
      unique: true,
    },
  }
);

UserModel.belongsTo(TallerModel, {
  foreignKey: "IdTaller",
  targetKey: "IdTaller",
});

UserModel.hasMany(VehiculoModel, {
  foreignKey: "IdUsuario",
  sourceKey: "uid",
  as: "vehiculos",
  onDelete: "CASCADE",
});

TallerModel.hasMany(VehiculoModel, {
  foreignKey: "IdTaller",
  as: "vehiculos",
  onDelete: "CASCADE",
});

TallerModel.hasMany(CitaModel, {
  foreignKey: "IdCita",
  as: "citas",
  onDelete: "CASCADE",
});

VehiculoModel.belongsTo(MarcaModel, {
  foreignKey: "IdMarca",
  targetKey: "IdMarca",
});

VehiculoModel.belongsTo(TallerModel, {
  foreignKey: "IdTaller",
  targetKey: "IdTaller",
});

VehiculoModel.hasMany(CitaModel, {
  foreignKey: "IdVehiculo",
  as: "citas",
  onDelete: "CASCADE",
});

VehiculoModel.belongsTo(UserModel, {
  foreignKey: "IdUsuario",
  targetKey: "IdUsuario",
});

CitaModel.belongsTo(TallerModel, {
  foreignKey: "IdTaller",
  targetKey: "IdTaller",
});

CitaModel.belongsTo(VehiculoModel, {
  foreignKey: "IdVehiculo",
  targetKey: "IdVehiculo",
});

CitaModel.belongsTo(MecanicoModel, {
  foreignKey: "IdMecanico",
  targetKey: "IdMecanico",
});

CitaModel.hasMany(OrdenModel, { foreignKey: "IdCita" });

MecanicoModel.hasMany(MecanicoTallerModel, {
  foreignKey: "IdMecanico",
  onDelete: "CASCADE",
});

TallerModel.belongsToMany(MecanicoModel, {
  through: MecanicoTallerModel,
  foreignKey: "IdTaller",
});

MecanicoModel.belongsToMany(TallerModel, {
  through: MecanicoTallerModel,
  foreignKey: "IdMecanico",
});

OrdenModel.belongsTo(TallerModel, {
  foreignKey: "IdTaller",
  targetKey: "IdTaller",
});

OrdenModel.belongsTo(VehiculoModel, {
  foreignKey: "IdVehiculo",
  targetKey: "IdVehiculo",
});

OrdenModel.belongsTo(MecanicoModel, {
  foreignKey: "IdMecanico",
  targetKey: "IdMecanico",
});

OrdenModel.belongsTo(CitaModel, {
  foreignKey: "IdCita",
  targetKey: "IdCita",
  as: "cita",
});

OrdenModel.belongsTo(EtapaModel, {
  foreignKey: "IdEtapa",
  targetKey: "IdEtapa",
});

ConversacionModel.belongsTo(UserModel, {
  foreignKey: "uid",
  targetKey: "uid",
});

ConversacionModel.belongsTo(TallerModel, {
  foreignKey: "IdTaller",
  targetKey: "IdTaller",
});

MessageModel.belongsTo(ConversacionModel, {
  foreignKey: "IdConversacion",
  targetKey: "IdConversacion",
});

NotificacionModel.belongsTo(UserModel, {
  foreignKey: "IdUsuario",
  targetKey: "uid",
});

ServicioVehiculoModel.belongsTo(VehiculoModel, {
  foreignKey: "IdVehiculo",
  targetKey: "IdVehiculo",
});

export {
  CitaModel,
  ConversacionModel,
  MarcaModel,
  MecanicoModel,
  OrdenModel,
  TallerModel,
  UserModel,
  VehiculoModel,
  MessageModel,
  NotificacionModel,
  ServicioModel,
  ServicioVehiculoModel,
  EtapaModel,
};
