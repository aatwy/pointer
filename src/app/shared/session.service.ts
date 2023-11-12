import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { v4 as uuid } from 'uuid';
import { Player } from "../players/player/player.model";
import { PlayerService } from "./player.service";
import { Subject } from "rxjs";

export interface Cookie {
  sessionId: string,
  playerId: number
}
@Injectable({providedIn: 'root'})
export class SessionService {
  sessionSet = new Subject<string>();
  player: Player;
  joiningSession: boolean = false;
  private _sessionId: string = 'abefg';

  constructor(
    private cookieService: CookieService,
    private playerService: PlayerService){}

  get sessionId() {
    return this._sessionId
  }

  checkCookie() {
    if (this.cookieService.check('pointingSession')) {
      return true;
    }
    return false;
  }

  getCookie(): Cookie {
    if (this.checkCookie()) {
      let cookie: Cookie = JSON.parse(this.cookieService.get('pointingSession'));
      this.sessionSet.next(cookie.sessionId)
      return cookie;
    }
    return this.createSessionCookie()
  }

  private createSessionCookie() {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);
    let stringCookie = JSON.stringify({ 'sessionId': this._sessionId, 'playerId': this.player.id})
    this.cookieService.set('pointingSession', stringCookie, expirationDate)
    let cookie: Cookie = JSON.parse(this.cookieService.get('pointingSession'))
    this.sessionSet.next(cookie.sessionId)
    return cookie;
  }

  createSession(playerName: string){
    console.log('creating session')
    this.player = this.playerService.addPlayer(
      {
        name: playerName,
        id: 1,
        vote: '',
        online: true
      })
    this._sessionId = uuid();
    this.createSessionCookie();
    console.log("players array: " + this.playerService.players)
    console.log("session ID: " + this._sessionId)
  }

  joinSession(playerName: string){
    this.player = this.playerService.addPlayer(
      {
        name: playerName,
        id: null
      });
    this.createSessionCookie();
  }







}