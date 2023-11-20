import { Component, OnInit } from '@angular/core';
import { VotingService } from '../shared/voting.service';
import { SessionService } from '../shared/session.service';
import { PlayerService } from '../shared/player.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {
  story: string;
  showVotes: boolean = false;
  admin: boolean = false;

  constructor(
    private votingService: VotingService,
    private playerService: PlayerService){
  }

  ngOnInit(): void {
    this.story = "Story time"
    if (this.playerService.currentPlayer) {
      this.admin = this.playerService.currentPlayer.isAdmin;
    }
  }

  toggleVote(){
    this.showVotes = !this.showVotes
    this.votingService.toggleVotes();
  }

  clearStory(){
    this.votingService.clearVotes()
    this.showVotes = false;
    this.story = ""
  }

}
