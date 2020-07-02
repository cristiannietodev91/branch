let conversacionAdapter = require("../adapter/conversacionAdapter");
var HttpStatus = require("http-status-codes");

const getConversacionesByIdTaller = (req, res, next) => {
  try {
    const IdTaller = req.params.Id;

    conversacionAdapter.getConversacionesByIdTaller(
      IdTaller,
      (error, conversaciones) => {
        if (error) {
          console.error(
            "Error al realizar la transaccion de get Conversaciones:::>",
            "error ::>",
            error.message
          );
          if (error.errors) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.errors[0] });
          } else {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          }
        } else {
          if (conversaciones) {
            res.status(HttpStatus.OK).json(conversaciones);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error al get conversaciones ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  getConversacionesByIdTaller
};
