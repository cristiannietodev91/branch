import cls from "cls-hooked";
import { Sequelize, Options } from "sequelize";
import Debug from "debug";

const namespace = cls.createNamespace("my-very-own-namespace");
const env: string = process.env.NODE_ENV || "development";
import dbConfig from "../config/config";

const myConfig: Options = (dbConfig as any)[env];
const debug = Debug("branch:server");

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

export default sequelize;