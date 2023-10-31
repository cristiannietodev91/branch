// eslint-disable-next-line @typescript-eslint/no-var-requires
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
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
  },
  production: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME || "branch",
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
