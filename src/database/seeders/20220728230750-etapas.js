"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "etapa",
      [
        {
          NombreEtapa: "Reparacion",
          requiereDocumentos: false,
          requiereAprobacion: true,
        },
        {
          NombreEtapa: "Ingreso",
          requiereDocumentos: false,
          requiereAprobacion: false,
        },
        {
          NombreEtapa: "Diagnostico",
          requiereDocumentos: false,
          requiereAprobacion: false,
        },
        {
          NombreEtapa: "Cotizacion",
          requiereDocumentos: false,
          requiereAprobacion: true,
        },
        {
          NombreEtapa: "Aprobacion",
          requiereDocumentos: true,
          requiereAprobacion: false,
        },
        {
          NombreEtapa: "Entrega",
          requiereDocumentos: true,
          requiereAprobacion: false,
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
    return queryInterface.bulkDelete("etapa", null, {});
  },
};
