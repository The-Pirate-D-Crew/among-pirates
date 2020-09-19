import io from "socket.io-client";
import settings from "../../config/settings";

const { baseWSocketUrl } = settings;

export default class Socket {
  constructor(matchId) {
    this.matchId = matchId;
    this.socket = io(baseWSocketUrl, {
      path: `/match/${matchId}`,
      autoConnect: true,
      transports: ["websocket"],
    });
  }

  onPlayerStates() {
    return this.socket.on("playerStates");
  }

  disconnect() {
    this.socket.disconnect();
  }
}
