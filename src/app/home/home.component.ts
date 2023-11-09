import { Component } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SessionModalComponent } from '../session/session-modal/session-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  modalRef: MdbModalRef<SessionModalComponent> | null = null;
  config = {
    animation: true,
    backdrop: true,
    data: {
      title: 'Session Creator'
    },
    ignoreBackdropClick: true
  }

  constructor(private modalService: MdbModalService) { }

  openModal() {
    this.modalRef = this.modalService.open(SessionModalComponent, this.config)
  }
}