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
		const matchCode = await agent
			.post("/match")
			.expect(200)
			.then(response => response.body.code);

		// Connect through socket as a driver
		const socket = io("http://localhost:4000", {
			path: `/match/${matchCode}`,
			autoConnect: false,
			transports: ["websocket"]
		});
		sockets.push(socket);	
		const socketConnection = new Promise(r => { socket.once("connect", r); });
		socket.open();
		await socketConnection;
	});
});
