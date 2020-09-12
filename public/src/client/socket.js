import io from 'socket.io-client';
const baseUrl = "https://ivankoop.dev"


export default class Socket {

    constructor(matchId) {
        this.matchId = matchId;
        this.socket = io.connect(`${baseUrl}/match/${matchId}`);
    }
    
    onPlayerStates() {
        return this.socket.on("playerStates")
    }
}