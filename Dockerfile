FROM node:18.16.0-alpine3.17
WORKDIR /app
RUN npm install -g yarn
COPY component/package.json,component/package-lock.json ./component
RUN cd /app/component && yarn install
COPY component/ /app/component
RUN cd /app/component && yarn build

COPY server/package.json,component/package.lock.json ./server
RUN cd /app/server && yarn install
COPY server/ /app/server
RUN cd /app/server && yarn build

CMD [ "yarn", "start"]