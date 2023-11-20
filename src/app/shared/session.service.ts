import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { v4 as uuid } from 'uuid';
import { Player } from "../players/player/player.model";
import { PlayerService } from "./player.service";
import { Subject } from "rxjs";
import { DataService } from "./data.service";
import { Session } from "../session/session.model";

export interface Cookie {
  sessionId: string,
  playerId: number
}

@Injectable({providedIn: 'root'})
export class SessionService {

  sessionSet = new Subject<string>();
  joiningSession: boolean = false;
  session: Session;
  sessionId: string;
  player: Player;


  constructor(
    private cookieService: CookieService,
    private playerService: PlayerService,
    private dataService: DataService){
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
    let stringCookie = JSON.stringify({ 'sessionId': this.sessionId, 'playerId': this.player.id})
    this.cookieService.set('pointingSession', stringCookie, expirationDate)
    let cookie: Cookie = JSON.parse(this.cookieService.get('pointingSession'))
    this.sessionSet.next(cookie.sessionId)
    return cookie;
  }

  async getSession(sessionId:string): Promise<Session> {
    return new Promise(async (resolve, reject) => {
      this.dataService.getSession(sessionId).then((session) => {
        resolve(session);
      }).catch((error) =>{
        reject(error)
      })
    })
  }

  async createSession(playerName: string){
    console.log('creating session')
    await this.dataService.createSession({name: playerName, online: true})
      .then(async (createdSession) => {
        this.sessionId = createdSession;

        await this.dataService.getSession(createdSession).then((session: any) =>{
          this.player = session.players[0];
          this.session = {
            id: session._id,
            players: session.players
          };
          // update list of players (even though there is only 1)
          this.playerService.players = session.players;
          // Set the current player to the player that just created the session
          this.playerService.currentPlayer = session.players[0];
          this.createSessionCookie();
          console.log(this.playerService.currentPlayer)
        }).catch((error) =>{
          // do something with error, probably setup an error message alert
        })
    })

  }

  async joinSession(playerName: string){
    this.player = await this.playerService.addPlayer({name: playerName}, this.sessionId);
    this.session = await this.getSession(this.sessionId)
    this.playerService.players = this.session.players;
    console.log(this.session)
    console.log(this.player)
    this.createSessionCookie();
  }







}