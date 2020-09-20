import randomstring from "randomstring";
import uniqid from "uniqid";
import * as redis from  "redis";
import {promisify} from "util";
var config:MatchControllerConfig;
var redisGeneralClient:redis.RedisClient;
var redisPublisher:redis.RedisClient;
var redisSet:redis.OverloadedCommand<string, string, string>;
var redisGet:redis.OverloadedCommand<string, string, string>;
var redisSadd:redis.OverloadedCommand<string, string, string>;
var redisSrem:redis.OverloadedCommand<string, string, string>;
const localPlayerIds = new Map<MatchId, Set<PlayerId>>();
const localPlayerActions = new Map<PlayerId,PlayerAction>();
var playerActionEmitLoop:NodeJS.Timeout;

export {
	setup,
	create,
	addPlayer,
	removePlayer,
	updatePlayerAction,
	getByCode,
	shutdown
};

async function setup(_config:MatchControllerConfig)
{
	// Make config available module wide
	config = _config;

	// Setup redis clients
	redisPublisher = redis.createClient({
		url: config.redisUrl
	});
	redisGeneralClient = redis.createClient({
		url: config.redisUrl
	});
	redisGeneralClient.on("error", error => console.error(error));
	redisPublisher.on("error", error => console.error(error));
	redisSet = promisify(redisGeneralClient.set).bind(redisGeneralClient);
	redisGet = promisify(redisGeneralClient.get).bind(redisGeneralClient);
	redisSadd = promisify(redisGeneralClient.sadd).bind(redisGeneralClient);
	redisSrem = promisify(redisGeneralClient.srem).bind(redisGeneralClient);

	// Setup PlayerActions emit playerActionEmitLoop
	playerActionEmitLoop = setInterval(emitPlayerActions, (1000/30));
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

async function addPlayer(matchId:string, playerId:string)
{
	// Add player to store
	await redisSadd(`${config.redisNamespace}:matchmembers:${matchId}`, playerId);

	// Add player to local set
	var playerIds = localPlayerIds.get(matchId);

	if(!playerIds){ playerIds = new Set<PlayerId>(); }
	playerIds.add(playerId);
	localPlayerIds.set(matchId, playerIds);
}

async function updatePlayerAction(matchId:MatchId, playerId:PlayerId, newPlayerAction:PlayerAction)
{
	// Update action
	localPlayerActions.set(playerId, newPlayerAction);
}

async function removePlayer(matchId:string, playerId:string)
{
	// Remove player from store
	await redisSrem(`${config.redisNamespace}:matchmembers:${matchId}`, playerId);

	// Remove player from local set
	const playerIds = localPlayerIds.get(matchId);
	if(playerIds){
		playerIds.delete(playerId);
	}

	// Remove player from actions map
	localPlayerActions.delete(playerId);
}

async function emitPlayerActions()
{
	for(let [matchId, playerIds] of localPlayerIds){
		const playerActions = new Map<PlayerId, PlayerAction>();
		for(let playerId of playerIds){
			const playerAction = localPlayerActions.get(playerId);
			playerActions.set(playerId, playerAction);
		}
		redisPublisher.publish(matchId, JSON.stringify({
			playerActions: Object.fromEntries(playerActions)
		}));
	}
}

async function shutdown()
{
	clearInterval(playerActionEmitLoop);
	await new Promise(r => redisGeneralClient.quit(r));
	await new Promise(r => redisPublisher.quit(r));
	redisGeneralClient.removeAllListeners();
	redisPublisher.removeAllListeners();
}
