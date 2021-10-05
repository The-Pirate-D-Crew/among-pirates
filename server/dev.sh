# Start services
docker-compose up -d mongodb

# Build API service image
docker-compose build api

# Run API service (exposing ports on host) and start a bash session
docker-compose run --rm --service-ports api bash

# Remove everything when API bash session exits
docker-compose down
