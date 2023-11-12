import { Injectable } from "@angular/core";

import { Player } from "../players/player/player.model";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class PlayerService {
  currentPlayer: Player;

  private _players: Player[] = [
    {
      name: 'Ali',
      id: 1,
      vote: '2',
      online: true
    },
    {
      name: 'Ali1',
      id: 2,
      vote: '2',
      online: true
    },
    {
      name: 'Ali2',
      id: 3,
      vote: '2',
      online: true
    },
    {
      name: 'Ali3',
      id: 4,
      vote: '3',
      online: true
    }, {
      name: 'Ali4',
      id: 78,
      vote: '1',
      online: true
    }
  ]

  constructor(){}

  get players(): Player[] {
    return this._players.slice();
  }

  getPlayer(id: number){
  }

  setPlayer(id: number){
    // set current player to one matched in players array
    this.currentPlayer = this._players.find(p => p.id === id)
    // Update player in array to online again
    this._players[this._players.findIndex(p => p.id === id)].online = true;
  }

  addPlayer(player: Player){
    // Check if player has an ID
    if (player.id){
      console.log('player id found')
      // Check if the player with this ID is already in this session
      // Then set the player status to online if they are found
      if (this._players.find( p => p.id === player.id)) {
        let index: number = this._players.findIndex(p => p.id === player.id)
        this._players[index].online = true;
        return this._players[index]
      }
    } else {
      // this is not the initial user in the session, so we can append the ID
      // Create new player, get new ID
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

  updateVote(vote: string){
    this._players
      [this._players.findIndex(p => p.id === this.currentPlayer.id)]
      .vote = vote;
      console.log("Players array in updateVote in player service" + this._players)
  }
}