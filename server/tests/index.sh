# Read flags
while getopts w option
	do
		case "${option}"
			in
			w) WATCH=true;;
	esac
done

# Run tests
TEST_CMD="cd /var/www; TS_NODE_FILES=true ./node_modules/.bin/mocha --recursive -r ts-node/register tests/routes/**/*.ts tests/wsEvents/**/*.ts"
DEV_CMD="cd /var/www; DEVTEST=true TS_NODE_FILES=true ./node_modules/.bin/mocha --bail -w --watch-files src/**/*.ts --watch-files tests/**/*.ts -r ts-node/register tests/routes/**/*.ts tests/wsEvents/**/*.ts || exit 0"
if [ "$WATCH" = true ]; then
	docker-compose up -d matchstore
	docker run -ti --rm \
		--mount source=$PWD,target=/var/www,type=bind \
		--env MATCH_STORE_REDIS_URL=redis://matchstore:6379 \
		--network=among-pirates_network1 \
		node:14.10.1 bash -c "$DEV_CMD"
	docker-compose down
else
	docker-compose up -d matchstore
	docker run -t --rm \
		--mount source=$PWD,target=/var/www,type=bind \
		--env MATCH_STORE_REDIS_URL=redis://matchstore:6379 \
		--network=among-pirates_network1 \
		node:14.10.1 bash -c "$TEST_CMD"
	docker-compose down
fi
