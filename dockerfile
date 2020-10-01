FROM node:10-alpine

WORKDIR /backend

COPY package.json backend/

RUN cd backend && npm install

COPY . backend/

EXPOSE 5000

# CMD [ "npm", "run server" ]