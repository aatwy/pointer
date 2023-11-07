import { Injectable } from "@angular/core";

import { Player } from "../players/player/player.model";

@Injectable({providedIn: 'root'})
export class VotingService {
  private players: Player[] = [
    {
      id: '1',
      name: 'Ali',
      vote: '5',
      voted: true
    },
    {
      id: '2',
      name: 'Mike',
      vote: '2',
      voted: true
    },
    {
      id: '3',
      name: 'Albert',
      vote: '1',
      voted: true
    }]

  getPlayers(){
    return this.players.slice();
  }
}