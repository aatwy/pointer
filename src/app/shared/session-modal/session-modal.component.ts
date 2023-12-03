import { AfterViewInit, Component, Injectable, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ModalConfig } from 'src/app/shared/modal.config.interface';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-session-modal',
  templateUrl: './session-modal.component.html',
  styleUrls: ['./session-modal.component.css']
})
@Injectable()
export class SessionModalComponent implements OnInit, AfterViewInit{
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<SessionModalComponent>;
  private modalRef: NgbModalRef;

  userName: string;
  spectate: boolean = false;
  createClicked: boolean = false;

  constructor(
    private sessionService: SessionService,
    private ngmodal: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private config: NgbModalConfig) {

    }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.sessionService.joiningSession) {
      this.config.backdrop = 'static';
      this.config.keyboard = false;
    }
  }

  async onClick(){
    this.createClicked = true;
    if(this.sessionService.joiningSession) {
      // Need to add a check if the session is valid or not, if not then  show error rather than navigate onwards
      await this.sessionService.joinSession(this.userName, this.spectate)
    } else {
      await this.sessionService.createSession(this.userName, this.spectate);
    }
    this.close();
    this.createClicked = false;
    if(!this.sessionService.joiningSession) {
      await this.router.navigate([`/session/`, this.sessionService.sessionId], { relativeTo: this.route })
    }
  }

  async open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.ngmodal.open(this.modalContent)
      this.modalRef.result.then(resolve, resolve)
    })
  }

  async close(): Promise<void> {
    if (this.modalConfig.shouldClose === undefined || (await this.modalConfig.shouldClose())) {
      const result = this.modalConfig.onClose === undefined || (await this.modalConfig.onClose())
      this.modalRef.close(result)
    }
  }

  async dismiss(): Promise<void> {
    if (this.modalConfig.shouldDismiss === undefined || (await this.modalConfig.shouldDismiss())) {
      const result = this.modalConfig.onDismiss === undefined || (await this.modalConfig.onDismiss())
      this.modalRef.dismiss(result)
    }
  }
}