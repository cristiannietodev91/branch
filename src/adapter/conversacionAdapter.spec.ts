import sinon from "sinon";
import {
  ConversationAttributes,
  ConversationCreationAttributes,
  ConversationInstance,
  UserAttributes,
} from "../types";
import { WhereOptions } from "sequelize";
import { expect } from "chai";
import conversacionDAO from "../dao/conversacionDAO";
import conversacionAdapter from "./conversacionAdapter";

describe("conversacion Adapter unit testing", () => {
  describe("create or get conversation functionality", () => {
    describe("it returns an existing conversation", () => {
      let getConversationStub: sinon.SinonStub<
        [filter: WhereOptions<ConversationAttributes>],
        Promise<ConversationInstance | null> | undefined
      >;

      let createConversationStub: sinon.SinonStub<
        [conversacion: ConversationCreationAttributes],
        Promise<ConversationInstance> | undefined
      >;

      const conversation: ConversationCreationAttributes = {
        uid: "DSDSAD665DSAD",
        keyconversacion: "DSADDSA5556456",
        IdTaller: 1,
      };

      const conversationMock = {
        IdConversacion: 1,
        ...conversation,
      };

      let result: ConversationInstance;

      before(async () => {
        getConversationStub = sinon.stub(conversacionDAO, "findOneByFilter");

        createConversationStub = sinon.stub(conversacionDAO, "create");

        getConversationStub.resolves(conversationMock);

        result = await conversacionAdapter.createOrGetConversacion(
          conversation
        );
      });

      after(() => {
        getConversationStub.restore();
        createConversationStub.restore();
      });

      it("create conversatin must no be called", () => {
        expect(createConversationStub.called).equal(false);
      });

      it("get conversation muts be called once", () => {
        expect(getConversationStub.calledOnce).equal(true);
      });

      it("value returned must by get Conversation must equal to result", () => {
        expect(result).equal(conversationMock);
      });
    });

    describe("conversation was not find must create a conversation", () => {
      let getConversationStub: sinon.SinonStub<
        [filter: WhereOptions<ConversationAttributes>],
        Promise<ConversationInstance | null> | undefined
      >;

      let createConversationStub: sinon.SinonStub<
        [conversacion: ConversationCreationAttributes],
        Promise<ConversationInstance> | undefined
      >;

      const conversation: ConversationCreationAttributes = {
        uid: "DSDSAD665DSAD",
        keyconversacion: "DSADDSA5556456",
        IdTaller: 1,
      };

      const conversationMock = {
        IdConversacion: 1,
        ...conversation,
      };

      let result: ConversationInstance;

      before(async () => {
        getConversationStub = sinon.stub(conversacionDAO, "findOneByFilter");

        createConversationStub = sinon.stub(conversacionDAO, "create");

        getConversationStub.resolves(null);

        createConversationStub.resolves(conversationMock);

        result = await conversacionAdapter.createOrGetConversacion(
          conversation
        );
      });

      after(() => {
        getConversationStub.restore();
        createConversationStub.restore();
      });

      it("create conversation must be called", () => {
        expect(createConversationStub.calledOnce).equal(true);
      });

      it("get conversation must be called once", () => {
        expect(getConversationStub.calledOnce).equal(true);
      });

      it("value returned must by creating conversation must equal to result", () => {
        expect(result).equal(conversationMock);
      });
    });

    describe("create conversation process fails", () => {
      let getConversationStub: sinon.SinonStub<
        [filter: WhereOptions<ConversationAttributes>],
        Promise<ConversationInstance | null> | undefined
      >;

      let createConversationStub: sinon.SinonStub<
        [conversacion: ConversationCreationAttributes],
        Promise<ConversationInstance> | undefined
      >;

      const conversation: ConversationCreationAttributes = {
        uid: "DSDSAD665DSAD",
        keyconversacion: "DSADDSA5556456",
        IdTaller: 1,
      };

      let result: any;

      before(() => {
        getConversationStub = sinon.stub(conversacionDAO, "findOneByFilter");

        createConversationStub = sinon.stub(conversacionDAO, "create");

        getConversationStub.resolves(null);

        createConversationStub.rejects(
          new Error("it was not possible to create a conversation")
        );

        conversacionAdapter
          .createOrGetConversacion(conversation)
          .catch((error) => {
            result = error;
          });
      });

      after(() => {
        getConversationStub.restore();
        createConversationStub.restore();
      });

      it("create conversation must be called", () => {
        expect(createConversationStub.calledOnce).equal(true);
      });

      it("get conversation must be called once", () => {
        expect(getConversationStub.calledOnce).equal(true);
      });

      it("value returned from adapter must be type Error", () => {
        expect(result).have.property("message");
      });

      it("message error must be thrown from dao layer to upper layers", () => {
        const { message } = result;
        expect(message).equal("it was not possible to create a conversation");
      });
    });
  });

  describe("find conversation by filter functions", () => {
    let findAllConversationByStub: sinon.SinonStub<
      [
        filterConversacion: WhereOptions<ConversationAttributes>,
        filterUsuario?: WhereOptions<UserAttributes> | undefined
      ],
      Promise<ConversationInstance[]> | undefined
    >;

    const mockListConversation = [
      {
        IdConversacion: 1,
      },
      {
        IdConversacion: 2,
      },
    ];

    let result: ConversationInstance[] | undefined;

    describe("list conversations by taller functionality", () => {
      before(async () => {
        findAllConversationByStub = sinon.stub(
          conversacionDAO,
          "findAllByFilter"
        );

        findAllConversationByStub.resolves(mockListConversation);

        result =
          await conversacionAdapter.getConversacionesByTallerAndNombreUsuario(
            1
          );
      });

      after(() => {
        findAllConversationByStub.restore();
      });

      it("findAllByFilter must be called once", () => {
        expect(findAllConversationByStub.calledOnce).equal(true);
      });

      it("findAllByFilter must be called with", () => {
        expect(
          findAllConversationByStub.calledWithMatch({ IdTaller: 1 })
        ).equal(true);
      });

      it("result must be equal to findAllConversation dao function", () => {
        expect(result).equal(mockListConversation);
      });
    });
  });
});
