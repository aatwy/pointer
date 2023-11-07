import { Component } from '@angular/core';

@Component({
  selector: 'app-pointing-cards',
  templateUrl: './pointing-cards.component.html',
  styleUrls: ['./pointing-cards.component.css']
})
export class PointingCardsComponent {

  onVote(event: Event) {
    let value = < HTMLInputElement > event.target
    console.log(value.id)
  }
}
