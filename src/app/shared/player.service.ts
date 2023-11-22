import { Injectable } from "@angular/core";

import { Player } from "../players/player/player.model";
import { Subject } from "rxjs";
import { DataService } from "./data.service";

@Injectable({providedIn: 'root'})
export class PlayerService {

  constructor(private dataService: DataService){

  }

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

  clearPlayerVotes(players: Player[]): Player[]{
    for (let player of players) {
      player.vote = null;
    }
    return players;
  }

}