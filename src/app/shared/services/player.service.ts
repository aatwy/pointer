import { Injectable } from "@angular/core";

import { Player } from "../../players/player/player.model";
import { DataService } from "./data.service";

@Injectable({providedIn: 'root'})
export class PlayerService {

  constructor(private dataService: DataService){
  }

  /**
   * Adds the current player to the session .
   * @param player Player to add to the session.
   * @param sessionId _id of session to join.
   * @returns a Player if successful, error if not.
   */
  async addPlayer(player: Player, sessionId: string): Promise<Player>{
    // Check if player has an ID
    return new Promise(async (resolve, reject) => {
        // Create new player, get new ID
        await this.dataService.addPlayer(player, sessionId).then((createdPlayer: Player) => {
          resolve(createdPlayer);
        }).catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }

  /**
   *
   * @param player
   * @param sessionId
   */
  async updatePlayer(player: Player, sessionId: string): Promise<Player> {
    // Send updated player
    return new Promise(async (resolve, reject) => {
      await this.dataService.updatePlayer(player, sessionId).then((updatedPlayer: Player) => {
        resolve(updatedPlayer);
      }).catch((error: Error) => {
        console.log(error)
        reject(error)
      })
    })
  }
}