import sinon from "sinon";
import { expect } from "chai";
import notificacionDAO from "../dao/notificacionDAO";
import {
  NotificationAttributes,
  NotificationCreationAttributes,
  NotificationInstance,
} from "../types";
import notificacionAdapter from "./notificacionAdapter";
import {
  FindAttributeOptions,
  GroupedCountResultItem,
  GroupOption,
  WhereOptions,
} from "sequelize/types";

describe("notification adapter functionality", () => {
  describe("create notification layer", () => {
    let createNotificationStub: sinon.SinonStub<
      [notificacion: NotificationCreationAttributes],
      Promise<NotificationInstance> | undefined
    >;

    const notificationInstanceMock = {
      IdNotification: 1,
    };

    const notificationAttributes: NotificationCreationAttributes = {
      IdUsuario: "DSADSAD4564",
      text: "Test notification message",
      typenotificacion: "test",
      read: true,
      dataAdicional: {
        IdCita: 1,
        calificada: true,
      },
    };

    before(() => {
      createNotificationStub = sinon.stub(notificacionDAO, "create");

      createNotificationStub.resolves(notificationInstanceMock);

      notificacionAdapter.crearNotificacion(notificationAttributes);
    });

    after(() => {
      createNotificationStub.restore();
    });

    it("create notification must be called once", () => {
      expect(createNotificationStub.calledOnce).to.be.true;
    });
  });

  describe("find notifications by user", () => {
    let findNotificationsStub: sinon.SinonStub<
      [filterNotificacion: WhereOptions<NotificationAttributes>],
      Promise<NotificationInstance[]> | undefined
    >;

    before(() => {
      findNotificationsStub = sinon.stub(notificacionDAO, "findAllByFilter");

      notificacionAdapter.findNotificacionesByIdUsuario(1);
    });

    after(() => {
      findNotificationsStub.restore();
    });

    it("find notification by filter must be called once", () => {
      expect(findNotificationsStub.calledOnce).to.be.true;
    });
  });

  describe("count notificaciones by IdUsuario", () => {
    let countNotificacionesStub: sinon.SinonStub<
      [
        filter: WhereOptions<NotificationAttributes>,
        groupBy?: GroupOption | undefined,
        attributes?: FindAttributeOptions | undefined
      ],
      Promise<number> | Promise<GroupedCountResultItem[]> | undefined
    >;

    before(() => {
      countNotificacionesStub = sinon.stub(notificacionDAO, "count");

      notificacionAdapter.countNotificacionesByIdUsuario(1);
    });

    after(() => {
      countNotificacionesStub.restore();
    });

    it("count notifications must be called once", () => {
      expect(countNotificacionesStub.calledOnce).to.be.true;
    });
  });

  describe("updating User notifications", () => {
    let updateNotificacionesStub: sinon.SinonStub<
      [
        filterNotificacion: WhereOptions<NotificationAttributes>,
        notificacion: Partial<NotificationAttributes>
      ],
      Promise<[affectedCount: number]> | undefined
    >;

    before(() => {
      updateNotificacionesStub = sinon.stub(notificacionDAO, "update");
    });

    after(() => {
      sinon.restore();
    });

    describe("updating notifications different to calification", () => {
      before(() => {
        sinon.reset();
        notificacionAdapter.updateNotificacionGeneralByIdUsuario(1);
      });

      it("count notifications must be called once", () => {
        expect(updateNotificacionesStub.calledOnce).to.be.true;
      });
    });

    describe("updating notifications by Id notification", () => {
      before(() => {
        sinon.reset();
        notificacionAdapter.updateNotificacionByIdNotificacion(1, 1, 4);
      });

      it("count notifications must be called once", () => {
        expect(updateNotificacionesStub.calledOnce).to.be.true;
      });
    });
  });
});
