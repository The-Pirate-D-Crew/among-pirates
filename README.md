## Developing
### Requirements
- docker
- docker-compose

### Install
1. `npm install --prefix server && npm install --prefix public`

### Server Flow
1. `docker-compose up -d matchstore`
2. `npm run dev --prefix server`
3. `docker-compose down`

### Client Flow
1. `npm start --prefix public`
