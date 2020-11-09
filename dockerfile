FROM node:10-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . /backend

EXPOSE 5000

CMD [ "npm", "start" ]

# CMD [ "node", "api/server.js" ]