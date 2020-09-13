FROM node:14.10.1 AS build-stage
WORKDIR /var/www
COPY ./package.json .
COPY ./package-lock.json .
COPY ./tsconfig.json .
RUN npm install
COPY ./src/ ./src/
RUN npm run build

FROM node:14.10.1
WORKDIR /var/www
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install --production
COPY --from=build-stage /var/www/dist ./dist
CMD npm start
