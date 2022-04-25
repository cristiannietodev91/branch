import sinon from "sinon";
import { expect } from "chai";
import messageDAO from "../dao/messageDAO";
import {
  ConversationAttributes,
  ConversationInstance,
  MessageAttributes,
  MessageCreationAttributes,
  MessageInstance,
  UserAttributes,
} from "../types";
import messageAdapter from "./messageAdapter";
import conversacionDAO from "../dao/conversacionDAO";
import { WhereOptions, Order, FindAttributeOptions } from "sequelize/types";

describe("messages adapter functionality", () => {
  const mockMessagesReturned: MessageCreationAttributes[] = [
    {
      _id: "SADSD4564ASD564SAD654DS",
      IdConversacion: 1,
      delivered: true,
      read: true,
      typeusuario: "cliente",
      user: { name: "cnieto" } as unknown as JSON,
    },
    {
      _id: "SADSD4564ASD56DS887854DS",
      IdConversacion: 1,
      delivered: true,
      read: true,
      typeusuario: "cliente",
      user: { name: "cnieto" } as unknown as JSON,
    },
  ];

  describe("create message functionality", () => {
    let createMessageStub: sinon.SinonStub<
      [message: MessageCreationAttributes],
      Promise<MessageInstance> | undefined
    >;

    let mockCreationMessage: MessageCreationAttributes = {
      _id: "SADSD4564ASD564SAD654DS",
      IdConversacion: 1,
      delivered: true,
      read: true,
      typeusuario: "cliente",
      user: { name: "cnieto" } as unknown as JSON,
    };

    let mockCreationMessageResult: MessageCreationAttributes = {
      IdMessage: 1,
      ...mockCreationMessage,
    };

    let result: MessageInstance | undefined;

    before(async () => {
      createMessageStub = sinon.stub(messageDAO, "create");

      createMessageStub.resolves(mockCreationMessageResult);

      result = await messageAdapter.createMessage(mockCreationMessage);
    });

    after(() => {
      createMessageStub.restore();
    });

    it("create message dao must be called with same object as the adapter", () => {
      expect(createMessageStub.calledWithMatch(mockCreationMessage)).equal(
        true
      );
    });

    it("Result must be equal to value returned from createMessages process", () => {
      expect(result).equal(mockCreationMessageResult);
    });
  });

  describe("get messages by conversation functionality", () => {
    let getMessagesStub: sinon.SinonStub<
      [filterMessages: WhereOptions<MessageAttributes>, order: Order],
      Promise<MessageInstance[]> | undefined
    >;

    let getConversationStub: sinon.SinonStub<
      [filter: WhereOptions<ConversationAttributes>],
      Promise<ConversationInstance | null> | undefined
    >;

    let mockCreationMessage: MessageCreationAttributes = {
      _id: "SADSD4564ASD564SAD654DS",
      IdConversacion: 1,
      delivered: true,
      read: true,
      typeusuario: "cliente",
      user: { name: "cnieto" } as unknown as JSON,
    };

    const mockCreationMessageResult: MessageCreationAttributes = {
      IdMessage: 1,
      ...mockCreationMessage,
    };

    const mockFilterConversation = {
      IdConversacion: 1,
    };

    let result: MessageInstance[];

    describe("get conversation and list of messages succefully", () => {
      const conversationReturnedMock = {
        ...mockFilterConversation,
        uid: "DSDSAD665DSAD",
        keyconversacion: "DSADDSA5556456",
        IdTaller: 1,
      };
      before(async () => {
        getConversationStub = sinon.stub(conversacionDAO, "findOneByFilter");
        getMessagesStub = sinon.stub(messageDAO, "findAllByFilter");

        getConversationStub.resolves(conversationReturnedMock);

        getMessagesStub.resolves(mockMessagesReturned);

        result = await messageAdapter.getMessagesByConversacion(
          mockFilterConversation
        );
      });

      after(() => {
        getMessagesStub.restore();
        getConversationStub.restore();
      });

      it("filter conversation dao must be called with conversation mock filtered value", () => {
        expect(
          getConversationStub.calledWithMatch(mockFilterConversation)
        ).equal(true);
      });

      it("filter conversation dao must be called once", () => {
        expect(getConversationStub.calledOnce).equal(true);
      });

      it("get messages function must be called once", () => {
        expect(getMessagesStub.calledOnce).equal(true);
      });

      it("result must be equal to findAllByFilter function", () => {
        expect(result).equal(mockMessagesReturned);
      });
    });

    describe("conversation was not found", () => {
      const conversationReturnedMock = {
        uid: "DSDSAD665DSAD",
        keyconversacion: "DSADDSA5556456",
        IdTaller: 1,
      };

      before(async () => {
        getConversationStub = sinon.stub(conversacionDAO, "findOneByFilter");
        getMessagesStub = sinon.stub(messageDAO, "findAllByFilter");

        getConversationStub.resolves(conversationReturnedMock);

        result = await messageAdapter.getMessagesByConversacion(
          mockFilterConversation
        );
      });

      after(() => {
        getMessagesStub.restore();
        getConversationStub.restore();
      });

      it("filter conversation dao must be called with conversation mock filtered value", () => {
        expect(
          getConversationStub.calledWithMatch(mockFilterConversation)
        ).equal(true);
      });

      it("filter conversation dao must be called once", () => {
        expect(getConversationStub.calledOnce).equal(true);
      });

      it("get messages function must be called once", () => {
        expect(getMessagesStub.called).equal(false);
      });

      it("result must be empty", () => {
        expect(result).to.deep.equal([]);
      });
    });
  });

  describe("get all unread conversations", () => {
    const conversationsMocked = [
      {
        IdConversacion: 1,
        uid: "DSDSAD665DSAD",
        keyconversacion: "DSADDSA5556456",
        IdTaller: 1,
      },
      {
        IdConversacion: 1,
        uid: "DSDSAD665DSAD",
        keyconversacion: "DSADDSA5556456",
        IdTaller: 1,
      },
    ];
    describe("messages have IdConversation", () => {
      let getMessagesStub: sinon.SinonStub<
        [
          filterMessages: WhereOptions<MessageAttributes>,
          attributes?: FindAttributeOptions | undefined
        ],
        Promise<MessageInstance[]> | undefined
      >;

      let conversationSub: sinon.SinonStub<
        [
          filterConversacion: WhereOptions<ConversationAttributes>,
          filterUsuario?: WhereOptions<UserAttributes> | undefined
        ],
        Promise<ConversationInstance[]> | undefined
      >;

      let result: ConversationInstance[];

      before(async () => {
        getMessagesStub = sinon.stub(messageDAO, "findDistinctAllByFilter");

        conversationSub = sinon.stub(conversacionDAO, "findAllByFilter");

        getMessagesStub.resolves(mockMessagesReturned);

        conversationSub.resolves(conversationsMocked);

        result = await messageAdapter.getAllConversationsUnread(1);
      });

      after(() => {
        getMessagesStub.restore();

        conversationSub.restore();
      });

      it("get Messages functions must be called once", () => {
        expect(getMessagesStub.calledOnce).equal(true);
      });

      it("get Messages functions must be called once with", () => {
        expect(
          getMessagesStub.calledOnceWith({
            read: false,
            typeusuario: "cliente",
          })
        ).equal(true);
      });

      it("conversation function must be called once", () => {
        expect(conversationSub.calledOnce).equal(true);
      });

      it("result must be equal to value returned from find all conversations", () => {
        expect(result).equal(conversationsMocked);
      });
    });
  });
});
