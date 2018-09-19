FROM node:8-alpine

# Create app directory
WORKDIR /usr/src/app

#Install dependencies from package.json and package-lock.json
COPY package*.json ./

RUN npm install
RUN npm install -g pkg

#Bundle app source
COPY . .

EXPOSE 6969

#Command to run inside container
CMD ["node", "index.js"]

