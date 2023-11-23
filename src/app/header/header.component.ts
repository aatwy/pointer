import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../shared/session.service';
import { Subscription, TimeInterval } from 'rxjs';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  session: string;
  inSession: boolean = false;
  buttonText: string = "Share Link";
  shareTimer: any;

  sessionSub = new Subscription();

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private clipboard: Clipboard){

    }

  ngOnInit(): void {
    this.sessionSub = this.sessionService.sessionSet.subscribe((sessionId) => {
      if(sessionId){
        console.log('SESSION ID FOUND', sessionId)

        const parsedUrl = new URL(window.location.href)
        this.session = parsedUrl.toString();
        this.buttonText = "Share Session"
        this.inSession = true;
      } else {
        console.log('NO SESSION ID FOUND', sessionId)
        this.inSession = false;
        this.session = null;
        this.buttonText = "Share Link"
      }
      clearTimeout(this.shareTimer)
    })
    const parsedUrl = new URL(window.location.href)
    this.session = parsedUrl.toString();
  }

  ngOnDestroy(): void {
    this.sessionSub.unsubscribe();
  }

  onShare(){
    this.clipboard.copy(this.session);
    if(this.inSession){
      this.buttonText = "Session Link copied";
      this.shareTimer = setTimeout(() => { this.buttonText = 'Share Session' }, 2000);
    } else {
      this.buttonText = 'Link Copied!';
      this.shareTimer = setInterval(() => { this.buttonText = 'Share Link' }, 2000);
    }
  }

  onGoHome(){
    this.sessionService.resetSession()
  }
}
