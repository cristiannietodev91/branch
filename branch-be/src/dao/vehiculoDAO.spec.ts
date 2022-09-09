import { expect } from "chai";
import sinon from "sinon";
import vehiculoDAO from "./vehiculoDAO";
import { VehiculoModel } from "../database/models";
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Model,
  Optional,
  UpdateOptions,
  WhereOptions,
} from "sequelize";
import { VehiculoAttributes, VehiculoCreationAttributes } from "../types";

describe.skip("vehiculo DAO unit testing", () => {
  describe("list vehiculo functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllStub = sinon.stub(VehiculoModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("vehiculo model findAll result must be equal to dao findAll function", async () => {
      const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllStub.resolves(mockList as any);
      const list = await vehiculoDAO.findAll();

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("vehiculo model findAll function must be called", async () => {
      findAllStub.resolves([]);
      await vehiculoDAO.findAll();

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when vehiculo model findAll function fails error is thrown upper layer", async () => {
      findAllStub.rejects(new Error("Error getting list of vehicles"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await vehiculoDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create vehiculo functionality", () => {
    let createStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const creationMock: VehiculoCreationAttributes = {
      placa: "UUU222",
      IdMarca: 1,
      IdUsuario: 1,
      IdTaller: 1,
      tipoVehiculo: "carro",
      estado: "activo",
    };

    const result: VehiculoAttributes = {
      ...creationMock,
      IdVehiculo: 1,
      IdMarca: 1,
    };

    before(() => {
      createStub = sinon.stub(VehiculoModel, "create");
    });

    after(() => {
      createStub.restore();
    });

    it("vehiculo model create function must be called when vehiculo is created", async () => {
      createStub.resolves(result as any);

      const vehiculo = await vehiculoDAO.create(creationMock);

      expect(createStub.called).to.equal(true);
      expect(createStub.callCount).to.equal(1);

      expect(vehiculo).to.equal(result);
    });

    it("vehiculo model create function must be called with specific params", async () => {
      createStub.resolves(result as any);

      await vehiculoDAO.create(creationMock);

      expect(createStub.calledWith(creationMock)).to.equal(true);
    });
  });

  describe("delete vehiculo functionality", () => {
    let destroyStub: sinon.SinonStub<
      [options?: DestroyOptions<any> | undefined],
      Promise<number>
    >;

    beforeEach(() => {
      destroyStub = sinon.stub(VehiculoModel, "destroy");
    });

    afterEach(() => {
      destroyStub.restore();
    });

    it("vehiculoModel destroy function result must be equal to deleteBy function", async () => {
      destroyStub.resolves(1);
      const result = await vehiculoDAO.deleteById(1);
      expect(result).to.equal(1);
    });

    it("vehiculoModel destroy function must be called when params is a number", async () => {
      destroyStub.resolves(1);
      await vehiculoDAO.deleteById(1);
      expect(destroyStub.called).to.equal(true);
      expect(destroyStub.callCount).to.equal(1);
    });
  });

  describe("update vehiculo functionality", () => {
    let updateStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    const filter: WhereOptions<VehiculoAttributes> = {
      IdVehiculo: 1,
    };

    const tallerToUpdate: Partial<VehiculoAttributes> = {
      placa: "UUU222",
    };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateStub = sinon.stub(VehiculoModel, "update");
    });

    afterEach(() => {
      updateStub.restore();
    });

    it("vehiculoModel update function result must be equal to vehiculoDao update", async () => {
      updateStub.resolves(resultMock);
      const result = await vehiculoDAO.update(filter, tallerToUpdate);

      expect(result).to.equal(resultMock);
    });

    it("vehiculoModel update function must be called when params is a number", async () => {
      updateStub.resolves(resultMock);
      await vehiculoDAO.update(filter, tallerToUpdate);
      expect(updateStub.called).to.equal(true);
      expect(updateStub.callCount).to.equal(1);
    });

    it("vehiculoModel update function must called once when param is an string", async () => {
      updateStub.resolves(resultMock);
      await vehiculoDAO.update(filter, tallerToUpdate);
      expect(updateStub.callCount).to.equal(1);
    });
  });
});
