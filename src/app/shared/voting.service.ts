import { Injectable } from "@angular/core";

import { Subject } from "rxjs";
import { SessionService } from "./session.service";
import { Player } from "../players/player/player.model";
import { DataService } from "./data.service";
import { Session } from "../session/session.model";

@Injectable({providedIn: 'root'})
export class VotingService {
  showVotes: boolean = false;
  votes: number[] = [];

  votesChanged = new Subject<Player[]>();
  votesCleared = new Subject<boolean>();
  toggler = new Subject<boolean>();

  constructor(
    private sessionService: SessionService,
    private dataService: DataService){

      this.dataService.voteUpdated.subscribe((session) => {
          this.setVotes(session.players);
      })

      this.dataService.toggleShow.subscribe((toggle) => {
        this.showVotes = toggle;
        this.toggler.next(toggle)
      })

      this.sessionService.playerSet.subscribe((player:Player) => {
        if (this.sessionService.player.isAdmin) {
          this.toggleVotes(this.showVotes);
        }
        this.setVotes(this.sessionService.session.players)
      })

      this.sessionService.sessionSet.subscribe((session) => {
        if(!session) this.votes = [];
      })
    }

  /**
   * Sets a vote for the player, this will trigger an even that will update all players connected
   * to the session.
   * @param playerId _id of player to set vote for
   * @param vote  vote to set for the player
   */
  async vote(playerId: string, vote: number){
    await this.dataService.vote(playerId, this.sessionService.sessionId, vote)
  }

  /**
   * Shows or Hides votes for all players in the session.
   * @param showVotes True/False to show or hide votes
   */
  async toggleVotes(showVotes: boolean){
    this.showVotes = showVotes;
    await this.dataService.toggleVotes(this.sessionService.sessionId, showVotes);
    this.toggler.next(this.showVotes);
  }

  /**
   * Clears votes for all of the players in the session
   */
  async clearVotes(){
    await this.dataService.clearVotes(this.sessionService.sessionId);
    this.dataService.updateStory(this.sessionService.sessionId, "")
    this.showVotes = false;
    await this.toggleVotes(this.showVotes);
    this.votes = [];
    this.votesCleared.next(true);
  }

  /**
   * Sends out update on the subject to all subscribers
   */
  updateVotes(players: Player[]){
    this.votesChanged.next(players)
  }

  /**
   * Updates the votes array that is used by the counter component.
   * @param players Players array to update the votes for
   */
  setVotes(players: Player[]){
    this.votes = []

    for (let player of players) {
      if (+player.vote != 0) {
        this.votes.push(player.vote)
      }
    }
    this.updateVotes(players);
  }
}