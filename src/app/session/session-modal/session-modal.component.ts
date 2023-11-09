import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-session-modal',
  templateUrl: './session-modal.component.html',
  styleUrls: ['./session-modal.component.css']
})
export class SessionModalComponent {
  userName: string;
  spectate: boolean = false;

  constructor(
    public modalRef: MdbModalRef<SessionModalComponent>,
    private sessionService: SessionService) { }

  onCreate(){
    this.sessionService.createSession();
  }
}
