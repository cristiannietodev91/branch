import * as chai from "chai";
import { faker } from "@faker-js/faker";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

const expect = chai.expect;

import usersDAO from "./usersDAO";
import {
  Op,
} from "sequelize";
import { TallerCreationAttributes, UserCreationAttributes, UserInstance, VehiculoCreationAttributes } from "../types";
import vehiculoDAO from "./vehiculoDAO";
import tallerDAO from "./tallerDAO";
import citaDAO from "./citaDAO";

describe("user DAO unit testing", () => {

  const userMock: UserCreationAttributes = {
    tipoUsuario: "Cliente" as const,
    firstName: faker.person.firstName(),
    email: faker.internet.email(),
    estado: "Pendiente" as const,
    celular: faker.phone.number(),
    uid: faker.string.uuid()
  };

  const userMock2: UserCreationAttributes = {
    tipoUsuario: "Cliente" as const,
    firstName: faker.person.firstName(),
    email: faker.internet.email(),
    estado: "Pendiente" as const,
    celular: faker.phone.number(),
    uid: faker.string.uuid()
  };

  let userCreated: UserInstance;

  before(async ()=> {
    await citaDAO.truncate();
    await vehiculoDAO.truncate();
    await usersDAO.truncate();
  });
  
  describe("create user functionality", () => {

    it("can not create an user without the minimum fields", async () => {
      const user: any = {
        IdUsuario: 1,
        firstName: "test",
      };
      await expect(usersDAO.create(user)).to.eventually.be.rejectedWith("cannot be null");
    });

    it("must create the users in the database", async () => {

      userCreated = await usersDAO.create(userMock);
      const user2 = await usersDAO.create(userMock2);
      
      expect(userCreated).to.have.property("IdUsuario");
      expect(user2).to.have.property("IdUsuario");
    });
  });

  describe("get by id", () => {
    it("must return user by integer id", async () => {
      const user = await usersDAO.getById(userCreated.IdUsuario);

      expect(user).to.have.property("IdUsuario");
      expect(user?.IdUsuario).to.equal(userCreated.IdUsuario);
    });

    it("must search an user by an nonexisting id", async () => {
      const user = await usersDAO.getById(-1);

      expect(user).to.be.null;
    });
  });

  describe("list Users functionality", () => {
    it("user return list of user", async () => {

      const users = await usersDAO.findAll();
      expect(users).to.have.lengthOf(2);

    });
  });

  describe("find one by filter", () => {
    it("must return one user by filter", async () => {
      const user = await usersDAO.findOneByFilter({ email: userMock.email });

      expect(user).to.have.property("IdUsuario");
    });

    it("must return one user by filter - 2", async () => {
      const user = await usersDAO.findOneByFilter({
        firstName: {
          [Op.like]: `%${userMock2.firstName}%`
        }
      });

      expect(user).to.have.property("IdUsuario");
    });
  });

  describe("count users related", () => {

    it("must count all the users in the table", async () => {
      const numberOfUser = await usersDAO.count();
      expect(numberOfUser).to.equal(2);
    });

    it("must count users by filter", async () => {
      const result = await Promise.all([
        usersDAO.count({
          firstName: {
            [Op.like]: `%${userMock.firstName}%`
          }
        }),
        usersDAO.count({
          tipoUsuario: "Cliente"
        })
      ]);
      expect(result).to.deep.equal([1, 2]);
    });

    it("must count number of user related to a workshop", async () => {

      const workshop: TallerCreationAttributes = {
        nombre: faker.company.name(),
        identificacion: faker.string.numeric(10),
        email: faker.internet.email(),
        celular: faker.phone.number(),
        estado: faker.helpers.arrayElement(["Registrado", "Pendiente"]),
        direccion: faker.location.streetAddress(),
        latitude: faker.location.latitude(),
        longitud: faker.location.longitude(),
        telefono: faker.phone.number(),
        logo: faker.image.url(),
      };

      const workshopResult = await tallerDAO.create(workshop);

      const createVehiculo: VehiculoCreationAttributes = {
        IdTaller: workshopResult.IdTaller,
        IdUsuario: userMock.uid || "",
        IdMarca: 1,
        estado: faker.helpers.arrayElement(["Registrado", "Pendiente"]),
        placa: faker.vehicle.vrm(),
        tipoVehiculo: faker.helpers.arrayElement(["Moto", "Carro"])
      };

      const createVehiculo2: VehiculoCreationAttributes = {
        IdUsuario: userMock2.uid || "",
        IdMarca: 1,
        estado: faker.helpers.arrayElement(["Registrado", "Pendiente"]),
        placa: faker.vehicle.vrm(),
        tipoVehiculo: faker.helpers.arrayElement(["Moto", "Carro"])
      };

      await Promise.all(
        [vehiculoDAO.create(createVehiculo), vehiculoDAO.create(createVehiculo2)]
      );

      const numberOfUsers = await usersDAO.count({}, { IdTaller: workshopResult.IdTaller });

      expect(numberOfUsers).to.equal(1);
    });

    it("must return 0 when the search does not match with any record", async () => {
      const result = await Promise.all([
        usersDAO.count({}, { IdTaller: 2 }),
        usersDAO.count({ identificacion: "does not exists" })
      ]);

      expect(result).to.deep.equal([0, 0]);
    });
  });
});
