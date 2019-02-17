FROM node:8

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN ls


EXPOSE 6969

CMD ["npm", "start"]

