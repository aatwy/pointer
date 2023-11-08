import { Injectable } from "@angular/core";

import { Player } from "../players/player/player.model";

@Injectable({providedIn: 'root'})
export class PlayerService {
  currentPlayer: Player;

  private _players: Player[] = [
    {
      id: '1',
      name: 'Ali',
      vote: ''
    },
    {
      id: '2',
      name: 'Mike',
      vote: '2'
    },
    {
      id: '3',
      name: 'Albert',
      vote: '1'
    }]

  get players(): Player[] {
    return this._players.slice();
  }

  addPlayer(player: Player){
    this.players.push(player);
  }

  clearPlayerVotes(){
    for (let player of this._players) {
      player.vote = ""
    }
  }
}