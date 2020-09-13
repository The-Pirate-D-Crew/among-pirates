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

	// Setup MatchStore
	const matchStoreUrl = "redis://127.0.0.1:6379";
	matchStoreClient = redis.createClient({
		url: matchStoreUrl
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
