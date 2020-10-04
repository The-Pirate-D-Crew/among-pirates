import * as redis from  "redis";
import * as service from "../src/index";

var alreadySetup = false;
var matchStoreClient:redis.RedisClient;

export {
	setup,
	reset,
	shutdown
};

async function setup()
{
	// Do nothing if already setup
	if(alreadySetup){
		return;
	}
	alreadySetup = true;

	// Setup MatchStore client
	matchStoreClient = redis.createClient({
		url: process.env.MATCH_STORE_REDIS_URL
	});

	// Setup API
	await service.start();
}

async function reset()
{
	await new Promise(r => matchStoreClient.flushall(r));
}

async function shutdown()
{
	await service.shutdown();
	await new Promise(r => matchStoreClient.quit(r));
	alreadySetup = false;
}
