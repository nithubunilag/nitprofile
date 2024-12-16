FROM node:20-alpine
 
WORKDIR /app

COPY package.json .

COPY . .

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*
   
RUN npm install

EXPOSE 8000
 
CMD ["npm","run", "start:dev"]

