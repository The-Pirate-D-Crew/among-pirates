import SocketIoServer, * as SocketIo from "socket.io"
import * as http from "http"
import {Match} from "./components/match/models"
import * as matchController from "./components/match/controller";

var io:SocketIo.Server;
var playerStateEmitLoop:NodeJS.Timeout;

export async function setup(httpServer:http.Server)
{
	// Setup server
	io = SocketIoServer(httpServer, {
		path: "/socket.io",
		serveClient: false,
		origins: "*:*",
		transports: ["websocket"]
	});

	// Setup middleware
	io.use(async(socket, next) => {
		await onSocketConnection(socket);
		next();
	});

	// Setup PlayerState emit loop
	playerStateEmitLoop = setInterval(emitPlayerUpdatesToClients, (1000/20));
}

async function onSocketConnection(socket:SocketIo.Socket)
{
	// Retrieve match
	const matchId = socket.handshake.query.matchId;
	const match = await Match.findOne({_id: matchId}).exec();

	// Disconnect socket if match doesnt exist
	if(!match){
		socket.disconnect();
		return;
	}

	// Add player to match
	const playerId = socket.id;
	await matchController.addPlayer(matchId, playerId);

	// Associate socket to match
	await new Promise((resolve, reject) => {
		socket.join(matchId, error => {
			if(error){ reject(error); return; }
			resolve(undefined);
		});
	});

	// Set player initial state
	matchController.setPlayerState(playerId, {
		x: 700,
		y: 550
	});

	// Subscribe to events
	socket.on("actionUpdate", async playerAction => {
		await onPlayerActionUpdate(matchId, playerId, playerAction);
	});
	socket.on("disconnect", async() => {
		await onPlayerDisconnect(matchId, playerId);
	})
}

async function onPlayerActionUpdate(matchId:MatchId, playerId:PlayerId, playerAction:PlayerAction)
{
	matchController.updatePlayerAction(matchId, playerId, playerAction);
}

async function onPlayerDisconnect(matchId:MatchId, playerId:PlayerId)
{
	// Remove player from match
	await matchController.removePlayer(matchId, playerId);

	// Let other players on the same match know
	io.in(matchId).emit("playerDisconnection", {playerId});
}

// Emit PlayerStates and PlayerActions to clients
function emitPlayerUpdatesToClients()
{
	const matchIds = matchController.getLocal();
	for(let matchId of matchIds){
		const playerIds = matchController.getPlayerIds(matchId);
		const playerStates = new Map<PlayerId, PlayerState>();
		const playerActions = new Map<PlayerId, PlayerAction>();
		for(let playerId of playerIds){
			const playerState = matchController.getPlayerState(playerId);
			const playerAction = matchController.getPlayerAction(playerId);
			playerStates.set(playerId, playerState);
			playerActions.set(playerId, playerAction);
		}
		io.in(matchId).emit("playerUpdates", {
			playerStates: Object.fromEntries(playerStates),
			playerActions: Object.fromEntries(playerActions)
		});
	}
}

export async function shutdown()
{
	clearTimeout(playerStateEmitLoop);
	await new Promise(r => io.close(() => r(undefined)));
	io.removeAllListeners();
}
