import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";


@Injectable({providedIn: 'root'})
export class ModalService {
  modal: any;


  constructor(private modalService: NgbModal ){}

  openModal(content: any) {
    this.modal = this.modal.open(content);
  }

  closeModal(){
    this.modal.close();
  }
}