# develop stage
FROM node:14.20-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && yarn install \
    && apk del .gyp
COPY . .

# build stage
FROM develop-stage as build-stage
RUN yarn build

# production stage
FROM nginx:1.15.7-alpine as production-stage
ENV NODE_ENV=production
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]