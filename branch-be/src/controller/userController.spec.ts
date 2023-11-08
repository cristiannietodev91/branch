import sessionMiddleware from "../middleware/session";
import csrfMiddleware from "../utils/csrf";

import sinon from "sinon";
import { expect } from "chai";
import userAdapter from "../adapter/userAdapter";
import * as supertest from "supertest";
import { WhereOptions } from "sequelize";
// eslint-disable-next-line node/no-extraneous-import
import { FirebaseError } from "@firebase/util";
import { UserAttributes, UserCreationAttributes, UserInstance, VehiculoFilter } from "../types";


describe("user controller", () => {
  let request: supertest.SuperAgentTest;
  let session: sinon.SinonStub;
  let csrf: sinon.SinonStub;

  before(() => {

    session = sinon.stub(sessionMiddleware, "validSession");
    session.callsFake(async (_req, _res, next) => next());

    csrf = sinon.stub(csrfMiddleware, "csrfSynchronisedProtection");
    csrf.callsFake(async (_req, _res, next) => next());

    import("../app").then(async app => {
      request = await supertest.agent(app.default);
    });
  });

  after(() => {
    sinon.verifyAndRestore();
  });

  describe("get all users", () => {
    let findAllUsersStub: sinon.SinonStub<[], Promise<UserInstance[]>>;

    beforeEach(() => {
      findAllUsersStub = sinon.stub(userAdapter, "findAllUsers");
    });

    afterEach(() => {
      findAllUsersStub.restore();
    });

    it("must return empty list when does not find users", async () => {

      findAllUsersStub.resolves([]);

      const response = await request
        .get("/usuario/getAll");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.empty;
      expect(findAllUsersStub.calledOnce).to.be.true;
    });

    it("must return error when counts user by Id workshop fail", async () => {
      const errorMsg = "Error getting users";

      findAllUsersStub.rejects(new Error(errorMsg));

      const response = await request.get("/usuario/getAll");

      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({ error: errorMsg });
      expect(findAllUsersStub.calledOnce).to.be.true;
    });
  });

  describe("find user by email", () => {
    let findOneUserByFilterStub: sinon.SinonStub<[filter: WhereOptions<UserAttributes> | undefined], Promise<UserInstance | null> | undefined>;

    beforeEach(() => {
      findOneUserByFilterStub = sinon.stub(userAdapter, "findOneUserByFilter");
    });

    afterEach(() => {
      findOneUserByFilterStub.restore();
    });

    it("must return success when a user is found", async () => {

      const email = "test@test.com";

      const userResult = {
        id: "userId1",
        name: "user name",
        email
      };

      findOneUserByFilterStub.resolves(userResult);

      const response = await request
        .get(`/usuario/getByEmail/${email}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(userResult);
      expect(findOneUserByFilterStub.calledOnceWith({ email })).to.be.true;
    });

    it("must return not found when user does not exist", async () => {
      const email = "test@test.com";

      findOneUserByFilterStub.resolves(null);

      const response = await request
        .get(`/usuario/getByEmail/${email}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({ error: "User not found" });
      expect(findOneUserByFilterStub.calledOnceWith({ email })).to.be.true;
    });

    it("must return error when search user by email fail", async () => {
      const email = "test@test.com";
      const errorMsg = "Error searching user";

      findOneUserByFilterStub.rejects(new Error(errorMsg));

      const response = await request
        .get(`/usuario/getByEmail/${email}`);

      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({ error: errorMsg });
      expect(findOneUserByFilterStub.calledOnceWith({ email })).to.be.true;
    });
  });

  describe("find user by id", () => {
    let findOneUserByIdStub: sinon.SinonStub<[IdUsuario: string | number], Promise<UserInstance | null> | undefined>;

    const userId = "1";

    beforeEach(() => {
      findOneUserByIdStub = sinon.stub(userAdapter, "getById");
    });

    afterEach(() => {
      findOneUserByIdStub.restore();
    });

    it("must return success when a user is found", async () => {

      const userResult = {
        id: userId,
        name: "user name",
        email: "test@test.com",
      };

      findOneUserByIdStub.resolves(userResult);

      const response = await request
        .get(`/usuario/getById/${userId}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(userResult);
      expect(findOneUserByIdStub.calledOnceWith(userId)).to.be.true;
    });

    it("must return not found when user does not exist", async () => {

      findOneUserByIdStub.resolves(null);

      const response = await request
        .get(`/usuario/getById/${userId}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({ error: "User not found" });
      expect(findOneUserByIdStub.calledOnceWith(userId)).to.be.true;
    });

    it("must return error when search user by id fail", async () => {
      const errorMsg = "Error searching user";

      findOneUserByIdStub.rejects(new Error(errorMsg));

      const response = await request
        .get(`/usuario/getById/${userId}`);

      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({ error: errorMsg });
      expect(findOneUserByIdStub.calledOnceWith(userId)).to.be.true;
    });
  });

  describe("find user by uid", () => {
    let findOneUserByFilterStub: sinon.SinonStub<[filter: WhereOptions<UserAttributes> | undefined], Promise<UserInstance | null> | undefined>;

    beforeEach(() => {
      findOneUserByFilterStub = sinon.stub(userAdapter, "findOneUserByFilter");
    });

    afterEach(() => {
      findOneUserByFilterStub.restore();
    });

    it("must return success when a user is found and it has an IdTaller attr related", async () => {

      const uid = "uuid";

      const userResult = {
        id: "userId1",
        name: "user name",
        IdTaller: 1,
        uid
      };

      findOneUserByFilterStub.resolves(userResult);

      const response = await request
        .get(`/usuario/loginUsuario/${uid}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(userResult);
      expect(findOneUserByFilterStub.calledOnceWith({ uid })).to.be.true;
    });

    it("must return forbidden when the user does not have access to a workshop", async () => {

      const uid = "uuid";

      const userResult = {
        id: "userId1",
        name: "user name",
        uid
      };

      findOneUserByFilterStub.resolves(userResult);

      const response = await request
        .get(`/usuario/loginUsuario/${uid}`);

      expect(response.status).to.equal(403);
      expect(response.body.error).to.deep.equal("User does not have access to the workshop");
      expect(findOneUserByFilterStub.calledOnceWith({ uid })).to.be.true;
    });

    it("must return not found when user does not exist", async () => {
      const uid = "uuid";

      findOneUserByFilterStub.resolves(null);

      const response = await request
        .get(`/usuario/loginUsuario/${uid}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({ error: "User not found" });
      expect(findOneUserByFilterStub.calledOnceWith({ uid })).to.be.true;
    });

    it("must return error when search user by uid fail", async () => {
      const uid = "uuid";
      const errorMsg = "Error searching user";

      findOneUserByFilterStub.rejects(new Error(errorMsg));

      const response = await request
        .get(`/usuario/loginUsuario/${uid}`);

      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({ error: errorMsg });
      expect(findOneUserByFilterStub.calledOnceWith({ uid })).to.be.true;
    });
  });

  describe("count user by IdWorkshop", () => {
    let countUserByFilterStub: sinon.SinonStub<[filter: VehiculoFilter], Promise<number> | undefined>;

    beforeEach(() => {
      countUserByFilterStub = sinon.stub(userAdapter, "countUsersByIdWorkshop");
    });

    afterEach(() => {
      countUserByFilterStub.restore();
    });

    it("must return number of users found", async () => {

      const IdWorkshop = "1";

      countUserByFilterStub.resolves(2);

      const response = await request
        .get(`/usuario/countByIdTaller/${IdWorkshop}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(2);
      expect(countUserByFilterStub.calledOnceWith({ IdTaller: IdWorkshop })).to.be.true;
    });

    it("must return error when counts user by Id workshop fail", async () => {
      const IdWorkshop = "1";
      const errorMsg = "Error searching user";

      countUserByFilterStub.rejects(new Error(errorMsg));

      const response = await request
        .get(`/usuario/countByIdTaller/${IdWorkshop}`);

      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({ error: errorMsg });
      expect(countUserByFilterStub.calledOnceWith({ IdTaller: IdWorkshop })).to.be.true;
    });
  });

  describe("Delete user by id", () => {
    let deleteUserByIdStub: sinon.SinonStub<[userId: string | number], Promise<number> | undefined>;

    beforeEach(() => {
      deleteUserByIdStub = sinon.stub(userAdapter, "deleteById");
    });

    afterEach(() => {
      deleteUserByIdStub.restore();
    });

    it("must return success message when the user is deleted", async () => {

      const IdUser = 1;

      deleteUserByIdStub.resolves(1);

      const response = await request.delete(`/usuario/deleteById/${IdUser}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
        message: `The userId [${IdUser}] was deleted.`,
      });
      expect(deleteUserByIdStub.calledOnceWith(IdUser)).to.be.true;
    });

    it("must return error message when the userId received is not a number", async () => {

      const IdUser = "a";

      const response = await request.delete(`/usuario/deleteById/${IdUser}`);

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({ error: "Param IdUser must be a number." });
      expect(deleteUserByIdStub.notCalled).to.be.true;
    });

    it("must return user not found when the user is not deleted", async () => {
      const IdUser = 1;

      deleteUserByIdStub.resolves(0);

      const response = await request.delete(`/usuario/deleteById/${IdUser}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ message: "User id not found" });
      expect(deleteUserByIdStub.calledOnceWith(IdUser)).to.be.true;
    });

    it("must return error when error occurs deleting an user", async () => {
      const IdUser = 1;
      const errorMessage = "Error deleting user";

      deleteUserByIdStub.rejects(new Error(errorMessage));

      const response = await request.delete(`/usuario/deleteById/${IdUser}`);

      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({ error: errorMessage });
      expect(deleteUserByIdStub.calledOnceWith(IdUser)).to.be.true;

    });
  });

  describe("create user", () => {
    let createUserStub: sinon.SinonStub<[usuario: UserCreationAttributes], Promise<UserInstance> | undefined>;

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
        tipoUsuario: "Cliente"
      };

      const userResponse = {
        uid: "uuid",
        ...userRequest
      };

      createUserStub.resolves(userResponse);

      const response = await request.post("/usuario/createFireBaseUser").send(userRequest);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(userResponse);
      expect(createUserStub.called).to.be.true;
    });

    it("must return error when response from creating user is not received", async () => {
      const userRequest = {
        email: "xxxx@xxx.com",
        password: "123456",
        celular: "3105202566",
        tipoUsuario: "Cliente"
      };

      createUserStub.resolves(null);

      const response = await request.post("/usuario/createFireBaseUser").send(userRequest);

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
        };

        createUserStub.rejects(new FirebaseError(errorCode, "Error firebase."));

        const response = await request.post("/usuario/createFireBaseUser").send(userRequest);

        expect(response.status).to.equal(400);
        expect(response.body).to.deep.equal({ error: errorMessageExpected });
        expect(createUserStub.called).to.be.true;
      });
    });
  });

});