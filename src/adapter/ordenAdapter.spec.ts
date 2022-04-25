import sinon from "sinon";
import { expect } from "chai";
import ordenDAO from "../dao/ordenDAO";
import ordenAdapter from "./ordenAdapter";
import { WhereOptions } from "sequelize/types";
import {
  OrdenAttributes,
  VehiculoAttributes,
  CitaAttributes,
  OrdenInstance,
} from "../types";

describe("orden adapter functionality", () => {
  describe("get ordenes process validation", () => {
    let findOrdenesStub: sinon.SinonStub<
      [
        filterOrden: WhereOptions<OrdenAttributes>,
        filterVehiculo: WhereOptions<VehiculoAttributes>,
        filterCita: WhereOptions<CitaAttributes>
      ],
      Promise<OrdenInstance[]> | undefined
    >;

    describe("filter ordenes by IdTaller", () => {
      before(() => {
        findOrdenesStub = sinon.stub(ordenDAO, "findAllByFilter");

        ordenAdapter.getOrdenesByIdTallerAndFilter(1);
      });

      after(() => {
        findOrdenesStub.restore();
      });

      it("find ordenes function must be called once", () => {
        expect(findOrdenesStub.calledOnce).equal(true);
      });
    });

    describe("filter ordenes by IdTaller active", () => {
      before(() => {
        findOrdenesStub = sinon.stub(ordenDAO, "findAllByFilter");

        ordenAdapter.getOrdenesByIdTallerActivas(1);
      });

      after(() => {
        findOrdenesStub.restore();
      });

      it("find ordenes function must be called once", () => {
        expect(findOrdenesStub.calledOnce).equal(true);
      });
    });

    describe("filter ordenes by IdTaller and appoinment", () => {
      before(() => {
        findOrdenesStub = sinon.stub(ordenDAO, "findAllByFilter");

        ordenAdapter.getOrdenesByIdTallerAndIdCita(1);
      });

      after(() => {
        findOrdenesStub.restore();
      });

      it("find ordenes function must be called once", () => {
        expect(findOrdenesStub.calledOnce).equal(true);
      });
    });
  });
});
