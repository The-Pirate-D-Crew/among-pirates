FROM node:14.10.1 AS server-build-stage
WORKDIR /var/www
COPY ./server/package.json .
COPY ./server/package-lock.json .
COPY ./server/tsconfig.json .
RUN npm install
COPY ./server/src/ ./src/
RUN npm run build

# FROM node:14.10.1 AS client-build-stage
# WORKDIR /var/www
# COPY ./public/ ./
# RUN npm install
# RUN npm run build

FROM node:14.10.1
WORKDIR /var/www/server
COPY --from=server-build-stage /var/www/package.json .
COPY --from=server-build-stage /var/www/package-lock.json .
RUN npm install --production
COPY --from=server-build-stage /var/www/dist ./dist
# COPY --from=client-build-stage /var/www/dist ../public/dist
# COPY --from=client-build-stage /var/www/assets ../public/assets
CMD npm start
