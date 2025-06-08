import { AfterViewInit, Component, Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Player } from './player/player.model';
import { VotingService } from '../shared/services/voting.service';
import { Subscription } from 'rxjs';
import { SessionService } from '../shared/services/session.service';


@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  standalone: false
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
    this.sessionService.sessionUpdated.subscribe((session) => {
      this.players = session.players;
      this.onSort();
    })

    this.players = this.sessionService.session.players;
    // Subscribe to listen for vote updates
    this.votesUpdatedSub = this.votingService.votesChanged.subscribe((players) => {
      this.players = players;
      this.onSort();
    })
    // Subscribe to listen for any changes on toggling the player votes
    this.voteControlSub = this.votingService.toggler.subscribe((showVotes) => {
      this.showVotes = showVotes
    })
    this.showVotes = this.votingService.showVotes;
    this.onSort();
  }

  ngOnDestroy(): void {
    this.voteControlSub.unsubscribe();
    this.votesUpdatedSub.unsubscribe();
  }

  onSort(){
    this.players.sort((a, b) => a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : a.name > b.name ? 1 : 0);
  }

}
