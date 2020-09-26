import randomstring from "randomstring";
import uniqid from "uniqid";
import * as redis from  "redis";
import {promisify} from "util";
var config:MatchControllerConfig;
var redisGeneralClient:redis.RedisClient;
var redisSet:redis.OverloadedCommand<string, string, string>;
var redisGet:redis.OverloadedCommand<string, string, string>;
var redisSadd:redis.OverloadedCommand<string, string, string>;
var redisSrem:redis.OverloadedCommand<string, string, string>;
const localPlayerIds = new Map<MatchId, Set<PlayerId>>();
const localPlayerActions = new Map<PlayerId,PlayerAction>();
const localPlayerStates = new Map<PlayerId,PlayerState>();
var playerStateUpdateLoop:NodeJS.Timeout;

export {
	setup,
	create,
	addPlayer,
	removePlayer,
	setPlayerState,
	updatePlayerAction,
	getByCode,
	getById,
	getLocal,
	getPlayerState,
	getPlayerAction,
	getPlayerIds,
	shutdown
};

async function setup(_config:MatchControllerConfig)
{
	// Make config available module wide
	config = _config;

	// Setup redis clients
	redisGeneralClient = redis.createClient({
		url: config.redisUrl
	});
	redisGeneralClient.on("error", error => console.error(error));
	redisSet = promisify(redisGeneralClient.set).bind(redisGeneralClient);
	redisGet = promisify(redisGeneralClient.get).bind(redisGeneralClient);
	redisSadd = promisify(redisGeneralClient.sadd).bind(redisGeneralClient);
	redisSrem = promisify(redisGeneralClient.srem).bind(redisGeneralClient);

	// Setup PlayerState update loop
	playerStateUpdateLoop = setInterval(updatePlayerStates, (1000/60));
}

async function create():Promise<Match>
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
	await redisSet(`${config.redisNamespace}:${matchId}`, JSON.stringify(match));
	return match;
}

async function getByCode(matchCode:string):Promise<Match>
{
	const matchStr = await redisGet(`${config.redisNamespace}:${matchCode}`);
	if(!matchStr){
		return null;
	}
	return JSON.parse(matchStr);
}

async function getById(matchId:MatchId):Promise<Match>
{
	const matchStr = await redisGet(`${config.redisNamespace}:${matchId}`);
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

function updatePlayerAction(matchId:MatchId, playerId:PlayerId, newPlayerAction:PlayerAction)
{
	// Update action
	localPlayerActions.set(playerId, newPlayerAction);
}

function setPlayerState(playerId:PlayerId, playerState:PlayerState)
{
	localPlayerStates.set(playerId, playerState);
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

	// Remove player from local actions map
	localPlayerActions.delete(playerId);
}

function getLocal():MatchId[]
{
	return Array.from(localPlayerIds.keys());
}

function getPlayerState(playerId:PlayerId):PlayerState
{
	return localPlayerStates.get(playerId);
}

function getPlayerAction(playerId:PlayerId):PlayerAction
{
	return localPlayerActions.get(playerId);
}

function getPlayerIds(matchId:MatchId):PlayerId[]
{
	return Array.from(localPlayerIds.get(matchId));
}

function onPlayerActionUpdate(playerId:PlayerId, playerAction:PlayerAction)
{
	localPlayerActions.set(playerId, playerAction);
}

function updatePlayerStates()
{
	const movementSpeed:number = 6;
	for(let playerId of localPlayerActions.keys()){

		// Get current state and action
		const playerState = localPlayerStates.get(playerId);
		const playerAction = localPlayerActions.get(playerId);

		// Update position
		if(playerAction.up){
			playerState.y -=  movementSpeed;
		}
		if(playerAction.down){
			playerState.y +=  movementSpeed;
		}
		if(playerAction.left){
			playerState.x -=  movementSpeed;
		}
		if(playerAction.right){
			playerState.x +=  movementSpeed;
		}

		// Save state
		localPlayerStates.set(playerId, playerState);
	}
}

async function shutdown()
{
	clearInterval(playerStateUpdateLoop);
	await new Promise(r => redisGeneralClient.quit(r));
	redisGeneralClient.removeAllListeners();
}
