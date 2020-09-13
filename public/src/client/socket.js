import io from "socket.io-client";
const baseUrl = "http://localhost:4000";

export default class Socket {
  constructor(matchId) {
    this.matchId = matchId;
    this.socket = io("http://localhost:4000", {
      path: `/match/${matchId}`,
      autoConnect: false,
      transports: ["websocket"],
    });

    this.socket.connect()
    
  }

  onPlayerStates() {
    return this.socket.on("playerStates");
  }

  disconnect() {
    this.socket.disconnect();
  }
}
