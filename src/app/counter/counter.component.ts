import { Component, OnDestroy, OnInit } from '@angular/core';
import { VotingService } from '../shared/voting.service';
import { Subscription } from 'rxjs';
import { SessionService } from '../shared/session.service';


export interface VoteCount {
  'point': number,
  'count': number
}
@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})

export class CounterComponent implements OnInit, OnDestroy{
  voterSub: Subscription;
  voteTogglerSub: Subscription;

  votes: number[] = [];
  voteCount: VoteCount[] = [];
  average: number;
  showVotes: boolean = false;

  constructor(private voteService: VotingService){}

  ngOnInit(): void {
    this.voterSub = this.voteService.votesChanged.subscribe((votes) => {
      this.votes = votes;
      this.countVotes();
    } )

    this.voteTogglerSub = this.voteService.toggler.subscribe((show) => {
      this.showVotes = show;
    })
    this.votes = this.voteService.votes;
    console.log(`votes in ngInit of counter components ${this.votes}`)
    this.countVotes();
  }

  ngOnDestroy(): void {
    this.voterSub.unsubscribe();
    this.voteTogglerSub.unsubscribe();
  }

  averageVotes(){
    if (this.votes.length === 0){
      return 0;
    }
    let total = this.votes.reduce((sum, current) => sum + current)
    return (total / this.voteCount.length)
  }

  countVotes() {
    this.voteCount = [];

    const voteCounter = (votes = this.votes, vote: number) => {
      return (votes.filter((x) => x == vote).length);
    }

    let pointSequence: number[] = [0,1,2,3,5,8,13,20,40,100]

    for (let point of pointSequence ) {
      if (this.votes.includes(point)){
        let vote: VoteCount = {'point': point, 'count': voteCounter(this.votes, point) }
        this.voteCount.push(vote)
      }
    }
    this.voteCount = this.voteCount.sort((a,b) => b.count - a.count )
    this.average = Math.round((this.averageVotes()) * 100) / 100
    console.log("current votecount: " + this.voteCount)
  }


}
