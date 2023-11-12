import { Injectable } from "@angular/core";

import { Subject } from "rxjs";
import { PlayerService } from "./player.service";

@Injectable({providedIn: 'root'})
export class VotingService {
  showVotes: boolean = false;
  votes: number[] = [];

  votesChanged = new Subject<number[]>();
  votesCleared = new Subject<boolean>();
  toggler = new Subject<boolean>();

  constructor(
    private playerService: PlayerService){
    }

  toggleVotes(){
    this.showVotes = !this.showVotes
    this.toggler.next(this.showVotes)
  }

  clearVotes(){
    this.playerService.clearPlayerVotes();
    this.showVotes = false;
    this.toggler.next(this.showVotes)
    this.votes = [];
    this.votesCleared.next(true);
  }

  updateVotes(){
    this.votesChanged.next(this.votes)
    console.log("Updating Votes, new vote array:" + this.votes)
  }

  setVotes(){
    this.votes = []
    let players = this.playerService.players;

    for (let player of players) {
      if (+player.vote != 0) {
        this.votes.push(+player.vote)
      }
    }
    console.log("setting votes: " + this.votes)
    this.updateVotes();
  }

}