type Match = {
	id: string,
	code: string
}

type MatchControllerConfig = {
	redisUrl: string,
	redisNamespace: string
}

type PlayerAction = {
	forward: boolean,
	backward: boolean,
	left: boolean,
	right: boolean
}

type MatchId = string;
type PlayerId = string;