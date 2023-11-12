import { Component, OnInit } from '@angular/core';
import { SessionService } from '../shared/session.service';
import { Subscription, timeInterval } from 'rxjs';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  session: string;
  sessionSet: boolean = false;
  buttonText: string = "Share"

  sessionSub: Subscription;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private clipboard: Clipboard){

    }


  ngOnInit(): void {
    this.sessionSub = this.sessionService.sessionSet.subscribe((sessionId) => {
      const parsedUrl = new URL(window.location.href)
      this.session = parsedUrl.toString();
      this.sessionSet = true;
    })
  }

  onShare(){
    this.clipboard.copy(this.session)
    this.buttonText = 'Link Copied!'
    let timer = setInterval( ()=> {this.buttonText = 'Share'}, 2000)

  }
}
