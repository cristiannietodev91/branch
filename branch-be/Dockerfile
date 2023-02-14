FROM node:14-alpine as base
WORKDIR /app/branch
COPY package.json yarn.lock /app/branch/

FROM base as builder
COPY . /app/branch
RUN yarn install
RUN yarn build

FROM base as production
COPY --from=builder /app/branch/dist ./dist
ARG DBHOST
ARG DBUSER
ARG DBPASSWORD
ENV DBHOST=$DBHOST
ENV DBUSER=$DBUSER
ENV DBPASSWORD=$DBPASSWORD
ENV NODE_ENV=production
RUN yarn install --production
EXPOSE 3005
CMD [ "yarn", "start" ]

FROM base as develop-stage

COPY . /app/branch

RUN chmod +x entrypoint.sh      # if required
ENTRYPOINT ["./entrypoint.sh"]
RUN yarn config set unsafe-perm true && yarn global add nodemon
RUN yarn install

ENV NODE_ENV=development
ENV DEBUG=branch:*

CMD ["yarn", "dev"]