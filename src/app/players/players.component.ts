import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Player } from './player/player.model';
import { VotingService } from '../shared/voting.service';
import { Subscription } from 'rxjs';
import { SessionService } from '../shared/session.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})

export class PlayersComponent implements OnInit, OnDestroy {
  voteControlSub =new Subscription();
  votesUpdatedSub = new Subscription();

  showVotes:boolean = false;
  showPlayerComp: boolean = false;

  players: Player[] = [];

  constructor(
    private votingService: VotingService,
    private sessionService: SessionService){}

  ngOnInit(): void {
    if(!this.sessionService.player.spectator){
      this.showPlayerComp = true;
    }

    // Subscribe to changes in the session
    this.sessionService.player
    this.sessionService.sessionUpdated.subscribe((session) => {
      this.players = session.players;
    })
    this.players = this.sessionService.session.players;
    // Subscribe to listen for vote updates
    this.votesUpdatedSub = this.votingService.votesChanged.subscribe((players) => {
      this.players = players;
    })
    // Subscribe to listen for any changes on toggling the player votes
    this.voteControlSub = this.votingService.toggler.subscribe((showVotes) => {
      this.showVotes = showVotes
    })
    this.showVotes = this.votingService.showVotes;
  }

  ngOnDestroy(): void {
    this.voteControlSub.unsubscribe();
    this.votesUpdatedSub.unsubscribe();
  }

}
