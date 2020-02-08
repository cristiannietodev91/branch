module.exports =
{
  "development": {
    "username": "root",
    "password": null,
    "database": "branch",
    "host": "localhost",
    "dialect": "mysql",
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
    "dialect": "mysql"
  },
  "production": {
    "username": "admin",
    "password": "Pv5CFY6gcvHEp8wk",
    "database": "branch",
    "host": "databasec3xsmart.csw5vlnybfvb.us-east-2.rds.amazonaws.com",
    "dialect": "mysql",
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
