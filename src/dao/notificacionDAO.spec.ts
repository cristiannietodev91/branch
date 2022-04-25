import { expect } from "chai";
import sinon from "sinon";
import notificacionDAO from "./notificacionDAO";
import { NotificacionModel } from "../database/models";
import {
  CreateOptions,
  FindOptions,
  Model,
  Optional,
  UpdateOptions,
  WhereOptions,
} from "sequelize";
import {
  NotificationAttributes,
  NotificationCreationAttributes,
} from "../types";

describe.skip("notificacion DAO unit testing", () => {
  describe("list notificaciones functionality", () => {
    let findAllStub: sinon.SinonStub<
      [options?: FindOptions<any> | undefined],
      Promise<Model<any, any>[]>
    >;
    beforeEach(() => {
      findAllStub = sinon.stub(NotificacionModel, "findAll");
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it("notificacion model findAll result must be equal to findAll function", async () => {
      const mockList = [{ id: 1 }, { id: 1 }, { id: 1 }];
      findAllStub.resolves(mockList as any);
      const list = await notificacionDAO.findAll();

      expect(list).to.have.lengthOf(mockList.length);
    });

    it("notificacion model findAll function must be called", async () => {
      findAllStub.resolves([]);
      await notificacionDAO.findAll();

      expect(findAllStub.called).to.equal(true);
      expect(findAllStub.callCount).to.equal(1);
    });

    it("when notificacion model findAll function fails error is thrown upper layer", async () => {
      findAllStub.rejects(new Error("Error getting list of notificaciones"));
      const stubCatch = sinon.spy();
      const stubThen = sinon.spy();
      await notificacionDAO.findAll().then(stubThen).catch(stubCatch);

      expect(stubCatch.called).to.equal(true);
      expect(stubThen.called).to.equal(false);
    });
  });

  describe("create notificacion functionality", () => {
    let createStub: sinon.SinonStub<
      [
        values?: Optional<any, string> | undefined,
        options?: CreateOptions<any> | undefined
      ],
      Promise<Model<any, any>>
    >;

    const creationMock: NotificationCreationAttributes = {
      IdUsuario: "Test 1",
      text: "user notification",
      typenotificacion: "Test",
      read: true,
      dataAdicional: { IdCita: 1, calificada: false },
    };

    const result: NotificationAttributes = {
      ...creationMock,
      IdNotificacion: 1,
    };

    before(() => {
      createStub = sinon.stub(NotificacionModel, "create");
    });

    after(() => {
      createStub.restore();
    });

    it("Notification model create function must be called when notification is created", async () => {
      createStub.resolves(result as any);

      const notificacion = await notificacionDAO.create(creationMock);

      expect(createStub.called).to.equal(true);
      expect(createStub.callCount).to.equal(1);

      expect(notificacion).to.equal(result);
    });

    it("notification model create function must be called with specific params", async () => {
      createStub.resolves(result as any);

      await notificacionDAO.create(creationMock);

      expect(createStub.calledWith(creationMock)).to.equal(true);
    });
  });

  describe("update notification functionality", () => {
    let updateStub: sinon.SinonStub<
      [values: { [x: string]: any }, options: UpdateOptions<any>],
      Promise<[affectedCount: number]>
    >;

    const filter: WhereOptions<NotificationAttributes> = {
      IdNotificacion: 1,
    };

    const toUpdate: Partial<NotificationAttributes> = {
      read: true,
    };

    const resultMock: [affectedCount: number] = [1];

    beforeEach(() => {
      updateStub = sinon.stub(NotificacionModel, "update");
    });

    afterEach(() => {
      updateStub.restore();
    });

    it("notificationModel update function result must be equal to notificationDao update", async () => {
      updateStub.resolves(resultMock);
      const result = await notificacionDAO.update(filter, toUpdate);

      expect(result).to.equal(resultMock);
    });

    it("notificationModel update function must be called when params is a number", async () => {
      updateStub.resolves(resultMock);
      await notificacionDAO.update(filter, toUpdate);
      expect(updateStub.called).to.equal(true);
      expect(updateStub.callCount).to.equal(1);
    });

    it("notificationModel update function must called once when param is an string", async () => {
      updateStub.resolves(resultMock);
      await notificacionDAO.update(filter, toUpdate);
      expect(updateStub.callCount).to.equal(1);
    });
  });
});
