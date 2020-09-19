PROJECT = "Among Pirates"

install: ;@echo "Installing ${PROJECT}....."; \
	cp public/config/settings.example.json public/config/settings.json; \
	npm install --prefix server && npm install --prefix public

server-dev: ;@echo "Starting ${PROJECT} Server....."; \
	docker-compose up -d matchstore; \
	npm run dev --prefix server

client-dev: ;@echo "Starting ${PROJECT} Client....."; \
	npm start --prefix public
