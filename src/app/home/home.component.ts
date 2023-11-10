import { Component, ViewChild } from '@angular/core';
import { SessionModalComponent } from './session-modal/session-modal.component';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig } from '../shared/modal.config.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('modal') private modalComponent: SessionModalComponent

  modalConfig: ModalConfig = {
    modalTitle: 'Session Creator'
  }

  constructor(private modalService: NgbModal) { }

    async openModal() {
      return await this.modalComponent.open()
    }
  }