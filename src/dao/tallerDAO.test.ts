import { expect } from "chai";
import sinon from "sinon";
import tallerDAO from "./tallerDAO";
import { TallerModel } from "../database/models";
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Model,
  Optional,
  UpdateOptions,
} from "sequelize";
import { TallerAttributes, TallerCreationAttributes } from "../types";

describe("taller DAO unit testing", () => {
  describe("list tallers functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllStub = sinon.stub(TallerModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("taller model findAll result must be equal to findAll function", async () => {
      const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllStub.resolves(mockList as any);
      const list = await tallerDAO.findAll();

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("taller model findAll function must be called", async () => {
      findAllStub.resolves([]);
      await tallerDAO.findAll();

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when taller model findAll function fails error is thrown upper layer", async () => {
      findAllStub.rejects(new Error("Error getting list of talleres"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await tallerDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create taller functionality", () => {
    let createStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const creationMock: TallerCreationAttributes = {
      nombre: "test 1",
      identificacion: "1123455",
      direccion: "Address Test",
      latitude: 100,
      longitud: 120,
      celular: "32155452312",
      telefono: "22453224556",
      email: "test@test.com",
      logo: "/logo/url",
      estado: "Activo",
    };

    const result: TallerAttributes = {
      ...creationMock,
      IdTaller: 1,
    };

    before(() => {
      createStub = sinon.stub(TallerModel, "create");
    });

    after(() => {
      createStub.restore();
    });

    it("taller model create function must be called when taller is created", async () => {
      createStub.resolves(result as any);

      const taller = await tallerDAO.create(creationMock);

      expect(createStub.called).to.equal(true);
      expect(createStub.callCount).to.equal(1);

      expect(taller).to.equal(result);
    });

    it("taller model create function must be called with specific params", async () => {
      createStub.resolves(result as any);

      await tallerDAO.create(creationMock);

      expect(createStub.calledWith(creationMock)).to.equal(true);
    });
  });

  describe("delete taller functionality", () => {
    let destroyStub: sinon.SinonStub<
      [options?: DestroyOptions<any> | undefined],
      Promise<number>
    >;

    beforeEach(() => {
      destroyStub = sinon.stub(TallerModel, "destroy");
    });

    afterEach(() => {
      destroyStub.restore();
    });

    it("tallerModel destroy function result must be equal to deleteBy function", async () => {
      destroyStub.resolves(1);
      const result = await tallerDAO.deleteById(1);
      expect(result).to.equal(1);
    });

    it("tallerModel destroy function must be called when params is a number", async () => {
      destroyStub.resolves(1);
      await tallerDAO.deleteById(1);
      expect(destroyStub.called).to.equal(true);
      expect(destroyStub.callCount).to.equal(1);
    });
  });

  describe("update taller functionality", () => {
    let updateStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    const tallerToUpdate: Partial<TallerCreationAttributes> = {
      direccion: "1111111",
    };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateStub = sinon.stub(TallerModel, "update");
    });

    afterEach(() => {
      updateStub.restore();
    });

    it("tallerModel update function result must be equal to tallerDao update", async () => {
      updateStub.resolves(resultMock);
      const result = await tallerDAO.update(1, tallerToUpdate);

      expect(result).to.equal(resultMock);
    });

    it("tallerModel update function must be called when params is a number", async () => {
      updateStub.resolves(resultMock);
      await tallerDAO.update(2, tallerToUpdate);
      expect(updateStub.called).to.equal(true);
      expect(updateStub.callCount).to.equal(1);
    });

    it("tallerModel update function must called once when param is an string", async () => {
      updateStub.resolves(resultMock);
      await tallerDAO.update(3, tallerToUpdate);
      expect(updateStub.callCount).to.equal(1);
    });
  });
});
