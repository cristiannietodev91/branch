import { expect } from "chai";
import sinon from "sinon";
import messageDAO from "./messageDAO";
import { MessageModel } from "../database/models";
import {
  CreateOptions,
  FindOptions,
  Model,
  Optional,
  UpdateOptions,
  WhereOptions,
} from "sequelize";
import {
  MessageAttributes,
  MessageCreationAttributes,
} from "../types";

describe("message DAO unit testing", () => {
  describe("list messages functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllStub = sinon.stub(MessageModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("message model findAll result must be equal to findAll function", async () => {
      const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllStub.resolves(mockList as any);
      const list = await messageDAO.findAll();

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("message model findAll function must be called", async () => {
      findAllStub.resolves([]);
      await messageDAO.findAll();

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when message model findAll function fails error is thrown upper layer", async () => {
      findAllStub.rejects(new Error("Error getting list of messages"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await messageDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create message functionality", () => {
    let createStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const creationMock: MessageCreationAttributes = {
      IdConversacion: 1,
      _id: "44DSAD134DFDS23",
      delivered: true,
      read: false,
      typeusuario: "Client",
      user: { name: "Test 1"} as unknown as JSON
    };

    const result: MessageAttributes = {
      ...creationMock,
      IdMessage: 1,
    };

    before(() => {
      createStub = sinon.stub(MessageModel, "create");
    });

    after(() => {
      createStub.restore();
    });

    it("Message model create function must be called when message is created", async () => {
      createStub.resolves(result as any);

      const message = await messageDAO.create(creationMock);

      expect(createStub.called).to.equal(true);
      expect(createStub.callCount).to.equal(1);

      expect(message).to.equal(result);
    });

    it("message model create function must be called with specific params", async () => {
      createStub.resolves(result as any);

      await messageDAO.create(creationMock);

      expect(createStub.calledWith(creationMock)).to.equal(true);
    });
  });

  describe("update message functionality", () => {
    let updateStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    const filter: WhereOptions<MessageAttributes> = {
      IdMessage: 1,
    };

    const toUpdate: Partial<MessageAttributes> = {
      read: true
    };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateStub = sinon.stub(MessageModel, "update");
    });

    afterEach(() => {
      updateStub.restore();
    });

    it("messageModel update function result must be equal to messageDao update", async () => {
      updateStub.resolves(resultMock);
      const result = await messageDAO.update(filter, toUpdate);

      expect(result).to.equal(resultMock);
    });

    it("messageModel update function must be called when params is a number", async () => {
      updateStub.resolves(resultMock);
      await messageDAO.update(filter, toUpdate);
      expect(updateStub.called).to.equal(true);
      expect(updateStub.callCount).to.equal(1);
    });

    it("messageModel update function must called once when param is an string", async () => {
      updateStub.resolves(resultMock);
      await messageDAO.update(filter, toUpdate);
      expect(updateStub.callCount).to.equal(1);
    });
  });
});
