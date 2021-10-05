const localPlayerIds = new Map<MatchId, Set<PlayerId>>();
const localPlayerActions = new Map<PlayerId,PlayerAction>();
const localPlayerStates = new Map<PlayerId,PlayerState>();
var playerStateUpdateLoop:NodeJS.Timeout;

export {
	setup,
	addPlayer,
	removePlayer,
	setPlayerState,
	updatePlayerAction,
	getLocal,
	getPlayerState,
	getPlayerAction,
	getPlayerIds,
	shutdown
};

async function setup()
{
	// Setup PlayerState update loop
	playerStateUpdateLoop = setInterval(updatePlayerStates, (1000/60));
}

async function addPlayer(matchId:string, playerId:string)
{
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
	const movementSpeed:number = 3;
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
}
