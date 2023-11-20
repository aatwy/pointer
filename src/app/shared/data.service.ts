import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io'
import { Session } from '../session/session.model';
import { Player } from '../players/player/player.model';


@Injectable({providedIn: 'root'})
export class DataService {

  constructor(private socket: Socket) {
    socket.connect();
  }


  async createSession(player: Player): Promise<any>{
    return new Promise( async (resolve, reject) => {
      await this.socket.emit('createSession', player, (createdSession: string) => {
        if(createdSession.length === 24) {
          resolve(createdSession)
        } else {
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
          reject(`Error in getSession: ${session}`)
        }
      })
    })
  }

  async addPlayer(playerToCreate: Player, sessionId: string): Promise<Player> {
    return new Promise(async (resolve, reject) => {
      let newPlayer = {
        name: playerToCreate.name,
        isAdmin: false
      }
      await this.socket.emit('addPlayer', newPlayer, sessionId, (createdPlayer: any) => {
        if ('_id' in createdPlayer) {
          resolve({
            name: createdPlayer.name,
            id: createdPlayer._id,
            isAdmin: false
          })
        } else {
          reject(`Error ${createdPlayer}`)
        }
      })
    })

  }

}
