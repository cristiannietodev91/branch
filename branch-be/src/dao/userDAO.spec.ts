import { expect } from "chai";
import sinon from "sinon";
import usersDAO from "./usersDAO";
import { UserModel } from "../database/models";
import {
  CountOptions,
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Model,
  Optional,
  UpdateOptions,
  WhereOptions,
} from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../types";

describe.skip("user DAO unit testing", () => {
  describe("list Users functionality", () => {
    let findAllUserStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllUserStub = sinon.stub(UserModel, "findAll");
    });

    afterEach(() => {
      findAllUserStub.restore();
    });

    it("user model findAll result must be equal to findAll function", async () => {
      const mockUsers = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllUserStub.resolves(mockUsers as any);
      const users = await usersDAO.findAll();

      expect(users).to.have.lengthOf(mockUsers.length);
    });

    it("user model findAll function must be called", async () => {
      findAllUserStub.resolves([]);
      await usersDAO.findAll();

      expect(findAllUserStub.called).to.equal(true);
      expect(findAllUserStub.callCount).to.equal(1);
    });

    it("when user mode findAll function fails usersDao function is called", async () => {
      findAllUserStub.rejects(new Error("Error getting list of users"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await usersDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create user functionality", () => {
    let createUserStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const userMock: UserCreationAttributes = {
      tipoUsuario: "Cliente" as const,
      firstName: "Test",
      email: "xxxx@xxxx.com",
      estado: "Pendiente" as const,
    };

    const userResult = {
      ...userMock,
      IdUsuario: 1,
    };

    before(() => {
      createUserStub = sinon.stub(UserModel, "create");
    });

    after(() => {
      createUserStub.restore();
    });

    it("user model create function must be called when user is created", async () => {
      createUserStub.resolves(userResult as any);

      const user = await usersDAO.create(userMock);

      expect(createUserStub.called).to.equal(true);
      expect(createUserStub.callCount).to.equal(1);

      expect(user).to.equal(userResult);
    });

    it("user model create function must be called with specific params", async () => {
      createUserStub.resolves(userResult as any);

      await usersDAO.create(userMock);

      expect(createUserStub.calledWith(userMock)).to.equal(true);
    });
  });

  describe("count users functionality", () => {
    let countUsersStub: sinon.SinonStub<
      [options?: Omit<CountOptions<any>, "group"> | undefined],
      Promise<number>
    >;

    const filterUsers: WhereOptions<UserAttributes> = {
      IdUsuario: 10,
      identificacion: "1",
    };

    beforeEach(() => {
      countUsersStub = sinon.stub(UserModel, "count");
    });

    afterEach(() => {
      countUsersStub.restore();
    });

    it("user model count function must be called when empty filters", async () => {
      countUsersStub.resolves(undefined);

      const result = await usersDAO.count({}, {});

      expect(countUsersStub.called).to.equal(true);
      expect(countUsersStub.callCount).to.equal(1);

      expect(result).to.equal(undefined);
    });

    it("user model count function must be called when filter are set", async () => {
      countUsersStub.resolves(undefined);

      const result = await usersDAO.count(
        { identificacion: "1" },
        { IdVehiculo: 1 }
      );

      expect(countUsersStub.called).to.equal(true);
      expect(countUsersStub.callCount).to.equal(1);

      expect(result).to.equal(undefined);
    });

    it("user model resolve function must be equal to userDAO count result", async () => {
      countUsersStub.resolves(3);
      const result = await usersDAO.count({}, {});
      expect(result).to.equal(3);
    });

    it("user model resolve function must be equal to userDAO count result when filters are set", async () => {
      countUsersStub.resolves(1);

      const result = await usersDAO.count(filterUsers, {});

      expect(countUsersStub.called).to.equal(true);
      expect(result).to.equal(1);
    });
  });

  describe("delete user functionality", () => {
    let destroyUsersStub: sinon.SinonStub<
      [options?: DestroyOptions<any> | undefined],
      Promise<number>
    >;

    beforeEach(() => {
      destroyUsersStub = sinon.stub(UserModel, "destroy");
    });

    afterEach(() => {
      destroyUsersStub.restore();
    });

    it("userModel destroy function result must be equal to deleteBy function", async () => {
      destroyUsersStub.resolves(1);
      const result = await usersDAO.deleteById(1);
      expect(result).to.equal(1);
    });

    it("userModel destroy function must be called when params is a number", async () => {
      destroyUsersStub.resolves(1);
      await usersDAO.deleteById(1);
      expect(destroyUsersStub.called).to.equal(true);
      expect(destroyUsersStub.callCount).to.equal(1);
    });

    it("userModel destroy function must called once when param is an string", async () => {
      destroyUsersStub.resolves(1);
      await usersDAO.deleteById("1");
      expect(destroyUsersStub.callCount).to.equal(1);
    });
  });

  describe("update user functionality", () => {
    let updateUsersStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    const filterToUpdate = { IdUsuario: 1 };
    const userToUpdate = { identificacion: "1111111" };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateUsersStub = sinon.stub(UserModel, "update");
    });

    afterEach(() => {
      updateUsersStub.restore();
    });

    it("userModel update function result must be equal to userDao update", async () => {
      updateUsersStub.resolves(resultMock);
      const result = await usersDAO.update(filterToUpdate, userToUpdate);

      expect(result).to.equal(resultMock);
    });

    it("userModel update function must be called when params is a number", async () => {
      updateUsersStub.resolves(resultMock);
      await usersDAO.update(filterToUpdate, userToUpdate);
      expect(updateUsersStub.called).to.equal(true);
      expect(updateUsersStub.callCount).to.equal(1);
    });

    it("userModel update function must called once when param is an string", async () => {
      updateUsersStub.resolves(resultMock);
      await usersDAO.update(filterToUpdate, userToUpdate);
      expect(updateUsersStub.callCount).to.equal(1);
    });
  });
});
