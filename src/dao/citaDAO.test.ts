import { expect } from "chai";
import sinon from "sinon";
import citaDAO from "./citaDAO";
import { CitaModel } from "../database/models";
import {
  CountOptions,
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Model,
  Optional,
  UpdateOptions,
  WhereOptions,
} from "sequelize";
import {
  CitaAttributes,
  CitaCreationAttributes,
} from "../types";

describe("cita DAO unit testing", () => {
  34;
  describe("list cita functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllStub = sinon.stub(CitaModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("cita model findAll result must be equal to findAll function", async () => {
      const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllStub.resolves(mockList as any);
      const list = await citaDAO.findAll();

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("cita model findAll function must be called", async () => {
      findAllStub.resolves([]);
      await citaDAO.findAll();

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when cita model findAll function fails error is thrown upper layer", async () => {
      findAllStub.rejects(new Error("Error getting list of citas"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await citaDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create cita functionality", () => {
    let createStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const creationMock: CitaCreationAttributes = {
      IdTaller: 1,
      IdMecanico: 1,
      IdVehiculo: 1,
      fechaCita: new Date(),
      horaCita: 12313,
      servicio: "Test service",
      estado: "Pendiente"
    };

    const result: CitaAttributes = {
      ...creationMock,
      IdCita: 1,
    };

    before(() => {
      createStub = sinon.stub(CitaModel, "create");
    });

    after(() => {
      createStub.restore();
    });

    it("cita model create function must be called when cita is created", async () => {
      createStub.resolves(result as any);

      const cita = await citaDAO.create(creationMock);

      expect(createStub.called).to.equal(true);
      expect(createStub.callCount).to.equal(1);

      expect(cita).to.equal(result);
    });

    it("cita model create function must be called with specific params", async () => {
      createStub.resolves(result as any);

      await citaDAO.create(creationMock);

      expect(createStub.calledWith(creationMock)).to.equal(true);
    });
  });

  describe("update cita functionality", () => {
    let updateStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    const toUpdate: Partial<CitaCreationAttributes> = {
      IdMecanico: 1,
      estado: "Attended"
    };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateStub = sinon.stub(CitaModel, "update");
    });

    afterEach(() => {
      updateStub.restore();
    });

    it("citaModel update function result must be equal to citaDao update", async () => {
      updateStub.resolves(resultMock);
      const result = await citaDAO.update(1, toUpdate);

      expect(result).to.equal(resultMock);
    });

    it("citaModel update function must be called when params is a number", async () => {
      updateStub.resolves(resultMock);
      await citaDAO.update(1, toUpdate);
      expect(updateStub.called).to.equal(true);
      expect(updateStub.callCount).to.equal(1);
    });

    it("citaModel update function must called once when param is an string", async () => {
      updateStub.resolves(resultMock);
      await citaDAO.update(1, toUpdate);
      expect(updateStub.callCount).to.equal(1);
    });
  });

  describe("delete cita functionality", () => {
    let destroyStub: sinon.SinonStub<
      [options?: DestroyOptions<any> | undefined],
      Promise<number>
    >;

    beforeEach(() => {
      destroyStub = sinon.stub(CitaModel, "destroy");
    });

    afterEach(() => {
      destroyStub.restore();
    });

    it("citaModel destroy function result must be equal to deleteBy function", async () => {
      destroyStub.resolves(1);
      const result = await citaDAO.deleteById(1);
      expect(result).to.equal(1);
    });

    it("tallerModel destroy function must be called when params is a number", async () => {
      destroyStub.resolves(1);
      await citaDAO.deleteById("1");
      expect(destroyStub.called).to.equal(true);
      expect(destroyStub.callCount).to.equal(1);
    });
  });

  describe("count citas functionality", () => {
    let countStub: sinon.SinonStub<
      [options?: Omit<CountOptions<any>, "group"> | undefined],
      Promise<number>
    >;

    const filter: WhereOptions<CitaAttributes> = {
      estado: "Activa"
    };

    beforeEach(() => {
      countStub = sinon.stub(CitaModel, "count");
    });

    afterEach(() => {
      countStub.restore();
    });

    it("cita model count function must be called when empty filters", async () => {
      countStub.resolves(undefined);

      const result = await citaDAO.count({});

      expect(countStub.called).to.equal(true);
      expect(countStub.callCount).to.equal(1);

      expect(result).to.equal(undefined);
    });

    it("cita model count function must be called when filter are set", async () => {
      countStub.resolves(undefined);

      const result = await citaDAO.count(
        { IdTaller: "1" },
        "IdVehiculo"
      );

      expect(countStub.called).to.equal(true);
      expect(countStub.callCount).to.equal(1);

      expect(result).to.equal(undefined);
    });

    it("cita model resolve function must be equal to citaDAO count result", async () => {
      countStub.resolves(3);
      const result = await citaDAO.count({});
      expect(result).to.equal(3);
    });

    it("cita model resolve function must be equal to citaDAO count result when filters are set", async () => {
      countStub.resolves(1);

      const result = await citaDAO.count(filter, "IdCita");

      expect(countStub.called).to.equal(true);
      expect(result).to.equal(1);
    });
  });
});
