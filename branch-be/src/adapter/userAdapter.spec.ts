import sinon from "sinon";
import { expect } from "chai";
import usersDAO from "../dao/usersDAO";
import {
  UserAttributes,
  UserCreationAttributes,
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

    const mockUser: UserCreationAttributes = {
      tipoUsuario: "Cliente" as const,
      email: "xxx@xxxx.com",
      firstName: "Test",
      estado: "Pendiente" as const,
    };

    const mockUserResult = {
      IdUsuario: 1,
      ...mockUser,
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

    it("when user is already registered at firebase the user must be registered at the database", async () => {
      const mockUserWithUid: UserCreationAttributes = {
        ...mockUser,
        uid: "ASDSAD454564",
      };

      createUserStub.resolves(mockUserResult);
      const result = await userAdapter.createUser(mockUserWithUid);
      
      expect(createUserStub.calledOnce).to.be.true;
      expect(findOneUserByFilterStub.notCalled).to.be.true;
      expect(result).to.be.deep.equal(mockUserResult);
    });

    it("registering user by email", async () => {

      createUserStub.resolves(mockUserResult);
      const result = await userAdapter.createUser(mockUser);


      expect(createUserStub.calledOnce).to.be.true;
      expect(result).to.be.deep.equal(mockUserResult);
      expect(findOneUserByFilterStub.notCalled).to.be.true;
    });

    it("registering user using identification - user by email does not exist", async () => {
      
      const mockUserWithIdentification: UserCreationAttributes = {
        ...mockUser,
        identificacion: "111111111",
      };

      const userResultMock = {
        IdUsuario: 1,
        ...mockUserWithIdentification,
      };

      findOneUserByFilterStub.resolves(null);

      createUserStub.resolves(userResultMock);
      const result = await userAdapter.createUser(mockUserWithIdentification);
      
      expect(createUserStub.calledOnce).to.be.true;
      expect(findOneUserByFilterStub.firstCall.calledWith({ identificacion: mockUserWithIdentification.identificacion })).to.be.true;
      expect(findOneUserByFilterStub.secondCall.calledWith({ email: mockUserWithIdentification.email })).to.be.true;
      expect(updateVehiculoStub.notCalled).to.be.true;
      expect(createUserFirebaseMockFunction.calledOnce).to.be.true;
      expect(result).to.be.deep.equal(userResultMock);
    });

    it("registering user using identification - user by email does exist", async () => {
      
      const mockUserWithIdentification: UserCreationAttributes = {
        ...mockUser,
        identificacion: "111111111",
      };

      const userResultMock = {
        IdUsuario: 1,
        ...mockUserWithIdentification,
      };

      findOneUserByFilterStub.onCall(0).resolves(null);
      findOneUserByFilterStub.onCall(1).resolves(userResultMock);
      
      const result = await userAdapter.createUser(mockUserWithIdentification);
      
      expect(createUserStub.notCalled).to.be.true;
      expect(findOneUserByFilterStub.firstCall.calledWith({ identificacion: mockUserWithIdentification.identificacion })).to.be.true;
      expect(findOneUserByFilterStub.secondCall.calledWith({ email: mockUserWithIdentification.email })).to.be.true;
      expect(createUserFirebaseMockFunction.called).to.be.true;
      expect(updateVehiculoStub.calledOnceWith({ IdUsuario: userFirebaseMock.email }, { IdUsuario: undefined })).to.be.true;
      expect(updateUserStub.called).to.be.true;
      expect(result).to.be.deep.equal(userResultMock);
    });
  });
});
