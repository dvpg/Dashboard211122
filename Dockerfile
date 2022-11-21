FROM node:16.13.2-alpine

WORKDIR /backend

COPY ./backend /backend

COPY ./frontend /frontend

WORKDIR /backend

RUN npm install

WORKDIR /frontend

RUN npm install

RUN npm run build

WORKDIR /backend

EXPOSE 5008

EXPOSE 8080

EXPOSE 5005

CMD ["npm","run", "prod"]
