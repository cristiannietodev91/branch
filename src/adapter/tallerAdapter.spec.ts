import sinon from "sinon";
import { expect } from "chai";
import tallerDAO from "../dao/tallerDAO";
import { TallerCreationAttributes, TallerInstance } from "../types";
import tallerAdapter from "./tallerAdapter";

describe("Taller adapter functionality", () => {
  describe("get Taller by Id", () => {
    let getByIdStub: sinon.SinonStub<
      [IdTaller: string | number],
      Promise<TallerInstance | null> | undefined
    >;

    before(() => {
      getByIdStub = sinon.stub(tallerDAO, "getById");

      tallerAdapter.getById(1);
    });

    after(() => {
      getByIdStub.restore();
    });

    it("get By Id function musty be called once", () => {
      expect(getByIdStub.calledOnce).equal(true);
    });
  });

  describe("get All functionality", () => {
    let findAllStub: sinon.SinonStub<[], Promise<TallerInstance[]> | undefined>;

    before(() => {
      findAllStub = sinon.stub(tallerDAO, "findAll");

      tallerAdapter.getAll();
    });

    after(() => {
      findAllStub.restore();
    });

    it("get All function must be called once", () => {
      expect(findAllStub.calledOnce).equal(true);
    });
  });

  describe("create taller functionality", () => {
    let createStub: sinon.SinonStub<
      [taller: TallerCreationAttributes],
      Promise<TallerInstance> | undefined
    >;

    const createTallerMock: TallerCreationAttributes = {
      nombre: "Test 1",
      identificacion: "1020202002",
      direccion: "Address Test",
      latitude: 111,
      longitud: 45,
      celular: "+57234234324",
      telefono: "+57234234324",
      email: "xxxx@xxxx.com",
      logo: "",
      estado: "Activa",
    };

    const tallerResult = {
      IdTaller: 1,
      ...createTallerMock,
    };

    let result: TallerInstance | undefined;

    before(async () => {
      createStub = sinon.stub(tallerDAO, "create");

      createStub.resolves(tallerResult);

      result = await tallerAdapter.create(createTallerMock);
    });

    after(() => {
      createStub.restore();
    });

    it("create function must be called once", () => {
      expect(createStub.calledOnce).equal(true);
    });

    it("create taller result must be equal to result adapter", () => {
      expect(result).deep.equal(tallerResult);
    });
  });
});
