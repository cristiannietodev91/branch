# branch

[![Coverage Status](https://coveralls.io/repos/github/cristiannietodev91/branch-be/badge.svg?branch=master)](https://coveralls.io/github/cristiannietodev91/branch-be?branch=master)

## Dev environment


### Prerequisistes run locally branch project

- Mysql client must be running
- a database called ``branch`` must exist to execute migrations

### firsts step to set the project

- Set SSH Key in git for your user
- Download the project from the repo
- Set .env file with the next values to local environment
    ``DBNAME=branch
    DBHOST=localhost
    DBPASSWORD=root
    DBUSER=root``
- run ``yarn install`` command to install all project neccesary dependencies
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


