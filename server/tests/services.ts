import {MongoClient} from "mongodb";
import * as service from "../src/index";

var alreadySetup = false;
var mongoClient:MongoClient;

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

	// Setup mongodb client
	mongoClient = new MongoClient(process.env.MONGO_DB_URL);
	await mongoClient.connect();

	// Setup service
	await service.start();
}

async function reset()
{
	const collections = await mongoClient.db().collections();
	await Promise.all(collections.map(c => c.deleteMany({})));
}

async function shutdown()
{
	await service.shutdown();
	await mongoClient.close();
	alreadySetup = false;
}
