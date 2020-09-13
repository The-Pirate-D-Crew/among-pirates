import * as Express from "express";
import * as matchController from "./controller";

export default {
	create,
	join,
	getPlayers,
	start
};

async function create(req:Express.Request, res:Express.Response)
{
	const match = await matchController.create();
	res.status(200).json({
		id: match.id,
		code: match.code
	});
}

async function join(req:Express.Request, res:Express.Response)
{
	// Get match
	const match = await matchController.getByCode(req.params.code);
	if(!match){
		res.status(404).json({message: "MATCH_NOT_FOUND"});
		return;
	}

	// Send response
	res.status(200).json({
		id: match.id
	});
}

async function getPlayers(req:Express.Request, res:Express.Response)
{
	res.sendStatus(200);
}

async function start(req:Express.Request, res:Express.Response)
{
	res.sendStatus(200);
}