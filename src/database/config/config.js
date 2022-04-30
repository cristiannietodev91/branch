const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    dialect: "mysql",
    port: 3306,
    define: {
      underscored: false,
      freezeTableName: true,
    },
    timezone: "-05:00", // for writing to database,
    dialectOptions: {
      socketPath: "/tmp/mysql.sock"
    }
  },
  test: {
    username: "root",
    password: "root",
    database: "test",
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    define: {
      underscored: false,
      freezeTableName: true,
    },
    timezone: "-05:00", // for writing to database
  },
  production: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    dialect: "mysql",
    port: 3306,
    define: {
      underscored: false,
      freezeTableName: true,
    },
    timezone: "-05:00", // for writing to database
  },
};
