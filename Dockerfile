#FROM node:14.17.1-alpine
FROM node:16.13.2-alpine

WORKDIR /backend

COPY ./backend /backend

COPY ./frontend /frontend

WORKDIR /backend

RUN npm i nodemon -g

RUN npm install

#RUN npm audit fix

WORKDIR /frontend

RUN npm install

#RUN npm audit fix

RUN apk add curl

#RUN npm install -g npm@latest

RUN npm install -g npm@8.5.5

#RUN npm install -g serve

RUN npm run build

#RUN ls /frontend/build

#RUN mv /frontend/build ../backend/

#RUN serve -s build -l 3000

#RUN serve -s build


#EXPOSE 3003


WORKDIR /backend

#EXPOSE 5001

EXPOSE 5008

EXPOSE 8080

EXPOSE 5005







CMD ["npm","run", "prod"]
#CMD ["npm","run", "prodTest"]
