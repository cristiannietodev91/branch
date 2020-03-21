require('dotenv').config()

module.exports =
{
  "development": {
    "username": process.env.DBUSER,
    "password": process.env.DBPASSWORD,
    "database": process.env.DBNAME,
    "host": process.env.DBHOST,
    "dialect": "mysql",
    "port": process.env.DBPORT,
    define: {
      underscored: false,
      freezeTableName: true
    },
    dialectOptions: {
        typeCast: function (field, next) {
            if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
                return new Date(field.string() + 'Z');
            }
            return next();
        }
    },
    "timezone": '-05:00' //for writing to database
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port": process.env.DBPORT
  },
  "production": {
    "username": process.env.DBUSER,
    "password": process.env.DBPASSWORD,
    "database": process.env.DBNAME,
    "host": process.env.DBHOST,
    "dialect": "mysql",
    "port": process.env.DBPORT,
    define: {
      underscored: false,
      freezeTableName: true
    },
    dialectOptions: {
      typeCast: function (field, next) {
        if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
          return new Date(field.string() + 'Z');
        }
        return next();
      }
    },
    "timezone": '-05:00' //for writing to database
  }
}
