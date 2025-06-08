import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Quote } from '../shared/models/quote.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false
})

export class FooterComponent implements OnInit{
  quoteJson: Quote;
  quote: string = "I'm not superstitious, but I am a little stitious.";
  author: string = "Michael Scott"
  url: string = "https://zenquotes.io"

  constructor(private dataservice: DataService) {}

  ngOnInit(): void {
    this.dataservice.quoteUpdated.subscribe((quote: Quote) => {
      if (quote) {
        this.quote = quote.quote;
        this.author = quote.author;
      }
      this.quoteJson = quote;
    })
    this.getQuote();
  }


  async getQuote(){
    let quote = await this.dataservice.getQuote();
    this.quote = quote.quote;
    this.author = quote.author;
  }
}
