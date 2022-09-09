import sinon from "sinon";
import app from "../app";
import * as request from "supertest";
import citaAdapter from "../adapter/citaAdapter";
import citaDAO from "../dao/citaDAO";
import { CitaRequestAttributes, CitaInstance } from "../types";

describe("cita controller", () => {
  let response: request.SuperAgentTest;
  before(async () => {
    response = await request.agent(app);
  });
  describe("list All citas available", () => {
    let findAllStub: sinon.SinonStub<[]>;

    before(() => {
      findAllStub = sinon.stub(citaDAO, "findAll");

      findAllStub.resolves([]);
    });

    after(() => {
      findAllStub.restore();
    });

    it("return success when list of cita is returned", (done) => {
      response
        .get("/cita/getAll")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          return done();
        });
    });
  });

  describe("create cita functionality", () => {
    let createCitaStub: sinon.SinonStub<
      [cita: CitaRequestAttributes],
      Promise<CitaInstance>
    >;

    const mockCitaCreated: any = {
      IdCita: 1,
    };

    const citaRequest: CitaRequestAttributes = {
      IdTaller: 1,
      IdMecanico: 2,
      placa: "XXX213",
      fechaCita: new Date(),
      horaCita: 11321,
      estado: "Activa",
    };

    before(() => {
      createCitaStub = sinon.stub(citaAdapter, "createCita");

      createCitaStub.resolves(mockCitaCreated);
    });

    after(() => {
      createCitaStub.restore();
    });

    it("return success when cita params are send", (done) => {
      response
        .post("/cita/create")
        .send(citaRequest)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          return done();
        });
    });
  });
});
