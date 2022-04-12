import { expect } from "chai";
import sinon from "sinon";
import servicioDAO from "./servicioDAO";
import { ServicioModel } from "../database/models";
import {
  CreateOptions,
  FindOptions,
  Model,
  Optional,
  UpdateOptions,
  WhereOptions,
} from "sequelize";
import {
  ServicioAttributes,
  ServicioCreationAttributes,
} from "../types";

describe("servicio DAO unit testing", () => {
  describe("list servicios functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllStub = sinon.stub(ServicioModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("servicio model findAll result must be equal to findAll function", async () => {
      const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllStub.resolves(mockList as any);
      const list = await servicioDAO.findAll();

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("servicio model findAll function must be called", async () => {
      findAllStub.resolves([]);
      await servicioDAO.findAll();

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when servicio model findAll function fails error is thrown upper layer", async () => {
      findAllStub.rejects(new Error("Error getting list of servicios"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await servicioDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create servicio functionality", () => {
    let createStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const creationMock: ServicioCreationAttributes = {
      nombre: "Reparation",
      icono: "screwdriver",
      type: "test",
      color: "#DDFFAA"
    };

    const result: ServicioAttributes = {
      ...creationMock,
      IdServicio: 1,
    };

    before(() => {
      createStub = sinon.stub(ServicioModel, "create");
    });

    after(() => {
      createStub.restore();
    });

    it("servicio model create function must be called when servicio is created", async () => {
      createStub.resolves(result as any);

      const servicio = await servicioDAO.create(creationMock);

      expect(createStub.called).to.equal(true);
      expect(createStub.callCount).to.equal(1);

      expect(servicio).to.equal(result);
    });

    it("servicio model create function must be called with specific params", async () => {
      createStub.resolves(result as any);

      await servicioDAO.create(creationMock);

      expect(createStub.calledWith(creationMock)).to.equal(true);
    });
  });

  describe("update servicio functionality", () => {
    let updateStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    

    const toUpdate: Partial<ServicioAttributes> = {
      icono: "tool"
    };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateStub = sinon.stub(ServicioModel, "update");
    });

    afterEach(() => {
      updateStub.restore();
    });

    it("servicioModel update function result must be equal to servicioDao update", async () => {
      updateStub.resolves(resultMock);
      const result = await servicioDAO.update(1, toUpdate);

      expect(result).to.equal(resultMock);
    });

    it("servicioModel update function must be called when params is a number", async () => {
      updateStub.resolves(resultMock);
      await servicioDAO.update(1, toUpdate);
      expect(updateStub.called).to.equal(true);
      expect(updateStub.callCount).to.equal(1);
    });

    it("servicioModel update function must called once when param is an string", async () => {
      updateStub.resolves(resultMock);
      await servicioDAO.update(1, toUpdate);
      expect(updateStub.callCount).to.equal(1);
    });
  });
});
