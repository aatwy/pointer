import { Component, OnInit } from '@angular/core';
import { Cookie, SessionService } from '../shared/session.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PlayerService } from '../shared/player.service';
import { switchMap } from 'rxjs';

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
    private route: ActivatedRoute,
    private playerService: PlayerService){}

  ngOnInit(): void {
    // Set current session and check if it matches the cookie
    let session: string;
    this.route.params.subscribe(params => {
      session = params['id']
      this.sessionService.sessionId = session;
    })
    // Check if cookie exists and matches session you are joining
    if(this.sessionService.checkCookie() && this.sessionService.getCookie().sessionId === session){
      this.cookie = this.sessionService.getCookie();
      // get players based on session ID and populate players array
      // set current player to the one matching this player ID
      this.playerService.setPlayer(this.cookie.playerId)
      // Cookie does not exist, or does not match, then navigate to the hom
    } else {
      this.cookie = null;
      this.sessionService.joiningSession = true;
      this.router.navigate([''])
    }
  }

}
