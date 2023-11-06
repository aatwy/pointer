import { Component } from '@angular/core';
import { Player } from './player/player.model';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})

export class PlayersComponent {
  players: Player[] = [
    {
    id: '1',
    name: 'Ali',
    vote: '5',
    voted: true
    },
    {
    id: '2',
    name: 'Mike',
    vote: '2',
    voted: true
    },
    {
    id: '3',
    name: 'Albert',
    vote: '1',
    voted: true
    },

  ];

}
