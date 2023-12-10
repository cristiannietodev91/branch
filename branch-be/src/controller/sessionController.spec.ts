import sinon from "sinon";
import { expect } from "chai";
import * as supertest from "supertest";
import { UserCreationRequest, UserInstance } from "../types";
import userAdapter from "../adapter/userAdapter";
import csrfMiddleware from "../utils/csrf";
// eslint-disable-next-line node/no-extraneous-import
import { FirebaseError } from "@firebase/util";

describe("session controller", () => {
  let request: supertest.SuperAgentTest;
  let csrf: sinon.SinonStub;

  before(() => {

    csrf = sinon.stub(csrfMiddleware, "csrfSynchronisedProtection");
    csrf.callsFake(async (_req, _res, next) => next());

    import("../app").then(async app => {
      request = await supertest.agent(app.default);
    });
  });

  after(() => {
    sinon.verifyAndRestore();
  });

  describe("create user", () => {
    let createUserStub: sinon.SinonStub<[usuario: UserCreationRequest], Promise<UserInstance>>;

    beforeEach(() => {
      createUserStub = sinon.stub(userAdapter, "createUser");
    });

    afterEach(() => {
      createUserStub.restore();
    });

    it("must create the user and return success response", async () => {
      const userRequest = {
        email: "xxxx@xxx.com",
        password: "123456",
        celular: "3105202566",
        tipoUsuario: "Cliente",
        identificacion: "11111"
      };

      const userResponse = {
        uid: "uuid",
        ...userRequest
      };

      createUserStub.resolves(userResponse as UserInstance);

      const response = await request.post("/session/createUser").send(userRequest);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(userResponse);
      expect(createUserStub.called).to.be.true;
    });

    it("must return error when response from creating user is not received", async () => {
      const userRequest = {
        email: "xxxx@xxx.com",
        password: "123456",
        celular: "3105202566",
        tipoUsuario: "Cliente",
        identificacion: "11111"
      };

      createUserStub.resolves(undefined);

      const response = await request.post("/session/createUser").send(userRequest);

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({ error: "Error creating user." });
      expect(createUserStub.called).to.be.true;
    });

    [{
      errorCode: "auth/invalid-phone-number",
      errorMessageExpected: "Error phone number is not a valid."
    }, {
      errorCode: "auth/email-already-exists",
      errorMessageExpected: "User already registered with that email."
    }, {
      errorCode : "auth/phone-number-already-exists",
      errorMessageExpected: "User already registered with that phone number."
    }, {
      errorCode : "another error",
      errorMessageExpected: "Error firebase."
    }
    ].forEach(({ errorCode, errorMessageExpected }, index) => {
      it(`must return an user error message for the firebase error - ${index}`, async () => {
        const userRequest = {
          email: "xxxx@xxx.com",
          password: "123456",
          celular: "3105202566",
          tipoUsuario: "Cliente",
          identificacion: "11111"
        };

        createUserStub.rejects(new FirebaseError(errorCode, "Error firebase."));

        const response = await request.post("/session/createUser").send(userRequest);

        expect(response.status).to.equal(400);
        expect(response.body).to.deep.equal({ error: errorMessageExpected });
        expect(createUserStub.called).to.be.true;
      });
    });
  });
});