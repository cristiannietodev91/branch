# develop stage
FROM node:14.20-alpine as develop-stage
WORKDIR /app

# build stage
FROM develop-stage as build-stage
COPY package*.json ./
RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && yarn install \
    && apk del .gyp
COPY . .
RUN yarn build

# production stage
FROM develop-stage as production-stage
ENV NODE_ENV=production
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/server.js /app/server.js
RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && yarn install --production \
    && apk del .gyp
EXPOSE 5000
CMD [ "yarn", "start" ]