import { expect } from "chai";
import sinon from "sinon";
import mecanicoDAO from "./mecanicoDAO";
import { MecanicoModel } from "../database/models";
import {
  CreateOptions,
  FindOptions,
  Model,
  Optional,
  UpdateOptions,
  WhereOptions,
} from "sequelize";
import {
  MecanicoAttributes,
  MecanicoCreationAttributes
} from "../types";

describe.skip("mecanico DAO unit testing", () => {
  describe("list mecanico functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllStub = sinon.stub(MecanicoModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("mecanico model findAll result must be equal to findAll function", async () => {
      const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllStub.resolves(mockList as any);
      const list = await mecanicoDAO.findAll();

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("mecanico model findAll function must be called", async () => {
      findAllStub.resolves([]);
      await mecanicoDAO.findAll();

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when mecanico model findAll function fails error is thrown upper layer", async () => {
      findAllStub.rejects(new Error("Error getting list of mecanico"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await mecanicoDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create mecanico functionality", () => {
    let createStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const creationMock: MecanicoCreationAttributes = {
      identificacion: "111111111",
      firstName: "test 1",
      lastName: "lastName",
      estado: "Activo",
      fullName: "test 1 lastName"
    };

    const result: MecanicoAttributes = {
      ...creationMock,
      IdMecanico: 1,
    };

    before(() => {
      createStub = sinon.stub(MecanicoModel, "create");
    });

    after(() => {
      createStub.restore();
    });

    it("mecanico model create function must be called when mecanico is created", async () => {
      createStub.resolves(result as any);

      const mecanico = await mecanicoDAO.create(creationMock);

      expect(createStub.called).to.equal(true);
      expect(createStub.callCount).to.equal(1);

      expect(mecanico).to.equal(result);
    });

    it("mecanico model create function must be called with specific params", async () => {
      createStub.resolves(result as any);

      await mecanicoDAO.create(creationMock);

      expect(createStub.calledWith(creationMock)).to.equal(true);
    });
  });

  describe("update mecanico functionality", () => {
    let updateStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    const toUpdate: Partial<MecanicoAttributes> = {
      identificacion: "2222222",
    };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateStub = sinon.stub(MecanicoModel, "update");
    });

    afterEach(() => {
      updateStub.restore();
    });

    it("mecanicoModel update function result must be equal to mecanicoDao update", async () => {
      updateStub.resolves(resultMock);
      const result = await mecanicoDAO.update("1", toUpdate);

      expect(result).to.equal(resultMock);
    });

    it("mecanicoModel update function must be called when params is a number", async () => {
      updateStub.resolves(resultMock);
      await mecanicoDAO.update("1", toUpdate);
      expect(updateStub.called).to.equal(true);
      expect(updateStub.callCount).to.equal(1);
    });

    it("mecanicoModel update function must called once when param is an string", async () => {
      updateStub.resolves(resultMock);
      await mecanicoDAO.update("1", toUpdate);
      expect(updateStub.callCount).to.equal(1);
    });
  });
});
