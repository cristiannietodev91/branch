import sessionMiddleware from  "../middleware/session";
import csrfMiddleware from "../utils/csrf";

import sinon from "sinon";
import * as supertest from "supertest";
import citaAdapter from "../adapter/citaAdapter";
import citaDAO from "../dao/citaDAO";
import { CitaRequestAttributes, CitaInstance } from "../types";


describe("cita controller", () => {
  let request: supertest.SuperAgentTest;
  let session;
  let csrf;

  before(() => {

    session = sinon.stub(sessionMiddleware, "validSession");
    session.callsFake(async (_, __, next)=> next());

    csrf = sinon.stub(csrfMiddleware, "csrfSynchronisedProtection");
    csrf.callsFake(async (_, __, next)=> next());

    import("../app").then(async app => {
      request = await supertest.agent(app.default);
    });
  });

  after(()=> {
    sinon.verifyAndRestore();
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
      request
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
      request
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
