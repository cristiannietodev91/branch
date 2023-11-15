import * as chai from "chai";
import sinon from "sinon";

import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
const expect = chai.expect;
import usersDAO from "../dao/usersDAO";
import {
  UserAttributes,
  UserCreationAttributes,
  UserCreationRequest,
  UserInstance,
  VehiculoAttributes,
  VehiculoFilter,
} from "../types";
import userAdapter from "./userAdapter";
import { WhereOptions } from "sequelize/types";
import admin from "firebase-admin";
import vehiculoDAO from "../dao/vehiculoDAO";

describe("user adapter testing", () => {
  describe("must get an user by Id", () => {
    let getUserByIdStub: sinon.SinonStub<
      [IdUsuario: string | number],
      Promise<UserInstance | null> | undefined
    >;

    before(() => {
      getUserByIdStub = sinon.stub(usersDAO, "getById");

      userAdapter.getById(1);
    });

    after(() => {
      getUserByIdStub.restore();
    });

    it("get user dao function must be called once", () => {
      expect(getUserByIdStub.calledOnce).to.be.true;
    });
  });

  describe("must find a list of users", () => {
    let getUserListStub: sinon.SinonStub<[], Promise<UserInstance[]>>;

    before(() => {
      getUserListStub = sinon.stub(usersDAO, "findAll");

      userAdapter.findAllUsers();
    });

    after(() => {
      getUserListStub.restore();
    });

    it("list users dao function must be called once", () => {
      expect(getUserListStub.calledOnce).to.be.true;
    });
  });

  describe("must find an user by filter", () => {
    let getUserByStub: sinon.SinonStub<
      [filter: WhereOptions<UserAttributes> | undefined],
      Promise<UserInstance | null> | undefined
    >;

    before(() => {
      getUserByStub = sinon.stub(usersDAO, "findOneByFilter");

      userAdapter.findOneUserByFilter({ uid: "45645665" });
    });

    after(() => {
      getUserByStub.restore();
    });

    it("list users dao function must be called once", () => {
      expect(getUserByStub.calledOnce).to.be.true;
    });
  });

  describe("must count user by Id Taller", () => {
    let countUserByStub: sinon.SinonStub<[
      filterUsuario?: WhereOptions<UserAttributes> | undefined, 
      filterVehiculo?: VehiculoFilter | undefined
    ], Promise<number>>;

    before(() => {
      countUserByStub = sinon.stub(usersDAO, "count");

      userAdapter.countUsersByIdWorkshop({ IdTaller: "1" });
    });

    after(() => {
      countUserByStub.restore();
    });

    it("list users dao function must be called once", () => {
      expect(countUserByStub.calledOnce).to.be.true;
    });
  });

  describe("must delete user by Id", () => {
    let deleteUserByIdStub: sinon.SinonStub<
      [IdUsuario: string | number],
      Promise<number> | undefined
    >;

    before(() => {
      deleteUserByIdStub = sinon.stub(usersDAO, "deleteById");

      userAdapter.deleteById(1);
    });

    after(() => {
      deleteUserByIdStub.restore();
    });

    it("delete user function must be called once", () => {
      expect(deleteUserByIdStub.calledOnce).to.be.true;
    });
  });

  describe("create user functionality", () => {
    let createUserStub: sinon.SinonStub<
      [usuario: UserCreationAttributes],
      Promise<UserInstance> | undefined>;

    let findOneUserByFilterStub: sinon.SinonStub<[
      filter: WhereOptions<UserAttributes> | undefined
    ], Promise<UserInstance | null> | undefined>;

    let updateVehiculoStub: sinon.SinonStub<[
      filterVehiculo: WhereOptions<VehiculoAttributes>, vehiculo: Partial<VehiculoAttributes>
    ], Promise<[affectedCount: number]> | undefined>;

    let updateUserStub: sinon.SinonStub<[
      filter: WhereOptions<UserAttributes>, usuario: Partial<UserCreationAttributes>
    ], Promise<[affectedCount: number]> | undefined>;

    const userToCreate: UserCreationRequest = {
      tipoUsuario: "Cliente" as const,
      email: "xxx@xxxx.com",
      firstName: "Test",
      identificacion: "111111",
      password: "secure password"
    };

    const mockUserResult = {
      IdUsuario: 1,
      ...userToCreate,
    };

    const userFirebaseMock: admin.auth.UserRecord = {
      uid: "123132123",
      emailVerified: false,
      email: "xxx@xxxx.com",
      disabled: false,
      metadata: {
        lastSignInTime: "",
        creationTime: new Date().toDateString(),
        // eslint-disable-next-line @typescript-eslint/ban-types
        toJSON: (): Object => ({}),
      },
      providerData: [],
      // eslint-disable-next-line @typescript-eslint/ban-types
      toJSON: (): Object => ({}),
    };

    const createUserFirebaseMockFunction =
      sinon.fake.resolves(userFirebaseMock);

    beforeEach(() => {
      createUserStub = sinon.stub(usersDAO, "create");
      findOneUserByFilterStub = sinon.stub(usersDAO, "findOneByFilter");
      updateVehiculoStub = sinon.stub(vehiculoDAO, "update");
      updateUserStub = sinon.stub(usersDAO, "update");

      sinon.stub(admin, "initializeApp");

      sinon.stub(admin, "auth").get(() => () => ({
        createUser: createUserFirebaseMockFunction,
      }));
    });

    afterEach(() => {
      sinon.restore();
    });

    ["", "   ", undefined].forEach((identification) => {
      it("must return error when identification prop is not received", async ()=> {
        const userToCreateWithoutIdentification = {
          tipoUsuario: "Cliente" as const,
          email: "xxx@xxxx.com",
          firstName: "Test",
          identificacion: identification,
          password: "secure password"
        };

        await expect(userAdapter.createUser(userToCreateWithoutIdentification as UserCreationRequest))
          .to.eventually.rejectedWith("Identification is needed to create the user");
        expect(findOneUserByFilterStub.notCalled).to.be.true;
      });
    });

    it("must validate that the user does not exist in the db before creating it", async ()=> {
      const existingUser = {
        IdUsuario: 1,
        firstName: "existing user"
      };

      findOneUserByFilterStub.resolves(existingUser);

      createUserStub.resolves(mockUserResult);
      await expect(userAdapter.createUser(userToCreate)).to.eventually.rejectedWith("User with the identification");
      
      expect(findOneUserByFilterStub.calledWith({ identificacion: userToCreate.identificacion })).to.be.true;
      expect(createUserFirebaseMockFunction.notCalled).to.be.true;
    });

    it("registering user using identification - user by email does not exist", async () => {
      
      findOneUserByFilterStub.resolves(null);

      createUserStub.resolves(mockUserResult);
      const result = await userAdapter.createUser(userToCreate);
      
      expect(findOneUserByFilterStub.firstCall.calledWith({ identificacion: userToCreate.identificacion })).to.be.true;
      expect(findOneUserByFilterStub.secondCall.calledWith({ email: userFirebaseMock.email })).to.be.true;
      expect(createUserStub.calledOnce).to.be.true;
      expect(updateVehiculoStub.notCalled).to.be.true;
      expect(createUserFirebaseMockFunction.calledOnce).to.be.true;
      expect(result).to.be.deep.equal(mockUserResult);
    });

    it("registering user using identification - user by email does exist", async () => {
      
      findOneUserByFilterStub.onCall(0).resolves(null);
      findOneUserByFilterStub.onCall(1).resolves(mockUserResult);
      
      const result = await userAdapter.createUser(userToCreate);
      
      expect(findOneUserByFilterStub.firstCall.calledWith({ identificacion: userToCreate.identificacion })).to.be.true;
      expect(findOneUserByFilterStub.secondCall.calledWith({ email: userFirebaseMock.email })).to.be.true;
      expect(createUserFirebaseMockFunction.called).to.be.true;
      expect(updateVehiculoStub.calledOnceWith({ IdUsuario: userFirebaseMock.email }, { IdUsuario: userFirebaseMock.uid })).to.be.true;
      expect(updateUserStub.called).to.be.true;
      expect(createUserStub.notCalled).to.be.true;
      expect(result).to.be.deep.equal(mockUserResult);
    });
  });
});
