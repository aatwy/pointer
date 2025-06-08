import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModalConfig } from './shared/modal.config.interface';
import { SessionModalComponent } from './shared/session-modal/session-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit{
  title = 'pointer';
  @ViewChild('modal') private modalComponent: SessionModalComponent

  modalConfig: ModalConfig;

  constructor( private toastr: ToastrService){

  }

  ngOnInit(): void {
  }

}
