import * as chai from "chai";
import { faker } from "@faker-js/faker";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

const expect = chai.expect;


import vehiculoDAO from "./vehiculoDAO";
import { 
  TallerCreationAttributes, 
  TallerInstance, 
  UserCreationAttributes, 
  UserInstance, 
  VehiculoCreationAttributes 
} from "../types";
import tallerDAO from "./tallerDAO";
import usersDAO from "./usersDAO";

describe("vehiculo DAO unit testing", () => {

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

  const userMock: UserCreationAttributes = {
    tipoUsuario: "Cliente" as const,
    firstName: faker.person.firstName(),
    email: faker.internet.email(),
    estado: "Pendiente" as const,
    celular: faker.phone.number(),
    uid: faker.string.uuid()
  };

  let workshopResult: TallerInstance;
  let userResult: UserInstance;

  before(async () => {
    [workshopResult, userResult ] = await Promise.all([
      tallerDAO.create(workshop),
      usersDAO.create(userMock)
    ]);
  });

  describe("create vehicle", () => {
    it("must fail when create a vehicle without minimum requirements", async () => {
      const createVehiculo: any = {
        IdMarca: 1,
        estado: faker.helpers.arrayElement(["Registrado", "Pendiente"]),
        placa: faker.vehicle.vrm(),
        tipoVehiculo: faker.helpers.arrayElement(["Moto", "Carro"])
      };

      await expect(vehiculoDAO.create(createVehiculo)).to.eventually.be.rejectedWith("cannot be null");
    });

    it("must create the vehicle in the database", async () => {
      const createVehiculo: VehiculoCreationAttributes = {
        IdTaller: workshopResult.IdTaller,
        IdUsuario: userResult.uid || "",
        IdMarca: 1,
        estado: faker.helpers.arrayElement(["Registrado", "Pendiente"]),
        placa: faker.vehicle.vrm(),
        tipoVehiculo: faker.helpers.arrayElement(["Moto", "Carro"])
      };

      await expect(vehiculoDAO.create(createVehiculo)).to.eventually.have.property("IdVehiculo");
    });

    it("must create the vehicle in the database without workshop related", async () => {
      const createVehiculo: VehiculoCreationAttributes = {
        IdUsuario: userResult.uid || "",
        IdMarca: 1,
        estado: faker.helpers.arrayElement(["Registrado", "Pendiente"]),
        placa: faker.vehicle.vrm(),
        tipoVehiculo: faker.helpers.arrayElement(["Moto", "Carro"])
      };

      await expect(vehiculoDAO.create(createVehiculo)).to.eventually.have.property("IdVehiculo");
    });

  });

  describe("find one vehicle by filter", () => {

    it("must search one vehicle by filters", async () => {

      const vehicle = await vehiculoDAO.findOneByFilter({ IdTaller: workshopResult.IdTaller });

      expect(vehicle).to.have.property("IdVehiculo");
    });

    it("must return the first found vehicle when the search matches with multiple vehicles", async () => {

      const vehicle = await vehiculoDAO.findOneByFilter({ IdMarca: 1 });

      expect(vehicle).to.have.property("IdVehiculo");
    });

    it("must return one single vehicle when not filters are passed", async ()=> {
      const vehicle = await vehiculoDAO.findOneByFilter({});
      expect(vehicle).to.have.property("IdVehiculo");
    });

    it("must return null when does not exist a vehicle with the filter passed", async ()=> {
      const vehicle = await vehiculoDAO.findOneByFilter({ IdTaller: -1 });
      expect(vehicle).to.be.null;
    });
  });

  describe("count vehicles", ()=> {
    it("must count all the vehicles when empty filter is received", async ()=> {
      const count = await vehiculoDAO.count({});
      expect(count).to.be.equal(4);
    });

    it("must receive zero when does not find vehicle by the filter received", async ()=> {
      const count = await vehiculoDAO.count({ IdMarca: -1 , IdTaller: -1 });
      expect(count).to.be.equal(0);
    });

    it("must return number of vehicle found by filter received", async ()=> {
      const [count1, count2] = await Promise.all([
        vehiculoDAO.count({ IdTaller: workshopResult.IdTaller }),
        vehiculoDAO.count({ IdUsuario: userMock.uid }),
      ]);
      expect(count1).to.be.equal(1);
      expect(count2).to.be.equal(2);
    });
  });

  describe("get by id", ()=> {
    it("must return null when does not find a vehicle by id", async ()=> {
      const vehicle = await vehiculoDAO.getById(-1);
      expect(vehicle).to.be.null;
    });

    it("must return vehicle when the id does exist", async ()=> {
      const vehicle = await vehiculoDAO.getById(1);
      expect(vehicle).to.have.property("IdVehiculo");
      expect(vehicle?.IdVehiculo).to.equal(1);
    });
  });

  describe("find all the vehicles by filter", ()=> {
    it("must return all the vehicles when filter is empty", async()=> {
      const vehicles = await vehiculoDAO.findAllByFilter({});
      expect(vehicles).to.have.length(4);
    });

    it("must return vehicles by filter", async()=> {
      const [vehicles1, vehicles2, vehicles3] = await Promise.all([
        vehiculoDAO.findAllByFilter({ IdTaller: workshopResult.IdTaller }),
        vehiculoDAO.findAllByFilter({ IdTaller: workshopResult.IdTaller, IdUsuario: userMock.uid }),
        vehiculoDAO.findAllByFilter({ IdUsuario: userMock.uid })
      ]);
       
      expect(vehicles1).to.have.length(1);
      expect(vehicles2).to.have.length(1);
      expect(vehicles3).to.have.length(2);
    });

    it("must return empty when the filter does not match with vehicles in the db", async()=> {
      const vehicles = await vehiculoDAO.findAllByFilter({ IdTaller: -1 });
       
      expect(vehicles).to.have.length(0);
    });
  });

  describe("find vehicles paginated", ()=> {
    it("must return all the vehicles when no params are received", async ()=> {
      const vehiclesPaginated = await vehiculoDAO.findPaginateByFilter();

      expect(vehiclesPaginated.rows).to.have.length(4);
      expect(vehiclesPaginated.count).to.equal(4);
    });

    it("must return only the number of item received as limit", async ()=> {
      const vehiclesPaginated = await vehiculoDAO.findPaginateByFilter(3);

      expect(vehiclesPaginated.rows).to.have.length(3);
      expect(vehiclesPaginated.count).to.equal(4);
    });

    it("must return vehicles for specific page", async ()=> {
      const [vehiclesPaginated1, vehiclesPaginated2, vehiclesPaginated3] = await Promise.all([
        vehiculoDAO.findPaginateByFilter(2, 1),
        vehiculoDAO.findPaginateByFilter(2, 2),
        vehiculoDAO.findPaginateByFilter(2, 3),
      ]);

      expect(vehiclesPaginated1.rows).to.have.length(2);
      expect(vehiclesPaginated1.count).to.equal(4);
      expect(vehiclesPaginated2.rows).to.have.length(2);
      expect(vehiclesPaginated2.count).to.equal(4);
      expect(vehiclesPaginated3.rows).to.have.length(0);
      expect(vehiclesPaginated3.count).to.equal(4);
    });

    it("must return vehicles paginating and filtering with vehicle data", async ()=> {
      const [vehiclesPaginated1, vehiclesPaginated2, vehiclesPaginated3, vehiclesPaginated4] = await Promise.all([
        vehiculoDAO.findPaginateByFilter(undefined, undefined, { IdMarca: 1 }),
        vehiculoDAO.findPaginateByFilter(1, undefined, { IdMarca: 1 }),
        vehiculoDAO.findPaginateByFilter(2, 2, { IdMarca: 1 }),
        vehiculoDAO.findPaginateByFilter(3, 1, { IdMarca: 1, IdUsuario: userMock.uid })
      ]);
       
      expect(vehiclesPaginated1.rows).to.have.length(4);
      expect(vehiclesPaginated1.count).to.equal(4);
      expect(vehiclesPaginated2.rows).to.have.length(1);
      expect(vehiclesPaginated2.count).to.equal(4);
      expect(vehiclesPaginated3.rows).to.have.length(2);
      expect(vehiclesPaginated3.count).to.equal(4);
      expect(vehiclesPaginated4.rows).to.have.length(2);
      expect(vehiclesPaginated4.count).to.equal(2);
    });

    it("must return vehicles paginating and filtering with user data", async ()=> {
      const [vehiclesPaginated1, vehiclesPaginated2, vehiclesPaginated3, vehiclesPaginated4] = await Promise.all([
        vehiculoDAO.findPaginateByFilter(undefined, undefined, { IdMarca: 1 }, { uid: userMock.uid}),
        vehiculoDAO.findPaginateByFilter(undefined, undefined, {}, {}),
        vehiculoDAO.findPaginateByFilter(2, 2, {}, { tipoUsuario: "Cliente" }),
        vehiculoDAO.findPaginateByFilter(3, 1, { IdMarca: -1 })
      ]);
       
      expect(vehiclesPaginated1.rows).to.have.length(2);
      expect(vehiclesPaginated1.count).to.equal(2);
      expect(vehiclesPaginated2.rows).to.have.length(4);
      expect(vehiclesPaginated2.count).to.equal(4);
      expect(vehiclesPaginated3.rows).to.have.length(2);
      expect(vehiclesPaginated3.count).to.equal(4);
      expect(vehiclesPaginated4.rows).to.have.length(0);
      expect(vehiclesPaginated4.count).to.equal(0);
    });
  });
});
