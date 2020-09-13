import * as httpServer from "./httpServer";
import * as wsServer from "./wsServer";
import * as matchController from "./components/match/controller";


export async function start()
{
	// Set everything up
	await matchController.setup({
		redisUrl: "redis://127.0.0.1:6379",
		redisNamespace: "match"
	});
	await httpServer.setup();
	await wsServer.setup();
}

export async function shutdown()
{
	await httpServer.shutdown();
	await wsServer.shutdown();
	await matchController.shutdown();
}
if(require.main === module){ start(); }
