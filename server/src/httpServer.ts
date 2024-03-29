import * as http from "http";
import express from "express";
import cors from "cors";
import {router as matchRouter} from "./components/match/router";

const app = express();
var server:http.Server;

export async function setup():Promise<http.Server>
{
	app.use(cors());
	app.use("/match", matchRouter);
	app.use("/assets", express.static("../public/assets"))
	app.use(express.static("../public/dist"))
	app.get("/healthz", (req, res) => res.sendStatus(200));
	app.use(async(error:Error, req:express.Request, res:express.Response, next:express.NextFunction) => {
		// Dont log client syntax errors
		if(error instanceof SyntaxError){ res.sendStatus(400); return; }

		// Send response
		res.sendStatus(500);

		// Log error
		console.error(error);
	});
	server = http.createServer(app);
	await new Promise(r => server.listen(3000, r));
	return server;
}

export async function shutdown()
{
	if(server){ await new Promise(r => server.close(r)); }
}
