import axios from "axios";
import settings from "../../config/settings";

const { baseURL } = settings;

export default class HttpRequest {
  static createMatch() {
    return axios.post(`${baseURL}/match`);
  }

  static joinMatch(matchId) {
    return axios.post(`${baseURL}/match/${matchId}/join`);
  }

  static startMatch(matchId) {
    return axios.post(`${baseURL}/match/${matchId}/start`);
  }

  static getPlayers(matchId) {
    return axios.get(`${baseURL}/match/${matchId}/players`);
  }
}
