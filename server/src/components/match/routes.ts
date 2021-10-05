import * as Express from "express";
import mongoose from "mongoose";
import randomstring from "randomstring";
import {Match, Invitation} from "./models";

export default {
	create,
	join,
	getPlayers,
	start
};

async function create(req:Express.Request, res:Express.Response)
{
	// Generate a match ID
	const matchId = new mongoose.Types.ObjectId();

	// Brute-force an invitation code
	const maxGenerationRetries = 100;
	var invitation:Invitation;
	for(let i=0; i<maxGenerationRetries; i++){
		let code = randomstring.generate({
			length: 5,
			capitalization: "uppercase"
		});
		try{
			invitation = await Invitation.create({
				match: matchId,
				code: code
			});
			break;
		}catch(error){
			if(error.code != 11000 || !error.keyPattern?.code){
				throw error;
			}
		}		
	}
	if(!invitation){
		throw new Error("Could not create an invitation code");
	}

	// Create a match
	const match = await Match.create({
		_id: matchId,
		invitationCode: invitation.code
	});

	// Send response
	res.status(200).json({
		id: match.id,
		code: match.invitationCode
	});
}

async function join(req:Express.Request, res:Express.Response)
{
	// Get match
	const match = await Match.findOne({invitationCode: req.params.code}).exec();
	if(!match){
		res.status(404).json({message: "MATCH_NOT_FOUND"});
		return;
	}

	// Send response
	res.status(200).json({
		id: match._id
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