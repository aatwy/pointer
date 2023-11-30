import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Subject, Subscription } from "rxjs";

import { Player } from "../players/player/player.model";
import { PlayerService } from "./player.service";
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
  playerRejoined = new Subject<Session>();

  joiningSession: boolean = false;
  session: Session;
  sessionId: string;
  player: Player;


  constructor(
    private cookieService: CookieService,
    private playerService: PlayerService,
    private dataService: DataService){

    dataService.sessionUpdate.subscribe((session) => {
      this.session = session;
      this.sessionUpdated.next(this.session);
    })
    // Vote updated recieved from socket, update current votes
    // in players array
    dataService.voteUpdated.subscribe((session) => {
      this.session.players = session.players;
      this.voteUdpated.next(session.players);
    })
  }

  /**
   * Checks if a cookie exists or not
   * @returns True if cookie exists, false if not
   */
  checkCookie(sessionId: string = this.sessionId) {
    if (this.cookieService.check(`${sessionId}`)) {
      return true;
    }
    return false;
  }

  /**
   * Gets the cookie if it exists, creates one and returns it if it does not.
   * @returns Found or Created cookie, no milk provided.
   */
  getCookie(sessionId: string = this.sessionId): Cookie {
    if (this.checkCookie()) {
      let cookie: Cookie = { sessionId: sessionId, playerId: this.cookieService.get(`${sessionId}`)};
      return cookie;
    }
    return this.createSessionCookie()
  }

  /**
   * Creates a cookie, uses the currently set sessionId and player, cookie has an 8 hour expiration time.
   * The cookie is using the sessionId as the key, and playerId as the value.
   * So a user can have multiple cookies at the same time
   * @returns new session cookie created using the sessionId and player.
   */
  private createSessionCookie(sessionId: string = this.sessionId, playerId: string = this.player._id) {
    // Set Expiration Date to 8 hours from now
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);
    // Set cookie
    this.cookieService.set(
      `${sessionId}`,
      `${playerId}`,
      expirationDate,
      `session`)
    let cookie: Cookie = this.getCookie(sessionId)
    return cookie;
  }

  /**
   * Will send a request over the socket to retrieve a session.
   * @param sessionId _id of sessioin to get.
   * @returns Session if found, error otherwise.
   */
  async getSession(sessionId:string): Promise<Session> {
    return new Promise(async (resolve, reject) => {
      this.dataService.getSession(sessionId).then((session) => {
        resolve(session);
      }).catch((error) =>{
        reject(error)
      })
    })
  }

  /**
   * Creates a session given the player name, sets the session and player in the object if succesful.
   * @param playerName Name of player to create the session for.
   */
  async createSession(playerName: string){
    await this.dataService.createSession({name: playerName, online: true})
      .then(async (session) => {
      this.sessionId = session._id.toString();
        this.player = session.players[0];
        this.session = session;
        // Set the current player to the player that just created the session
        this.createSessionCookie();
        // this.sessionUpdated.next(this.session);
        // this.playerSet.next(this.player);
      }).catch((error) =>{
        // do something with error, probably setup an error message alert
      })
  }

  /**
   * Adds a player to a session, creates a cookie once the player has joined.
   * Sets the player and sessionId as well
   * @param playerName Name of player to join session with.
   */
  async joinSession(playerName: string){
    console.log("In Join Session", this.sessionId)
    await this.playerService.addPlayer({name: playerName}, this.sessionId)
      .then(async (player:Player) =>{
        // set player and session
        this.player = player;
        this.session = await this.getSession(this.sessionId)
        this.createSessionCookie(this.session._id, this.player._id);
        // broadcast the updates
        this.playerSet.next(this.player)
    }).catch((error) => {
      // do something with this later
      console.log(`Error during joinSession: ${error}`)
    });
  }

  /**
   * Connects to the socket , which add this player to the room if a new socketId is used.
   * Updates players array, session and player.
   * @param playerId _id of player to rejoin the session with
   * @param sessionId  _id of the session to rejoin
   */
  async rejoinSession(playerId: string, sessionId: string){
    // retrieve session from server, populate sessionService variabels
    // send out update
    await this.getSession(sessionId).then((session) => {
      // set session and player
      this.session = session;
      this.player = session.players.find(player => player._id === playerId);
      // broadcast the updates
      this.playerSet.next(this.player);
    }).catch((e) => {
      // do something with error later
      console.log(`Error while rejoining session ${e}`);
    })
  }

  /**
   * Clears session info, player info, and leaves the session/room for the socket
   */
  resetSession(){
    this.dataService.leaveRoom(this.sessionId);
    this.session = null;
    this.sessionId = null;
    this.player = null;
    this.joiningSession = null;
    this.sessionSet.next(null);
  }







}