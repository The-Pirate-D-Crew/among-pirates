import {expect} from "chai";
import * as request from "supertest";
import {Socket} from "socket.io-client";
import * as services from "../../services";

describe("POST /match", function(){
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
		await services.shutdown();
	});


	it("should create a match", async function(){

		const response = await agent
			.post("/match")
			.expect(200);
		expect(response.body.code).to.be.a("string");
		expect(response.body.code.length).to.equal(5);
		expect(response.body.id).to.be.a("string");
	});
});
