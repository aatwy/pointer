import { Injectable } from "@angular/core";

import { Player } from "../players/player/player.model";

@Injectable({providedIn: 'root'})
export class PlayerService {
  currentPlayer: Player;

  private _players: Player[] = []

  get players(): Player[] {
    return this._players.slice();
  }

  getPlayer(id: number){

  }

  addPlayer(player: Player){
    if (player.id){
      console.log('player has an id')
      if (this._players.find( p => p.id === player.id)) {
        let index: number = this._players.findIndex(p => p.id === player.id)
        this._players[index].online = true;
        return this._players[index]
      }

    } else {
      player.id = (this._players[this._players.length - 1].id + 1);
    }
    player.online = true;
    player.vote = '';
    this._players.push(player);
    this.currentPlayer = player;
    return this.currentPlayer;
  }

  clearPlayerVotes(){
    for (let player of this._players) {
      player.vote = "";
    }
  }
}