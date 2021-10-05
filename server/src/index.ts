import mongoose from "mongoose";
import * as httpServer from "./httpServer";
import * as wsServer from "./wsServer";
import * as matchController from "./components/match/controller";


export async function start()
{
	// Set everything up
	await mongoose.connect(process.env.MONGO_DB_URL);
	await matchController.setup();
	const webServer = await httpServer.setup();
	await wsServer.setup(webServer);
}

export async function shutdown()
{
	await matchController.shutdown();
	await httpServer.shutdown();
	await wsServer.shutdown();
	await mongoose.disconnect();
}
if(require.main === module){ start(); }
