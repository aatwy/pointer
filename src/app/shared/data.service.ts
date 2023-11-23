import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io'

import { Session } from '../session/session.model';
import { Player } from '../players/player/player.model';
import { NotificationService } from './toast/notification.service';
import { NotificationType } from './toast/notification.message';


@Injectable({providedIn: 'root'})
export class DataService {
  sessionUpdate = this.socket.fromEvent<Session>('sessionUpdated');
  voteUpdated = this.socket.fromEvent<Session>('voteUpdated');
  toggleShow = this.socket.fromEvent<boolean>('toggleShow');
  storyUpdated = this.socket.fromEvent<string>('storyUpdated');

  constructor(
    private socket: Socket,
    private notificationService: NotificationService) {
    this.connectToSocket();

  }
  async connectToSocket(){
    await this.socket.connect();
  }

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
   * test function
   * @param sessionId
   */
  async getSession(sessionId: string): Promise<Session>{

    return new Promise(async (resolve, reject)  => {
      await this.socket.emit('getSession', sessionId, (session: Session) => {
        if ("_id" in session){
          resolve(session)
        } else {
          this.notificationService.sendMessage({
            type: NotificationType.error,
            message: "Error: Could get session"
          })
          reject(`Error in getSession: ${session}`)
        }
      })
    })
  }

  /**
   *
   * @param playerToCreate
   * @param sessionId
   * @returns
   */
  async addPlayer(playerToCreate: Player, sessionId: string): Promise<Player> {
    return new Promise(async (resolve, reject) => {
      let newPlayer = {
        name: playerToCreate.name,
        isAdmin: false
      };
      await this.socket.emit('addPlayer', newPlayer, sessionId, (createdPlayer: any) => {
        console.log(createdPlayer)
        if ('_id' in createdPlayer) {
          resolve(createdPlayer);
        } else {
          this.notificationService.sendMessage({
            type: NotificationType.error,
            message: `Error occured while joining session: ${createdPlayer}`
          })
          console.log(createdPlayer)
          reject(createdPlayer);
        }
      })
    })
  }

  /**
   *
   * @param playerId
   * @param sessionId
   * @param vote
   */
  async vote(playerId: string, sessionId: string, vote: number): Promise<Boolean> {
    await this.socket.emit('updateVote', playerId, sessionId, vote)
    return Promise.resolve(true)
  }

  async clearVotes(sessionId: string){
    await this.socket.emit('clearVotes', sessionId)
  }

  async toggleVotes(sessionId: string, show: boolean){
    this.socket.emit('toggleShow', sessionId, show)
  }

  async updateStory(sessionId: string, story: string){
    this.socket.emit('updateStory', sessionId, story);
  }

  async leaveRoom(sessionId: string) {
    await this.socket.emit('leaveRoom', sessionId);
  }

}


