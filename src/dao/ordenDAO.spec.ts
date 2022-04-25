import { expect } from "chai";
import sinon from "sinon";
import ordenDAO from "./ordenDAO";
import { OrdenModel } from "../database/models";
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Model,
  Optional,
  UpdateOptions,
  WhereOptions,
} from "sequelize";
import {
  OrdenAttributes,
  OrdenCreationAttributes,
} from "../types";

describe.skip("orden DAO unit testing", () => {
  describe("list ordenes functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllStub = sinon.stub(OrdenModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("orden model findAll result must be equal to findAll function", async () => {
      const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllStub.resolves(mockList as any);
      const list = await ordenDAO.findAll();

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("orden model findAll function must be called", async () => {
      findAllStub.resolves([]);
      await ordenDAO.findAll();

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when orden model findAll function fails error is thrown upper layer", async () => {
      findAllStub.rejects(new Error("Error getting list of ordenes"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await ordenDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create orden functionality", () => {
    let createStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const creationMock: OrdenCreationAttributes = {
      IdTaller: 1,
      CodigoOrden: "220CCDDFF",
      IdEtapa: 2,
      IdCita: 1,
      estado: "Activo",
      IdMecanico: 2,
      IdVehiculo: 2,
    };

    const result: OrdenAttributes = {
      ...creationMock,
      IdOrdenTrabajo: 1,
    };

    before(() => {
      createStub = sinon.stub(OrdenModel, "create");
    });

    after(() => {
      createStub.restore();
    });

    it("orden model create function must be called when orden is created", async () => {
      createStub.resolves(result as any);

      const orden = await ordenDAO.create(creationMock);

      expect(createStub.called).to.equal(true);
      expect(createStub.callCount).to.equal(1);

      expect(orden).to.equal(result);
    });

    it("orden model create function must be called with specific params", async () => {
      createStub.resolves(result as any);

      await ordenDAO.create(creationMock);

      expect(createStub.calledWith(creationMock)).to.equal(true);
    });
  });

  describe("update orden functionality", () => {
    let updateStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    const filter: WhereOptions<OrdenAttributes> = {
      IdVehiculo: 1,
    };

    const toUpdate: Partial<OrdenAttributes> = {
      estado: "In Activo"
    };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateStub = sinon.stub(OrdenModel, "update");
    });

    afterEach(() => {
      updateStub.restore();
    });

    it("ordenModel update function result must be equal to ordenDao update", async () => {
      updateStub.resolves(resultMock);
      const result = await ordenDAO.update(filter, toUpdate);

      expect(result).to.equal(resultMock);
    });

    it("ordenModel update function must be called when params is a number", async () => {
      updateStub.resolves(resultMock);
      await ordenDAO.update(filter, toUpdate);
      expect(updateStub.called).to.equal(true);
      expect(updateStub.callCount).to.equal(1);
    });

    it("ordenModel update function must called once when param is an string", async () => {
      updateStub.resolves(resultMock);
      await ordenDAO.update(filter, toUpdate);
      expect(updateStub.callCount).to.equal(1);
    });
  });
});
