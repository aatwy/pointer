import { Injectable } from "@angular/core";

import { Subject } from "rxjs";
import { PlayerService } from "./player.service";
import { SessionService } from "./session.service";
import { Player } from "../players/player/player.model";
import { DataService } from "./data.service";
import { Session } from "../session/session.model";

@Injectable({providedIn: 'root'})
export class VotingService {
  showVotes: boolean = false;
  votes: number[] = [];

  votesChanged = new Subject<number[]>();
  votesCleared = new Subject<boolean>();
  toggler = new Subject<boolean>();

  constructor(
    private sessionService: SessionService,
    private dataService: DataService){

      this.sessionService.voteUdpated.subscribe((updatedPlayers) => {
          this.setVotes(updatedPlayers);
      })

      this.dataService.toggleShow.subscribe((toggle) => {
        this.showVotes = toggle;
        this.toggler.next(toggle)
      })
    }

  async vote(playerId: string, vote: number){
    await this.dataService.vote(playerId, this.sessionService.sessionId, vote)
  }

  async toggleVotes(showVotes: boolean){
    this.showVotes = showVotes;
    await this.dataService.toggleVotes(this.sessionService.sessionId, showVotes);
    this.toggler.next(this.showVotes);
  }

  async clearVotes(){
    await this.dataService.clearVotes(this.sessionService.sessionId);
    this.dataService.updateStory(this.sessionService.sessionId, "")
    this.showVotes = false;
    await this.toggleVotes(this.showVotes);
    this.votes = [];
    this.votesCleared.next(true);
  }

  updateVotes(){
    this.votesChanged.next(this.votes)
  }

  setVotes(players: Player[]){
    this.votes = []

    for (let player of players) {
      if (+player.vote != 0) {
        this.votes.push(player.vote)
      }
    }
    this.updateVotes();
  }

}