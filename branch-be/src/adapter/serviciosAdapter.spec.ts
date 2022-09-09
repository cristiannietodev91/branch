import sinon from "sinon";
import { expect } from "chai";
import servicioDAO from "../dao/servicioDAO";
import serviciosAdapter from "./serviciosAdapter";
import {
  CreationServiceAttributes,
  ServicioInstance,
  ServicioVehiculoCreationAttributes,
  ServicioVehiculoInstance,
  VehiculoAttributes,
  VehiculoInstance,
} from "../types";
import servicioVehiculoDAO from "../dao/servicioVehiculoDAO";
import vehiculoDAO from "../dao/vehiculoDAO";
import { WhereOptions } from "sequelize/types";

describe("servicios adapter testing", () => {
  describe("list servicios functionality", () => {
    let findAllStub: sinon.SinonStub<[], Promise<ServicioInstance[]>>;

    before(() => {
      findAllStub = sinon.stub(servicioDAO, "findAll");

      serviciosAdapter.listarServicios();
    });

    after(() => {
      findAllStub.restore();
    });

    it("find all dao function must be called once", () => {
      expect(findAllStub.calledOnce).to.be.true;
    });
  });

  describe("crear servicio functionality", () => {
    let crearServicioStub: sinon.SinonStub<
      [servicio: ServicioVehiculoCreationAttributes],
      Promise<ServicioVehiculoInstance> | undefined
    >;

    let findVehicleStub: sinon.SinonStub<
      [filter: WhereOptions<VehiculoAttributes>],
      Promise<VehiculoInstance | null> | undefined
    >;

    const mockCreateService: CreationServiceAttributes = {
      placa: "XXX123",
      servicio: "Changing engine",
      valor: 12132,
    };

    const vehicleMock = {
      IdVehiculo: 1,
    };

    const serviceVehicleCreated = {
      IdServicio: 1,
      ...mockCreateService,
    };

    before(() => {
      crearServicioStub = sinon.stub(servicioVehiculoDAO, "create");

      findVehicleStub = sinon.stub(vehiculoDAO, "findOneByFilter");

      findVehicleStub.resolves(vehicleMock);

      crearServicioStub.resolves(serviceVehicleCreated);

      serviciosAdapter.crearServicio(mockCreateService);
    });

    after(() => {
      crearServicioStub.restore();

      findVehicleStub.restore();
    });

    it("find vehicule must be called once", () => {
      expect(findVehicleStub.calledOnce).to.be.true;
    });

    it("create vehicle service must be called once", () => {
      expect(crearServicioStub.calledOnce).to.be.true;
    });
  });
});
