import sinon from "sinon";
import { expect } from "chai";
import app from "../app";
import userAdapter from "../adapter/userAdapter";
import * as supertest from "supertest";
import { WhereOptions } from "sequelize";
import { UserAttributes, UserInstance } from "../types";

describe("user controller", ()=> {
  let request: supertest.SuperAgentTest;

  before(async () => {
    request = await supertest.agent(app);
  });

  describe("find user by email", ()=> {
    let findOneUserByFilterStub: sinon.SinonStub<[filter: WhereOptions<UserAttributes> | undefined], Promise<UserInstance | null> | undefined>;

    before(()=> {
      findOneUserByFilterStub = sinon.stub(userAdapter, "findOneUserByFilter");
    });

    it("must return success when a user is found", async ()=> {

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
      expect(findOneUserByFilterStub.calledWith({ email })).to.be.true;
    });

    it("must return not found when user does not exist", async () => {
      const email = "test@test.com";

      findOneUserByFilterStub.resolves(null);

      const response = await request
        .get(`/usuario/getByEmail/${email}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({});
      expect(findOneUserByFilterStub.calledWith({ email })).to.be.true;
    });

    it("must return error when search user by email fail", async ()=> {
      const email = "test@test.com";
      const errorMsg = "Error searching user";

      findOneUserByFilterStub.rejects(new Error(errorMsg));

      const response = await request
        .get(`/usuario/getByEmail/${email}`);

      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({ error: errorMsg });
      expect(findOneUserByFilterStub.calledWith({ email })).to.be.true;
    });
  });

  describe("find user by id", ()=> {
    let findOneUserByIdStub: sinon.SinonStub<[IdUsuario: string | number], Promise<UserInstance | null> | undefined>;

    const userId = "1";

    before(()=> {
      findOneUserByIdStub = sinon.stub(userAdapter, "getById");
    });

    it("must return success when a user is found", async ()=> {

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
      expect(findOneUserByIdStub.calledWith(userId)).to.be.true;
    });

    it("must return not found when user does not exist", async () => {
      
      findOneUserByIdStub.resolves(null);

      const response = await request
        .get(`/usuario/getById/${userId}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({});
      expect(findOneUserByIdStub.calledWith(userId)).to.be.true;
    });

    it("must return error when search user by email fail", async ()=> {
      const email = "test@test.com";
      const errorMsg = "Error searching user";

      findOneUserByIdStub.rejects(new Error(errorMsg));

      const response = await request
        .get(`/usuario/getByEmail/${email}`);

      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({ error: errorMsg });
      expect(findOneUserByIdStub.calledWith(userId)).to.be.true;
    });
  });

});