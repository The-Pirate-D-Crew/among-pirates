import SocketIoServer, * as SocketIo from "socket.io"
import * as matchController from "./components/match/controller"
var io:SocketIo.Server;

export async function setup()
{
	io = SocketIoServer({
		path: "/match",
		serveClient: false
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

	// Associate socket to match
	await new Promise((resolve, reject) => {
		socket.join(matchId, error => {
			if(error){ reject(error); return; }
			resolve();
		});
	});
}

export async function shutdown()
{
	await new Promise(r => io.close(r));
	io.removeAllListeners();
}
