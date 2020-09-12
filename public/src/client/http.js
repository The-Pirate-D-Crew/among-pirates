import axios from 'axios'
const baseUrl = "https://ivankoop.dev"

export default class HttpRequest {

    static createMatch() {
        return axios.post(`${baseUrl}/match`)
    }

    static joinMatch(matchId) {
        return axios.post(`${baseUrl}/match/${matchId}/join`)
    }

    static startMatch(matchId) {
        return axios.post(`${baseUrl}/match/${matchId}/start`)
    }

    static getPlayers(matchId) {
        return axios.get(`${baseUrl}/match/${matchId}/players`)
    }
}