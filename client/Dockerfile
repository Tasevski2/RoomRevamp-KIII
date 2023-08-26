FROM node:18.12.1

WORKDIR /app

COPY . /app/

RUN yarn install

RUN yarn build

RUN npm install -g serve

EXPOSE 3000
