PROJECT = "Among Pirates"

install: ;@echo "Installing ${PROJECT}....."; \
	cp public/config/settings.example.json public/config/settings.json; \
	npm ci --prefix server && npm install --prefix public

server-dev: ;@echo "Starting ${PROJECT} Server....."; \
	(cd server && ./dev.sh)

client-dev: ;@echo "Starting ${PROJECT} Client....."; \
	npm start --prefix public
