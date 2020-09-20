type Match = {
	id: string,
	code: string
}

type MatchControllerConfig = {
	redisUrl: string,
	redisNamespace: string
}

type PlayerAction = {
	up: boolean,
	down: boolean,
	left: boolean,
	right: boolean
}

type PlayerState = {
	x: number,
	y: number
}

type MatchId = string;
type PlayerId = string;