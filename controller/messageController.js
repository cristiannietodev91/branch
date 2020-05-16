let messageAdapter = require("../adapter/messageAdapter");

const createMessage = (req, res, next) => {
  try {
    const message = req.body;

    messageAdapter.createMessage(message, (error, message) => {
      if (error) {
        console.error(
          "Error al realizar la transaccion de crear Message:::>",
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
        if (message) {
          res.status(HttpStatus.OK).json(message);
        }
      }
    });
  } catch (error) {
    console.error("Error al crear vehiculo ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  createMessage,
};
