FROM node:12-alpine as base

WORKDIR /app/branch
COPY package.json yarn.lock /app/branch/
COPY . /app/branch
EXPOSE 3000

FROM base as production

ENV NODE_ENV=production
RUN yarn install --production

CMD [ "node", "index.js" ]

FROM base as develop-stage

ENV NODE_ENV=development
RUN chmod +x entrypoint.sh      # if required
ENTRYPOINT ["./entrypoint.sh"]
RUN yarn config set unsafe-perm true && yarn global add nodemon
RUN yarn install
ENV DEBUG=branch:*
CMD ["yarn", "run dev"]