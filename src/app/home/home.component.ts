import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SessionModalComponent } from '../shared/session-modal/session-modal.component';
import { ModalConfig } from '../shared/modal.config.interface';
import { SessionService } from '../shared/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit{
  @ViewChild('modal') private modalComponent: SessionModalComponent

  modalConfig: ModalConfig = {
    modalTitle: 'Session Creator',
    closeButtonLabel: 'Create Session'
  }

  constructor(
    private sessionService: SessionService) {
  }

  ngOnInit(): void {
    if(this.sessionService.joiningSession){
      this.modalConfig.modalTitle = 'Join Pointing Session';
      this.modalConfig.closeButtonLabel = 'Join Session';
      this.modalConfig.shouldDismiss = () => false;
      this.modalConfig.hideDismissButton  = () => true;
    }
  }

  ngAfterViewInit(): void {
    if (this.sessionService.joiningSession) {
      this.onCreateSession()
    }
  }

  async onCreateSession() {
    return await this.modalComponent.open()
  }
}