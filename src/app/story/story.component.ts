import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { VotingService } from '../shared/voting.service';
import { SessionService } from '../shared/session.service';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit, OnDestroy {
  playerSetSub = new Subscription();
  storySub = new Subscription();
  sessionUpdatedSub = new Subscription();

  story: string;
  showVotes: boolean = false;
  admin: boolean = false;

  constructor(
    private votingService: VotingService,
    private sessionService: SessionService,
    private dataService: DataService){
  }

  ngOnInit(): void {
    this.playerSetSub = this.sessionService.playerSet.subscribe((player) => {
      this.admin = player.isAdmin;
    })

    /*
      Setup a subscription to listen for players rejoining
      This will re-broadcast the story to the players so the rejoined
      player has a copy as well

      This will need to be updated when setting multiple admins
    */
    this.dataService.playerRejoined.subscribe((session) => {
      if (this.admin) {
        if (this.story) {
          this.onStoryUpdated();
        }
      }
    })
    /*
      Setup a subscription to listen for updates to the session
      (Usually new player joining)
      This will re-broadcast the story to the players so the new
      player has a copy as well

      This will need to be updated when setting multiple admins
    */
    this.sessionService.sessionUpdated.subscribe((session) => {
      if (this.admin) {
        if (this.story) {
          this.onStoryUpdated();
        }
      }
    })

    if (this.sessionService.player) {
      this.admin = this.sessionService.player.isAdmin;
    }
    this.story = ""
    this.storySub = this.dataService.storyUpdated.subscribe((story) => {
      this.story = story
    })
  }

  ngOnDestroy(): void {
    this.playerSetSub.unsubscribe();
    this.storySub.unsubscribe();
  }

  toggleVote(){
    this.showVotes = !this.showVotes
    this.votingService.toggleVotes(this.showVotes);
  }

  onNextStory(){
    this.votingService.clearVotes()
  }

  async onStoryUpdated(){
      this.dataService.updateStory(this.sessionService.sessionId, this.story);
  }
}
