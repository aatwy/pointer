import { Component, OnInit } from '@angular/core';
import { Cookie, SessionService } from '../shared/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../shared/player.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  cookie: Cookie;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private playerService: PlayerService){}

  ngOnInit(): void {
    if(this.sessionService.checkCookie()){
      this.cookie = this.sessionService.getCookie();
      // get players based on session ID and populate players array
      // set current player to the one matching this player ID
      this.playerService.setPlayer(this.cookie.playerId)
    } else {
      this.cookie = null;
      this.sessionService.joiningSession = true;
      this.router.navigate([''])
    }

  }

}
