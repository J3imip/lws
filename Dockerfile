FROM node:20.12.2

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install -y python3 make g++

RUN npm install

COPY . .

RUN npm rebuild bcrypt --build-from-source

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
