import { Injectable } from "@angular/core";

import { Player } from "../players/player/player.model";
import { Subject } from "rxjs";
import { DataService } from "./data.service";

@Injectable({providedIn: 'root'})
export class PlayerService {
  currentPlayer: Player;

  players: Player[] = []

  constructor(private dataService: DataService){

  }

  getPlayer(id: number){
  }

  setPlayer(id: number){
    // Update player in array to online again
    // this.players[this.players.findIndex(p => p.id === id)].online = true;
    // // set current player to one matched in players array
    // this.currentPlayer = this.players.find(p => p.id === id)
  }

  async addPlayer(player: Player, sessionId: string): Promise<Player>{
    // Check if player has an ID
    return new Promise(async (resolve, reject) => {
      if (player.id) {
        console.log('player id found')
        // Check if the player with this ID is already in this session
        // Then set the player status to online if they are found
        if (this.players.find(p => p.id === player.id)) {
          let index: number = this.players.findIndex(p => p.id === player.id)
          this.players[index].online = true;
          this.currentPlayer = this.players[index]
          this.currentPlayer.vote = '';
          resolve(this.currentPlayer)
        }
      } else {
        // this is not the initial user in the session, so we can append the ID
        // Create new player, get new ID
        await this.dataService.addPlayer(player, sessionId).then((createdPlayer: Player) => {
          this.currentPlayer = {
            ...createdPlayer,
          }
          resolve(this.currentPlayer);
        }).catch((error) => {
          console.log(error)
        })
      }
    })

  }

  clearPlayerVotes(){
    for (let player of this.players) {
      player.vote = "";
    }
  }

  updateVote(vote: string){
    this.players
      [this.players.findIndex(p => p.id === this.currentPlayer.id)]
      .vote = vote;
      console.log("Players array in updateVote in player service" + this.players)
  }
}