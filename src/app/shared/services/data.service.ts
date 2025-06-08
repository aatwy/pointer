import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io'
import { Router } from '@angular/router';

import { Session } from '../models/session.model';
import { Player } from '../../players/player/player.model';
import { NotificationService } from '../toast/notification.service';
import { NotificationType } from '../toast/notification.message';
import { Quote } from '../models/quote.model';



@Injectable({
   providedIn: 'root'
})
export class DataService {
  sessionUpdate = this.socket.fromEvent<Session>('sessionUpdated');
  voteUpdated = this.socket.fromEvent<Session>('voteUpdated');
  toggleShow = this.socket.fromEvent<boolean>('toggleShow');
  storyUpdated = this.socket.fromEvent<string>('storyUpdated');
  playerRejoined = this.socket.fromEvent<Session>('playerRejoined');
  quoteUpdated = this.socket.fromEvent<Quote>('quoteUpdated');
  adminUpdated = this.socket.fromEvent<Session>('adminUpdated');
  voteLockUpdated = this.socket.fromEvent<boolean>('voteLockUpdated');

  constructor(
    private socket: Socket,
    private notificationService: NotificationService,
    private router: Router) {
    this.connectToSocket();
  }

  /**
   * Connects to the socket given the connection was setup in app.module
   */
  async connectToSocket(){
    await this.socket.connect();
  }

  /**
   * Creates a session using the player passed in, this will return a session with the current player
   * set as the admin
   * @param player Player to create the session for.
   * @returns Session with player already added as admin
   */
  async createSession(player: Player): Promise<Session>{
    return new Promise( async (resolve, reject) => {
      await this.socket.emit('createSession', player, (createdSession: Session) => {
        if(createdSession._id.toString().length === 24) {
          resolve(createdSession)
        } else {
          this.notificationService.sendMessage({
            type: NotificationType.error,
            message: "Error while trying to create session"
          })
          reject(createdSession)
        }
      })
    })
  }

  /**
   * Gets session given the sessionId, will return an error if the id is not valid ,
   * or session is not found.
   * @param sessionId _id of the session to retrieve
   * @returns Session if found, error if not
   */
  async getSession(sessionId: string): Promise<Session>{

    return new Promise(async (resolve, reject)  => {
      await this.socket.emit('getSession', sessionId, (session: Session) => {
        try{
          if ("_id" in session) {
            resolve(session)
          }
        } catch (error){
          this.notificationService.sendMessage({
            type: NotificationType.error,
            message: "Error: Could not get session"
          })
          reject(`Error in getSession: ${error}`)
        }

      })
    })
  }

  /**
   * Adds a player to an existing session, returns the player. An event will be triggered if succesful
   * which will update the players array.
   * @param  playerToCreate Player to add to the session
   * @param  sessionId _id of the session to add the player to
   * @returns Player wrapped in a promise.
   */
  async addPlayer(playerToCreate: Player, sessionId: string): Promise<Player> {
    return new Promise(async (resolve, reject) => {
      let newPlayer = {
        ...playerToCreate,
        isAdmin: false
      };
      await this.socket.emit('joinSession', newPlayer, sessionId, (createdPlayer: any) => {
        try {
          if ('_id' in createdPlayer) {
            resolve(createdPlayer);
          }
        } catch {
          this.router.navigate(['']);
          // this.modal.closeModal();
          this.notificationService.sendMessage({
            type: NotificationType.error,
            message: `Error occured while joining session: ${createdPlayer}`
          })
          reject(createdPlayer);
        }
      })

    })
  }

  /**
   * Updates player, currently only name is updated! An event will be triggered if successful which will
   * update the players array
   *
   * @param playertoUpdate Player to update
   * @param sessionId _id of the session to update player in
   * @returns Player wrapped in a promise
   */
  async updatePlayer(playerToUpdate: Player, sessionId: string): Promise<Player> {
    return new Promise(async (resolve, reject) => {
      await this.socket.emit('updatePlayer', playerToUpdate, sessionId, (updatedPlayer: Player) => {
        try {
          if (updatedPlayer.name == playerToUpdate.name) {
            resolve(this.updatePlayer)
          }
          } catch(error) {
            this.notificationService.sendMessage({
              type: NotificationType.error,
              message: "Error updating Player"
            })
            reject(`Error in updatePlayer: ${error}`)
          }
      })
    })

  }

  async rejoinedSession(playerId: string, sessionId: string): Promise<Session> {
    return new Promise(async (resolve, reject) => {
      await this.socket.emit('rejoinedSession', playerId, sessionId, (session:Session) => {
        try {
          if ("_id" in session) {
            resolve(session)
          }
        } catch (error) {
          this.notificationService.sendMessage({
            type: NotificationType.error,
            message: "Error: Could not get session"
          })
          reject(`Error in getSession: ${error}`)
        }
      })
    })
  }
  /**
   * Updates/Adds a vote for a player in a session. An event will be triggered if successful
   * which will update the players array .
   * @param playerId  _id of player to set vote for.
   * @param sessionId _id of session to update player vote in
   * @param vote vote value to set for the player
   */
  async vote(playerId: string, sessionId: string, vote: number): Promise<Boolean> {
    await this.socket.emit('updateVote', playerId, sessionId, vote)
    return Promise.resolve(true)
  }

  /**
   * Clears all votes in a given session. An event will be triggered if successful
   * which will update the players array .
   * @param sessionId _id of session to clear votes for.
   */
  async clearVotes(sessionId: string){
    await this.socket.emit('clearVotes', sessionId)
  }

  /**
   * Toggles the show / hide vote for all players the session.An event will be triggered if successful
   * which will update the players array .
   * @param sessionId _id of session to show/hide votes for
   * @param show show or hide: true = show, false = hides  votes
   */
  async toggleVotes(sessionId: string, show: boolean){
    this.socket.emit('toggleShow', sessionId, show)
  }

  /**
   * Update the story for all players in the session. An event will be triggered if successful
   * which will update the players array .
   * @param sessionId _id of the session to update the story in
   * @param story text to set for the story
   */
  async updateStory(sessionId: string, story: string){
    this.socket.emit('updateStory', sessionId, story);
  }

  /**
   * Will remove the current socket from the given session/room
   * @param sessionId _id for the session/room to leave.
   */
  async leaveRoom(sessionId: string) {
    await this.socket.emit('leaveRoom', sessionId);
  }

  /**
   * Gets current quote from the server
   * @returns
   */
  async getQuote(): Promise<Quote> {
    return new Promise(async (resolve, reject) => {
     this.socket.emit('getQuote', "dummy", (quote: Quote) => {
      resolve(quote);
      })
    })
  }

  /**
   * Switches player from and to spectator mode in a session
   * @param spectate
   * @param playerId
   * @param sessionId
   * @returns
   */
  async switchSpectate(spectate: boolean, playerId: string, sessionId: string): Promise<boolean>{
    return new Promise(async (resolve, reject) => {
      await this.socket.emit('switchSpectateMode', spectate, playerId, sessionId, (success: boolean) => {
        try {
          if (success) {
            resolve(success)
          }
        } catch (error) {
          this.notificationService.sendMessage({
            type: NotificationType.error,
            message: "Error in switching spectator mode:"
          })
          reject(`Error in switching spectator mode: ${error}`)
        }
      })
    })
  }

  /**
   * Sets player as admin, or removes admin from player
   * @param isAdmin
   * @param playerId
   * @param sessionId
   * @returns
   */
  async setAdmin(isAdmin:boolean, playerId: string, sessionId: string): Promise<boolean>{
    return new Promise(async (resolve, reject) => {
      await this.socket.emit('setAdmin', isAdmin, playerId, sessionId, (success: boolean) => {
        try {
          if (success) {
            resolve(success)
          }
        } catch (error) {
          this.notificationService.sendMessage({
            type: NotificationType.error,
            message: "Error in setting admin:"
          })
          reject(`Error in setting admin: ${error}`)
        }
      })
    })
  }

  async lockVotes(lockVotes: boolean, sessionId: string): Promise<boolean>{
    return new Promise(async (resolve, reject) => {
      await this.socket.emit('toggleLock', lockVotes, sessionId, (success: boolean) => {
        try {
          if (success) {
            resolve(success)
          }
        } catch (error) {
          this.notificationService.sendMessage({
            type: NotificationType.error,
            message: "Error in locking controls:"
          })
          reject(`Error in locking controls: ${error}`)
        }
      })
    })
  }

}


