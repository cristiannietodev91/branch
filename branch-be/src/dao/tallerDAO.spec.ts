import { expect } from "chai";
import tallerDAO from "./tallerDAO";
import { 
  TallerCreationAttributes, TallerInstance 
} from "../types";
import { faker } from "@faker-js/faker";

describe("workshop DAO unit testing", () => {

  let tallerCreated: TallerInstance;

  describe("create workshop", ()=> {
    it("must fail when try to  create an user with the minimum values", async ()=> {
      const workshop: any = {
        nombre: faker.company.name(),
        identificacion: faker.string.numeric(10),
        email: faker.internet.email(),
        celular: faker.phone.number(),
        estado: faker.helpers.arrayElement(["Registrado", "Pendiente"]),
        telefono: faker.phone.number(),
        logo: faker.image.url(),
      };

      await expect(tallerDAO.create(workshop)).to.eventually.be.rejectedWith("cannot be null");

    });

    it("must create a workshop", async ()=> {
      const workshop1: TallerCreationAttributes = {
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

      const workshop2: TallerCreationAttributes = {
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

      tallerCreated = await tallerDAO.create(workshop1);

      expect(tallerCreated).to.have.property("IdTaller");
      await expect(tallerDAO.create(workshop2)).to.eventually.have.property("IdTaller");
    });
  });

  describe("get by id", ()=> {
    it("must search the workshop by id", async()=> {
      const workshop = await tallerDAO.getById(1);
      expect(workshop).to.have.property("IdTaller");
    });

    it("must return null when the workshop is not found", async()=> {
      await expect(tallerDAO.getById(-1)).to.eventually.be.null;
    });
  });

  describe("update workshop", ()=> {
    it("must return zero when id to update does not exist", async ()=> {
      const updateResult = await tallerDAO.update(-1, {
        identificacion: faker.string.numeric(10) 
      });

      expect(updateResult).to.have.length(1);
      expect(updateResult[0]).to.be.equal(0);
    });

    it("must return number of elements updated", async ()=> {
      const [updateResult1, updateResult2] = await Promise.all([
        tallerDAO.update(1, {
          identificacion: faker.string.numeric(10) 
        }),
        tallerDAO.update(2, {
          identificacion: faker.string.numeric(10),
          estado: faker.helpers.arrayElement(["Registrado", "Pendiente"]),
        })
      ]);

      expect(updateResult1).to.have.length(1);
      expect(updateResult1[0]).to.be.equal(1);
      expect(updateResult2).to.have.length(1);
      expect(updateResult2[0]).to.be.equal(1);
    });
  });

  describe("delete workshop", ()=> {
    it("must return the number of items deleted by workshop id", async ()=> {
      await expect(tallerDAO.deleteById(tallerCreated.IdTaller)).to.eventually.be.equal(1);
    });

    it("must return zero when workshop to delete does not exist", async ()=> {
      await expect(tallerDAO.deleteById(-1)).to.eventually.be.equal(0);
    });
  });
});
