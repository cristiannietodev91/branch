"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "usuarios",
      [
        {
          firstName: "User 1",
          lastName: "Name 1",
          identificacion: "331221122",
          email: "user1@test.com",
          uid: "11321323123",
          celular: "3123253646",
          tipoUsuario: "Cliente",
          estado: "Registrado",
          typeDevice: "mobile",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: "User 2",
          lastName: "Name 2",
          identificacion: "2332131231",
          email: "user2@test.com",
          uid: "23232332312312",
          celular: "3123253647",
          tipoUsuario: "Cliente",
          estado: "Registrado",
          typeDevice: "mobile",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: "User 3",
          lastName: "Name 3",
          identificacion: "2134344234",
          email: "user3@test.com",
          uid: "43432434234234234",
          celular: "3123253648",
          tipoUsuario: "Cliente",
          estado: "Registrado",
          typeDevice: "mobile",
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("usuarios", null, {});
  },
};
