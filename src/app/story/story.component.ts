import { Component, OnInit } from '@angular/core';
import { VotingService } from '../shared/voting.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {
  story: string;
  showVotes: boolean = false;

  constructor( private votingService: VotingService ){

  }


  ngOnInit(): void {
    this.story = "MM-XXX"
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
