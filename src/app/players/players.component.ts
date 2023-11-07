import { Component, OnInit } from '@angular/core';
import { Player } from './player/player.model';
import { VotingService } from '../shared/voting.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})

export class PlayersComponent implements OnInit {
  players: Player[];

  constructor(private votingService: VotingService){}

  ngOnInit(): void {
    this.players = this.votingService.getPlayers();
  }


}
