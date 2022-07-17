import sinon, { SinonStub } from "sinon";
import { expect } from "chai";
import vehiculoDAO from "../dao/vehiculoDAO";
import {
  TallerInstance,
  UserAttributes,
  UserCreationAttributes,
  UserInstance,
  VehiculoAttributes,
  VehiculoCreationAttributes,
  VehiculoCreationRequest,
  VehiculoInstance,
} from "../types";
import vehiculoAdapter from "./vehiculoAdapter";
import * as sms from "../utils/sendSms";
import tallerDAO from "../dao/tallerDAO";
import { WhereOptions } from "sequelize/types";
import usersDAO from "../dao/usersDAO";

describe("vehicle Adapter", () => {
  describe("find Vehicles functionality", () => {
    let findStub: SinonStub<[], Promise<VehiculoInstance[]>>;

    const mockListVehicles: any = [
      {
        IdVehiculo: 1,
      },
      {
        IdVehiculo: 2,
      },
    ];

    before(() => {
      findStub = sinon.stub(vehiculoDAO, "findAll");

      findStub.resolves(mockListVehicles);

      vehiculoAdapter.findAllVehiculos();
    });

    after(() => {
      findStub.restore();
    });

    it("find Stube function must be called once", () => {
      expect(findStub.calledOnce).equal(true);
    });
  });

  describe("delete vehicle functionality", () => {
    let deleteStub: sinon.SinonStub<
      [IdVehiculo: number],
      Promise<number> | undefined
    >;

    let result: number | undefined;

    const deleteResultMock = [1];

    before(async () => {
      deleteStub = sinon.stub(vehiculoDAO, "deleteById");

      deleteStub.resolves(deleteResultMock);

      result = await vehiculoAdapter.deleteById(1);
    });

    after(() => {
      deleteStub.restore();
    });

    it("delete by Id database call must be done once", () => {
      expect(deleteStub.calledOnce).equal(true);
    });

    it("result must be equal to delete by Id result", () => {
      expect(result).to.deep.equal(deleteResultMock);
    });
  });

  describe("create vehicle functionality", () => {
    let createVehicleStub: sinon.SinonStub<
      [vehiculo: VehiculoCreationAttributes],
      Promise<VehiculoInstance> | undefined
    >;

    let findVehicleStub: sinon.SinonStub<
      [filter: WhereOptions<VehiculoAttributes>],
      Promise<VehiculoInstance | null> | undefined
    >;

    let findTallerStub: sinon.SinonStub<
      [IdTaller: string | number],
      Promise<TallerInstance | null> | undefined
    >;

    const vehicleMock: VehiculoCreationAttributes = {
      IdMarca: 1,
      IdUsuario: 1,
      IdTaller: 1,
      tipoVehiculo: "carro",
      placa: "XXX111",
      estado: "Activo",
    };

    const mockVehicleResult = {
      IdVehiculo: 1,
      usuarios: {
        tokenCM: "SADDASDSA2321321",
      },
      ...vehicleMock,
    };

    const tallerMockResult = {
      nombre: "test name",
    };

    const notification = sinon.fake();

    before(() => {
      findVehicleStub = sinon.stub(vehiculoDAO, "findOneByFilter");

      createVehicleStub = sinon.stub(vehiculoDAO, "create");

      findTallerStub = sinon.stub(tallerDAO, "getById");

      sinon.replace(sms, "sendNotificacionToUser", notification);
    });

    after(() => {
      sinon.restore();
    });

    describe("vehicle is trying to create already exists but it does not have a taller assigned", () => {
      let updateVehicleStub: sinon.SinonStub<
        [
          filterVehiculo: WhereOptions<VehiculoAttributes>,
          vehiculo: Partial<VehiculoAttributes>
        ],
        Promise<[affectedCount: number]> | undefined
      >;

      const vehicleMock: VehiculoCreationRequest = {
        IdTaller: 1,
        tipoVehiculo: "carro",
        placa: "XXX111",
        celular: "3100000000",
        usuario: {
          email: "xxx@xxx.com",
        },
      };

      const mockVehicleResult = {
        IdVehiculo: 1,
        usuarios: {
          tokenCM: "SADDASDSA2321321",
        },
        ...vehicleMock,
      };

      before(() => {
        //findVehicleStub.reset();
        updateVehicleStub = sinon.stub(vehiculoDAO, "update");

        findVehicleStub.resolves(mockVehicleResult);

        updateVehicleStub.resolves([1]);

        findTallerStub.resolves(tallerMockResult);

        vehiculoAdapter.crearVehiculo(vehicleMock);
      });

      after(() => {
        updateVehicleStub.restore();
      });

      it("find existing vehicle function must be called once", () => {
        expect(findVehicleStub.calledOnce).to.be.true;
      });

      it("Update vehicle function must be called once", () => {
        expect(updateVehicleStub.calledOnce).to.be.true;
      });

      it("find taller to send notification to user must be called once", () => {
        expect(findTallerStub.calledOnce).to.be.true;
      });

      it("It must send a user notification once", () => {
        expect(notification.calledOnce).to.be.true;
      });
    });

    describe("creating an not existing vehicle", () => {
      let findUserStub: sinon.SinonStub<
        [filter: WhereOptions<UserAttributes> | undefined],
        Promise<UserInstance | null> | undefined
      >;

      const userMockResult = {
        IdUsuario: 1,
      };

      const notExistingVehicleMock: VehiculoCreationRequest = {
        ...vehicleMock,
        celular: "3001000000",
        usuario: {
          email: "xxxx@xxxx.com",
        },
      };

      before(() => {
        sinon.reset();

        notification.resetHistory();

        findUserStub = sinon.stub(usersDAO, "findOneByFilter");

        findVehicleStub.resolves(null);

        findUserStub.resolves(userMockResult);

        createVehicleStub.resolves(mockVehicleResult);

        findTallerStub.resolves(tallerMockResult);

        vehiculoAdapter.crearVehiculo(notExistingVehicleMock);
      });

      after(() => {
        findUserStub.restore();
      });

      it("find existing vehicle function must be called once", () => {
        expect(findVehicleStub.calledOnce).to.be.true;
      });

      it("find user by email must be called once", () => {
        expect(findUserStub.calledOnce).to.be.true;
      });

      it("create vehicle function must be called once", () => {
        expect(createVehicleStub.calledOnce).to.be.true;
      });

      it("it must call findTaller once to send a notification to the user", () => {
        expect(findTallerStub.calledOnce).to.be.true;
      });

      it("It must send a user notification once", () => {
        expect(notification.calledOnce).to.be.true;
      });
    });

    describe("creating an not existing vehicle when user does not exists ", () => {
      let findUserStub: sinon.SinonStub<
        [filter: WhereOptions<UserAttributes> | undefined],
        Promise<UserInstance | null> | undefined
      >;

      let createUserStub: sinon.SinonStub<
        [usuario: UserCreationAttributes],
        Promise<UserInstance> | undefined
      >;

      const notExistingVehicleMock: VehiculoCreationRequest = {
        ...vehicleMock,
        celular: "3001000000",
        usuario: {
          email: "xxxx@xxxx.com",
        },
      };

      before(() => {
        sinon.reset();

        notification.resetHistory();

        findUserStub = sinon.stub(usersDAO, "findOneByFilter");

        createUserStub = sinon.stub(usersDAO, "create");

        findVehicleStub.resolves(null);

        findUserStub.resolves(null);

        createUserStub.resolves({ IdUsuario: 1 });

        createVehicleStub.resolves(mockVehicleResult);

        findTallerStub.resolves(tallerMockResult);

        vehiculoAdapter.crearVehiculo(notExistingVehicleMock);
      });

      after(() => {
        createUserStub.restore();

        findUserStub.restore();
      });

      it("find existing vehicle function must be called once", () => {
        expect(findVehicleStub.calledOnce).to.be.true;
      });

      it("find user by email must be called once", () => {
        expect(findUserStub.calledOnce).to.be.true;
      });

      it("create user function must be called once", () => {
        expect(createUserStub.calledOnce).to.be.true;
      });

      it("create vehicle function must be called once", () => {
        expect(createVehicleStub.calledOnce).to.be.true;
      });

      it("it must call findTaller once to send a notification to the user", () => {
        expect(findTallerStub.calledOnce).to.be.true;
      });

      it("It must send a user notification once", () => {
        expect(notification.calledOnce).to.be.true;
      });
    });
  });
});
