const baseUrl = "https://ivankoop.dev"
const header = { 'Content-Type': 'application/json' }
export default class Api {

    static createMatch() {
        return fetch(`${baseUrl}/match`, { method: "POST", headers: this.header })
    }

    static joinMatch(matchId) {
        return fetch(`${baseUrl}/match/${matchId}/join`, { method: "POST", headers: this.header })
    }

    static startMatch(matchId) {
        return fetch(`${baseUrl}/match/${matchId}/start`, { method: "POST", headers: this.header })
    }

    static getPlayers(matchId) {
        return fetch(`${baseUrl}/match/${matchId}/players`)
    }
}