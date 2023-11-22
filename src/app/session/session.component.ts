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
    private route: ActivatedRoute,){

    }

  async ngOnInit(): Promise<void> {
    // Set current session and check if it matches the cookie
    let session: string;
    this.route.params.subscribe(params => {
      session = params['id']
      this.sessionService.sessionId = session;
    })
    // Check if player and session are set
    if(this.sessionService.player && this.sessionService.session){
      // we just created or joined a new session, so  nothing to do here
      // Check if cookie exists and matches session you are joining
    } else if(this.sessionService.checkCookie() && this.sessionService.getCookie().sessionId === session){
      this.cookie = this.sessionService.getCookie();
      await this.sessionService.rejoinSession(this.cookie.playerId, this.cookie.sessionId)
      // Cookie does not exist, or does not match, then navigate to the home page and allow
      // user to join session
    } else {
      this.cookie = null;
      this.sessionService.joiningSession = true;
      this.router.navigate([''])
    }
  }

}
