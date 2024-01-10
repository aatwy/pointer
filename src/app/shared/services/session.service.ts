import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

import { Player } from "../../players/player/player.model";
import { PlayerService } from "./player.service";
import { DataService } from "./data.service";
import { Session } from "../models/session.model";

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
  story: string;

  constructor(
    private playerService: PlayerService,
    private dataService: DataService){

    dataService.sessionUpdate.subscribe((session) => {
      this.session = session;
      this.story = session.currentStory
      this.sessionUpdated.next(this.session);
      this.player = this.session.players.find(player => player._id === this.player._id);
      this.playerSet.next(this.player);
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
    if(localStorage.getItem(sessionId)) {
      return true;
    }
    // temporarily disabled cookies, not working on iOS
    // if (this.cookieService.check(sessionId)) {
    //   return true;
    // }
    return false;
  }

  /**
   * Gets the cookie if it exists, creates one and returns it if it does not.
   * @returns Found or Created cookie, no milk provided.
   */
  getCookie(sessionId: string = this.sessionId): Cookie {
    if (this.checkCookie()) {
      let cookie: Cookie = { sessionId: sessionId, playerId: localStorage.getItem(sessionId)};
      return cookie;
    }
    return this.createSessionCookie()
  }

  /**
   * Temporarily switched to local storage
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
    localStorage.setItem(sessionId, playerId);
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
  async createSession(playerName: string, spectate: boolean = false){
    let newPlayer: Player = { name: playerName, spectator: spectate, online: true }
    await this.dataService.createSession(newPlayer)
      .then(async (session) => {
      this.sessionId = session._id.toString();
        this.player = session.players[0];
        this.session = session;
        this.sessionSet.next(this.sessionId)
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
  async joinSession(playerName: string, spectate: boolean = false){
    let newPlayer: Player =
      {
        name: playerName,
        spectator: spectate,
        isAdmin: false,
        online: true
      }
    await this.playerService.addPlayer(newPlayer, this.sessionId)
      .then(async (player:Player) =>{
        // set player and session
        this.player = player;
        this.session = await this.getSession(this.sessionId)
        this.createSessionCookie(this.session._id, this.player._id);
        // broadcast the updates
        this.playerSet.next(this.player)
        this.sessionSet.next(this.sessionId)
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
    await this.getSession(sessionId).then(async (session) => {
      // set session and player
      this.session = session;
      this.player = session.players.find(player => player._id === playerId);
      // broadcast the updates
      this.playerSet.next(this.player);
      this.sessionSet.next(this.sessionId);
      await this.dataService.rejoinedSession(playerId, sessionId);
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

  /**
   * Switches the player to a spectator or not, updates the player in the session.
   */
  async switchSpecate(){
    await this.dataService.switchSpectate(!this.player.spectator, this.player._id, this.sessionId)
  }







}