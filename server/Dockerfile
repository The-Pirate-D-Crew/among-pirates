FROM node:16.10.0 AS server-build-stage
WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
COPY ./tsconfig.json .
RUN npm ci
COPY ./src/ ./src/
RUN npm run build

FROM node:16.10.0
WORKDIR /app
COPY --from=server-build-stage /var/www/package.json .
COPY --from=server-build-stage /var/www/package-lock.json .
RUN npm ci --production
COPY --from=server-build-stage /var/www/dist ./dist
CMD npm start
