import {expect} from "chai";
import * as request from "supertest";
import {Socket} from "socket.io-client";
import * as services from "../../services";

describe("POST /match/:id/join", function(){
	var agent:request.SuperAgentTest;

	before(async function(){
		await services.setup();
	});

	beforeEach(async function(){
		// Start service
		await services.reset();

		// Prepare agent
		agent = request.agent("http://localhost:3000");
	});

	after(async function(){
		if(!process.env.DEVTEST){
			await services.shutdown();
		}
	});


	it("should respond with match id", async function(){
		// Create a match
		const matchCode = await agent
			.post("/match")
			.expect(200)
			.then(response => response.body.code);

		// Attempt to join it
		const response = await agent
			.post(`/match/${matchCode}/join`)
			.expect(200);
		expect(response.body.id).to.be.a("string");
	});

});
