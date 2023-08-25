# Use the official Node.js image with version 18.12.1 as the base image
FROM node:18.12.1

WORKDIR /app

COPY . /app/

RUN yarn install

RUN yarn build

RUN npm install -g serve

EXPOSE 3000
