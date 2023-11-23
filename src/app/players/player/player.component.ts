import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Player } from './player.model';
import { PlayerService } from 'src/app/shared/player.service';
import { Subscription } from 'rxjs';
import { VotingService } from 'src/app/shared/voting.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy{
  voteControl: number[] = [.5,1,2,3,5,8,13,20,40,100,0]
  currentVote: number;
  currentPlayer:Player;
  votesClearedSub = new Subscription();
  votesUpdatedSub = new Subscription();

  constructor(
    private votingService: VotingService,
    private sessionService: SessionService){
  }

  ngOnInit(): void {
    this.sessionService.playerSet.subscribe((updatedPlayer)=>{
      this.currentPlayer = updatedPlayer
    })
    this.currentPlayer = this.sessionService.player;

    this.votesClearedSub = this.votingService.votesCleared.subscribe(() => {
      this.currentVote = null;
    })
    this.votesUpdatedSub = this.sessionService.voteUdpated.subscribe(() => {
      this.currentVote = this.sessionService.session.players
        .find(player => player._id === this.currentPlayer._id).vote
    })
    this.currentVote = null
  }

  ngOnDestroy(): void {
    this.votesClearedSub.unsubscribe();
    this.votesUpdatedSub.unsubscribe();
  }

  isClicked(vote: number){
    if (vote === this.currentVote){
      return true
    }
    return false;
  }

  async onVote(event: Event) {
    let value = <HTMLInputElement>event.target
    this.currentVote = +value.id;
    await this.votingService.vote(this.currentPlayer._id, +value.id);
  }
}