import sinon, { SinonStub } from "sinon";
import * as request from "supertest";
import app from "../app";
import messageAdapter from "../adapter/messageAdapter";
import { WhereOptions, OrderItem } from "sequelize";
import { ConversationAttributes, MessageInstance } from "../types";
import { expect } from "chai";

describe("message controller", ()=> {
  let response: request.SuperAgentTest;

  before(async ()=> {
    response = await request.agent(app);
  });

  describe("getMessagesByConversacion", ()=> {
    // getMessagesByConversacion
    let getMessagesByConversacionStub: SinonStub<[conversacion: WhereOptions<ConversationAttributes>, order?: OrderItem | undefined], Promise<MessageInstance[]>>;

    before(()=> {
      getMessagesByConversacionStub = sinon.stub(messageAdapter, "getMessagesByConversacion");
    });

    after(()=> {
      getMessagesByConversacionStub.restore();
    });

    it("must validate IdConversacionUser required parameter", () => {
      return response.get("/message/getMessagesByConversacion")
        .expect("Content-Type", /json/)
        .expect(500)
        .then(value => {
          expect(value.body.error).to.equal("Missing IdConversacionUser required param.");
        });
    });
  });
});