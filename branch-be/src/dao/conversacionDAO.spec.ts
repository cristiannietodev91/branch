import { expect } from "chai";
import sinon from "sinon";
import conversacionDAO from "./conversacionDAO";
import { ConversacionModel } from "../database/models";
import {
  BindOrReplacements,
  CreateOptions,
  FieldMap,
  FindAttributeOptions,
  FindOptions,
  GroupedCountResultItem,
  GroupOption,
  Includeable,
  IndexHint,
  LOCK,
  Model,
  ModelStatic,
  Optional,
  Order,
  RetryOptions,
  Transaction,
  UpdateOptions,
  WhereOptions,
} from "sequelize";
import {
  ConversationAttributes,
  ConversationCreationAttributes,
  ConversationInstance,
} from "../types";

describe.skip("conversacion DAO unit testing", () => {
  describe("list conversacion functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllStub = sinon.stub(ConversacionModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("conversacion model findAll result must be equal to findAll function", async () => {
      const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllStub.resolves(mockList as any);
      const list = await conversacionDAO.findAll();

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("conversacion model findAll function must be called", async () => {
      findAllStub.resolves([]);
      await conversacionDAO.findAll();

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when conversacion model findAll function fails error is thrown upper layer", async () => {
      findAllStub.rejects(new Error("Error getting list of conversations"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await conversacionDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create conversacion functionality", () => {
    let createStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const creationMock: ConversationCreationAttributes = {
      uid: "SSADSAD52456AS4D-SADASD",
      keyconversacion: "1SASSAD5SAD",
      IdTaller: 1,
    };

    const result: ConversationAttributes = {
      ...creationMock,
      IdConversacion: 1,
    };

    before(() => {
      createStub = sinon.stub(ConversacionModel, "create");
    });

    after(() => {
      createStub.restore();
    });

    it("conversation model create function must be called when conversation is created", async () => {
      createStub.resolves(result as any);

      const conversation = await conversacionDAO.create(creationMock);

      expect(createStub.called).to.equal(true);
      expect(createStub.callCount).to.equal(1);

      expect(conversation).to.equal(result);
    });

    it("conversation model create function must be called with specific params", async () => {
      createStub.resolves(result as any);

      await conversacionDAO.create(creationMock);

      expect(createStub.calledWith(creationMock)).to.equal(true);
    });
  });

  describe("update conversation functionality", () => {
    let updateStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    const toUpdate: Partial<ConversationAttributes> = {
      keyconversacion: "111111DASDASDDS",
    };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateStub = sinon.stub(ConversacionModel, "update");
    });

    afterEach(() => {
      updateStub.restore();
    });

    it("conversationModel update function result must be equal to conversationDao update", async () => {
      updateStub.resolves(resultMock);
      const result = await conversacionDAO.update(1, toUpdate);

      expect(result).to.equal(resultMock);
    });

    it("conversationModel update function must be called when params is a number", async () => {
      updateStub.resolves(resultMock);
      await conversacionDAO.update(1, toUpdate);
      expect(updateStub.called).to.equal(true);
      expect(updateStub.callCount).to.equal(1);
    });

    it("conversationModel update function must called once when param is an string", async () => {
      updateStub.resolves(resultMock);
      await conversacionDAO.update(1, toUpdate);
      expect(updateStub.callCount).to.equal(1);
    });
  });

  describe("filter conversacion functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;

    const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];

    beforeEach(() => {
      findAllStub = sinon.stub(ConversacionModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("conversacion model findAllByFilter result must be equal to findAll function", async () => {
      findAllStub.resolves(mockList as any);
      const list = await conversacionDAO.findAllByFilter({});

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("conversacion model findAllByFilter function must be called with empty filter", async () => {
      findAllStub.resolves([]);
      await conversacionDAO.findAllByFilter({});

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("conversacion model findAllByFilter function must be called with conversations param", async () => {
      findAllStub.resolves(mockList as any);
      await conversacionDAO.findAllByFilter({ IdTaller: 1 }, { IdTaller: 1 });

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when conversacion model findAllByFilter function fails error is thrown upper layer", async () => {
      findAllStub.rejects(
        new Error("Error getting list of conversations filtered")
      );
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await conversacionDAO
        .findAllByFilter({})
        ?.then(stubThen)
        .catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("findOne conversacion functionality", () => {
    let findOneStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any> | null>
    >;

    const mockResult = { IdConversacion: "1" };

    beforeEach(() => {
      findOneStub = sinon.stub(ConversacionModel, "findOne");
    });

    afterEach(() => {
      findOneStub.restore();
    });

    it("conversacion model findOne result must be equal to findOneByFilter function", async () => {
      findOneStub.resolves(mockResult as any);
      const result = await conversacionDAO.findOneByFilter({});

      expect(result).to.equal(mockResult);
    });

    it("conversacion model findOne function must be called with empty filter", async () => {
      findOneStub.resolves({} as any);
      await conversacionDAO.findOneByFilter({});

      expect(findOneStub.called).to.equal(true);
      expect(findOneStub.callCount).to.equal(1);
    });

    it("conversacion model findOne function must be called with conversations param", async () => {
      findOneStub.resolves(mockResult as any);
      await conversacionDAO.findOneByFilter({ IdTaller: 1 });

      expect(findOneStub.called).to.equal(true);
      expect(findOneStub.callCount).to.equal(1);
    });

    it("when conversacion model findAllByFilter function fails error is thrown upper layer", async () => {
      findOneStub.rejects(
        new Error("Error getting list of conversations filtered")
      );
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await conversacionDAO
        .findOneByFilter({})
        ?.then(stubThen)
        .catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("paginate conversacion functionality", () => {
    let paginateStub: sinon.SinonStub<
      [
        options: {
          type?: string | undefined;
          where?: WhereOptions<any> | undefined;
          include?: Includeable | Includeable[] | undefined;
          order?: Order | undefined;
          limit?: number | undefined;
          groupedLimit?: unknown;
          offset?: number | undefined;
          lock?:
            | boolean
            | LOCK
            | { level: LOCK; of: ModelStatic<Model<any, any>> }
            | undefined;
          skipLocked?: boolean | undefined;
          raw?: boolean | undefined;
          having?: WhereOptions<any> | undefined;
          subQuery?: boolean | undefined;
          nest?: boolean | undefined;
          plain?: boolean | undefined;
          replacements?: BindOrReplacements | undefined;
          bind?: BindOrReplacements | undefined;
          instance?: Model<any, any> | undefined;
          mapToModel?: boolean | undefined;
          retry?: RetryOptions | undefined;
          fieldMap?: FieldMap | undefined;
          logging?:
            | boolean
            | ((sql: string, timing?: number | undefined) => void)
            | undefined;
          benchmark?: boolean | undefined;
          transaction?: Transaction | null | undefined;
          useMaster?: boolean | undefined;
          attributes?: FindAttributeOptions | undefined;
          paranoid?: boolean | undefined;
          indexHints?: IndexHint[] | undefined;
          distinct?: boolean | undefined;
          col?: string | undefined;
          group: GroupOption;
        }
      ],
      Promise<{ rows: Model<any, any>[]; count: GroupedCountResultItem[] }>
    >;

    const mockList: {
      rows: ConversationInstance[];
      count: number;
    } = { rows: [{ id: 1 }, { id: 1 }, { id: 1 }] as any, count: 3 };

    beforeEach(() => {
      paginateStub = sinon.stub(ConversacionModel, "findAndCountAll");
    });

    afterEach(() => {
      paginateStub.restore();
    });

    it("conversacion model paginateByFilter result must be equal to findPaginateByFilter function", async () => {
      paginateStub.resolves(mockList as any);
      const list = await conversacionDAO.findPaginateByFilter(1, 10, {});

      expect(list?.rows).to.have.lengthOf(mockList.rows.length);
    });

    it("conversacion model paginateByFilter function must be called with empty filter", async () => {
      paginateStub.resolves({ rows: [], count: [] });
      await conversacionDAO.findPaginateByFilter(1, 10, {});

      expect(paginateStub.called).to.equal(true);
      expect(paginateStub.callCount).to.equal(1);
    });

    it("conversacion model paginateByFilter function must be called with conversations param", async () => {
      paginateStub.resolves(mockList as any);
      await conversacionDAO.findPaginateByFilter(1, 10, { IdTaller: 1 });

      expect(paginateStub.called).to.equal(true);
      expect(paginateStub.callCount).to.equal(1);
    });

    it("when conversacion model findAllByFilter function fails error is thrown upper layer", async () => {
      paginateStub.rejects(
        new Error("Error getting list of conversations filtered")
      );
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await conversacionDAO
        .findPaginateByFilter(1, 10, {})
        ?.then(stubThen)
        .catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });
});
