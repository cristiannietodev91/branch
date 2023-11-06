# branch

[![Coverage Status](https://coveralls.io/repos/github/cristiannietodev91/branch/badge.svg?branch=main)](https://coveralls.io/github/cristiannietodev91/branch?branch=main)

## Dev environment


### Prerequisistes run locally branch project

- Mysql client must be running
- a database called ``branch`` must exist to execute migrations
- A Firebase project used to handle web and mobile app users

### Generate the service key to access Firebase services

To generate a private key file for your service account:
- In the Firebase console, open Settings > Service Accounts.
- Click Generate New Private Key, then confirm by clicking Generate Key.
- Securely store the JSON file containing the key.
- Set the environment variable GOOGLE_APPLICATION_CREDENTIALS to the file path of the JSON

#### **ex (macOS)**
```
export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
```
#### **ex (windows)**
```
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\username\Downloads\service-account-file.json"
```
### first steps to set the project up

- Set SSH Key in git for your user
- Download the project from the repo
- Set .env file with the next properties to local development
    ```
    DBNAME=branch
    DBHOST=localhost
    DBPASSWORD=root
    DBUSER=root
    FIREBASE_PROJECT_NAME=firebaseproject
    ```
- run ``yarn install`` command to install all project necessary dependencies
- create an database called ``branch``

### Run migrations
- run ``npx sequelize-cli db:migrate`` to run migrations

## Undo migrations
- run ``npx sequelize-cli db:migrate:undo``

### Run Seeders
- run ``npx sequelize-cli db:seed:all`` 

Run specific seed ``npx sequelize-cli db:seed --seed fileName``

## Runing project locally

you should execute the next command to run the server and enable all the logs using DEBUG library

``DEBUG=branch:* yarn dev``


### Security

The app secured the endpoints using user session. The secured endpoints validate a valid firebase user sessions. That means that to consume the app endpoints you must have an user with permissions in Firebase. 

#### CSRF (Cross-site request forgery)

The endpoints that make changes in the data state of the app use CSRF protection. Those endpoints require a valid token sent (x-csrf-token="valid token") in the headers of each request.

ex. 
```javascript
curl --location --request POST 'http://localhost:3005/session/login' \
--header 'x-csrf-token: csrf token value' \
--header 'Content-Type: application/json' \
--data '{
    "uid": "user uid"
}'
```

#### Secured endpoints

To consume secured endpoints a valid cookie session must exist in the request. To get a cookie session you must log in to the app with a valid firebase user using the next endpoint.

```javascript
curl --location --request POST 'http://localhost:3005/session/login' \
--header 'x-csrf-token: valid csrf token' \
--header 'Content-Type: application/json' \
--data '{
    "idToken": "firebase user token",
    "uid": "firebase user id"
}'
```

### Test

