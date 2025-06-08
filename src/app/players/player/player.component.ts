import { AfterViewChecked, Component, ElementRef, HostListener, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Player } from './player.model';
import { Subscription } from 'rxjs';
import { VotingService } from 'src/app/shared/services/voting.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { PlayerService } from 'src/app/shared/services/player.service';
import { Session } from 'src/app/shared/models/session.model';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  standalone: false
})
export class PlayerComponent implements OnInit, OnDestroy, AfterViewChecked{
  @ViewChild('playerNameTextBox', { static: false }) playerNameTextBox: ElementRef;

  voteControl: number[] = [.5,1,2,3,5,8,13,20,40,100,0]
  currentVote: number;
  currentPlayer:Player;
  lockControls: boolean = false;

  votesClearedSub = new Subscription();
  votesUpdatedSub = new Subscription();
  votesLockSub = new Subscription();

  sessionUpdated = new Subscription();

  edit = false;
  originalName: string;


  constructor(
    private votingService: VotingService,
    private sessionService: SessionService,
    private playerService: PlayerService){
  }

  ngOnInit(): void {
    this.votesLockSub = this.votingService.voteLockUpdated.subscribe((lock) => {
      this.lockControls = lock;
    })
    this.lockControls = this.votingService.lockVotes;

    this.sessionUpdated = this.sessionService.sessionUpdated.subscribe(() => {
      this.originalName = this.sessionService.player.name
    })

    this.sessionService.playerSet.subscribe((updatedPlayer)=>{
      this.currentPlayer = updatedPlayer;
      this.originalName = updatedPlayer.name
      this.currentVote = updatedPlayer.vote;
    })
    this.currentPlayer = this.sessionService.player;
    this.currentVote = this.currentPlayer.vote;

    this.votesClearedSub = this.votingService.votesCleared.subscribe(() => {
      this.currentVote = null;
    })
    this.votesUpdatedSub = this.votingService.votesChanged.subscribe((players) => {
      if(this.currentPlayer) {
        this.currentVote =  players.find(player => player._id === this.currentPlayer._id).vote
      }
    })
  }

  ngAfterViewChecked() {
    if(this.playerNameTextBox){
      this.playerNameTextBox.nativeElement.focus()
    }
  }

  ngOnDestroy(): void {
    this.votesClearedSub.unsubscribe();
    this.votesUpdatedSub.unsubscribe();
    this.votesLockSub.unsubscribe();
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

  onEditName(event: KeyboardEvent){
    if(event.code === "Enter" && this.currentPlayer.name.length > 0) {
      this.playerService.updatePlayer(this.currentPlayer, this.sessionService.sessionId)
      this.edit = false;
    } else if(event.key === "Escape") {
      this.edit = false;
      this.currentPlayer.name = this.originalName;
    }
  }
  onEnableEdit(){
    this.edit = true;
  }

  @HostListener('document:click', ['$event'])
  docClicked(event: Event) {
    if (this.edit && !this.playerNameTextBox.nativeElement.contains(event.target)) {
      this.playerService.updatePlayer(this.currentPlayer, this.sessionService.sessionId)
      this.edit = false;
    }
  }

}