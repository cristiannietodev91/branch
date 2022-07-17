# branch

[![Coverage Status](https://coveralls.io/repos/bitbucket/branchmotor/branch/badge.svg?branch=feature/add-unit-testing)](https://coveralls.io/bitbucket/branchmotor/branch?branch=feature/add-unit-testing)

## Dev environment


### Prerequisistes run locally branch project

- Mysql client must be running
- a database called ``branch`` must exist to execute migrations

### firsts step to set the project

- Set SSH Key in bitbucket for your user
- Download the repo from bitbucket
- Set .env file with the next values to local environment
    ``DBNAME=branch
    DBHOST=localhost
    DBPASSWORD=root
    DBUSER=root``
- run ``npm install`` command to install all project neccesary dependencies
- create an database called ``branch``

### Run migrations
- run ``npx sequelize-cli db:migrate`` to run migrations

## Undo migrations
- run ``npx sequelize-cli db:migrate:undo``

### Run Seeders
- run ``npx sequelize-cli db:seed:all`` 

Run specific sedd ``npx sequelize-cli db:seed --seed fileName``

## Runing project locally

you should execute the next command to run the server and enable all the logs using DEBUG library

``DEBUG=branch:* npm run dev``


### Test


