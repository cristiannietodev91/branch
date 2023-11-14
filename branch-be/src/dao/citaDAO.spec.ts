import { expect } from "chai";
import citaDAO from "./citaDAO";
import {
  Op,
} from "sequelize";
import {
  CitaCreationAttributes,
  CitaInstance,
  TallerCreationAttributes,
  TallerInstance,
  UserCreationAttributes,
  UserInstance,
  VehiculoCreationAttributes,
  VehiculoInstance,
} from "../types";
import { faker } from "@faker-js/faker";
import tallerDAO from "./tallerDAO";
import usersDAO from "./usersDAO";
import vehiculoDAO from "./vehiculoDAO";


describe("cita DAO unit testing", () => {

  let workshopResult: TallerInstance;
  let vehicleResult: VehiculoInstance;
  let vehicleResult2: VehiculoInstance;
  let userResult: UserInstance;
  let userResult2: UserInstance;

  let appointmentCreated: CitaInstance;
  let appointmentCreated2: CitaInstance;
  let appointmentCreated3: CitaInstance;
  let appointmentCreated4: CitaInstance;

  before(async ()=> {
    const workshop: TallerCreationAttributes = {
      nombre: faker.company.name(),
      identificacion: faker.string.numeric(10),
      email: faker.internet.email(),
      celular: faker.phone.number(),
      estado: faker.helpers.arrayElement(["Registrado", "Pendiente"]),
      direccion: faker.location.streetAddress(),
      latitude: faker.location.latitude(),
      longitud: faker.location.longitude(),
      telefono: faker.phone.number(),
      logo: faker.image.url(),
    };

    const user1: UserCreationAttributes = {
      tipoUsuario: "Cliente" as const,
      firstName: faker.person.firstName(),
      email: faker.internet.email(),
      estado: "Pendiente" as const,
      celular: faker.phone.number(),
      uid: faker.string.uuid()
    };

    const user2: UserCreationAttributes = {
      tipoUsuario: "Cliente" as const,
      firstName: faker.person.firstName(),
      email: faker.internet.email(),
      estado: "Pendiente" as const,
      celular: faker.phone.number(),
      uid: faker.string.uuid()
    };

    [workshopResult, userResult, userResult2] = await Promise.all([
      tallerDAO.create(workshop),
      usersDAO.create(user1),
      usersDAO.create(user2)
    ]);
    
    const createVehiculo: VehiculoCreationAttributes = {
      IdTaller: workshopResult.IdTaller,
      IdUsuario: userResult.uid || "",
      IdMarca: 1,
      estado: faker.helpers.arrayElement(["Registrado", "Pendiente"]),
      placa: faker.vehicle.vrm(),
      tipoVehiculo: faker.helpers.arrayElement(["Moto", "Carro"])
    };

    const createVehiculo2: VehiculoCreationAttributes = {
      IdTaller: workshopResult.IdTaller,
      IdUsuario: userResult2.uid || "",
      IdMarca: 1,
      estado: faker.helpers.arrayElement(["Registrado", "Pendiente"]),
      placa: faker.vehicle.vrm(),
      tipoVehiculo: faker.helpers.arrayElement(["Moto", "Carro"])
    };

    [vehicleResult, vehicleResult2] = await Promise.all([
      vehiculoDAO.create(createVehiculo),
      vehiculoDAO.create(createVehiculo2)
    ]);
  });


  describe("create appointment", ()=> {

    it("must fail when creates an appointment without the minimum values", async ()=> {
      const appointment: any = {
        IdTaller: workshopResult.IdTaller,
        IdVehiculo: vehicleResult.IdVehiculo,
        horaCita: 0,
      };

      await expect(citaDAO.create(appointment)).to.eventually.be.rejectedWith("cannot be null");
    });

    it("must create an appointment", async ()=> {
      
      const appointment: CitaCreationAttributes = {
        IdTaller: workshopResult.IdTaller,
        IdVehiculo: vehicleResult.IdVehiculo,
        estado: "Solicitada",
        fechaCita: faker.date.soon({ days: 2 }),
        horaCita: 0,
      };

      const appointment2: CitaCreationAttributes = {
        IdTaller: workshopResult.IdTaller,
        IdVehiculo: vehicleResult.IdVehiculo,
        estado: "Solicitada",
        fechaCita: faker.date.soon({ days: 3 }),
        horaCita: 0,
      };

      const appointment3: CitaCreationAttributes = {
        IdTaller: workshopResult.IdTaller,
        IdVehiculo: vehicleResult2.IdVehiculo,
        estado: faker.helpers.arrayElement(["Confirmada", "Cancelada", "Incumplida"]),
        fechaCita: faker.date.soon({ days: 9 }),
        horaCita: 0,
      };

      const appointment4: CitaCreationAttributes = {
        IdTaller: workshopResult.IdTaller,
        IdVehiculo: vehicleResult2.IdVehiculo,
        estado: faker.helpers.arrayElement(["Confirmada", "Cancelada", "Incumplida"]),
        fechaCita: faker.date.soon({ days: 3 }),
        horaCita: 0,
      };

      [appointmentCreated, appointmentCreated2, appointmentCreated3, appointmentCreated4] = await Promise.all([
        citaDAO.create(appointment),
        citaDAO.create(appointment2),
        citaDAO.create(appointment3),
        citaDAO.create(appointment4),
      ]);

      expect(appointmentCreated).to.have.property("IdCita");
      expect(appointmentCreated2).to.have.property("IdCita");
      expect(appointmentCreated3).to.have.property("IdCita");
      expect(appointmentCreated4).to.have.property("IdCita");
    });
  });

  describe("get appointment by id", ()=> {
    it("must return appointment found", async ()=> {
      const appoinment = await citaDAO.getById(appointmentCreated.IdCita);
      expect(appoinment).to.have.property("IdCita");
      expect(appoinment?.taller).not.to.be.null;
      expect(appoinment?.vehiculo).not.to.be.null;
    });

    it("must return null when appointment is not found", async ()=> {
      await expect(citaDAO.getById(-1)).to.eventually.be.null;
    });
  });

  describe("get appointments by filter", ()=> {
    it("must return empty when appoinments are not found by filters received", async ()=> {
      const appointments = await citaDAO.findAllByFilter({ IdMecanico: {
        [Op.not]: null
      }});
      expect(appointments).to.be.empty;
    });

    it("must return all the appointments when no filters are received", async ()=> {
      const appointments = await citaDAO.findAllByFilter();
      expect(appointments).to.have.length(4);
    });

    it("must search appointments with appoinment filter", async ()=> {
      const appointments = await citaDAO.findAllByFilter({ estado: "Solicitada" ,  IdTaller: workshopResult.IdTaller });
      expect(appointments).to.have.length(2);
    });

    it("must filter appointments using vehicle filter", async()=> {
      const appointments = await citaDAO.findAllByFilter({}, { IdUsuario: userResult.uid });
      expect(appointments).to.have.length(2);
    });
  });

  describe("count appointments", ()=> {
    it("count all the appoinments when filter is not received", async ()=> {
      const amountOfAppointments = await citaDAO.count();
      expect(amountOfAppointments).to.be.equal(4);
    });

    it("must filter appointments", async ()=> {
      const amountOfAppointments = await citaDAO.count({ estado: "Solicitada" });
      expect(amountOfAppointments).to.be.equal(2);
    });

    it("must count appointments grouped by", async ()=> {
      const amountOfAppointments = await citaDAO.count({}, "IdTaller", ["IdTaller"]);
      expect(amountOfAppointments).to.deep.equal([{ count: 4, IdTaller: workshopResult.IdTaller }]);
    });
  });

  describe("update appointment", ()=> {
    it("update appoinment by filter", async()=> {
      const updatedAppointment = await citaDAO.update(appointmentCreated2.IdCita, { estado: "Confirmada" });
      expect(updatedAppointment).to.deep.equal([1]);
    });

    it("must return zero items updated when the appointment to update does not exist", async()=> {
      const updatedAppointment = await citaDAO.update(-1, { estado: "Confirmada" });
      expect(updatedAppointment).to.deep.equal([0]);
    });
  });

  describe("delete appointment", ()=> {
    it("must delete existing appointment", async ()=> {
      const result = await citaDAO.deleteById(appointmentCreated4.IdCita);
      expect(result).to.be.equal(1);
    });

    it("must return zero when appointment does not exist", async ()=> {
      const result = await citaDAO.deleteById(-1);
      expect(result).to.be.equal(0);
    });
  });

});
