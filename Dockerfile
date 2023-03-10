FROM node:18-alpine3.15

WORKDIR /node-app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000
