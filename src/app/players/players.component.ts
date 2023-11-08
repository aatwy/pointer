import { Component, OnDestroy, OnInit } from '@angular/core';
import { Player } from './player/player.model';
import { VotingService } from '../shared/voting.service';
import { Subscription } from 'rxjs';
import { PlayerService } from '../shared/player.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})

export class PlayersComponent implements OnInit, OnDestroy {
  voteControlSub: Subscription;
  showVotes:boolean = false;
  players: Player[];

  constructor(
    private votingService: VotingService,
    private playerService: PlayerService){}

  ngOnInit(): void {
    this.voteControlSub = this.votingService.toggler.subscribe((showVotes) => {
      this.showVotes = showVotes
    })
    this.players = this.playerService.players;
  }

  ngOnDestroy(): void {
    this.voteControlSub.unsubscribe
  }

}
