import { expect } from "chai";
import sinon from "sinon";
import etapaDAO from "./etapaDAO";
import { EtapaModel } from "../database/models";
import {
  CreateOptions,
  FindOptions,
  Model,
  Optional,
  UpdateOptions,
} from "sequelize";
import { EtapaAttributes, EtapaCreationAttributes } from "../types";

describe("etapa DAO unit testing", () => {
  describe("list etapas functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllStub = sinon.stub(EtapaModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("etapa model findAll result must be equal to findAll function", async () => {
      const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllStub.resolves(mockList as any);
      const list = await etapaDAO.findAll();

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("etapa model findAll function must be called", async () => {
      findAllStub.resolves([]);
      await etapaDAO.findAll();

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when etapa model findAll function fails error is thrown upper layer", async () => {
      findAllStub.rejects(new Error("Error getting list of etapas"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await etapaDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create etapa functionality", () => {
    let createStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const creationMock: EtapaCreationAttributes = {
      NombreEtapa: "Test 1",
      requiereAprobacion: true,
      requiereDocumentos: true,
    };

    const result: EtapaAttributes = {
      ...creationMock,
      IdEtapa: 1,
    };

    before(() => {
      createStub = sinon.stub(EtapaModel, "create");
    });

    after(() => {
      createStub.restore();
    });

    it("etapa model create function must be called when etapa is created", async () => {
      createStub.resolves(result as any);

      const etapa = await etapaDAO.create(creationMock);

      expect(createStub.called).to.equal(true);
      expect(createStub.callCount).to.equal(1);

      expect(etapa).to.equal(result);
    });

    it("etapa model create function must be called with specific params", async () => {
      createStub.resolves(result as any);

      await etapaDAO.create(creationMock);

      expect(createStub.calledWith(creationMock)).to.equal(true);
    });
  });

  describe("update etapa functionality", () => {
    let updateStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    const toUpdate: Partial<EtapaAttributes> = {
      requiereAprobacion: false,
    };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateStub = sinon.stub(EtapaModel, "update");
    });

    afterEach(() => {
      updateStub.restore();
    });

    it("etapaModel update function result must be equal to etapaDao update", async () => {
      updateStub.resolves(resultMock);
      const result = await etapaDAO.update("1", toUpdate);

      expect(result).to.equal(resultMock);
    });

    it("etapaModel update function must be called when params is a number", async () => {
      updateStub.resolves(resultMock);
      await etapaDAO.update("1", toUpdate);
      expect(updateStub.called).to.equal(true);
      expect(updateStub.callCount).to.equal(1);
    });

    it("etapaModel update function must called once when param is an string", async () => {
      updateStub.resolves(resultMock);
      await etapaDAO.update("1", toUpdate);
      expect(updateStub.callCount).to.equal(1);
    });
  });
});
