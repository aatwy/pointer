import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Cookie, SessionService } from '../shared/session.service';
import { ActivatedRoute } from '@angular/router';
import { ModalConfig } from '../shared/modal.config.interface';
import { SessionModalComponent } from '../shared/session-modal/session-modal.component';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit, AfterViewInit {
  @ViewChild('modal') private modalComponent: SessionModalComponent

  modalConfig: ModalConfig = {
    modalTitle: 'Join Pointing Session',
    closeButtonLabel: 'Join Session',
    shouldDismiss: () => false,
    hideDismissButton: () => true,
  }

  cookie: Cookie;
  newPlayer: boolean = false;
  sessionActive: boolean = false;

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,) {
  }

  async ngOnInit(): Promise<void> {
    this.sessionService.sessionSet.subscribe((stuff) => {
      this.sessionActive = true;
    })
    if (this.sessionService.session) {
      this.sessionActive = true;
    }
    // Set current session and check if it matches the cookie
    let session: string;
    this.route.params.subscribe(params => {
      session = params['id']
      this.sessionService.sessionId = session;
    })

    // Check if player and session are set
    if (this.sessionService.player && this.sessionService.session) {
      // we just created or joined a new session, so  nothing to do here
      // Check if cookie exists and matches session you are joining
    } else if (this.sessionService.checkCookie(session) && this.sessionService.getCookie(session).sessionId === session) {
      this.cookie = this.sessionService.getCookie();
      await this.sessionService.rejoinSession(this.cookie.playerId, this.cookie.sessionId)
      // Cookie does not exist, or does not match, then navigate to the home page and allow
      // user to join session
    } else {
      this.cookie = null;
      this.sessionService.joiningSession = true;
      this.newPlayer = true;
    }
  }

  ngAfterViewInit(): void {
    if (this.newPlayer) this.joinSession();
  }

  async joinSession() {
    return await this.modalComponent.open();
  }
}

