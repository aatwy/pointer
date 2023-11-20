import { Component, Input, OnInit } from '@angular/core';
import { Player } from './player.model';
import { PlayerService } from 'src/app/shared/player.service';
import { Subscription } from 'rxjs';
import { VotingService } from 'src/app/shared/voting.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit{
  voteControl: number[] = [.5,1,2,3,5,8,13,20,40,100,0]
  currentVote: number;
  currentPlayer:Player;
  clearVote: Subscription;

  constructor(
    private playerService: PlayerService,
    private votingService: VotingService){
  }

  ngOnInit(): void {
    this.currentPlayer = this.playerService.currentPlayer
    console.log("Current player in player component:")
    console.log(this.currentPlayer)

    this.clearVote = this.votingService.votesCleared.subscribe(() => {
      this.currentVote = null;
    })
  }

  isClicked(vote: number){
    if (vote === this.currentVote){
      return true
    }
    return false;
  }

  onVote(event: Event) {
    let value = <HTMLInputElement>event.target
    this.currentVote = +value.id;
    this.playerService.updateVote(value.id);
    this.votingService.setVotes()
  }
}