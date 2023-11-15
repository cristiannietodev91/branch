import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

const expect = chai.expect;

import sinon, { SinonStub } from "sinon";
import vehiculoDAO from "../dao/vehiculoDAO";
import {
  MarcaAttributes,
  MarcaInstance,
  TallerInstance,
  UserAttributes,
  UserCreationAttributes,
  UserInstance,
  VehiculoAttributes,
  VehiculoCreationAttributes,
  VehiculoCreationRequest,
  VehiculoInstance,
} from "../types";
import vehiculoAdapter from "./vehiculoAdapter";
import * as sms from "../utils/sendSms";
import tallerDAO from "../dao/tallerDAO";
import { InferCreationAttributes, Optional, WhereOptions } from "sequelize/types";
import usersDAO from "../dao/usersDAO";
import { faker } from "@faker-js/faker";
import marcaDAO from "../dao/marcaDAO";
import { NullishPropertiesOf } from "sequelize/types/utils";

describe("vehicle Adapter", () => {
  describe("find Vehicles functionality", () => {
    let findStub: SinonStub<[], Promise<VehiculoInstance[]>>;

    const mockListVehicles: any = [
      {
        IdVehiculo: 1,
      },
      {
        IdVehiculo: 2,
      },
    ];

    before(() => {
      findStub = sinon.stub(vehiculoDAO, "findAll");

      findStub.resolves(mockListVehicles);

      vehiculoAdapter.findAllVehiculos();
    });

    after(() => {
      findStub.restore();
    });

    it("find Stube function must be called once", () => {
      expect(findStub.calledOnce).equal(true);
    });
  });

  describe("delete vehicle functionality", () => {
    let deleteStub: sinon.SinonStub<
      [IdVehiculo: number],
      Promise<number> | undefined
    >;

    let result: number | undefined;

    const deleteResultMock = [1];

    before(async () => {
      deleteStub = sinon.stub(vehiculoDAO, "deleteById");

      deleteStub.resolves(deleteResultMock);

      result = await vehiculoAdapter.deleteById(1);
    });

    after(() => {
      deleteStub.restore();
    });

    it("delete by Id database call must be done once", () => {
      expect(deleteStub.calledOnce).equal(true);
    });

    it("result must be equal to delete by Id result", () => {
      expect(result).to.deep.equal(deleteResultMock);
    });
  });

  describe("create vehicle functionality", () => {
    let createVehicleStub: sinon.SinonStub<
      [vehiculo: VehiculoCreationAttributes],
      Promise<VehiculoInstance> | undefined
    >;

    let findVehicleStub: sinon.SinonStub<
      [filter: WhereOptions<VehiculoAttributes>],
      Promise<VehiculoInstance | null> | undefined
    >;

    let findTallerStub: sinon.SinonStub<
      [IdTaller: string | number],
      Promise<TallerInstance | null> | undefined
    >;

    let findMarcaStub: sinon.SinonStub<[
      filterMarca?: WhereOptions<MarcaAttributes> | undefined
    ], Promise<MarcaInstance | null>>;

    let updateVehicleStub: sinon.SinonStub<[
      filterVehiculo: WhereOptions<VehiculoAttributes>, 
      vehiculo: Partial<VehiculoAttributes>
    ], Promise<[affectedCount: number]>>;

    let findUserStub: sinon.SinonStub<[
      filter: WhereOptions<UserAttributes> | undefined
    ], Promise<UserInstance | null>>;

    let createUserStub: sinon.SinonStub<[
      usuario: Optional<InferCreationAttributes<UserInstance, { omit: never; }>, 
      NullishPropertiesOf<InferCreationAttributes<UserInstance, { omit: never; }>>>
    ], Promise<UserInstance>>;

    const vehicleToCreate: VehiculoCreationRequest = {
      IdTaller: 1,
      tipoVehiculo: "carro",
      placa: "XXX111",
      celular: "3100000000",
      usuario: {
        email: "xxx@xxx.com",
        uid: "SASAS123213FFDS",
      },
    };

    const mockVehicleResult = {
      IdVehiculo: 1,
      usuarios: {
        tokenCM: "SADDASDSA2321321",
      },
      ...vehicleToCreate,
    };

    const tallerMockResult = {
      nombre: "test name",
    };

    const notification = sinon.fake();

    beforeEach(() => {

      notification.resetHistory();

      findVehicleStub = sinon.stub(vehiculoDAO, "findOneByFilter");

      createVehicleStub = sinon.stub(vehiculoDAO, "create");

      findTallerStub = sinon.stub(tallerDAO, "getById");

      findMarcaStub = sinon.stub(marcaDAO, "findOneByFilter");

      updateVehicleStub = sinon.stub(vehiculoDAO, "update");

      findUserStub = sinon.stub(usersDAO, "findOneByFilter");

      createUserStub = sinon.stub(usersDAO, "create");

      sinon.replace(sms, "sendNotificacionToUser", notification);
    });

    afterEach(() => {
      sinon.restore();
    });

    it("must create the vehicle when the vehicle exists and does not have a workshop assigned", async () => {
      
      findVehicleStub.resolves(mockVehicleResult);

      updateVehicleStub.resolves([1]);

      findTallerStub.resolves(tallerMockResult);

      const vehicleResult = await vehiculoAdapter.crearVehiculo(vehicleToCreate);

      expect(findVehicleStub.calledOnceWith({ placa: vehicleToCreate.placa })).to.be.true;
      expect(updateVehicleStub.calledOnceWith({ IdVehiculo: mockVehicleResult.IdVehiculo }, { IdTaller: vehicleToCreate.IdTaller })).to.be.true;
      expect(findTallerStub.calledOnce).to.be.true;
      expect(notification.calledOnce).to.be.true;
      expect(vehicleResult).to.deep.equal(mockVehicleResult);
      
    });

    it("must return error when vehicle is already assigned to a workshop", async () => {

      const mockVehicleResult = {
        IdVehiculo: 1,
        usuarios: {
          tokenCM: "SADDASDSA2321321",
        },
        taller: {
          IdTaller: 2
        },
        ...vehicleToCreate,
      };

      findVehicleStub.resolves(mockVehicleResult);

      updateVehicleStub.resolves([1]);

      findTallerStub.resolves(tallerMockResult);

      await expect(vehiculoAdapter.crearVehiculo(vehicleToCreate)).to.eventually.rejectedWith("vehiculo ya esta creado");

      expect(findVehicleStub.calledOnceWith({ placa: vehicleToCreate.placa })).to.be.true;
      expect(updateVehicleStub.notCalled).to.be.true;
      expect(findTallerStub.notCalled).to.be.true;
      expect(notification.notCalled).to.be.true;
    });

    it("must return error when vehicle is not updated", async () => {

      const mockVehicleResult = {
        IdVehiculo: 1,
        usuarios: {
          tokenCM: "SADDASDSA2321321",
        },
        ...vehicleToCreate,
      };

      findVehicleStub.resolves(mockVehicleResult);

      updateVehicleStub.resolves([0]);

      await expect(vehiculoAdapter.crearVehiculo(vehicleToCreate)).to.eventually.rejectedWith("Vehicle was not assigned to the workshop.");

      expect(findVehicleStub.calledOnceWith({ placa: vehicleToCreate.placa })).to.be.true;
      expect(updateVehicleStub.calledOnceWith({ IdVehiculo: mockVehicleResult.IdVehiculo }, { IdTaller: vehicleToCreate.IdTaller })).to.be.true;
      expect(findTallerStub.notCalled).to.be.true;
      expect(notification.notCalled).to.be.true;
    });

    it("creating an not existing vehicle without brand assigned", async () => {
      const userMockResult = {
        IdUsuario: 1,
        uid: "ERADL8789798",
      };

      findVehicleStub.resolves(null);

      findUserStub.resolves(userMockResult as UserInstance);

      createVehicleStub.resolves(mockVehicleResult);

      findTallerStub.resolves(tallerMockResult);

      const vehicleResult = await vehiculoAdapter.crearVehiculo(vehicleToCreate);

      expect(findVehicleStub.calledOnceWith({placa: vehicleToCreate.placa })).to.be.true;
      expect(findMarcaStub.notCalled).to.be.true;
      expect(findUserStub.calledOnceWith({ email: vehicleToCreate.usuario.email })).to.be.true;
      expect(createVehicleStub.calledOnce).to.be.true;
      expect(findTallerStub.calledOnce).to.be.true;
      expect(notification.calledOnce).to.be.true;
      expect(vehicleResult).to.be.deep.equal(mockVehicleResult);
    });

    it("creating an not existing vehicle when user does not exists ", async () => {
      

      const vehicleWithBrand: VehiculoCreationRequest = {
        ...vehicleToCreate,
        marca: {
          marca: "test",
          referencia: "000"
        }
      };

      findVehicleStub.resolves(null);

      findMarcaStub.resolves({ IdMarca: 2 } as MarcaInstance);

      findUserStub.resolves(null);

      createUserStub.resolves({ IdUsuario: 1, uid: faker.string.uuid() } as UserInstance);

      createVehicleStub.resolves(mockVehicleResult);

      findTallerStub.resolves(tallerMockResult);

      const vehicleCreated = await vehiculoAdapter.crearVehiculo(vehicleWithBrand);
      
      expect(findVehicleStub.calledOnceWith({ placa: vehicleWithBrand.placa })).to.be.true;
      expect(findMarcaStub.calledWith({ 
        marca: vehicleWithBrand.marca?.marca, 
        referencia: vehicleWithBrand.marca?.referencia 
      })).to.be.true;
      expect(findUserStub.calledOnceWith({ email: vehicleWithBrand.usuario.email })).to.be.true;
      expect(createUserStub.calledOnce).to.be.true;
      expect(createVehicleStub.calledOnce).to.be.true;
      expect(findTallerStub.calledOnce).to.be.true;
      expect(notification.calledOnce).to.be.true;
      expect(vehicleCreated).to.be.deep.equal(mockVehicleResult);
    });

    it("creating an not existing vehicle when user does not exists - brand not found", async () => {
      const vehicleWithBrand: VehiculoCreationRequest = {
        ...vehicleToCreate,
        marca: {
          marca: "test",
          referencia: "000"
        }
      };

      findVehicleStub.resolves(null);

      findMarcaStub.resolves(null);

      findUserStub.resolves(null);

      createUserStub.resolves({ IdUsuario: 1, uid: faker.string.uuid() } as UserInstance);

      createVehicleStub.resolves(mockVehicleResult);

      findTallerStub.resolves(tallerMockResult);

      const vehicleCreated = await vehiculoAdapter.crearVehiculo(vehicleWithBrand);
      
      expect(findVehicleStub.calledOnceWith({ placa: vehicleWithBrand.placa })).to.be.true;
      expect(findMarcaStub.calledWith({ 
        marca: vehicleWithBrand.marca?.marca, 
        referencia: vehicleWithBrand.marca?.referencia 
      })).to.be.true;
      expect(findUserStub.calledOnceWith({ email: vehicleWithBrand.usuario.email })).to.be.true;
      expect(createUserStub.calledOnce).to.be.true;
      expect(createVehicleStub.calledOnce).to.be.true;
      expect(findTallerStub.calledOnce).to.be.true;
      expect(notification.calledOnce).to.be.true;
      expect(vehicleCreated).to.be.deep.equal(mockVehicleResult);
    });
  });
});
