import SocketIoServer, * as SocketIo from "socket.io"
import * as matchController from "./components/match/controller"

var io:SocketIo.Server;

export async function setup()
{
	// Setup server
	io = SocketIoServer({
		path: "/match",
		serveClient: false,
		origins: "*:*"
	});

	// Setup middleware
	io.use(async(socket, next) => {
		await onSocketConnection(socket);
		next();
	});

	// Start listenint for connections
	io.listen(4000);
}

async function onSocketConnection(socket:SocketIo.Socket)
{
	// Retrieve match
	const matchId = socket.handshake.url.split("/")[2];
	const match = await matchController.getByCode(matchId);

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
			resolve();
		});
	});

	// Subscribe to events
	socket.on("actionUpdate", async playerAction => {
		await onPlayerActionUpdate(matchId, playerId, playerAction);
	});
	socket.on("disconnect", async() => {
		await matchController.removePlayer(matchId, playerId);
	});
}

async function onPlayerActionUpdate(matchId:MatchId, playerId:PlayerId, playerAction:PlayerAction)
{
	await matchController.updatePlayerAction(matchId, playerId, playerAction);
}

export async function shutdown()
{
	await new Promise(r => io.close(r));
	io.removeAllListeners();
}
