import { Component, OnInit } from '@angular/core';


interface VoteCount {
  'point': number,
  'count': number
}
@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})

export class CounterComponent implements OnInit{
  votes: number[] = [3,2,3,3,1,1,3,3,2,1,3];
  voteCount: VoteCount[] = [];
  average: number;

  ngOnInit(): void {
    this.countVotes();
    this.average = Math.round((this.averageVotes()) * 100 )/ 100
  }

  averageVotes(){
    let total = this.votes.reduce((sum, current) => sum + current)
    return (total / this.voteCount.length)
  }

  countVotes () {

    const voteCounter = (votes = this.votes, vote: number) => {
      return (votes.filter((x) => x == vote).length);
    }

    let pointSequence: number[] = [0,1,2,3,5,8,13,20,40,100]

    for( let point of pointSequence ) {
      if (this.votes.includes(point)){
        let vote: VoteCount = {'point': point, 'count': voteCounter(this.votes, point) }
        this.voteCount.push(vote)
      }
    }
    this.voteCount = this.voteCount.sort((a,b) => b.count - a.count )
    console.log(this.voteCount)
  }


}
