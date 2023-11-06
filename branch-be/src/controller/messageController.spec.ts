import sessionMiddleware from  "../middleware/session";
import csrfMiddleware from "../utils/csrf";

import sinon, { SinonStub } from "sinon";
import * as supertest from "supertest";
import messageAdapter from "../adapter/messageAdapter";
import { WhereOptions, OrderItem } from "sequelize";
import { ConversationAttributes, MessageInstance } from "../types";
import { expect } from "chai";

describe("message controller", ()=> {
  let request: supertest.SuperAgentTest;
  let session;
  let csrf;

  before(() => {

    session = sinon.stub(sessionMiddleware, "validSession");
    session.callsFake(async (_req, _res, next)=> next());

    csrf = sinon.stub(csrfMiddleware, "csrfSynchronisedProtection");
    csrf.callsFake(async (_req, _res, next)=> next());

    import("../app").then(async app => {
      request = await supertest.agent(app.default);
    });
  });
  
  after(()=> {
    sinon.verifyAndRestore();
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
      return request.get("/message/getMessagesByConversacion")
        .expect("Content-Type", /json/)
        .expect(500)
        .then(value => {
          expect(value.body.error).to.equal("Missing IdConversacionUser required param.");
        });
    });
  });
});