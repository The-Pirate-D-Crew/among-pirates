import {expect} from "chai";
import * as request from "supertest";
const io = require("socket.io-client");
import * as services from "../services";

describe("WS /match/:id", function(){
	var agent:request.SuperAgentTest;
	var sockets:SocketIOClient.Socket[] = [];

	before(async function(){
		await services.setup();
	});

	beforeEach(async function(){
		// Start service
		await services.reset();

		// Prepare agent
		agent = request.agent("http://localhost:3000");
	});

	afterEach(async function(){
		// Disconnect client sockets if any
		sockets.forEach(socket => socket.disconnect());
		sockets = [];
	});

	after(async function(){
		if(!process.env.DEVTEST){
			await services.shutdown();
		}
	});


	it("should allow connection with socket.io over websockets", async function(){
		// Create a match
		const matchId = await agent
			.post("/match")
			.expect(200)
			.then(response => response.body.id);

		// Connect through socket.io as player1
		const player1Socket = io("http://localhost:3000", {
			path: "/socket.io",
			autoConnect: false,
			transports: ["websocket"],
			query: {
				matchId: matchId
			}
		});
		sockets.push(player1Socket);
		const player1SocketConnection = new Promise(r => { player1Socket.once("connect", r); });
		player1Socket.open();
		await player1SocketConnection;
	});

	it("should notify when players disconnect", async function(){
		// Create a match
		const matchId = await agent
			.post("/match")
			.expect(200)
			.then(response => response.body.id);

		// Connect through socket.io as player1
		const player1Socket = io("http://localhost:3000", {
			path: "/socket.io",
			autoConnect: false,
			transports: ["websocket"],
			query: {
				matchId: matchId
			}
		});
		sockets.push(player1Socket);
		const player1SocketConnection = new Promise(r => { player1Socket.once("connect", r); });
		player1Socket.open();
		await player1SocketConnection;
		const player1Id = player1Socket.id;

		// Connect through socket.io as player2
		const player2Socket = io("http://localhost:3000", {
			path: "/socket.io",
			autoConnect: false,
			transports: ["websocket"],
			query: {
				matchId: matchId
			}
		});
		sockets.push(player2Socket);
		const player2SocketConnection = new Promise(r => { player2Socket.once("connect", r); });
		player2Socket.open();
		await player2SocketConnection;

		// Disconnect player1 and expect player2 to receive notification
		const playerDisconnectEvent = new Promise<{playerId:PlayerId}>(r => {
			player2Socket.once("playerDisconnection", r);
		});
		player1Socket.disconnect();
		const playerDisconnectEventPayload:{playerId:PlayerId} = await playerDisconnectEvent;
		expect(playerDisconnectEventPayload.playerId).to.equal(player1Id);
	});
});
