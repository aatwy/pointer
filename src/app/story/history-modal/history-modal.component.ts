import { AfterViewInit, Component, Injectable, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { ModalConfig } from 'src/app/shared/modal.config.interface';
import { sessionHistory } from 'src/app/shared/models/sessionHistory.model';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-history-modal',
  templateUrl: './history-modal.component.html',
  styleUrls: ['./history-modal.component.scss']
})

@Injectable()
export class HistoryModalComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<HistoryModalComponent>;
  private modalRef: NgbModalRef;

  historyEntries: sessionHistory[] = [];
  selectedEntry: sessionHistory;
  buttonText: string = "Choose a Story"

  sessionSub = new Subscription();

  constructor(
    private sessionService: SessionService,
    private ngmodal: NgbModal,
    private config: NgbModalConfig) {
  }

  ngOnInit(): void {
    this.sessionSub = this.sessionService.sessionUpdated.subscribe((session) => {
      this.historyEntries = session.history;
    })
    this.historyEntries = this.sessionService.session.history;

  }


  async open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.ngmodal.open(this.modalContent, {size: 'md'})
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

  onSelectEntry(entry: sessionHistory) {
    this.selectedEntry = entry;
  }


}
