import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { v4 as uuid } from 'uuid';
import { Player } from "../players/player/player.model";
import { PlayerService } from "./player.service";


@Injectable({providedIn: 'root'})
export class SessionService {
  player: Player;
  private _sessionId: string;

  constructor(
    private ngxCookieService: CookieService,
    private playerService: PlayerService){}


  createSession(playerName: string){
    this.player = {name: playerName, id: 1 , vote: '', online: true}
    this._sessionId = uuid();
    this.player = this.playerService.addPlayer(this.player)
    this.createSessionCookie();
    console.log(this.playerService.players)
    console.log(this._sessionId)
  }

  private createSessionCookie(){
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);
    let cookie = JSON.stringify({'_sessionId': this._sessionId, 'playerId': 1})
    this.ngxCookieService.set('_sessionId', cookie, expirationDate)
  }

  getCookieValue(value: string){
    if (this.ngxCookieService.check('_sessionId')) {
      let cookie: any = this.ngxCookieService.get('_sessionId')
      cookie = JSON.parse(cookie)
      return cookie[value];
    }
    return null;
  }
  get sessionId(){
    return this._sessionId
  }




}