import { expect } from "chai";
import sinon from "sinon";
import marcaDAO from "./marcaDAO";
import { MarcaModel } from "../database/models";
import {
  CreateOptions,
  FindOptions,
  Model,
  Optional,
  UpdateOptions,
} from "sequelize";
import {
  MarcaAttributes,
  MarcaCreationAttributes,
} from "../types";

describe("marca DAO unit testing", () => {
  describe("list marcas functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllStub = sinon.stub(MarcaModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("marca model findAll result must be equal to findAll function", async () => {
      const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllStub.resolves(mockList as any);
      const list = await marcaDAO.findAll();

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("marca model findAll function must be called", async () => {
      findAllStub.resolves([]);
      await marcaDAO.findAll();

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when marca model findAll function fails error is thrown upper layer", async () => {
      findAllStub.rejects(new Error("Error getting list of marcas"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await marcaDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create marca functionality", () => {
    let createStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const creationMock: MarcaCreationAttributes = {
      marca: "VW",
      referencia: "Jetta",
    };

    const result: MarcaAttributes = {
      ...creationMock,
      IdMarca: 1,
    };

    before(() => {
      createStub = sinon.stub(MarcaModel, "create");
    });

    after(() => {
      createStub.restore();
    });

    it("marca model create function must be called when marca is created", async () => {
      createStub.resolves(result as any);

      const marca = await marcaDAO.create(creationMock);

      expect(createStub.called).to.equal(true);
      expect(createStub.callCount).to.equal(1);

      expect(marca).to.equal(result);
    });

    it("marca model create function must be called with specific params", async () => {
      createStub.resolves(result as any);

      await marcaDAO.create(creationMock);

      expect(createStub.calledWith(creationMock)).to.equal(true);
    });
  });

  describe("update narca functionality", () => {
    let updateStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    const toUpdate: Partial<MarcaAttributes> = {
      referencia: "golf",
    };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateStub = sinon.stub(MarcaModel, "update");
    });

    afterEach(() => {
      updateStub.restore();
    });

    it("marcaModel update function result must be equal to marcaDao update", async () => {
      updateStub.resolves(resultMock);
      const result = await marcaDAO.update("1", toUpdate);

      expect(result).to.equal(resultMock);
    });

    it("marcaModel update function must be called when params is a number", async () => {
      updateStub.resolves(resultMock);
      await marcaDAO.update("1", toUpdate);
      expect(updateStub.called).to.equal(true);
      expect(updateStub.callCount).to.equal(1);
    });

    it("marcaModel update function must called once when param is an string", async () => {
      updateStub.resolves(resultMock);
      await marcaDAO.update("1", toUpdate);
      expect(updateStub.callCount).to.equal(1);
    });
  });
});
