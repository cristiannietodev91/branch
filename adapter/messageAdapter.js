const messageDAO = require("../dao/messageDAO");
const { Op } = require("sequelize");

const createMessage = (message, cb) => {
  messageDAO.create(message, (error, message) => {
    if (error) {
      cb(error, null);
    } else {
      if (message) {
        cb(null, message);
      }
    }
  });
};

module.exports = {
  createMessage,
};
