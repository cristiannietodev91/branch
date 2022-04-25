# branch

[![Coverage Status](https://coveralls.io/repos/bitbucket/branchmotor/branch/badge.svg?branch=feature/add-unit-testing)](https://coveralls.io/bitbucket/branchmotor/branch?branch=feature/add-unit-testing)

## Dev environment

### firsts step to set the project

- Set SSH Key in bitbucket for your user
- Download the repo from bitbucket
- Set .env file with the next values to local environment
    ``DBNAME=branch
    DBHOST=localhost
    DBPASSWORD=root
    DBUSER=root``
- run npm install command to install all project neccesary dependencies
- run the project with ``DEBUG=branch:* npm run dev``

to run dev environment we should the next command, this will run the server and enable all the logs using DEBUG library

``DEBUG=branch:* npm run dev``

