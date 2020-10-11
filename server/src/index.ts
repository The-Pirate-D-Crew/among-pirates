import * as httpServer from "./httpServer";
import * as wsServer from "./wsServer";
import * as matchController from "./components/match/controller";


export async function start()
{
	// Set everything up
	await matchController.setup({
		redisUrl: process.env.MATCH_STORE_REDIS_URL,
		redisNamespace: "match"
	});
	const webServer = await httpServer.setup();
	await wsServer.setup(webServer);
}

export async function shutdown()
{
	await httpServer.shutdown();
	await wsServer.shutdown();
	await matchController.shutdown();
}
if(require.main === module){ start(); }
