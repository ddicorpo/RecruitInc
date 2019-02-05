FROM node:8

WORKDIR /usr/src/app

COPY package*.json ./

RUN ping www.google.com
RUN npm install

EXPOSE 6969

CMD ["npm", "run dev"]

