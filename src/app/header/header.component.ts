import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../shared/services/session.service';
import { Subscription } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { DataService } from '../shared/services/data.service';
import { Player } from '../players/player/player.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy{
  session: string;
  inSession: boolean = false;
  buttonText: string = "Share Link";
  spectatorButtonText: string = "Spectate"
  shareTimer: any;

  sessionSub = new Subscription();
  playerSetSub = new Subscription();

  constructor(
    private sessionService: SessionService,
    private clipboard: Clipboard,
    private dataService: DataService){
    }

  ngOnInit(): void {
    this.sessionSub = this.sessionService.sessionSet.subscribe((sessionId) => {
      if(sessionId){
        this.resolveSpectateButtonText(this.sessionService.player);
        this.buttonText = "Share Session"
        this.inSession = true;
      } else {
        this.inSession = false;
        this.buttonText = "Share Link"
      }
      clearTimeout(this.shareTimer)
    })

    this.playerSetSub = this.sessionService.playerSet.subscribe((player) => {
      this.resolveSpectateButtonText(player);
    })
    const parsedUrl = new URL(window.location.href)
    this.session = parsedUrl.toString();
  }

  ngOnDestroy(): void {
    this.sessionSub.unsubscribe();
  }

  onShare(){
    const parsedUrl = new URL(window.location.href)
    this.session = parsedUrl.toString();
    this.clipboard.copy(this.session);
    if(this.inSession){
      this.buttonText = "Link Copied!";
      this.shareTimer = setTimeout(() => { this.buttonText = 'Share Session' }, 2000);
    } else {
      this.buttonText = 'Link Copied!';
      this.shareTimer = setInterval(() => { this.buttonText = 'Share Link' }, 2000);
    }
  }

  onSpectate(){
    this.sessionService.switchSpecate();
  }

  onGoHome(){
    this.sessionService.resetSession()
  }

  resolveSpectateButtonText(player: Player){
    if (player.spectator) {
      this.spectatorButtonText = "Point"
    }
    if (!player.spectator) {
      this.spectatorButtonText = "Spectate"
    }
  }
}
