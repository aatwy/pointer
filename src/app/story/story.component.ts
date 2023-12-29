import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { VotingService } from '../shared/services/voting.service';
import { SessionService } from '../shared/services/session.service';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit, OnDestroy {
  playerSetSub = new Subscription();
  storySub = new Subscription();
  showVotesSub = new Subscription();

  story: string = "";
  storyInput: string = "";
  showVotes: boolean;
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
    if (this.sessionService.player) {
      this.admin = this.sessionService.player.isAdmin;
    }

    this.storySub = this.dataService.storyUpdated.subscribe((story) => {
      this.story = story
      if(story === ""){
        this.storyInput = "";
      }
    })
    this.story = this.sessionService.session.currentStory;

    this.showVotesSub = this.dataService.toggleShow.subscribe((showVotes) => {
      this.showVotes = showVotes;
    })
    this.showVotes = this.sessionService.session.showVotes;
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
    // Check if user is entering empty spaces to prevent useless network calls
    if (this.storyInput.replace(/\s/g, '').length) {
      await this.dataService.updateStory(this.sessionService.sessionId, this.storyInput);
    } else if (this.story.length > 0){
      await this.dataService.updateStory(this.sessionService.sessionId, "");
    }
  }

}
