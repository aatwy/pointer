import { Injectable, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";

import { SessionModalComponent } from "./session-modal/session-modal.component";
import { ModalConfig } from "./modal.config.interface";


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  @ViewChild('modal') private modalComponent: SessionModalComponent
  modalCommand = new Subject<any>;
  modalConfig: ModalConfig;
  modalRef:any;


  constructor(private modalService: NgbModal ){}
  /**
   * Opens the modal with the provided content
   * @param content content to open the modal with (configuration based on the config template)
   */
  async open(config: ModalConfig) {
    this.modalConfig = config;
    this.modalComponent.open();
  }

  /**
   * Closes current modal
   */
  close(){
    this.modalComponent.close();
  }
}