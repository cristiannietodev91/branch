import sinon from "sinon";
import { expect } from "chai";
import usersDAO from "../dao/usersDAO";
import {
  UserAttributes,
  UserCreationAttributes,
  UserInstance,
  VehiculoFilter,
} from "../types";
import userAdapter from "./userAdapter";
import { WhereOptions } from "sequelize/types";
import admin from "firebase-admin";

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
    let countUserByStub: sinon.SinonStub<
      [
        filterUsuario: WhereOptions<UserAttributes>,
        filterVehiculo: VehiculoFilter
      ],
      Promise<number> | undefined
    >;

    before(() => {
      countUserByStub = sinon.stub(usersDAO, "count");

      userAdapter.countUsuariosByIdTaller({ IdTaller: "1" });
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
      Promise<UserInstance> | undefined
    >;

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

    let adminInitStub: sinon.SinonStub<
      [options?: admin.AppOptions | undefined, name?: string | undefined],
      admin.app.App
    >;

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

    before(() => {
      createUserStub = sinon.stub(usersDAO, "create");

      adminInitStub = sinon.stub(admin, "initializeApp");

      sinon.stub(admin, "auth").get(() => () => ({
        createUser: createUserFirebaseMockFunction,
      }));
    });

    after(() => {
      adminInitStub.restore();

      sinon.restore();
    });

    describe("when user is registered at firebase the user must be registered at the database", () => {
      const mockUserWithUid: UserCreationAttributes = {
        ...mockUser,
        uid: "ASDSAD454564",
      };

      let result: UserInstance | undefined;

      before(async () => {
        sinon.reset();

        createUserStub.resolves(mockUserResult);
        result = await userAdapter.createUsuario(mockUserWithUid);
      });

      it("create user dao must be called once", () => {
        expect(createUserStub.calledOnce).to.be.true;
      });

      it("result must be equal to createUser mock", () => {
        expect(result).to.be.deep.equal(mockUserResult);
      });
    });

    describe("registering user by email", () => {
      let result: UserInstance | undefined;

      before(async () => {
        sinon.reset();

        createUserStub.resolves(mockUserResult);
        result = await userAdapter.createUsuario(mockUser);
      });

      it("create user dao must be called once", () => {
        expect(createUserStub.calledOnce).to.be.true;
      });

      it("result must be equal to createUser mock", () => {
        expect(result).to.be.deep.equal(mockUserResult);
      });
    });

    describe("registering user using identification", () => {
      let getUserByStub: sinon.SinonStub<
        [filter: WhereOptions<UserAttributes> | undefined],
        Promise<UserInstance | null> | undefined
      >;

      let result: UserInstance | undefined;

      const mockUserWithIdentification: UserCreationAttributes = {
        ...mockUser,
        identificacion: "111111111",
      };

      const userResultMock = {
        IdUsuario: 1,
        ...mockUserWithIdentification,
      };

      before(async () => {
        sinon.reset();

        getUserByStub = sinon.stub(usersDAO, "findOneByFilter");

        getUserByStub.resolves(null);

        createUserStub.resolves(userResultMock);
        result = await userAdapter.createUsuario(mockUserWithIdentification);
      });

      after(() => {
        getUserByStub.restore();
      });

      it("create user dao must be called once", () => {
        expect(createUserStub.calledOnce).to.be.true;
      });

      it("after create user in firebase must serach the user in the database", () => {
        expect(getUserByStub.calledTwice).to.be.true;
      });

      it("must create user in firebase", () => {
        expect(createUserFirebaseMockFunction.calledOnce).to.be.true;
      });

      it("result must be equal to createUser mock", () => {
        expect(result).equal(userResultMock);
      });
    });
  });
});
