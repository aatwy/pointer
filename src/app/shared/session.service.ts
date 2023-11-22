import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { v4 as uuid } from 'uuid';
import { Player } from "../players/player/player.model";
import { PlayerService } from "./player.service";
import { Subject, Subscription } from "rxjs";
import { DataService } from "./data.service";
import { Session } from "../session/session.model";

export interface Cookie {
  sessionId: string,
  playerId: string
}

@Injectable({providedIn: 'root'})
export class SessionService {
  sessionUpdates = new Subscription();

  sessionSet = new Subject<string>();
  sessionUpdated = new Subject<Session>();
  playerSet = new Subject<Player>();
  voteUdpated = new Subject<Player[]>();

  joiningSession: boolean = false;
  session: Session;
  sessionId: string;
  player: Player;


  constructor(
    private cookieService: CookieService,
    private playerService: PlayerService,
    private dataService: DataService){

    dataService.sessionUpdate.subscribe((session) => {
      console.log('update received from socket');
      console.log(session);
      this.session = session;
      this.sessionUpdated.next(this.session);
    })
    // Vote updated recieved from socket, update current votes
    // in players array
    dataService.voteUpdated.subscribe((session) => {
      console.log('Vote update received from server');
      this.session.players = session.players;
      console.log('When Votes.next is fired', session)
      this.voteUdpated.next(session.players);
    })

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
    // Set Expiration Date to 1 hour from now
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);
    // Stringify the cookie to hold more than 1 value
    let stringCookie = JSON.stringify({ 'sessionId': this.sessionId, 'playerId': this.player._id})
    // Set cookie
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
      .then(async (session) => {
      this.sessionId = session._id.toString();
        this.player = session.players[0];
        this.session = session;
        // Set the current player to the player that just created the session
        this.createSessionCookie();
        this.playerSet.next(this.player);
        this.sessionUpdated.next(this.session);
      }).catch((error) =>{
        // do something with error, probably setup an error message alert
      })
  }

  async joinSession(playerName: string){
    await this.playerService.addPlayer({name: playerName}, this.sessionId)
      .then(async (player:Player) =>{
        this.player = player;
        this.session = await this.getSession(this.sessionId)
        console.log('In join Session: session + player')
        console.log(this.session)
        console.log(this.player)
        this.createSessionCookie();
        this.sessionUpdated.next(this.session);
    }).catch((error) => {
      // do something with this later
      console.log(`Error during joinSession: ${error}`)
    });
  }

  async rejoinSession(playerId: string, sessionId: string){
    // retrieve session from server, populate sessionService variabels
    // send out update
    await this.getSession(sessionId).then((session) => {
      this.session = session;
      this.sessionUpdated.next(this.session);
      let players = this.session.players;
      this.player = players[players.findIndex((player) => player._id === playerId)];
      this.playerSet.next(this.player);
    }).catch((e) => {
      // do something with error later
      console.log(`Error while rejoining session ${e}`);
    })

  }







}