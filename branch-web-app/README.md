# branch-web-app

## Project setup

### Get the project from the repo

- Set SSH Key in git for your user
- Download the project from the repo

### Install dependencies

- run `yarn install` command to install all project necessary dependencies


### Set env variables

Create an `.env` or `.env.development` file containing the next keys

```
VUE_APP_URLBACKSERVICES={backend url}
VUE_APP_FIREBASE_PROJECT_NAME={firebase project name}
VUE_APP_FIREBASE_API_KEY={firebase api key}
VUE_APP_FIREBASE_MESSAGE_SENDER_ID={firebase message sender id}
VUE_APP_FIREBASE_APP_ID={firebase app id}
```


### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```


