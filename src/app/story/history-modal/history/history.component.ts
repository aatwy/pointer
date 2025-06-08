import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Player } from 'src/app/players/player/player.model';
import { sessionHistory } from 'src/app/shared/models/sessionHistory.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  standalone: false
})
export class HistoryComponent implements OnInit, OnChanges{
  @Input() historyEntry: sessionHistory
  story: string = "select entry...";
  players: Player[] = [];
  average: number = 0;

  ngOnInit(): void {
    if (this.historyEntry){
      this.story = this.historyEntry.story;
      this.players = this.historyEntry.players;
      this.average = Math.round(this.historyEntry.average * 10) / 10
    }
  }


  ngOnChanges(): void {
    if (this.historyEntry) {
      this.story = this.historyEntry.story;
      this.players = this.historyEntry.players;
      this.average = Math.round(this.historyEntry.average * 10) / 10
    }
  }


}
