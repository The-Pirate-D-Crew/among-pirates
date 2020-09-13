import randomstring from "randomstring";
import uniqid from "uniqid";
import * as redis from  "redis";
import {promisify} from "util";
var config:MatchControllerConfig;
var redisClient:redis.RedisClient;
var redisSet:redis.OverloadedCommand<string, string, string>;
var redisGet:redis.OverloadedCommand<string, string, string>;

export {
	setup,
	create,
	getByCode,
	shutdown
};

async function setup(_config:MatchControllerConfig)
{
	// Make config available module wide
	config = _config;

	// Setup redis client
	redisClient = redis.createClient({
		url: config.redisUrl
	});
	redisClient.on("error", error => console.error(error));
	redisSet = promisify(redisClient.set).bind(redisClient);
	redisGet = promisify(redisClient.get).bind(redisClient);
}

async function create()
{
	// Generate an id
	const matchId = uniqid();

	// Get a code for the match
	var matchCode;
	const maxGenerationRetries = 1000;
	for(let i=0; i<maxGenerationRetries; i++){
		// Generate code
		let code = randomstring.generate({
			length: 5,
			capitalization: "uppercase"
		});

		// Make sure generated code isnt being used
		const valid = await redisSet(`${config.redisNamespace}:${code}`, "", "NX");
		if(!valid){ continue; }
		matchCode = code;
		break;
	}
	if(!matchCode){
		throw new Error("Could not generate a valid matchId");
	}

	// Create match
	const match:Match = {
		id: matchId,
		code: matchCode
	}
	await redisSet(`${config.redisNamespace}:${matchCode}`, JSON.stringify(match));
	return match;
}

async function getByCode(matchCode:string)
{
	const matchStr = await redisGet(`${config.redisNamespace}:${matchCode}`);
	if(!matchStr){
		return null;
	}
	return JSON.parse(matchStr);
}

async function shutdown()
{
	await new Promise(r => redisClient.quit(r));
	redisClient.removeAllListeners();
}
