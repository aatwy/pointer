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
    // Subscribe to listen for any changes on toggling the player votes
    this.voteControlSub = this.votingService.toggler.subscribe((showVotes) => {
      this.showVotes = showVotes
    })
    // update component players list with current list from service
    this.players = this.playerService.players;
    // initialize votes in the voting service for first load
    this.votingService.setVotes()
  }

  ngOnDestroy(): void {
    this.voteControlSub.unsubscribe
  }

}
