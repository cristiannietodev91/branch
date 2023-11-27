import sinon, { SinonStub } from "sinon";
import citaAdapter from "./citaAdapter";
import vehiculoDAO from "../dao/vehiculoDAO";
import citaDAO from "../dao/citaDAO";
import mecanicoDAO from "../dao/mecanicoDAO";
import {
  CitaAttributes,
  CitaCreationAttributes,
  CitaInstance,
  CitaRequestAttributes,
  MecanicoInstance,
  OrdenAttributes,
  VehiculoAttributes,
  VehiculoInstance,
} from "../types";
import { WhereOptions } from "sequelize";
import { expect } from "chai";
import * as sms from "../utils/sendSms";
import moment from "moment";


describe("cita Adapter unit testing", () => {
  describe("create cita functionality", () => {
    describe("create cita success process with mechanic", () => {
      let getVehicleStub: SinonStub<
        [filter: WhereOptions<VehiculoAttributes>],
        Promise<VehiculoInstance | null> | undefined
      >;
      let createCitaStub: SinonStub<
        [cita: CitaCreationAttributes],
        Promise<CitaInstance> | undefined
      >;

      let mecanicoGetStub: SinonStub<
        [IdMecanico: string | number],
        Promise<MecanicoInstance | null> | undefined
      >;

      const vehiculoMock: any = {
        IdVehiculo: 1,
        usuario: {
          firstName: " Test 1",
          lastName: "Test last name",
          IdUsuario: 1,
          tipoUsuario: "Client",
          celular: "+573202102021",
          tokenCM: "SDASDSA4564654",
        },
      };

      const citaCreatedMock: any = {
        IdCita: 1,
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      const mecanicoMock: any = {
        IdMecanico: 1,
        firstName: "Test 1",
      };

      const cita: CitaRequestAttributes = {
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      let result: CitaInstance;

      const fake = sinon.fake();
      const notification = sinon.fake();
      const parseFake = sinon.fake();

      before(async () => {
        getVehicleStub = sinon.stub(vehiculoDAO, "findOneByFilter");
        createCitaStub = sinon.stub(citaDAO, "create");
        mecanicoGetStub = sinon.stub(mecanicoDAO, "getById");

        sinon.replace(sms, "sendSMStoInfoBip", fake);
        sinon.replace(sms, "sendNotificacionToUser", notification);
        sinon.replace(sms, "parseTextoSms", parseFake);

        //citaAdapterMocked.__set__("parseTextoSms", parseTextFake);

        getVehicleStub.resolves(vehiculoMock);
        createCitaStub.resolves(citaCreatedMock);
        mecanicoGetStub.resolves(mecanicoMock);

        result = await citaAdapter.createCita(cita);
      });

      after(() => {
        getVehicleStub.restore();
        createCitaStub.restore();
        mecanicoGetStub.restore();
        sinon.restore();
      });

      it("must function to find vehicle be called once", () => {
        expect(getVehicleStub.callCount).equal(1);
      });

      it("must create cita function must be called once", () => {
        expect(createCitaStub.callCount).equal(1);
      });

      it("find mecanico function must be called when cita was created succesfully", () => {
        expect(mecanicoGetStub.callCount).equal(1);
      });

      it("createCita result must be equal to citaDAO create function", () => {
        expect(result).equal(citaCreatedMock);
      });

      it("User has phone number sms must be send", () => {
        expect(fake.callCount).equal(1);
      });

      it("User has app token notification must be send", () => {
        expect(notification.callCount).equal(1);
      });

      it("parse text sms function mst be called with mecanico gotten", () => {
        expect(parseFake.calledWithMatch(mecanicoGetStub)).equal(true);
      });
    });

    describe("create cita success process without mechanic", () => {
      let getVehicleStub: SinonStub<
        [filter: WhereOptions<VehiculoAttributes>],
        Promise<VehiculoInstance | null> | undefined
      >;
      let createCitaStub: SinonStub<
        [cita: CitaCreationAttributes],
        Promise<CitaInstance> | undefined
      >;

      let mecanicoGetStub: SinonStub<
        [IdMecanico: string | number],
        Promise<MecanicoInstance | null> | undefined
      >;

      const vehiculoMock: any = {
        IdVehiculo: 1,
        usuarios: {
          firstName: " Test 1",
          lastName: "Test last name",
          IdUsuario: 1,
          tipoUsuario: "Client",
          celular: "+573202102021",
          tokenCM: "SDASDSA4564654",
        },
      };

      const citaCreatedMock: any = {
        IdCita: 1,
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      const cita: CitaRequestAttributes = {
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      let result: CitaInstance;

      const fake = sinon.fake();
      const notification = sinon.fake();
      const parseFake = sinon.fake();

      before(async () => {
        getVehicleStub = sinon.stub(vehiculoDAO, "findOneByFilter");
        createCitaStub = sinon.stub(citaDAO, "create");
        mecanicoGetStub = sinon.stub(mecanicoDAO, "getById");

        sinon.replace(sms, "sendSMStoInfoBip", fake);
        sinon.replace(sms, "sendNotificacionToUser", notification);
        sinon.replace(sms, "parseTextoSms", parseFake);

        //citaAdapterMocked.__set__("parseTextoSms", parseTextFake);

        getVehicleStub.resolves(vehiculoMock);
        createCitaStub.resolves(citaCreatedMock);
        mecanicoGetStub.resolves(undefined);

        result = await citaAdapter.createCita(cita);
      });

      after(() => {
        getVehicleStub.restore();
        createCitaStub.restore();
        mecanicoGetStub.restore();
        sinon.restore();
      });

      it("parse text sms function mst be called with mecanico gotten", () => {
        expect(parseFake.calledWithMatch(undefined, vehiculoMock)).equal(true);
      });
    });

    describe("create cita success process when user has not contact information", () => {
      let getVehicleStub: SinonStub<
        [filter: WhereOptions<VehiculoAttributes>],
        Promise<VehiculoInstance | null> | undefined
      >;
      let createCitaStub: SinonStub<
        [cita: CitaCreationAttributes],
        Promise<CitaInstance> | undefined
      >;

      let mecanicoGetStub: SinonStub<
        [IdMecanico: string | number],
        Promise<MecanicoInstance | null> | undefined
      >;

      const vehiculoMock: any = {
        IdVehiculo: 1,
        usuarios: {
          firstName: " Test 1",
          lastName: "Test last name",
          IdUsuario: 1,
          tipoUsuario: "Client",
        },
      };

      const citaCreatedMock: any = {
        IdCita: 1,
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      const cita: CitaRequestAttributes = {
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      let result: CitaInstance;

      const fake = sinon.fake();
      const notification = sinon.fake();
      const parseFake = sinon.fake();

      before(async () => {
        getVehicleStub = sinon.stub(vehiculoDAO, "findOneByFilter");
        createCitaStub = sinon.stub(citaDAO, "create");
        mecanicoGetStub = sinon.stub(mecanicoDAO, "getById");

        sinon.replace(sms, "sendSMStoInfoBip", fake);
        sinon.replace(sms, "sendNotificacionToUser", notification);
        sinon.replace(sms, "parseTextoSms", parseFake);

        //citaAdapterMocked.__set__("parseTextoSms", parseTextFake);

        getVehicleStub.resolves(vehiculoMock);
        createCitaStub.resolves(citaCreatedMock);
        mecanicoGetStub.resolves(undefined);

        result = await citaAdapter.createCita(cita);
      });

      after(() => {
        getVehicleStub.restore();
        createCitaStub.restore();
        mecanicoGetStub.restore();
        sinon.restore();
      });

      it("must create cita function must be called once", () => {
        expect(createCitaStub.callCount).equal(1);
      });

      it("User has phone number sms must be send", () => {
        expect(fake.callCount).equal(0);
      });

      it("User has app token notification must be send", () => {
        expect(notification.callCount).equal(0);
      });
    });

    describe("cita is created and process keeps even when findMecanico crash", () => {
      let getVehicleStub: SinonStub<
        [filter: WhereOptions<VehiculoAttributes>],
        Promise<VehiculoInstance | null> | undefined
      >;
      let createCitaStub: SinonStub<
        [cita: CitaCreationAttributes],
        Promise<CitaInstance> | undefined
      >;

      let mecanicoGetStub: SinonStub<
        [IdMecanico: string | number],
        Promise<MecanicoInstance | null> | undefined
      >;

      const vehiculoMock: any = {
        IdVehiculo: 1,
        usuarios: {
          firstName: " Test 1",
          lastName: "Test last name",
          IdUsuario: 1,
          tipoUsuario: "Client",
        },
      };

      const citaCreatedMock: any = {
        IdCita: 1,
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      const cita: CitaRequestAttributes = {
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      let result: CitaInstance;

      const fake = sinon.fake();
      const notification = sinon.fake();

      before(async () => {
        getVehicleStub = sinon.stub(vehiculoDAO, "findOneByFilter");
        createCitaStub = sinon.stub(citaDAO, "create");
        mecanicoGetStub = sinon.stub(mecanicoDAO, "getById");

        sinon.replace(sms, "sendSMStoInfoBip", fake);
        sinon.replace(sms, "sendNotificacionToUser", notification);
        getVehicleStub.resolves(vehiculoMock);
        createCitaStub.resolves(citaCreatedMock);
        mecanicoGetStub.rejects(new Error("Error getting mechanic"));

        result = await citaAdapter.createCita(cita);
      });

      after(() => {
        getVehicleStub.restore();
        createCitaStub.restore();
        mecanicoGetStub.restore();
        sinon.restore();
      });

      it("must create cita function must be called once", () => {
        expect(createCitaStub.callCount).equal(1);
      });

      it("User has phone number sms must be send", () => {
        expect(fake.callCount).equal(0);
      });

      it("User has app token notification must be send", () => {
        expect(notification.callCount).equal(0);
      });

      it("createCita result must be equal to citaDAO create function", () => {
        expect(result).equal(citaCreatedMock);
      });
    });

    describe("citaDao result is undefined adapter must return an error instance", () => {
      let getVehicleStub: SinonStub<
        [filter: WhereOptions<VehiculoAttributes>],
        Promise<VehiculoInstance | null> | undefined
      >;
      let createCitaStub: SinonStub<
        [cita: CitaCreationAttributes],
        Promise<CitaInstance> | undefined
      >;

      let mecanicoGetStub: SinonStub<
        [IdMecanico: string | number],
        Promise<MecanicoInstance | null> | undefined
      >;

      const vehiculoMock: any = {
        IdVehiculo: 1,
        usuarios: {
          firstName: " Test 1",
          lastName: "Test last name",
          IdUsuario: 1,
          tipoUsuario: "Client",
        },
      };

      const cita: CitaRequestAttributes = {
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      let result: any;

      before(() => {
        getVehicleStub = sinon.stub(vehiculoDAO, "findOneByFilter");
        createCitaStub = sinon.stub(citaDAO, "create");
        mecanicoGetStub = sinon.stub(mecanicoDAO, "getById");

        getVehicleStub.resolves(vehiculoMock);
        createCitaStub.resolves(undefined);

        result = citaAdapter.createCita(cita);
      });

      after(() => {
        getVehicleStub.restore();
        createCitaStub.restore();
        mecanicoGetStub.restore();
        sinon.restore();
      });

      it("findMecanico must not be called", () => {
        expect(mecanicoGetStub.called).equal(false);
      });

      it("must create cita function must be called once", () => {
        expect(createCitaStub.callCount).equal(1);
      });

      it("createCita result must contain message prop", () => {
        result.catch((error: any) => {
          expect(error).to.have.property("message");
        });
      });
    });

    describe("create cita process throws en exception", () => {
      let getVehicleStub: SinonStub<
        [filter: WhereOptions<VehiculoAttributes>],
        Promise<VehiculoInstance | null> | undefined
      >;
      let createCitaStub: SinonStub<
        [cita: CitaCreationAttributes],
        Promise<CitaInstance> | undefined
      >;

      const vehiculoMock: any = {
        IdVehiculo: 1,
        usuarios: {
          firstName: " Test 1",
          lastName: "Test last name",
          IdUsuario: 1,
          tipoUsuario: "Client",
        },
      };

      const cita: CitaRequestAttributes = {
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      before(async () => {
        getVehicleStub = sinon.stub(vehiculoDAO, "findOneByFilter");
        createCitaStub = sinon.stub(citaDAO, "create");

        getVehicleStub.resolves(vehiculoMock);
        createCitaStub.rejects(
          new Error("Error creating appoinment within workshop")
        );
      });

      after(() => {
        getVehicleStub.restore();
        createCitaStub.restore();
        sinon.restore();
      });

      it("createCita result must contain error message property", () => {
        citaAdapter.createCita(cita).catch((error) => {
          expect(error).to.have.property("message");
          const { message } = error;
          expect(message).equal("Error creating appoinment within workshop");
        });
      });
    });

    describe("find vehiculo process is undefined or null", () => {
      let getVehicleStub: SinonStub<
        [filter: WhereOptions<VehiculoAttributes>],
        Promise<VehiculoInstance | null> | undefined
      >;
      let createCitaStub: SinonStub<
        [cita: CitaCreationAttributes],
        Promise<CitaInstance> | undefined
      >;

      const cita: CitaRequestAttributes = {
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      before(async () => {
        getVehicleStub = sinon.stub(vehiculoDAO, "findOneByFilter");
        createCitaStub = sinon.stub(citaDAO, "create");

        getVehicleStub.resolves(null);
      });

      after(() => {
        getVehicleStub.restore();
        createCitaStub.restore();
        sinon.restore();
      });

      it("Create cita must not be called when vehicle result is undefined", async () => {
        try {
          await citaAdapter.createCita(cita);
        // eslint-disable-next-line no-empty
        } catch {}
        expect(createCitaStub.called).equal(false);
      });

      it("createCita result must contain error message property", () => {
        citaAdapter.createCita(cita).catch((error) => {
          expect(error).to.have.property("message");
          const { message } = error;
          expect(message).equal(
            "No se encontro un vehiculo con la placa " + cita.placa
          );
        });
      });
    });

    describe("find vehiculo process is undefined or null", () => {
      let getVehicleStub: SinonStub<
        [filter: WhereOptions<VehiculoAttributes>],
        Promise<VehiculoInstance | null> | undefined
      >;
      let createCitaStub: SinonStub<
        [cita: CitaCreationAttributes],
        Promise<CitaInstance> | undefined
      >;

      const cita: CitaRequestAttributes = {
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      before(async () => {
        getVehicleStub = sinon.stub(vehiculoDAO, "findOneByFilter");
        createCitaStub = sinon.stub(citaDAO, "create");

        getVehicleStub.resolves(null);
      });

      after(() => {
        getVehicleStub.restore();
        createCitaStub.restore();
        sinon.restore();
      });

      it("Create cita must not be called when vehicle result is undefined", async () => {
        try {
          await citaAdapter.createCita(cita);
        // eslint-disable-next-line no-empty
        } catch {}
        expect(createCitaStub.called).equal(false);
      });

      it("createCita result must contain error message property", () => {
        citaAdapter.createCita(cita).catch((error) => {
          expect(error).to.have.property("message");
          const { message } = error;
          expect(message).equal(
            "No se encontro un vehiculo con la placa " + cita.placa
          );
        });
      });
    });

    describe("find vehiculo dao process throws and exception", () => {
      let getVehicleStub: SinonStub<
        [filter: WhereOptions<VehiculoAttributes>],
        Promise<VehiculoInstance | null> | undefined
      >;
      let createCitaStub: SinonStub<
        [cita: CitaCreationAttributes],
        Promise<CitaInstance> | undefined
      >;

      const cita: CitaRequestAttributes = {
        placa: "XXX111",
        IdTaller: 1,
        fechaCita: new Date(),
        horaCita: 112021,
        estado: "Solicitada",
        servicio: "Reparation",
        IdMecanico: 1,
      };

      before(async () => {
        getVehicleStub = sinon.stub(vehiculoDAO, "findOneByFilter");
        createCitaStub = sinon.stub(citaDAO, "create");

        getVehicleStub.rejects(new Error("Error trying to find a vehicle"));
      });

      after(() => {
        getVehicleStub.restore();
        createCitaStub.restore();
        sinon.restore();
      });

      it("Create cita must not be called when vehicle result is not success", async () => {
        try {
          await citaAdapter.createCita(cita);
        // eslint-disable-next-line no-empty
        } catch {}
        expect(createCitaStub.called).equal(false);
      });

      it("createCita result must contain error message property", () => {
        citaAdapter.createCita(cita).catch((error) => {
          expect(error).to.have.property("message");
          const { message } = error;
          expect(message).equal("Error trying to find a vehicle");
        });
      });
    });
  });

  describe("cita adapter update cita by Id cita functionality", () => {
    const citaUpdateMock = {
      IdTaller: 1,
      IdMecanico: 1,
      fechaCita: moment().add(2, "days").toDate(),
      horaCita: 11,
      estado: "Cancelada",
    };

    describe("cita estado has an invalid value", () => {
      it("must return an error when Id Cita is null", () => {
        citaAdapter
          .updateCitaByIdCita(1, {
            ...citaUpdateMock,
            estado: "",
          })
          .catch((error) => {
            expect(error).to.have.property("message");
            const { message } = error;
            expect(message).equal("State value is not valid");
          });
      });
    });

    describe("cita update flow finishes succesfully", () => {
      let updateStub: sinon.SinonStub<[IdCita: number, cita: Partial<CitaCreationAttributes>], Promise<[affectedCount: number]>>;

      let getCitaStub: sinon.SinonStub<[IdCita: number], Promise<CitaInstance | null>>;

      let result: CitaInstance | null;

      const mockGetById = { ...citaUpdateMock, IdCita: 1 };

      before(async () => {
        updateStub = sinon.stub(citaDAO, "update");

        getCitaStub = sinon.stub(citaDAO, "getById");

        updateStub.resolves([1]);

        getCitaStub.resolves(mockGetById as CitaInstance);

        result = await citaAdapter.updateCitaByIdCita(1, citaUpdateMock);
      });

      after(() => {
        updateStub.restore();
        getCitaStub.restore();
      });

      it("citaDao update function must be called once", () => {
        expect(updateStub.calledOnce).equal(true);
      });

      it("citaDao getById function must be called once", () => {
        expect(getCitaStub.calledOnce).equal(true);
      });

      it("retrieve citaById must be equal to citaAdapter update by Id cita ", () => {
        expect(result).equal(mockGetById);
      });
    });

    describe("cita state cancelled must not be update when fechaCita is less than 24h", () => {
      let updateStub: sinon.SinonStub<[IdCita: number, cita: Partial<CitaCreationAttributes>], Promise<[affectedCount: number]>>;

      let getCitaStub: sinon.SinonStub<[IdCita: number], Promise<CitaInstance | null>>;

      let result: any;

      const mockGetById = { ...citaUpdateMock, IdCita: 1 };

      before(async () => {
        updateStub = sinon.stub(citaDAO, "update");

        getCitaStub = sinon.stub(citaDAO, "getById");

        updateStub.resolves([1]);

        getCitaStub.resolves(mockGetById as CitaInstance);

        citaAdapter
          .updateCitaByIdCita(1, {
            ...citaUpdateMock,
            fechaCita: new Date(),
          })
          .catch((error) => {
            result = error;
          });
      });

      after(() => {
        updateStub.restore();
        getCitaStub.restore();
      });

      it("citaDao update function must not be called", () => {
        expect(updateStub.calledOnce).equal(false);
      });

      it("citaDao getById function must not be called", () => {
        expect(getCitaStub.calledOnce).equal(false);
      });

      it("value retriev in catch must be type Error", () => {
        expect(result).to.have.property("message");
      });

      it("error message must be equal to", () => {
        const { message } = result;
        expect(message).equal("Appoinments must be cancelled 24h before");
      });
    });

    describe("must return error when getById cita is null", () => {
      let updateStub: sinon.SinonStub<[IdCita: number, cita: Partial<CitaCreationAttributes>], Promise<[affectedCount: number]>>;

      let getCitaStub: sinon.SinonStub<[IdCita: number], Promise<CitaInstance | null>>;

      let result: any;

      before(async () => {
        updateStub = sinon.stub(citaDAO, "update");

        getCitaStub = sinon.stub(citaDAO, "getById");

        updateStub.resolves([1]);

        getCitaStub.resolves(null);

        result = await citaAdapter.updateCitaByIdCita(1, {
          ...citaUpdateMock,
        });
      });

      after(() => {
        updateStub.restore();
        getCitaStub.restore();
      });

      it("citaDao update function must not be called", () => {
        expect(updateStub.calledOnce).equal(true);
      });

      it("citaDao getById function must not be called", () => {
        expect(getCitaStub.calledOnce).equal(true);
      });

      it("error message must be equal to", () => {
        expect(result).equal(null);
      });
    });
  });

  describe("rate appoinment functionality", () => {
    const citaUpdateMock = {
      IdTaller: 1,
      IdMecanico: 1,
      fechaCita: moment().add(2, "days").toDate(),
      horaCita: 11,
      estado: "Cancelada",
    };

    describe("calification workshop is sent must update appointment succesfully", () => {
      let updateStub: sinon.SinonStub<[IdCita: number, cita: Partial<CitaCreationAttributes>], Promise<[affectedCount: number]>>;

      let getCitaStub: sinon.SinonStub<[IdCita: number], Promise<CitaInstance | null>>;

      let result: any;

      const mockGetById = { ...citaUpdateMock, IdCita: 1 };

      before(async () => {
        updateStub = sinon.stub(citaDAO, "update");

        getCitaStub = sinon.stub(citaDAO, "getById");

        updateStub.resolves([1]);

        getCitaStub.resolves(mockGetById as CitaInstance);

        result = await citaAdapter.calificaCitaByIdCita({
          IdCita: 1,
          calificacion: 5,
        });
      });

      after(() => {
        updateStub.restore();
        getCitaStub.restore();
      });

      it("Update appointment function must be called", () => {
        expect(updateStub.calledOnce).equal(true);
      });

      it("find appointment function must be called", () => {
        expect(getCitaStub.calledOnce).equal(true);
      });

      it("value returned from adapter must be type Error", () => {
        expect(result).not.have.property("message");
      });

      it("result get cita by Id must equal to rate appointment function", () => {
        expect(result).equal(mockGetById);
      });
    });

    describe("must return error when any rate param are sent", () => {
      let updateStub: sinon.SinonStub<[IdCita: number, cita: Partial<CitaCreationAttributes>], Promise<[affectedCount: number]>>;
      let result: any;

      before(() => {
        updateStub = sinon.stub(citaDAO, "update");

        citaAdapter.calificaCitaByIdCita({ IdCita: 1 }).catch((error) => {
          result = error;
        });
      });

      after(() => {
        updateStub.restore();
      });

      it("Update appointment function must no be called", () => {
        expect(updateStub.called).equal(false);
      });

      it("value returned from adapter must be type Error", () => {
        expect(result).have.property("message");
      });

      it("Error message must be equal to", () => {
        const { message } = result;
        expect(message).equal("At least one calification is required");
      });
    });

    describe("update appointment database process fails exception must be returned", () => {
      let updateStub: sinon.SinonStub<[IdCita: number, cita: Partial<CitaCreationAttributes>], Promise<[affectedCount: number]>>;

      let getCitaStub: sinon.SinonStub<[IdCita: number], Promise<CitaInstance | null>>;

      let result: any;

      const mockGetById = { ...citaUpdateMock, IdCita: 1 };

      before(() => {
        updateStub = sinon.stub(citaDAO, "update");

        getCitaStub = sinon.stub(citaDAO, "getById");

        updateStub.rejects(new Error("Update appointment was not success"));

        getCitaStub.resolves(mockGetById as CitaInstance);

        citaAdapter
          .calificaCitaByIdCita({ IdCita: 1, calificacion: 5 })
          .catch((error) => {
            result = error;
          });
      });

      after(() => {
        updateStub.restore();
        getCitaStub.restore();
      });

      it("Update appointment function must be called", () => {
        expect(updateStub.calledOnce).equal(true);
      });

      it("find appointment function must be called", () => {
        expect(getCitaStub.calledOnce).equal(false);
      });

      it("value returned from adapter must be type Error", () => {
        expect(result).have.property("message");
      });

      it("result get cita by Id must equal to rate appointment function", () => {
        const { message } = result;
        expect(message).equal("Update appointment was not success");
      });
    });
  });

  describe("find By Filter functions", () => {
    let findAllCitasByStub: sinon.SinonStub<[
      filterCita?: WhereOptions<CitaAttributes> | undefined, 
      filterVehiculo?: WhereOptions<VehiculoAttributes> | undefined, 
      filterOrden?: WhereOptions<OrdenAttributes> | undefined], 
    Promise<CitaInstance[]>>;

    const mockListAppointment = [
      {
        IdCita: 1,
        horaCita: 11,
        estado: "Cancelada",
        fechaCita: new Date(),
      },
      {
        IdCita: 2,
        horaCita: 11,
        estado: "Cancelada",
        fechaCita: new Date(),
      },
    ] as CitaInstance[];

    let result: CitaInstance[] | undefined;

    describe("list Citas by taller functionality", () => {
      before(async () => {
        findAllCitasByStub = sinon.stub(citaDAO, "findAllByFilter");

        findAllCitasByStub.resolves(mockListAppointment);

        result = await citaAdapter.getAllCitasByIdTaller(1);
      });

      after(() => {
        findAllCitasByStub.restore();
      });

      it("findAllByFilter must be called once", () => {
        expect(findAllCitasByStub.calledOnce).equal(true);
      });

      it("findAllByFilter must be called with", () => {
        expect(findAllCitasByStub.calledWithMatch({ IdTaller: 1 })).equal(true);
      });

      it("result must be equal to findAllCitas dao function", () => {
        expect(result).equal(mockListAppointment);
      });
    });

    describe("list appointments by user Id", () => {
      before(async () => {
        findAllCitasByStub = sinon.stub(citaDAO, "findAllByFilter");

        findAllCitasByStub.resolves(mockListAppointment);

        result = await citaAdapter.getAllCitasByIdUsuario(1);
      });

      after(() => {
        findAllCitasByStub.restore();
      });

      it("findAllByFilter must be called once", () => {
        expect(findAllCitasByStub.calledOnce).equal(true);
      });

      it("findAllByFilter must be called with", () => {
        expect(findAllCitasByStub.calledWithMatch({}, { IdUsuario: 1 })).equal(
          true
        );
      });

      it("result must be equal ro findAllCitas dao function", () => {
        expect(result).equal(mockListAppointment);
      });
    });

    describe("find previous appointments by User", () => {
      before(async () => {
        findAllCitasByStub = sinon.stub(citaDAO, "findAllByFilter");

        findAllCitasByStub.resolves(mockListAppointment);

        result = await citaAdapter.getAllCitasPasadasByIdUsuario(1);
      });

      after(() => {
        findAllCitasByStub.restore();
      });

      it("findAllByFilter must be called once", () => {
        expect(findAllCitasByStub.calledOnce).equal(true);
      });

      it("findAllByFilter must be called with", () => {
        expect(findAllCitasByStub.calledWithMatch({}, { IdUsuario: 1 })).equal(
          true
        );
      });

      it("result must be equal ro findAllCitas dao function", () => {
        expect(result).equal(mockListAppointment);
      });
    });

    describe("find next appointments by User", () => {
      before(async () => {
        findAllCitasByStub = sinon.stub(citaDAO, "findAllByFilter");

        findAllCitasByStub.resolves(mockListAppointment);

        result = await citaAdapter.getAllCitasFuturasByIdUsuario(1);
      });

      after(() => {
        findAllCitasByStub.restore();
      });

      it("findAllByFilter must be called once", () => {
        expect(findAllCitasByStub.calledOnce).equal(true);
      });

      it("findAllByFilter must be called with", () => {
        expect(findAllCitasByStub.calledWithMatch({}, { IdUsuario: 1 })).equal(
          true
        );
      });

      it("result must be equal ro findAllCitas dao function", () => {
        expect(result).equal(mockListAppointment);
      });
    });

    describe("find active appointments by User", () => {
      before(async () => {
        findAllCitasByStub = sinon.stub(citaDAO, "findAllByFilter");

        findAllCitasByStub.resolves(mockListAppointment);

        result = await citaAdapter.getAllCitasActivasByIdUsuario(1);
      });

      after(() => {
        findAllCitasByStub.restore();
      });

      it("findAllByFilter must be called once", () => {
        expect(findAllCitasByStub.calledOnce).equal(true);
      });

      it("findAllByFilter must be called with", () => {
        expect(findAllCitasByStub.calledWithMatch({}, { IdUsuario: 1 })).equal(
          true
        );
      });

      it("result must be equal ro findAllCitas dao function", () => {
        expect(result).equal(mockListAppointment);
      });
    });
  });
});
