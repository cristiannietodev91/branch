import { expect } from "chai";
import sinon from "sinon";
import servicioVehiculoDAO from "./servicioVehiculoDAO";
import { ServicioVehiculoModel } from "../database/models";
import {
  CreateOptions,
  FindOptions,
  Model,
  Optional,
  UpdateOptions,
} from "sequelize";
import {
  ServicioVehiculoAttributes,
} from "../types";

describe("servicioVehiculo DAO unit testing", () => {
  describe("list servicioVehiculo functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllStub = sinon.stub(ServicioVehiculoModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("servicioVehiculo model findAll result must be equal to findAll function", async () => {
      const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllStub.resolves(mockList as any);
      const list = await servicioVehiculoDAO.findAll();

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("servicioVehiculo model findAll function must be called", async () => {
      findAllStub.resolves([]);
      await servicioVehiculoDAO.findAll();

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when servicioVehiciulo model findAll function fails error is thrown upper layer", async () => {
      findAllStub.rejects(new Error("Error getting list vehicle services"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await servicioVehiculoDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create servicioVehiculo functionality", () => {
    let createStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const creationMock: ServicioVehiculoAttributes = {
      IdServicio: 1,
      IdVehiculo: 1,
      servicio: "Test 1",
      valor: 25000,
    };

    const result: ServicioVehiculoAttributes = {
      ...creationMock,
    };

    before(() => {
      createStub = sinon.stub(ServicioVehiculoModel, "create");
    });

    after(() => {
      createStub.restore();
    });

    it("servicioVehiculo model create function must be called when servicioVehiculo is created", async () => {
      createStub.resolves(result as any);

      const servicioVehiculo = await servicioVehiculoDAO.create(creationMock);

      expect(createStub.called).to.equal(true);
      expect(createStub.callCount).to.equal(1);

      expect(servicioVehiculo).to.equal(result);
    });

    
  });

  describe("update servicioVehiculo functionality", () => {
    let updateStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    const toUpdate: Partial<ServicioVehiculoAttributes> = {
      valor: 25000,
    };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateStub = sinon.stub(ServicioVehiculoModel, "update");
    });

    afterEach(() => {
      updateStub.restore();
    });

    it("servicioVehiculoModel update function result must be equal to servicioVehiculoDao update", async () => {
      updateStub.resolves(resultMock);
      const result = await servicioVehiculoDAO.update(1, toUpdate);

      expect(result).to.equal(resultMock);
    });

    it("servicioVehiculoModel update function must be called when params is a number", async () => {
      updateStub.resolves(resultMock);
      await servicioVehiculoDAO.update(1, toUpdate);
      expect(updateStub.called).to.equal(true);
      expect(updateStub.callCount).to.equal(1);
    });

    it("servicioVehiculoModel update function must called once when param is an string", async () => {
      updateStub.resolves(resultMock);
      await servicioVehiculoDAO.update(1, toUpdate);
      expect(updateStub.callCount).to.equal(1);
    });
  });
});
