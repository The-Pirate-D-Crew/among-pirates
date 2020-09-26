import {expect} from "chai";
import * as request from "supertest";
const io = require("socket.io-client");
import * as services from "../services";

describe("WS /match/:id actionUpdate", function(){
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


	it("should update player state", async function(){
		this.timeout(999999);
		// Create a match
		const matchCode = await agent
			.post("/match")
			.expect(200)
			.then(response => response.body.code);

		// Connect through socket.io as Player 1
		const playerSocket1 = io("http://localhost:4000", {
			path: `/match/${matchCode}`,
			autoConnect: false,
			transports: ["websocket"]
		});
		sockets.push(playerSocket1);	
		const playerSocket1Connection = new Promise(r => { playerSocket1.once("connect", r); });
		playerSocket1.open();
		await playerSocket1Connection;

		// Connect through socket.io as Player 2
		const playerSocket2 = io("http://localhost:4000", {
			path: `/match/${matchCode}`,
			autoConnect: false,
			transports: ["websocket"]
		});
		sockets.push(playerSocket2);	
		const playerSocket2Connection = new Promise(r => { playerSocket2.once("connect", r); });
		playerSocket2.open();
		await playerSocket2Connection;

		// Update player 1 actions
		playerSocket1.emit("actionUpdate", {
			up: true,
			down: false,
			left: false,
			right: false
		});

		// Subscribe player 2 to other player states and
		// wait until we get the correct state for player 1
		await new Promise(r => {
			const checkFn = function(payload:{playerStates:{[key:string]: PlayerState}, playerActions:{[key:string]: PlayerAction}}){
				if(payload.playerStates[playerSocket1.id].y < 550 && payload.playerActions[playerSocket1.id].up){
					playerSocket1.off(checkFn);
					r();
				}
			}
			playerSocket1.on("playerUpdates", checkFn);
		});
	});
});

