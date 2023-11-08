import { Component, Input, OnInit } from '@angular/core';
import { Player } from './player.model';
import { PlayerService } from 'src/app/shared/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit{
  voteControl: number[] = [.5,1,2,3,5,8,13,20,40,100,0]
  currentVote: number;

  @Input() currentPlayer:Player;

  constructor(private playerService: PlayerService){
  }

  ngOnInit(): void {

  }

  isClicked(vote: number){
    if (vote === this.currentVote){
      return true
    }
    return false;
  }

  onVote(event: Event) {
    let value = <HTMLInputElement>event.target
    console.log(value.id)
    this.currentVote = +value.id;
  }
}